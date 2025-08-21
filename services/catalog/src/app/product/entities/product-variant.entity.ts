import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.variants)
  product: Product;

  @Column('uuid')
  productId: string;

  @Column({ unique: true })
  sku: string;

  @Column('json')
  attributes: Record<string, any>; // e.g., { color: 'red', size: 'L' }

  @Column('int', { default: 0 })
  priceDelta: number; // Différence de prix par rapport au produit de base

  @Column('int', { default: 0 })
  stockQuantity: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}