import { DomainEvent } from '@ecommerce/shared';

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly id: string;
  public readonly occurredAt: Date;
  public readonly version: number = 1;

  constructor(
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly payload: Record<string, any>,
    public readonly metadata?: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

// Order Events
export class OrderCreatedEvent extends BaseDomainEvent {
  constructor(orderId: string, payload: any, metadata?: any) {
    super('order.created', orderId, 'Order', payload, metadata);
  }
}

export class OrderPaidEvent extends BaseDomainEvent {
  constructor(orderId: string, payload: any, metadata?: any) {
    super('order.paid', orderId, 'Order', payload, metadata);
  }
}

export class OrderShippedEvent extends BaseDomainEvent {
  constructor(orderId: string, payload: any, metadata?: any) {
    super('order.shipped', orderId, 'Order', payload, metadata);
  }
}

export class OrderDeliveredEvent extends BaseDomainEvent {
  constructor(orderId: string, payload: any, metadata?: any) {
    super('order.delivered', orderId, 'Order', payload, metadata);
  }
}

export class OrderCancelledEvent extends BaseDomainEvent {
  constructor(orderId: string, payload: any, metadata?: any) {
    super('order.cancelled', orderId, 'Order', payload, metadata);
  }
}

// Product Events
export class ProductCreatedEvent extends BaseDomainEvent {
  constructor(productId: string, payload: any, metadata?: any) {
    super('product.created', productId, 'Product', payload, metadata);
  }
}

export class ProductUpdatedEvent extends BaseDomainEvent {
  constructor(productId: string, payload: any, metadata?: any) {
    super('product.updated', productId, 'Product', payload, metadata);
  }
}

export class ProductStockChangedEvent extends BaseDomainEvent {
  constructor(productId: string, payload: any, metadata?: any) {
    super('product.stock_changed', productId, 'Product', payload, metadata);
  }
}

export class ProductBackInStockEvent extends BaseDomainEvent {
  constructor(productId: string, payload: any, metadata?: any) {
    super('product.back_in_stock', productId, 'Product', payload, metadata);
  }
}

// Cart Events
export class CartItemAddedEvent extends BaseDomainEvent {
  constructor(cartId: string, payload: any, metadata?: any) {
    super('cart.item_added', cartId, 'Cart', payload, metadata);
  }
}

export class CartAbandonedEvent extends BaseDomainEvent {
  constructor(cartId: string, payload: any, metadata?: any) {
    super('cart.abandoned', cartId, 'Cart', payload, metadata);
  }
}

// User Events
export class UserRegisteredEvent extends BaseDomainEvent {
  constructor(userId: string, payload: any, metadata?: any) {
    super('user.registered', userId, 'User', payload, metadata);
  }
}

export class UserEmailVerifiedEvent extends BaseDomainEvent {
  constructor(userId: string, payload: any, metadata?: any) {
    super('user.email_verified', userId, 'User', payload, metadata);
  }
}

export class UserBirthdayEvent extends BaseDomainEvent {
  constructor(userId: string, payload: any, metadata?: any) {
    super('user.birthday', userId, 'User', payload, metadata);
  }
}

// Review Events
export class ReviewSubmittedEvent extends BaseDomainEvent {
  constructor(reviewId: string, payload: any, metadata?: any) {
    super('review.submitted', reviewId, 'Review', payload, metadata);
  }
}

export class ReviewApprovedEvent extends BaseDomainEvent {
  constructor(reviewId: string, payload: any, metadata?: any) {
    super('review.approved', reviewId, 'Review', payload, metadata);
  }
}

// Payment Events
export class PaymentSucceededEvent extends BaseDomainEvent {
  constructor(paymentId: string, payload: any, metadata?: any) {
    super('payment.succeeded', paymentId, 'Payment', payload, metadata);
  }
}

export class PaymentFailedEvent extends BaseDomainEvent {
  constructor(paymentId: string, payload: any, metadata?: any) {
    super('payment.failed', paymentId, 'Payment', payload, metadata);
  }
}