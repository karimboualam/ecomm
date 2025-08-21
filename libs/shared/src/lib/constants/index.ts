export const API_VERSIONS = {
  V1: '/api/v1',
  V2: '/api/v2',
} as const;

export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
} as const;

export const LANGUAGES = {
  FR: 'fr',
  EN: 'en',
  ES: 'es',
  DE: 'de',
} as const;

export const COUNTRIES = {
  FR: 'FR',
  US: 'US',
  GB: 'GB',
  ES: 'ES',
  DE: 'DE',
} as const;

export const PAYMENT_PROVIDERS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  KLARNA: 'klarna',
  BANK_TRANSFER: 'bank_transfer',
} as const;

export const SHIPPING_PROVIDERS = {
  COLISSIMO: 'colissimo',
  MONDIAL_RELAY: 'mondial_relay',
  CHRONOPOST: 'chronopost',
  DHL: 'dhl',
} as const;

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  ORDER_CONFIRMATION: 'order_confirmation',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  CART_ABANDONED: 'cart_abandoned',
  BACK_IN_STOCK: 'back_in_stock',
  BIRTHDAY_OFFER: 'birthday_offer',
  NEWSLETTER: 'newsletter',
} as const;

export const CACHE_KEYS = {
  PRODUCT: 'product',
  CATEGORY: 'category',
  USER: 'user',
  CART: 'cart',
  SEARCH_RESULTS: 'search',
} as const;

export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  SEARCH_INDEX: 'search-index-queue',
  PAYMENT_WEBHOOK: 'payment-webhook-queue',
  ORDER_PROCESSING: 'order-processing-queue',
  ANALYTICS: 'analytics-queue',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
} as const;

export const LOYALTY_POINTS = {
  REGISTRATION_BONUS: 100,
  PURCHASE_RATE: 0.01, // 1 point per €0.01
  REVIEW_BONUS: 50,
  REFERRAL_BONUS: 500,
} as const;