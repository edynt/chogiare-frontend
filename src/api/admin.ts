import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

const handleApiError = <T>(error: unknown, defaultValue: T): T => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: unknown } }
    const status = axiosError.response?.status
    if (status === 403 || status === 404) {
      console.warn(`API endpoint not available: ${status}`)
      return defaultValue
    }
  }
  throw error
}

export interface AdminDashboardStats {
  totalUsers: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    sellers: number
    buyers: number
  }
  totalProducts: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    active: number
    pending: number
  }
  totalOrders: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    completed: number
    processing: number
  }
  revenue: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    commission: number
    profit: number
  }
}

export interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'error' | 'pending'
}

export interface TopSeller {
  name: string
  orders: number
  revenue: number
  rating: number
}

export interface AnalyticsOverviewStats {
  totalViews: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
  newUsers: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
  orders: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    conversionRate: number
  }
  revenue: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    profit: number
  }
}

export interface AnalyticsTopProduct {
  name: string
  views: number
  orders: number
  revenue: number
  growth: string
}

export interface CategoryStat {
  name: string
  products: number
  orders: number
  revenue: number
  percentage: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  verified: boolean
  joinDate: string
  lastActive: string
  totalOrders: number
  totalRevenue: number
  rating: number
  location?: string
  avatar?: string
}

export interface AdminUserListResponse {
  items: AdminUser[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminUserStats {
  active: number
  pending: number
  suspended: number
  sellers: number
  verified: number
}

export interface QueryAdminUsersParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  role?: string
}

export interface AdminOrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
}

export interface AdminOrder {
  id: string
  userId: number
  storeId: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: string
  billingAddress: string
  notes?: string
  storeName?: string
  storeLogo?: string
  userEmail?: string
  userName?: string
  userPhone?: string
  sellerName?: string
  sellerEmail?: string
  sellerPhone?: string
  items: AdminOrderItem[]
  createdAt: string
  updatedAt: string
  completedAt?: string
  trackingNumber?: string
  commission?: number
  netAmount?: number
}

export interface AdminOrderListResponse {
  items: AdminOrder[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminOrderStats {
  totalOrders: number
  totalRevenue: number
  totalCommission: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  completedOrders: number
  cancelledOrders: number
}

export interface QueryAdminOrdersParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  paymentStatus?: string
  dateFilter?: string
}

export interface AdminTransaction {
  id: number
  userId?: number
  orderId?: string
  type: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethod: string | null
  reference: string | null
  description: string | null
  createdAt: string
  updatedAt: string
  completedAt?: string
  fee?: number
  netAmount?: number
  userName?: string
  userEmail?: string
}

export interface AdminTransactionListResponse {
  items: AdminTransaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminPaymentStats {
  totalTransactions: number
  totalAmount: number
  pendingTransactions: number
  completedTransactions: number
  failedTransactions: number
  totalCommission: number
}

export interface QueryAdminTransactionsParams {
  page?: number
  pageSize?: number
  type?: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
  status?: 'pending' | 'completed' | 'failed' | 'cancelled'
  search?: string
  dateFilter?: string
}

export const adminApi = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats')
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        totalUsers: { value: 0, change: 0, changeType: 'positive' as const, sellers: 0, buyers: 0 },
        totalProducts: { value: 0, change: 0, changeType: 'positive' as const, active: 0, pending: 0 },
        totalOrders: { value: 0, change: 0, changeType: 'positive' as const, completed: 0, processing: 0 },
        revenue: { value: 0, change: 0, changeType: 'positive' as const, commission: 0, profit: 0 },
      })
    }
  },

  getRecentActivities: async (limit?: number): Promise<RecentActivity[]> => {
    try {
      const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/admin/dashboard/activities', {
        params: { limit },
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, [])
    }
  },

  getTopSellers: async (limit?: number): Promise<TopSeller[]> => {
    try {
      const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/dashboard/top-sellers', {
        params: { limit },
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, [])
    }
  },

  getAnalyticsOverview: async (timeRange?: string): Promise<AnalyticsOverviewStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AnalyticsOverviewStats>>('/admin/analytics/overview', {
        params: { timeRange },
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        totalViews: { value: 0, change: 0, changeType: 'positive' as const },
        newUsers: { value: 0, change: 0, changeType: 'positive' as const },
        orders: { value: 0, change: 0, changeType: 'positive' as const, conversionRate: 0 },
        revenue: { value: 0, change: 0, changeType: 'positive' as const, profit: 0 },
      })
    }
  },

  getAnalyticsTopProducts: async (limit?: number): Promise<AnalyticsTopProduct[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AnalyticsTopProduct[]>>('/admin/analytics/top-products', {
        params: { limit },
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, [])
    }
  },

  getAnalyticsTopSellers: async (limit?: number): Promise<TopSeller[]> => {
    try {
      const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/analytics/top-sellers', {
        params: { limit },
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, [])
    }
  },

  getCategoryStats: async (): Promise<CategoryStat[]> => {
    try {
      const response = await apiClient.get<ApiResponse<CategoryStat[]>>('/admin/analytics/category-stats')
      return response.data.data
    } catch (error) {
      return handleApiError(error, [])
    }
  },

  getUsers: async (params?: QueryAdminUsersParams): Promise<AdminUserListResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserListResponse>>('/admin/users', {
        params,
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        items: [],
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalPages: 0,
      })
    }
  },

  getUser: async (id: string): Promise<AdminUser> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  getUserStats: async (): Promise<AdminUserStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserStats>>('/admin/users/stats')
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        active: 0,
        pending: 0,
        suspended: 0,
        sellers: 0,
        verified: 0,
      })
    }
  },

  approveUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/approve`)
    return response.data.data
  },

  suspendUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/suspend`)
    return response.data.data
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/activate`)
    return response.data.data
  },

  bulkApproveUsers: async (userIds: string[]): Promise<{ count: number }> => {
    const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/users/bulk-approve', {
      userIds,
    })
    return response.data.data
  },

  bulkSuspendUsers: async (userIds: string[]): Promise<{ count: number }> => {
    const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/users/bulk-suspend', {
      userIds,
    })
    return response.data.data
  },

  getOrders: async (params?: QueryAdminOrdersParams): Promise<AdminOrderListResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminOrderListResponse>>('/admin/orders', {
        params,
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        items: [],
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalPages: 0,
      })
    }
  },

  getOrder: async (id: string): Promise<AdminOrder> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  getOrderStats: async (): Promise<AdminOrderStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminOrderStats>>('/admin/orders/stats')
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        totalOrders: 0,
        totalRevenue: 0,
        totalCommission: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      })
    }
  },

  updateOrderStatus: async (id: string, status: string): Promise<AdminOrder> => {
    const response = await apiClient.patch<ApiResponse<AdminOrder>>(
      `/admin/orders/${id}/status`,
      {},
      { params: { status } }
    )
    return response.data.data
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: string): Promise<AdminOrder> => {
    const response = await apiClient.patch<ApiResponse<AdminOrder>>(
      `/admin/orders/${id}/payment-status`,
      {},
      { params: { paymentStatus } }
    )
    return response.data.data
  },

  getTransactions: async (params?: QueryAdminTransactionsParams): Promise<AdminTransactionListResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminTransactionListResponse>>('/admin/payments/transactions', {
        params,
      })
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        items: [],
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalPages: 0,
      })
    }
  },

  getTransaction: async (id: number): Promise<AdminTransaction> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminTransaction>>(`/admin/payments/transactions/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  getPaymentStats: async (): Promise<AdminPaymentStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminPaymentStats>>('/admin/payments/stats')
      return response.data.data
    } catch (error) {
      return handleApiError(error, {
        totalTransactions: 0,
        totalAmount: 0,
        pendingTransactions: 0,
        completedTransactions: 0,
        failedTransactions: 0,
        totalCommission: 0,
      })
    }
  },
}


