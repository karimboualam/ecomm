import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @Column()
  type: 'CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'KLARNA';

  @Column()
  provider: string;

  @Column()
  providerMethodId: string; // Provider's payment method ID

  @Column({ nullable: true })
  last4?: string;

  @Column({ nullable: true })
  brand?: string; // visa, mastercard, etc.

  @Column('int', { nullable: true })
  expiryMonth?: number;

  @Column('int', { nullable: true })
  expiryYear?: number;

  @Column({ nullable: true })
  holderName?: string;

  @Column('json', { nullable: true })
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}