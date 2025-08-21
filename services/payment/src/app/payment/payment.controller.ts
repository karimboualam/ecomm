import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post(':id/confirm')
  async confirmPayment(
    @Param('id') id: string,
    @Body() confirmPaymentDto: ConfirmPaymentDto
  ) {
    return this.paymentService.confirmPayment(id, confirmPaymentDto);
  }

  @Post(':id/refund')
  async refundPayment(
    @Param('id') id: string,
    @Body() refundPaymentDto: RefundPaymentDto
  ) {
    return this.paymentService.refundPayment(id, refundPaymentDto);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  async getPayments(
    @Query('orderId') orderId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string
  ) {
    return this.paymentService.findAll({ orderId, userId, status });
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }
}