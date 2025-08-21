import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { CheckoutInput } from './dto/checkout.input';

@Injectable()
export class OrderService {
  private orders: Order[] = [
    {
      id: '1',
      userId: 'user-1',
      items: [
        {
          productId: '1',
          name: 'Smartphone Premium',
          image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
          quantity: 1,
          unitPrice: 89900,
        }
      ],
      subtotal: 89900,
      taxes: 17980,
      shipping: 0,
      total: 107880,
      currency: 'EUR',
      status: OrderStatus.DELIVERED,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      billingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
  ];

  async getUserOrders(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.orders.filter(order => order.userId === userId);
  }

  async getOrder(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.orders.find(order => order.id === id) || null;
  }

  async createCheckout(sessionId: string, input: CheckoutInput): Promise<string> {
    // Mock Stripe checkout URL
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In real implementation:
    // 1. Get cart from Cart service
    // 2. Call Payment service to create Stripe session
    // 3. Return payment URL
    
    return 'https://checkout.stripe.com/pay/mock-session-id';
  }
}