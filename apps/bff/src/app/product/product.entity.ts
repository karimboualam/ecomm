import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number; // Prix en centimes

  @Field()
  currency: string;

  @Field(() => [String])
  images: string[];

  @Field()
  categoryId: string;

  @Field()
  inStock: boolean;

  @Field(() => Int)
  stockQuantity: number;

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field(() => Int, { nullable: true })
  reviewCount?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}