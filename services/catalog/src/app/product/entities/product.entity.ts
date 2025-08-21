import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Index,
  BeforeInsert,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number; // Prix en centimes

  @Column({ default: 'EUR' })
  currency: string;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column('uuid', { name: 'categoryId' })
  categoryId: string;

  @Column({ default: true })
  inStock: boolean;

  @Column('int', { default: 0 })
  stockQuantity: number;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column('json', { nullable: true })
  attributes?: Record<string, any>;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }
}