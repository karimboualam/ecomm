import { IsString, IsNumber, IsUUID, IsOptional, IsIn, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(50) // Minimum 50 cents
  amount: number;

  @IsString()
  currency: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsIn(['stripe', 'paypal', 'klarna'])
  provider?: string;

  @IsOptional()
  @IsUUID()
  paymentMethodId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}