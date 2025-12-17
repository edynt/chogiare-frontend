import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

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

export const adminApi = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats')
    return response.data.data
  },

  getRecentActivities: async (limit?: number): Promise<RecentActivity[]> => {
    const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/admin/dashboard/activities', {
      params: { limit },
    })
    return response.data.data
  },

  getTopSellers: async (limit?: number): Promise<TopSeller[]> => {
    const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/dashboard/top-sellers', {
      params: { limit },
    })
    return response.data.data
  },

  getAnalyticsOverview: async (timeRange?: string): Promise<AnalyticsOverviewStats> => {
    const response = await apiClient.get<ApiResponse<AnalyticsOverviewStats>>('/admin/analytics/overview', {
      params: { timeRange },
    })
    return response.data.data
  },

  getAnalyticsTopProducts: async (limit?: number): Promise<AnalyticsTopProduct[]> => {
    const response = await apiClient.get<ApiResponse<AnalyticsTopProduct[]>>('/admin/analytics/top-products', {
      params: { limit },
    })
    return response.data.data
  },

  getAnalyticsTopSellers: async (limit?: number): Promise<TopSeller[]> => {
    const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/analytics/top-sellers', {
      params: { limit },
    })
    return response.data.data
  },

  getCategoryStats: async (): Promise<CategoryStat[]> => {
    const response = await apiClient.get<ApiResponse<CategoryStat[]>>('/admin/analytics/category-stats')
    return response.data.data
  },

  getUsers: async (params?: QueryAdminUsersParams): Promise<AdminUserListResponse> => {
    const response = await apiClient.get<ApiResponse<AdminUserListResponse>>('/admin/users', {
      params,
    })
    return response.data.data
  },

  getUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${id}`)
    return response.data.data
  },

  getUserStats: async (): Promise<AdminUserStats> => {
    const response = await apiClient.get<ApiResponse<AdminUserStats>>('/admin/users/stats')
    return response.data.data
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
}

