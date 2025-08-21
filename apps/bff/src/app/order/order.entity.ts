import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class Address {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  postalCode: string;

  @Field()
  country: string;
}

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  productId: string;

  @Field()
  name: string;

  @Field()
  image: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPrice: number;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Int)
  subtotal: number;

  @Field(() => Int)
  taxes: number;

  @Field(() => Int)
  shipping: number;

  @Field(() => Int)
  total: number;

  @Field()
  currency: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Address)
  shippingAddress: Address;

  @Field(() => Address)
  billingAddress: Address;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}