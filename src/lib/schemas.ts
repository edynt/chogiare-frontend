import { z } from 'zod'
import { PASSWORD_PATTERNS } from '@/constants/password.constants'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(PASSWORD_PATTERNS.MIN_LENGTH, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        PASSWORD_PATTERNS.LOWERCASE,
        'Mật khẩu phải có ít nhất 1 chữ thường'
      )
      .regex(PASSWORD_PATTERNS.UPPERCASE, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(
        PASSWORD_PATTERNS.SPECIAL_CHAR,
        'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_PATTERNS.MIN_LENGTH, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        PASSWORD_PATTERNS.LOWERCASE,
        'Mật khẩu phải có ít nhất 1 chữ thường'
      )
      .regex(PASSWORD_PATTERNS.UPPERCASE, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(
        PASSWORD_PATTERNS.SPECIAL_CHAR,
        'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

// Product schemas
export const productSchema = z.object({
  title: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  price: z
    .union([
      z
        .string()
        .min(1, 'Giá là bắt buộc')
        .regex(/^\d+(\.\d+)?$/, 'Giá phải là số hợp lệ')
        .transform(val => parseFloat(val)),
      z.number(),
    ])
    .refine(val => val >= 0, 'Giá phải lớn hơn hoặc bằng 0'),
  originalPrice: z
    .union([
      z
        .string()
        .regex(/^\d+(\.\d+)?$/, 'Giá gốc phải là số hợp lệ')
        .transform(val => parseFloat(val)),
      z.literal('').transform(() => undefined),
      z.number(),
      z.undefined(),
    ])
    .optional()
    .refine(
      val => val === undefined || val >= 0,
      'Giá gốc phải lớn hơn hoặc bằng 0'
    ),
  categoryId: z.number().min(1, 'Danh mục là bắt buộc'),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  location: z.string().optional(),
  stock: z.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  tags: z.string().optional(),
  badges: z.array(z.string()).optional(),
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
})

export const productUpdateSchema = productSchema.partial().extend({
  status: z
    .enum(['draft', 'active', 'out_of_stock'])
    .optional(),
})

// Search filters schema
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']).optional(),
  location: z.string().optional(),
  badges: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['createdAt', 'price', 'rating', 'viewCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

// Review schemas
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Sản phẩm là bắt buộc'),
  rating: z.number().min(1).max(5, 'Đánh giá phải từ 1 đến 5 sao'),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
})

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Sản phẩm là bắt buộc'),
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
})

// Order schemas
export const orderSchema = z.object({
  sellerId: z
    .union([z.string(), z.number()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val)),
  paymentMethod: z.string().optional(),
  shippingAddressId: z.number().optional(),
  billingAddressId: z.number().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z
          .union([z.string(), z.number()])
          .transform(val =>
            typeof val === 'string' ? parseInt(val, 10) : val
          ),
        quantity: z.number().min(1),
      })
    )
    .min(1, 'Phải có ít nhất 1 sản phẩm'),
})

// Seller schemas
export const sellerSchema = z.object({
  name: z.string().min(1, 'Tên người bán là bắt buộc'),
  description: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
})

// Chat schemas
export const chatMessageSchema = z.object({
  conversationId: z.string().min(1, 'Cuộc trò chuyện là bắt buộc'),
  messageType: z.string().min(1, 'Loại tin nhắn là bắt buộc'),
  content: z.string().min(1, 'Nội dung tin nhắn là bắt buộc'),
})

// Upload schemas
export const uploadSchema = z.object({
  file: z.instanceof(File),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type AddToCartFormData = z.infer<typeof addToCartSchema>
export type OrderFormData = z.infer<typeof orderSchema>
export type SellerFormData = z.infer<typeof sellerSchema>
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>
export type UploadFormData = z.infer<typeof uploadSchema>
