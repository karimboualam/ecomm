import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddressInput {
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

@InputType()
export class CheckoutInput {
  @Field(() => AddressInput)
  shippingAddress: AddressInput;

  @Field(() => AddressInput)
  billingAddress: AddressInput;

  @Field({ nullable: true })
  couponCode?: string;
}