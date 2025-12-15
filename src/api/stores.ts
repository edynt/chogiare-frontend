import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface Store {
  id: string
  userId: number
  name: string
  description?: string
  logo?: string
  banner?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  rating: number
  reviewCount: number
  productCount: number
  followerCount: number
  isVerified: boolean
  isActive: boolean
  userName?: string
  userEmail?: string
  createdAt: string
  updatedAt: string
}

export interface StoreListResponse {
  stores: Store[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface StoreStats {
  totalStores: number
  activeStores: number
  verifiedStores: number
  averageRating: number
  totalProducts: number
  totalFollowers: number
}

export interface CreateStoreRequest {
  name: string
  description?: string
  logo?: string
  banner?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  isVerified: boolean
  isActive: boolean
}

export interface UpdateStoreRequest {
  name?: string
  description?: string
  logo?: string
  banner?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  isVerified?: boolean
  isActive?: boolean
}

export const storesApi = {
  // Store CRUD operations
  createStore: async (data: CreateStoreRequest): Promise<Store> => {
    const response = await apiClient.post<ApiResponse<Store>>('/stores', data)
    return response.data.data
  },

  getStore: async (id: string): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`)
    return response.data.data
  },

  getMyStore: async (): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>('/stores/my')
    return response.data.data
  },

  getUserStore: async (): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>('/stores/my')
    return response.data.data
  },

  getStores: async (filters?: { page?: number; pageSize?: number }): Promise<StoreListResponse> => {
    const response = await apiClient.get<ApiResponse<StoreListResponse>>('/stores', {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listStores: async (page = 1, pageSize = 10): Promise<StoreListResponse> => {
    const response = await apiClient.get<ApiResponse<StoreListResponse>>('/stores', {
      params: { page, pageSize }
    })
    return response.data.data
  },

  searchStores: async (query: string, filters?: { page?: number; pageSize?: number }): Promise<StoreListResponse> => {
    const response = await apiClient.get<ApiResponse<StoreListResponse>>('/stores/search', {
      params: { 
        q: query, 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  updateStore: async (id: string, data: UpdateStoreRequest): Promise<Store> => {
    const response = await apiClient.put<ApiResponse<Store>>(`/stores/${id}`, data)
    return response.data.data
  },

  deleteStore: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}`)
  },

  // Statistics
  getStoreStats: async (): Promise<StoreStats> => {
    const response = await apiClient.get<ApiResponse<StoreStats>>('/stores/stats')
    return response.data.data
  },

  getUserStoreStats: async (): Promise<StoreStats> => {
    const response = await apiClient.get<ApiResponse<StoreStats>>('/stores/stats/my')
    return response.data.data
  },

  getStoreStatsById: async (storeId: string): Promise<StoreStats> => {
    const response = await apiClient.get<ApiResponse<StoreStats>>(`/stores/stats/${storeId}`)
    return response.data.data
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/stores/dashboard/stats')
    return response.data.data
  },

  getLowStockProducts: async (limit?: number): Promise<LowStockProduct[]> => {
    const response = await apiClient.get<ApiResponse<LowStockProduct[]>>('/stores/dashboard/low-stock', {
      params: { limit },
    })
    return response.data.data
  },

  getPromotedProducts: async (): Promise<PromotedProduct[]> => {
    const response = await apiClient.get<ApiResponse<PromotedProduct[]>>('/stores/dashboard/promoted')
    return response.data.data
  },
}

export interface DashboardStats {
  totalProducts: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    subtitle: string
  }
  revenue: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    subtitle: string
  }
  orders: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    subtitle: string
  }
  views: {
    value: number
    change: number
    changeType: 'positive' | 'negative'
    subtitle: string
  }
}

export interface LowStockProduct {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface PromotedProduct {
  id: string
  name: string
  image: string
  price: number
  currentViews: number
  totalViews: number
  startDate: string
  endDate: string | null
  remainingViews: number
  packageId: string
  packageName: string
  packageType: 'payPerView' | 'payPerDay'
  packagePrice: number
}
