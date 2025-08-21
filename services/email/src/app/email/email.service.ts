import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailLog } from './entities/email-log.entity';
import { EmailProvider } from './providers/email.provider';
import { SendEmailDto } from './dto/send-email.dto';
import { SendBulkEmailDto } from './dto/send-bulk-email.dto';
import { 
  OrderPaidEvent,
  OrderShippedEvent, 
  OrderDeliveredEvent,
  UserRegisteredEvent,
  CartAbandonedEvent,
  ProductBackInStockEvent,
  UserBirthdayEvent,
  ReviewApprovedEvent
} from '@ecommerce/events';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
    @InjectQueue('email-queue')
    private emailQueue: Queue,
    private emailProvider: EmailProvider
  ) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    const job = await this.emailQueue.add('send-email', sendEmailDto, {
      priority: sendEmailDto.priority || 10,
    });

    // Log the email
    const emailLog = this.emailLogRepository.create({
      recipient: sendEmailDto.to,
      subject: sendEmailDto.subject,
      template: sendEmailDto.template,
      status: 'QUEUED',
      provider: 'default',
      jobId: job.id.toString(),
      metadata: {
        variables: sendEmailDto.variables,
        attachments: sendEmailDto.attachments?.length || 0,
      },
    });

    await this.emailLogRepository.save(emailLog);

    return {
      success: true,
      jobId: job.id,
      emailLogId: emailLog.id,
    };
  }

  async sendBulkEmail(sendBulkEmailDto: SendBulkEmailDto) {
    const jobs = [];

    for (const recipient of sendBulkEmailDto.recipients) {
      const emailDto: SendEmailDto = {
        to: recipient.email,
        subject: sendBulkEmailDto.subject,
        template: sendBulkEmailDto.template,
        variables: {
          ...sendBulkEmailDto.variables,
          ...recipient.variables,
        },
        priority: sendBulkEmailDto.priority,
      };

      const job = await this.emailQueue.add('send-email', emailDto, {
        priority: emailDto.priority || 5, // Lower priority for bulk emails
        delay: jobs.length * 100, // Stagger bulk emails
      });

      jobs.push(job);

      // Log each email
      const emailLog = this.emailLogRepository.create({
        recipient: recipient.email,
        subject: sendBulkEmailDto.subject,
        template: sendBulkEmailDto.template,
        status: 'QUEUED',
        provider: 'default',
        jobId: job.id.toString(),
        metadata: {
          variables: emailDto.variables,
          isBulk: true,
          bulkId: `bulk-${Date.now()}`,
        },
      });

      await this.emailLogRepository.save(emailLog);
    }

    return {
      success: true,
      totalEmails: jobs.length,
      jobIds: jobs.map(job => job.id),
    };
  }

  async sendTemplateEmail(
    templateId: string,
    to: string,
    variables: Record<string, any>
  ) {
    return this.sendEmail({
      to,
      template: templateId,
      variables,
      priority: 10,
    });
  }

  async sendTestEmail(to: string, templateId = 'test') {
    return this.sendEmail({
      to,
      subject: 'Test Email',
      template: templateId,
      variables: {
        name: 'Test User',
        message: 'This is a test email from the e-commerce platform.',
      },
      priority: 20, // High priority for test emails
    });
  }

  async getEmailLogs(params: {
    page: number;
    limit: number;
    status?: string;
    recipient?: string;
  }) {
    const queryBuilder = this.emailLogRepository.createQueryBuilder('email_log');

    if (params.status) {
      queryBuilder.andWhere('email_log.status = :status', { status: params.status });
    }

    if (params.recipient) {
      queryBuilder.andWhere('email_log.recipient ILIKE :recipient', {
        recipient: `%${params.recipient}%`,
      });
    }

    queryBuilder
      .orderBy('email_log.createdAt', 'DESC')
      .limit(params.limit)
      .offset((params.page - 1) * params.limit);

    const [logs, total] = await queryBuilder.getManyAndCount();

    return {
      data: logs,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        pages: Math.ceil(total / params.limit),
      },
    };
  }

  async getEmailLog(id: string): Promise<EmailLog> {
    const emailLog = await this.emailLogRepository.findOne({ where: { id } });

    if (!emailLog) {
      throw new NotFoundException(`Email log with ID ${id} not found`);
    }

    return emailLog;
  }

  async updateEmailLogStatus(
    jobId: string,
    status: 'SENT' | 'FAILED' | 'BOUNCED' | 'DELIVERED',
    error?: string,
    providerResponse?: any
  ) {
    await this.emailLogRepository.update(
      { jobId },
      {
        status,
        error,
        sentAt: status === 'SENT' ? new Date() : undefined,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
        metadata: providerResponse ? { providerResponse } : undefined,
      }
    );
  }

  // Event handlers for automatic emails

  @OnEvent('order.paid')
  async handleOrderPaid(event: OrderPaidEvent) {
    await this.sendEmail({
      to: event.payload.customerEmail,
      template: 'order-confirmation',
      subject: `Commande confirmée #${event.payload.orderNumber}`,
      variables: {
        customerName: event.payload.customerName,
        orderNumber: event.payload.orderNumber,
        total: event.payload.total,
        items: event.payload.items,
        shippingAddress: event.payload.shippingAddress,
      },
      attachments: event.payload.invoiceUrl ? [{
        filename: `facture-${event.payload.orderNumber}.pdf`,
        url: event.payload.invoiceUrl,
      }] : undefined,
      priority: 15, // High priority for order confirmations
    });
  }

  @OnEvent('order.shipped')
  async handleOrderShipped(event: OrderShippedEvent) {
    await this.sendEmail({
      to: event.payload.customerEmail,
      template: 'order-shipped',
      subject: `Votre commande #${event.payload.orderNumber} a été expédiée`,
      variables: {
        customerName: event.payload.customerName,
        orderNumber: event.payload.orderNumber,
        trackingNumber: event.payload.trackingNumber,
        trackingUrl: event.payload.trackingUrl,
        carrier: event.payload.carrier,
        estimatedDelivery: event.payload.estimatedDelivery,
      },
      priority: 12,
    });
  }

  @OnEvent('order.delivered')
  async handleOrderDelivered(event: OrderDeliveredEvent) {
    await this.sendEmail({
      to: event.payload.customerEmail,
      template: 'order-delivered',
      subject: `Votre commande #${event.payload.orderNumber} a été livrée`,
      variables: {
        customerName: event.payload.customerName,
        orderNumber: event.payload.orderNumber,
        deliveryDate: event.payload.deliveryDate,
        reviewUrl: event.payload.reviewUrl,
      },
      priority: 10,
    });
  }

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    await this.sendEmail({
      to: event.payload.email,
      template: 'welcome',
      subject: 'Bienvenue sur notre plateforme !',
      variables: {
        firstName: event.payload.firstName,
        lastName: event.payload.lastName,
        verificationUrl: event.payload.verificationUrl,
        loyaltyPoints: event.payload.loyaltyPoints || 0,
      },
      priority: 15,
    });
  }

  @OnEvent('cart.abandoned')
  async handleCartAbandoned(event: CartAbandonedEvent) {
    await this.sendEmail({
      to: event.payload.customerEmail,
      template: 'cart-abandoned',
      subject: 'Vous avez oublié quelque chose dans votre panier',
      variables: {
        customerName: event.payload.customerName,
        cartItems: event.payload.items,
        cartTotal: event.payload.total,
        cartUrl: event.payload.cartUrl,
        couponCode: event.payload.recoveryCode, // Optional recovery coupon
      },
      priority: 5, // Lower priority for marketing emails
    });
  }

  @OnEvent('product.back_in_stock')
  async handleProductBackInStock(event: ProductBackInStockEvent) {
    // Send to all users who have this product in their wishlist
    const subscribers = event.payload.subscribers || [];

    for (const subscriber of subscribers) {
      await this.sendEmail({
        to: subscriber.email,
        template: 'back-in-stock',
        subject: `${event.payload.productName} est de retour en stock !`,
        variables: {
          customerName: subscriber.name,
          productName: event.payload.productName,
          productUrl: event.payload.productUrl,
          productImage: event.payload.productImage,
          originalPrice: event.payload.originalPrice,
          currentPrice: event.payload.currentPrice,
        },
        priority: 8,
      });
    }
  }

  @OnEvent('user.birthday')
  async handleUserBirthday(event: UserBirthdayEvent) {
    await this.sendEmail({
      to: event.payload.email,
      template: 'birthday-offer',
      subject: `Joyeux anniversaire ${event.payload.firstName} ! 🎉`,
      variables: {
        firstName: event.payload.firstName,
        couponCode: event.payload.birthdayCoupon,
        couponDiscount: event.payload.discount,
        expiryDate: event.payload.couponExpiry,
      },
      priority: 10,
    });
  }

  @OnEvent('review.approved')
  async handleReviewApproved(event: ReviewApprovedEvent) {
    await this.sendEmail({
      to: event.payload.customerEmail,
      template: 'review-approved',
      subject: 'Merci pour votre avis !',
      variables: {
        customerName: event.payload.customerName,
        productName: event.payload.productName,
        reviewUrl: event.payload.reviewUrl,
        loyaltyPointsEarned: event.payload.loyaltyPointsEarned,
      },
      priority: 8,
    });
  }
}