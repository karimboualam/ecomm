import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
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