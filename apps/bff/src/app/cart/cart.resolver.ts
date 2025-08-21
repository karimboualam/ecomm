import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { AddToCartInput } from './dto/add-to-cart.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart, { name: 'cart', nullable: true })
  async getCart(@Context() context: any) {
    // Get cart for current user/session
    return this.cartService.getCart('session-id');
  }

  @Mutation(() => Cart)
  async addToCart(@Args('input') input: AddToCartInput, @Context() context: any) {
    return this.cartService.addToCart('session-id', input);
  }

  @Mutation(() => Cart)
  async removeFromCart(
    @Args('productId', { type: () => ID }) productId: string,
    @Context() context: any
  ) {
    return this.cartService.removeFromCart('session-id', productId);
  }

  @Mutation(() => Cart)
  async updateCartItem(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('quantity') quantity: number,
    @Context() context: any
  ) {
    return this.cartService.updateQuantity('session-id', productId, quantity);
  }
}