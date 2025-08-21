import { z } from 'zod';

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export const SearchSchema = z.object({
  query: z.string().min(1).max(200),
  filters: z.record(z.any()).optional(),
  ...PaginationSchema.shape,
});

// Product validation schemas
export const ProductCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000),
  price: z.number().min(0),
  currency: z.string().length(3).default('EUR'),
  images: z.array(z.string().url()).min(1),
  categoryId: z.string().uuid(),
  stockQuantity: z.number().min(0).default(0),
  attributes: z.record(z.any()).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const ProductSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
  ...PaginationSchema.shape,
});

// User validation schemas
export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export const UserUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  preferences: z.record(z.any()).optional(),
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const PasswordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(128),
});

// Address validation schemas
export const AddressSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  company: z.string().max(100).optional(),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().optional(),
});

// Cart validation schemas
export const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().min(1).max(100),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().min(1).max(100),
});

// Order validation schemas
export const CheckoutSchema = z.object({
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  couponCode: z.string().optional(),
  paymentMethodId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// Review validation schemas
export const ReviewCreateSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  text: z.string().min(10).max(1000),
  images: z.array(z.string().url()).max(5).optional(),
});

export const ReviewUpdateSchema = ReviewCreateSchema.partial().omit({ productId: true });

// Category validation schemas
export const CategoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().min(0).default(0),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

// Coupon validation schemas
export const CouponCreateSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().min(0),
  minimumAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
  isActive: z.boolean().default(true),
});

export const CouponUpdateSchema = CouponCreateSchema.partial().omit({ code: true });

// Newsletter validation schemas
export const NewsletterSubscribeSchema = z.object({
  email: z.string().email(),
  preferences: z.record(z.boolean()).optional(),
});

// Contact validation schemas
export const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

// Shipping validation schemas
export const ShippingRateSchema = z.object({
  weight: z.number().min(0),
  zone: z.string(),
  address: AddressSchema,
});

// Webhook validation schemas
export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  timestamp: z.number(),
  signature: z.string(),
});

// File upload validation schemas
export const FileUploadSchema = z.object({
  file: z.any().refine(
    (file) => file?.size <= 5 * 1024 * 1024,
    'File size should be less than 5MB'
  ),
  type: z.enum(['image', 'document']),
});

// Export validation function helpers
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
  return result.data;
}

export function validatePartialSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Partial<T> {
  return schema.partial().parse(data);
}