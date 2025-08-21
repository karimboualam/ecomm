import { IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}