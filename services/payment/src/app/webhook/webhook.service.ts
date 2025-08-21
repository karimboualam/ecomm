import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentService } from '../payment/payment.service';
import { StripeProvider } from '../payment/providers/stripe.provider';
import { PaymentSucceededEvent, PaymentFailedEvent } from '@ecommerce/events';

@Injectable()
export class WebhookService {
  constructor(
    private paymentService: PaymentService,
    private stripeProvider: StripeProvider,
    private eventEmitter: EventEmitter2
  ) {}

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    try {
      const event = await this.stripeProvider.constructWebhookEvent(rawBody, signature);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleStripePaymentSucceeded(event.data.object as any);
          break;

        case 'payment_intent.payment_failed':
          await this.handleStripePaymentFailed(event.data.object as any);
          break;

        case 'charge.dispute.created':
          await this.handleStripeChargeDispute(event.data.object as any);
          break;

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  private async handleStripePaymentSucceeded(paymentIntent: any) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) return;

    const payments = await this.paymentService.findAll({
      orderId,
      status: 'PENDING',
    });

    for (const payment of payments) {
      if (payment.providerPaymentId === paymentIntent.id) {
        await this.paymentService.confirmPayment(payment.id, {});
        
        const event = new PaymentSucceededEvent(payment.id, {
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          provider: 'stripe',
        });
        
        await this.eventEmitter.emitAsync('payment.succeeded', event);
        break;
      }
    }
  }

  private async handleStripePaymentFailed(paymentIntent: any) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) return;

    const payments = await this.paymentService.findAll({
      orderId,
      status: 'PENDING',
    });

    for (const payment of payments) {
      if (payment.providerPaymentId === paymentIntent.id) {
        // Mark payment as failed
        payment.status = 'FAILED';
        payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
        
        const event = new PaymentFailedEvent(payment.id, {
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          currency: payment.currency,
          provider: 'stripe',
          reason: payment.failureReason,
        });
        
        await this.eventEmitter.emitAsync('payment.failed', event);
        break;
      }
    }
  }

  private async handleStripeChargeDispute(dispute: any) {
    console.log('Dispute created:', dispute);
    // Handle dispute logic here
  }

  async handlePayPalWebhook(body: any, headers: Record<string, string>) {
    // Verify PayPal webhook signature
    if (!this.verifyPayPalSignature(body, headers)) {
      throw new BadRequestException('Invalid PayPal webhook signature');
    }

    switch (body.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await this.handlePayPalOrderApproved(body.resource);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePayPalPaymentCompleted(body.resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await this.handlePayPalPaymentDenied(body.resource);
        break;

      default:
        console.log(`Unhandled PayPal event type: ${body.event_type}`);
    }

    return { received: true };
  }

  private verifyPayPalSignature(body: any, headers: Record<string, string>): boolean {
    // Implement PayPal webhook signature verification
    // This is a placeholder - implement actual verification
    return true;
  }

  private async handlePayPalOrderApproved(resource: any) {
    console.log('PayPal order approved:', resource);
    // Handle approved order
  }

  private async handlePayPalPaymentCompleted(resource: any) {
    console.log('PayPal payment completed:', resource);
    // Handle completed payment
  }

  private async handlePayPalPaymentDenied(resource: any) {
    console.log('PayPal payment denied:', resource);
    // Handle denied payment
  }

  async handleKlarnaWebhook(body: any, headers: Record<string, string>) {
    // Implement Klarna webhook handling
    console.log('Klarna webhook received:', body);
    return { received: true };
  }
}