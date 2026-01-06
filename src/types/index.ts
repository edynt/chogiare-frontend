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
  language?: string
  showEmail?: boolean
  showPhone?: boolean
  isVerified?: boolean
  roles: UserRole[]
  roleIds?: number[]  // Numeric role IDs: 1=admin, 2=user
  postCount: number
  storeInfo?: StoreInfo
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

export interface StoreInfo {
  id: string
  name: string
  description?: string
  logo?: string
  banner?: string
  address?: string
  phone?: string
  email?: string
  isVerified: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

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
  condition: ProductCondition
  tags: string[]
  location: string
  stock: number
  sellerId: string
  seller?: User
  store?: StoreInfo
  status: ProductStatus
  badges: ProductBadge[]
  rating: number
  reviewCount: number
  viewCount: number
  isFeatured: boolean
  isPromoted: boolean
  createdAt: string
  updatedAt: string
}

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor'
export type ProductStatus = 'draft' | 'active' | 'sold' | 'archived' | 'suspended'
export type ProductBadge = 'NEW' | 'FEATURED' | 'PROMO' | 'HOT' | 'SALE'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  sellerId?: string
  sellerName?: string
  storeId?: string
  storeName?: string
  quantity: number
  price: number
  productName: string
  productImage: string
  productPrice: number
  productStock: number
  productStatus: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  buyerId: string
  buyer?: User
  sellerId: string
  seller?: User
  productId: string
  product?: Product
  quantity: number
  totalAmount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  deliveryAddress: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'ready_for_pickup' | 'completed' | 'cancelled' | 'refunded'
export type PaymentMethod = 'momo' | 'zalopay' | 'stripe' | 'paypal' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

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
  type: 'text' | 'image' | 'file'
  attachments?: string[]
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
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
  condition?: ProductCondition | undefined
  location?: string | undefined
  sellerId?: string | undefined
  status?: ProductStatus | undefined
  search?: string | undefined
  badges?: ProductBadge[] | undefined
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
  moderationProducts?: any[]
}

export interface PaymentData {
  method: PaymentMethod
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
