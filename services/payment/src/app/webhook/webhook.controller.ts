import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    return this.webhookService.handleStripeWebhook(req.rawBody, signature);
  }

  @Post('paypal')
  async handlePayPalWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>
  ) {
    return this.webhookService.handlePayPalWebhook(body, headers);
  }

  @Post('klarna')
  async handleKlarnaWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>
  ) {
    return this.webhookService.handleKlarnaWebhook(body, headers);
  }
}