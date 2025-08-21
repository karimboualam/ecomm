import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductsInput } from './dto/products.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product], { name: 'products' })
  async getProducts(@Args('input', { nullable: true }) input?: ProductsInput) {
    return this.productService.findAll(input);
  }

  @Query(() => Product, { name: 'product', nullable: true })
  async getProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findById(id);
  }

  @Query(() => Product, { name: 'productBySlug', nullable: true })
  async getProductBySlug(@Args('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }
}