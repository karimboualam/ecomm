import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field(() => ID)
  productId: string;

  @Field()
  name: string;

  @Field()
  image: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPrice: number; // Prix en centimes
}

@ObjectType()
export class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Int)
  total: number; // Total en centimes

  @Field(() => Int)
  itemCount: number;

  @Field()
  currency: string;

  @Field()
  updatedAt: Date;
}