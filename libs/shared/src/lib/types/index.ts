// Common types used across the platform

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Product types
export interface Product extends BaseEntity {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  categoryId: string;
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
  reviewCount: number;
  attributes?: Record<string, any>;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  attributes: Record<string, any>;
  priceDelta: number;
  stockQuantity: number;
  isActive: boolean;
}

// Cart types
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart extends BaseEntity {
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  currency: string;
  couponCode?: string;
  discount?: number;
}

// Order types
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order extends BaseEntity {
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  invoiceUrl?: string;
  trackingNumber?: string;
  notes?: string;
}

// User types
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  loyaltyPoints: number;
  preferences?: Record<string, any>;
  lastLoginAt?: Date;
}

// Review types
export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  text: string;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  helpfulCount: number;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'KLARNA';
  provider: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Payment extends BaseEntity {
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  providerId: string;
  providerReference?: string;
  failureReason?: string;
}

// Events types
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  occurredAt: Date;
  version: number;
}

// Common event types
export const EventTypes = {
  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',

  // Product events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_STOCK_CHANGED: 'product.stock_changed',
  PRODUCT_BACK_IN_STOCK: 'product.back_in_stock',

  // Cart events
  CART_ITEM_ADDED: 'cart.item_added',
  CART_ITEM_UPDATED: 'cart.item_updated',
  CART_ITEM_REMOVED: 'cart.item_removed',
  CART_ABANDONED: 'cart.abandoned',

  // User events
  USER_REGISTERED: 'user.registered',
  USER_EMAIL_VERIFIED: 'user.email_verified',
  USER_PASSWORD_RESET: 'user.password_reset',
  USER_BIRTHDAY: 'user.birthday',

  // Review events
  REVIEW_SUBMITTED: 'review.submitted',
  REVIEW_APPROVED: 'review.approved',
  REVIEW_REJECTED: 'review.rejected',

  // Payment events
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];