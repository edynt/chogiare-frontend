import { apiClient } from '@shared/api/axios'
import type {
  Product,
  SearchFilters,
  PaginatedResponse,
  ApiResponse,
  Order,
  User,
} from '@/types'
import { constructProductFormData } from '@shared/utils/form-data'
import type { CreateProductFormDataInput } from '@shared/utils/form-data'

/**
 * Seller API
 * Dedicated API endpoints for seller operations
 * All endpoints require seller role authentication
 */

// Dashboard stats
export interface SellerDashboardStats {
  totalProducts: number
  activeProducts: number
  soldProducts: number
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalCustomers: number
  lowStockProducts: number
  outOfStockProducts: number
}

// Revenue stats
export interface RevenueStats {
  daily: { date: string; revenue: number; orders: number }[]
  weekly: { week: string; revenue: number; orders: number }[]
  monthly: { month: string; revenue: number; orders: number }[]
  total: number
  averageOrderValue: number
}

// Customer stats
export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  returningCustomers: number
  topCustomers: Array<{
    id: string
    name: string
    email: string
    totalOrders: number
    totalSpent: number
  }>
}

// Seller customer (aggregated from orders)
export interface SellerCustomer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  status: 'active' | 'inactive'
}

// Seller customer order (simplified order for customer history)
export interface SellerCustomerOrder {
  id: string
  status: string
  paymentStatus: string
  total: number
  itemCount: number
  items: Array<{
    id: string
    productId: string
    productName: string
    productImage: string | null
    quantity: number
    price: number
    subtotal: number
  }>
  createdAt: string
}

export const sellerApi = {
  // Dashboard
  getDashboardStats: async (): Promise<SellerDashboardStats> => {
    const response = await apiClient.get<ApiResponse<SellerDashboardStats>>(
      '/seller/dashboard/stats'
    )
    return response.data.data
  },

  // Products Management
  getMyProducts: async (
    filters: Omit<SearchFilters, 'sellerId'> = {}
  ): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, unknown> = {}

    if (filters.page !== undefined) params.page = filters.page
    if (filters.pageSize !== undefined) params.pageSize = filters.pageSize
    else if (filters.limit !== undefined) params.pageSize = filters.limit

    if (filters.categoryId !== undefined) params.categoryId = filters.categoryId
    if (filters.status !== undefined) params.status = filters.status
    if (filters.search !== undefined) params.search = filters.search
    if (filters.query !== undefined) params.search = filters.query

    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/seller/products', { params })
    return response.data.data
  },

  getMyProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/seller/products/${id}`
    )
    return response.data.data
  },

  /**
   * Create product with multipart/form-data (includes image files)
   * Uploads images in same request as product creation
   */
  createProductWithImages: async (
    data: CreateProductFormDataInput,
    files: File[]
  ): Promise<Product> => {
    const formData = constructProductFormData(data, files)

    // Must explicitly set Content-Type to undefined to let browser set multipart/form-data with boundary
    const response = await apiClient.post<ApiResponse<Product>>(
      '/seller/products',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    )

    return response.data.data
  },

  /**
   * Create product with JSON (backward compatibility)
   * Use this when images are pre-uploaded
   */
  createProduct: async (data: {
    title: string
    description?: string
    categoryId: number
    price: number
    originalPrice?: number
    condition: string
    location?: string
    stock: number
    tags?: string[]
    badges?: string[]
    minStock?: number
    maxStock?: number
    costPrice?: number
    sellingPrice?: number
    sku?: string
    storeId?: number
    images?: string[]
  }): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      '/seller/products',
      data
    )
    return response.data.data
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/seller/products/${id}`,
      data
    )
    return response.data.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/seller/products/${id}`)
  },

  bulkUpdateProducts: async (
    updates: Array<{ id: string; data: Partial<Product> }>
  ): Promise<Product[]> => {
    const response = await apiClient.patch<ApiResponse<Product[]>>(
      '/seller/products/bulk',
      { updates }
    )
    return response.data.data
  },

  // Stock Management
  updateStock: async (productId: string, stock: number): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/seller/products/${productId}/stock`,
      { stock }
    )
    return response.data.data
  },

  getLowStockProducts: async (threshold = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/seller/products/low-stock',
      {
        params: { threshold },
      }
    )
    return response.data.data
  },

  // Orders Management
  getMyOrders: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      '/seller/orders',
      { params }
    )
    return response.data.data
  },

  getMyOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/seller/orders/${id}`
    )
    return response.data.data
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/seller/orders/${orderId}/status`,
      { status }
    )
    return response.data.data
  },

  // Revenue & Analytics
  getRevenueStats: async (params?: {
    startDate?: string
    endDate?: string
    period?: 'daily' | 'weekly' | 'monthly'
  }): Promise<RevenueStats> => {
    const response = await apiClient.get<ApiResponse<RevenueStats>>(
      '/seller/revenue',
      {
        params,
      }
    )
    return response.data.data
  },

  // Customer Management
  getMyCustomers: async (params?: {
    page?: number
    pageSize?: number
    search?: string
  }): Promise<PaginatedResponse<SellerCustomer>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SellerCustomer>>>(
      '/seller/customers',
      { params }
    )
    return response.data.data
  },

  getCustomerStats: async (): Promise<CustomerStats> => {
    const response = await apiClient.get<ApiResponse<CustomerStats>>(
      '/seller/customers/stats'
    )
    return response.data.data
  },

  getCustomerOrders: async (
    customerId: string,
    params?: {
      page?: number
      pageSize?: number
    }
  ): Promise<PaginatedResponse<SellerCustomerOrder>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SellerCustomerOrder>>>(
      `/seller/customers/${customerId}/orders`,
      { params }
    )
    return response.data.data
  },

  // Notifications
  getMyNotifications: async (params?: {
    page?: number
    pageSize?: number
    read?: boolean
  }): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      '/seller/notifications',
      { params }
    )
    return response.data.data
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/seller/notifications/${notificationId}/read`)
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiClient.patch('/seller/notifications/read-all')
  },
}
