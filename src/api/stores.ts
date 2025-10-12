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
    const response = await apiClient.post<ApiResponse<Store>>('/v1/stores', data)
    return response.data.data
  },

  getStore: async (id: string): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>(`/v1/stores/${id}`)
    return response.data.data
  },

  getMyStore: async (): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>('/v1/stores/my')
    return response.data.data
  },

  listStores: async (page = 1, pageSize = 10): Promise<StoreListResponse> => {
    const response = await apiClient.get<ApiResponse<StoreListResponse>>('/v1/stores', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  searchStores: async (query: string, page = 1, pageSize = 10): Promise<StoreListResponse> => {
    const response = await apiClient.get<ApiResponse<StoreListResponse>>('/v1/stores/search', {
      params: { q: query, page, page_size: pageSize }
    })
    return response.data.data
  },

  updateStore: async (id: string, data: UpdateStoreRequest): Promise<Store> => {
    const response = await apiClient.put<ApiResponse<Store>>(`/v1/stores/${id}`, data)
    return response.data.data
  },

  deleteStore: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/stores/${id}`)
  },

  // Statistics
  getStoreStats: async (): Promise<StoreStats> => {
    const response = await apiClient.get<ApiResponse<StoreStats>>('/v1/stores/stats')
    return response.data.data
  },
}
