import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  async retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(id);
  }

  async confirmPaymentIntent(
    id: string,
    params: { payment_method?: string }
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.confirm(id, params);
  }

  async refundPayment(
    paymentIntentId: string,
    params: { amount?: number; reason?: string }
  ): Promise<Stripe.Refund> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: params.amount,
      reason: params.reason as Stripe.RefundCreateParams.Reason,
    });
  }

  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, any>;
  }): Promise<Stripe.Customer> {
    return this.stripe.customers.create(params);
  }

  async createPaymentMethod(params: {
    type: 'card';
    card: {
      token: string;
    };
    customer?: string;
  }): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.create(params);
  }

  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const { data } = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return data;
  }

  async constructWebhookEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}