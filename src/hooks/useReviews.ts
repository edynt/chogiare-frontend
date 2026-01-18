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

export const useStoreReviews = (
  storeId: string,
  filters?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['reviews', 'store', storeId, filters],
    queryFn: () => reviewsApi.getStoreReviews(storeId, filters),
    enabled: !!storeId,
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

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'product', variables.productId],
      })
      queryClient.invalidateQueries({
        queryKey: ['products', variables.productId],
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

export const useStoreReviewStats = (storeId: string) => {
  return useQuery({
    queryKey: ['reviews', 'stats', 'store', storeId],
    queryFn: () => reviewsApi.getStoreReviewStats(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
