import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface RevenueOverviewStats {
  totalRevenue: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
  totalOrders: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
  productsSold: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
  profit: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
  }
}

export interface RevenueData {
  date: string
  revenue: number
  orders: number
  productsSold: number
}

export interface TopProduct {
  productId: number
  name: string
  orders: number
  revenue: number
  quantity: number
  growth: string
}

export interface CategoryRevenue {
  name: string
  revenue: number
  orders: number
  percentage: number
}

export interface QueryRevenueReportParams {
  timeRange?: '7d' | '30d' | '90d' | '1y'
  dateFrom?: string
  dateTo?: string
  sellerId?: number
  limit?: number
}

export const reportsApi = {
  getRevenueOverview: async (
    params?: QueryRevenueReportParams
  ): Promise<RevenueOverviewStats> => {
    const response = await apiClient.get<ApiResponse<RevenueOverviewStats>>(
      '/reports/revenue/overview',
      {
        params,
      }
    )
    return response.data.data
  },

  getRevenueData: async (
    params?: QueryRevenueReportParams
  ): Promise<RevenueData[]> => {
    const response = await apiClient.get<ApiResponse<RevenueData[]>>(
      '/reports/revenue',
      {
        params,
      }
    )
    return response.data.data
  },

  getTopProducts: async (
    params?: QueryRevenueReportParams
  ): Promise<TopProduct[]> => {
    const response = await apiClient.get<ApiResponse<TopProduct[]>>(
      '/reports/top-products',
      {
        params,
      }
    )
    return response.data.data
  },

  getCategoryRevenue: async (
    params?: QueryRevenueReportParams
  ): Promise<CategoryRevenue[]> => {
    const response = await apiClient.get<ApiResponse<CategoryRevenue[]>>(
      '/reports/category-revenue',
      {
        params,
      }
    )
    return response.data.data
  },
}
