import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface Review {
  id: string
  productId: string
  userId: number
  orderId?: string
  rating: number
  title?: string
  comment?: string
  images: string[]
  isVerified: boolean
  helpful: number
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
  productId: string
  orderId?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerified: boolean
}

export interface UpdateReviewRequest {
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerified: boolean
}

export const reviewsApi = {
  // Review CRUD operations
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>('/v1/reviews', data)
    return response.data.data
  },

  getReview: async (id: string): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(`/v1/reviews/${id}`)
    return response.data.data
  },

  listReviews: async (page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/v1/reviews', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  listReviewsByProduct: async (productId: string, page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>(`/v1/reviews/product/${productId}`, {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  listUserReviews: async (page = 1, pageSize = 10): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ApiResponse<ReviewListResponse>>('/v1/reviews/my', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  updateReview: async (id: string, data: UpdateReviewRequest): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/v1/reviews/${id}`, data)
    return response.data.data
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/reviews/${id}`)
  },

  // Review interactions
  markReviewHelpful: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/reviews/${id}/helpful`)
  },

  unmarkReviewHelpful: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/reviews/${id}/helpful`)
  },

  // Statistics
  getReviewStats: async (productId: string): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>(`/v1/reviews/stats/product/${productId}`)
    return response.data.data
  },

  getUserReviewStats: async (): Promise<ReviewStats> => {
    const response = await apiClient.get<ApiResponse<ReviewStats>>('/v1/reviews/stats/my')
    return response.data.data
  },
}
