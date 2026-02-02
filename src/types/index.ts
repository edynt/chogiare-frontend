import type {
  ProductConditionType,
  ProductStatusType,
  ProductBadgeType,
  OrderStatusType,
  PaymentStatusType,
  PaymentMethodType,
  MessageTypeValue,
} from '@/constants/status.constants'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  gender?: string
  dateOfBirth?: string
  address?: string
  country?: string
  language?: number // 0=vi, 1=en
  showEmail?: boolean
  showPhone?: boolean
  isVerified?: boolean
  roles: UserRole[]
  roleIds?: number[] // Numeric role IDs: 1=admin, 2=user
  postCount: number
  isSeller?: boolean
  sellerName?: string
  sellerSlug?: string
  sellerLogo?: string
  sellerBanner?: string
  sellerDescription?: string
  sellerAddress?: string
  sellerPhone?: string
  sellerEmail?: string
  isSellerVerified?: boolean
  sellerRating?: number
  sellerReviewCount?: number
  createdAt: string
  updatedAt: string
}

// String role names
export type UserRole = 'admin' | 'user'

/**
 * Centralized Role Constants
 * Must match backend role definitions
 */
export const ROLES = {
  ADMIN: {
    id: 1,
    name: 'admin' as const,
    description: 'Administrator with full system access',
  },
  USER: {
    id: 2,
    name: 'user' as const,
    description: 'Regular user',
  },
} as const

// Export role IDs for easy access
export const ROLE_IDS = {
  ADMIN: ROLES.ADMIN.id,
  USER: ROLES.USER.id,
} as const

// Export role names for easy access
export const ROLE_NAMES = {
  ADMIN: ROLES.ADMIN.name,
  USER: ROLES.USER.name,
} as const

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  categoryId: string | number
  category?: Category
  images: string[]
  condition: ProductConditionType // numeric: 0=new, 1=like_new, 2=good, 3=fair, 4=poor
  tags: string[]
  location: string
  stock: number
  minStock?: number
  maxStock?: number
  costPrice?: number
  sellingPrice?: number
  sku?: string
  barcode?: string
  inventoryInfo?: {
    warehouseLocation?: string
    supplier?: string
    [key: string]: unknown
  }
  sellerId: string
  seller?: User
  status: ProductStatusType // numeric: 0=draft, 1=active, 2=out_of_stock
  badges: ProductBadgeType[] // numeric array: 0=NEW, 1=FEATURED, 2=PROMO, 3=HOT, 4=SALE
  warranty?: string
  returnPolicy?: string
  rating: number
  reviewCount: number
  viewCount: number
  isFeatured: boolean
  isPromoted: boolean
  createdAt: string
  updatedAt: string
}

// Re-export types for backward compatibility
export type ProductCondition = ProductConditionType
export type ProductStatus = ProductStatusType
export type ProductBadge = ProductBadgeType

export interface CartItem {
  id: string
  cartId: string
  productId: string
  sellerId?: string
  sellerName?: string
  quantity: number
  price: number
  productName: string
  productImage: string
  productPrice: number
  productStock: number
  productStatus: ProductStatusType
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNo?: string
  buyerId: string
  buyer?: User
  sellerId: string
  seller?: User
  productId?: string
  product?: Product
  items?: OrderItem[]
  quantity?: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  totalAmount?: number
  currency: string
  status: OrderStatusType // numeric: 0=pending, 1=confirmed, 2=preparing, 3=ready_for_pickup, 4=completed, 5=cancelled, 6=refunded
  paymentMethod: PaymentMethodType | null // numeric: 0=bank_transfer
  paymentStatus: PaymentStatusType // numeric: 0=pending, 1=completed, 2=failed, 3=refunded
  shippingAddressId?: number
  billingAddressId?: number
  deliveryAddress?: Address
  notes?: string
  sellerNotes?: string
  paymentImage?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage?: string
  price: number
  quantity: number
  subtotal: number
}

// Re-export types for backward compatibility
export type OrderStatus = OrderStatusType
export type PaymentMethod = PaymentMethodType
export type PaymentStatus = PaymentStatusType

export interface Address {
  id: string
  recipientName: string
  recipientPhone: string
  street: string
  city: string
  state: string
  district?: string
  ward?: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Review {
  id: string
  productId: string
  product?: Product
  buyerId: string
  buyer?: User
  sellerId: string
  seller?: User
  rating: number
  comment?: string
  isVerified: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  sender?: User
  content: string
  messageType: MessageTypeValue // numeric: 0=text, 1=image, 2=file
  type?: MessageTypeValue // alias for backward compatibility
  attachments?: string[]
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  type: number // 0=direct, 1=group
  participants: User[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string | undefined
  categoryId?: string | number | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  condition?: ProductConditionType | undefined
  location?: string | undefined
  sellerId?: string | undefined
  status?: ProductStatusType | undefined
  search?: string | undefined
  badges?: ProductBadgeType[] | undefined
  rating?: number | undefined
  minRating?: number | undefined
  featured?: boolean | undefined
  promoted?: boolean | undefined
  sortBy?: string | undefined
  sortOrder?: 'asc' | 'desc' | undefined
  page?: number | undefined
  pageSize?: number | undefined
  limit?: number | undefined
  offset?: number | undefined
}

export interface PaginatedResponse<T> {
  total: number
  items: T[]
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AdminTokens {
  adminAccessToken: string
  adminRefreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

export interface DemoData {
  products: Product[]
  categories: Category[]
  users: User[]
  orders: Order[]
  moderationProducts?: unknown[]
}

export interface PaymentData {
  method: PaymentMethodType
  amount: number
  currency: string
  orderId: string
  metadata?: Record<string, unknown>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  redirectUrl?: string
  error?: string
}

export interface Notification {
  id: string
  userId: string
  type: number // 0=order, 1=product, 2=payment, 3=system, 4=promotion, 5=message
  title: string
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: number // 0=deposit, 1=sale, 2=refund, 3=commission, 4=bonus, 5=subscription_purchase, 6=boost
  amount: number
  currency: string
  status: string
  paymentMethod?: PaymentMethodType
  reference?: string
  description?: string
  orderId?: string
  createdAt: string
  updatedAt: string
}
