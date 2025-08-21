import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { StripeProvider } from './providers/stripe.provider';
import { PaypalProvider } from './providers/paypal.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentMethod])],
  controllers: [PaymentController],
  providers: [PaymentService, StripeProvider, PaypalProvider],
  exports: [PaymentService],
})
export class PaymentModule {}