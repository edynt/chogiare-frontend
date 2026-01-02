import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface Review {
  id: string
  productId: string
  userId: number
  orderId?: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  userName?: string
  userEmail?: string
  userAvatar?: string
  productName?: string
  productImage?: string
  createdAt: string
  updatedAt: string
}

export interface ReviewListResponse {
  reviews: Review[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingCounts: Record<number, number>
  verifiedReviews: number
}

export interface CreateReviewRequest {
  productId: number
  orderId?: number
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
}

export interface UpdateReviewRequest {
  rating?: number
  title?: string
  comment?: string
  isVerified?: boolean
}

export const reviewsApi = {
  // Review CRUD operations
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data)
    return response.data.data
  },

  getReview: async (id: string): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(`/reviews/${id}`)
    return response.data.data
  },

  // List reviews with filters
  getReviews: async (filters?: { page?: number; pageSize?: number }): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/reviews', {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listReviews: async (page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/reviews', {
      params: { page, pageSize }
    })
    return response.data.data
  },

  // Product reviews
  getProductReviews: async (productId: string, filters?: { page?: number; pageSize?: number }): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>(`/reviews/product/${productId}`, {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listReviewsByProduct: async (productId: string, page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>(`/reviews/product/${productId}`, {
      params: { page, pageSize }
    })
    return response.data.data
  },

  // User reviews
  getUserReviews: async (filters?: { page?: number; pageSize?: number }): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/reviews/my', {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listUserReviews: async (page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/reviews/my', {
      params: { page, pageSize }
    })
    return response.data.data
  },

  // Store reviews
  getStoreReviews: async (storeId: string, filters?: { page?: number; pageSize?: number }): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>(`/reviews/store/${storeId}`, {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  updateReview: async (id: string, data: UpdateReviewRequest): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data)
    return response.data.data
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`)
  },

  // Statistics
  getReviewStats: async (): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>('/reviews/stats')
    return response.data.data
  },

  getProductReviewStats: async (productId: string): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>(`/reviews/stats/product/${productId}`)
    return response.data.data
  },

  getStoreReviewStats: async (storeId: string): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>(`/reviews/stats/store/${storeId}`)
    return response.data.data
  },

  getUserReviewStats: async (): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>('/reviews/stats/my')
    return response.data.data
  },
}
