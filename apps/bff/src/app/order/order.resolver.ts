import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CheckoutInput } from './dto/checkout.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order], { name: 'myOrders' })
  async getMyOrders(@Context() context: any) {
    // Get orders for current user
    return this.orderService.getUserOrders('user-1');
  }

  @Query(() => Order, { name: 'order', nullable: true })
  async getOrder(@Args('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Mutation(() => String, { name: 'checkout' })
  async checkout(@Args('input') input: CheckoutInput, @Context() context: any) {
    // Returns payment URL for Stripe
    return this.orderService.createCheckout('session-id', input);
  }
}