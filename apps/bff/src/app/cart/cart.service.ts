import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from './cart.entity';
import { AddToCartInput } from './dto/add-to-cart.input';

@Injectable()
export class CartService {
  private carts = new Map<string, Cart>();

  async getCart(sessionId: string): Promise<Cart> {
    let cart = this.carts.get(sessionId);
    
    if (!cart) {
      cart = {
        id: sessionId,
        items: [],
        total: 0,
        itemCount: 0,
        currency: 'EUR',
        updatedAt: new Date(),
      };
      this.carts.set(sessionId, cart);
    }
    
    return cart;
  }

  async addToCart(sessionId: string, input: AddToCartInput): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    
    const existingItem = cart.items.find(item => item.productId === input.productId);
    
    if (existingItem) {
      existingItem.quantity += input.quantity;
    } else {
      const newItem: CartItem = {
        productId: input.productId,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        name: input.name,
        image: input.image,
      };
      cart.items.push(newItem);
    }
    
    this.updateCartTotals(cart);
    cart.updatedAt = new Date();
    
    return cart;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    this.updateCartTotals(cart);
    cart.updatedAt = new Date();
    
    return cart;
  }

  async updateQuantity(sessionId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(sessionId, productId);
      }
      item.quantity = quantity;
      this.updateCartTotals(cart);
      cart.updatedAt = new Date();
    }
    
    return cart;
  }

  private updateCartTotals(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}