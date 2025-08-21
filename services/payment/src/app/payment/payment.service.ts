import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { StripeProvider } from './providers/stripe.provider';
import { PaypalProvider } from './providers/paypal.provider';
import { PaymentSucceededEvent, PaymentFailedEvent } from '@ecommerce/events';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    private stripeProvider: StripeProvider,
    private paypalProvider: PaypalProvider,
    private eventEmitter: EventEmitter2
  ) {}

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { amount, currency, orderId, userId, provider = 'stripe' } = createPaymentIntentDto;

    try {
      let providerResponse;
      let providerPaymentId;

      switch (provider) {
        case 'stripe':
          providerResponse = await this.stripeProvider.createPaymentIntent({
            amount,
            currency,
            metadata: { orderId, userId },
          });
          providerPaymentId = providerResponse.id;
          break;

        case 'paypal':
          providerResponse = await this.paypalProvider.createOrder({
            amount,
            currency,
            orderId,
          });
          providerPaymentId = providerResponse.id;
          break;

        default:
          throw new BadRequestException(`Unsupported payment provider: ${provider}`);
      }

      // Create payment record
      const payment = this.paymentRepository.create({
        orderId,
        userId,
        amount,
        currency,
        provider,
        providerPaymentId,
        status: 'PENDING',
        metadata: { providerResponse },
      });

      const savedPayment = await this.paymentRepository.save(payment);

      return {
        paymentId: savedPayment.id,
        clientSecret: providerResponse.client_secret || providerResponse.links?.find(l => l.rel === 'approve')?.href,
        status: savedPayment.status,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async confirmPayment(id: string, confirmPaymentDto: ConfirmPaymentDto) {
    const payment = await this.findOne(id);
    
    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Payment is not in pending state');
    }

    try {
      let confirmed = false;

      switch (payment.provider) {
        case 'stripe':
          const stripePayment = await this.stripeProvider.retrievePaymentIntent(
            payment.providerPaymentId
          );
          confirmed = stripePayment.status === 'succeeded';
          break;

        case 'paypal':
          const paypalOrder = await this.paypalProvider.captureOrder(
            payment.providerPaymentId
          );
          confirmed = paypalOrder.status === 'COMPLETED';
          break;
      }

      if (confirmed) {
        payment.status = 'SUCCEEDED';
        payment.confirmedAt = new Date();
        
        await this.paymentRepository.save(payment);

        // Emit success event
        const event = new PaymentSucceededEvent(payment.id, {
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.provider,
        });
        
        await this.eventEmitter.emitAsync('payment.succeeded', event);

        return { status: 'succeeded', payment };
      } else {
        payment.status = 'FAILED';
        payment.failureReason = 'Payment not confirmed by provider';
        
        await this.paymentRepository.save(payment);

        // Emit failure event
        const event = new PaymentFailedEvent(payment.id, {
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.provider,
          reason: payment.failureReason,
        });
        
        await this.eventEmitter.emitAsync('payment.failed', event);

        return { status: 'failed', payment };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      payment.status = 'FAILED';
      payment.failureReason = error.message;
      await this.paymentRepository.save(payment);

      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async refundPayment(id: string, refundPaymentDto: RefundPaymentDto) {
    const payment = await this.findOne(id);
    
    if (payment.status !== 'SUCCEEDED') {
      throw new BadRequestException('Can only refund successful payments');
    }

    const { amount = payment.amount, reason } = refundPaymentDto;

    try {
      let refundResponse;

      switch (payment.provider) {
        case 'stripe':
          refundResponse = await this.stripeProvider.refundPayment(
            payment.providerPaymentId,
            { amount, reason }
          );
          break;

        case 'paypal':
          refundResponse = await this.paypalProvider.refundOrder(
            payment.providerPaymentId,
            { amount: amount / 100, currency: payment.currency }
          );
          break;
      }

      payment.status = 'REFUNDED';
      payment.refundedAmount = amount;
      payment.refundReason = reason;
      payment.refundedAt = new Date();
      payment.metadata = { ...payment.metadata, refundResponse };

      await this.paymentRepository.save(payment);

      return { status: 'refunded', payment };
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw new BadRequestException('Failed to refund payment');
    }
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['paymentMethod'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findAll(filters: {
    orderId?: string;
    userId?: string;
    status?: string;
  }): Promise<Payment[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    if (filters.orderId) {
      queryBuilder.andWhere('payment.orderId = :orderId', { orderId: filters.orderId });
    }

    if (filters.userId) {
      queryBuilder.andWhere('payment.userId = :userId', { userId: filters.userId });
    }

    if (filters.status) {
      queryBuilder.andWhere('payment.status = :status', { status: filters.status });
    }

    queryBuilder.orderBy('payment.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async getPaymentStatus(id: string): Promise<{ status: string; payment: Payment }> {
    const payment = await this.findOne(id);
    
    // Sync status with provider
    try {
      switch (payment.provider) {
        case 'stripe':
          const stripePayment = await this.stripeProvider.retrievePaymentIntent(
            payment.providerPaymentId
          );
          if (stripePayment.status !== payment.status.toLowerCase()) {
            payment.status = stripePayment.status.toUpperCase() as any;
            await this.paymentRepository.save(payment);
          }
          break;

        case 'paypal':
          const paypalOrder = await this.paypalProvider.getOrder(
            payment.providerPaymentId
          );
          const mappedStatus = this.mapPaypalStatus(paypalOrder.status);
          if (mappedStatus !== payment.status) {
            payment.status = mappedStatus;
            await this.paymentRepository.save(payment);
          }
          break;
      }
    } catch (error) {
      console.error('Error syncing payment status:', error);
    }

    return { status: payment.status, payment };
  }

  private mapPaypalStatus(paypalStatus: string): string {
    const statusMap = {
      'CREATED': 'PENDING',
      'APPROVED': 'PENDING',
      'COMPLETED': 'SUCCEEDED',
      'CANCELLED': 'CANCELLED',
      'FAILED': 'FAILED',
    };

    return statusMap[paypalStatus] || 'PENDING';
  }
}