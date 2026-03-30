import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@user/api/reviews'
import type { UpdateReviewRequest } from '@user/api/reviews'

export const useReviews = (filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: () => reviewsApi.getReviews(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useProductReviews = (
  productId: string,
  filters?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId, filters],
    queryFn: () => reviewsApi.getProductReviews(productId, filters),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUserReviews = (filters?: {
  page?: number
  pageSize?: number
}) => {
  return useQuery({
    queryKey: ['reviews', 'user', filters],
    queryFn: () => reviewsApi.getUserReviews(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSellerReviews = (
  sellerId: string,
  filters?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['reviews', 'seller', sellerId, filters],
    queryFn: () => reviewsApi.getSellerReviews(sellerId, filters),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useReview = (id: string) => {
  return useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getReview(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useReviewEligibility = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: ['reviews', 'eligibility', productId],
    queryFn: () => reviewsApi.checkEligibility(productId),
    enabled: !!productId && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: (_, _variables) => {
      // Invalidate all review queries (includes eligibility, product reviews, etc.)
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      // Invalidate product query to refresh reviewCount
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewRequest }) =>
      reviewsApi.updateReview(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
    },
  })
}

export const useReviewStats = () => {
  return useQuery({
    queryKey: ['reviews', 'stats'],
    queryFn: reviewsApi.getReviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProductReviewStats = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'stats', 'product', productId],
    queryFn: () => reviewsApi.getProductReviewStats(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSellerReviewStats = (sellerId: string) => {
  return useQuery({
    queryKey: ['reviews', 'stats', 'seller', sellerId],
    queryFn: () => reviewsApi.getSellerReviewStats(sellerId),
    enabled: !!sellerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
