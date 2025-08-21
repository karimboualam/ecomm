import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orderId: string;

  @Column('uuid')
  @Index()
  userId: string;

  @Column('int')
  amount: number; // Amount in cents

  @Column()
  currency: string;

  @Column()
  provider: string; // stripe, paypal, klarna, etc.

  @Column()
  providerPaymentId: string; // Provider's payment ID

  @Column()
  @Index()
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

  @ManyToOne(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;

  @Column('uuid', { nullable: true })
  paymentMethodId?: string;

  @Column({ nullable: true })
  failureReason?: string;

  @Column('int', { nullable: true })
  refundedAmount?: number;

  @Column({ nullable: true })
  refundReason?: string;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ nullable: true })
  refundedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}