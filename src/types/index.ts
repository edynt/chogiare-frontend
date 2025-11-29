export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  roles: UserRole[]
  postCount: number
  storeInfo?: StoreInfo
  createdAt: string
  updatedAt: string
}

export type UserRole = 'buyer' | 'seller' | 'admin'

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
  categoryId: string
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
  shippingAddress: Address
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
  images?: string[]
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
  categoryId?: string | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  condition?: ProductCondition | undefined
  location?: string | undefined
  sellerId?: string | undefined
  badges?: ProductBadge[] | undefined
  rating?: number | undefined
  minRating?: number | undefined
  featured?: boolean | undefined
  promoted?: boolean | undefined
  sortBy?: string | undefined
  sortOrder?: 'asc' | 'desc' | undefined
  page?: number | undefined
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
  name: string
  email: string
  password: string
  phone?: string
  roles: UserRole[]
}

export interface DemoData {
  products: Product[]
  categories: Category[]
  users: User[]
  orders: Order[]
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
