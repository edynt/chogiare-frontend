/**
 * @deprecated This file is deprecated. The Store model has been removed from the backend.
 * Seller information is now part of the User model.
 * Please use the seller hooks from './useSeller.ts' instead.
 *
 * Migration guide:
 * - useStores -> useSellerProducts (for products)
 * - useStore -> useSellerProduct (for single product)
 * - useUserStore -> Use user auth context for seller info
 * - useStoreStats -> useSellerDashboardStats
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storesApi } from '@user/api/stores'
import type { UpdateStoreRequest } from '@user/api/stores'

export const useStores = (filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: () => storesApi.getStores(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => storesApi.getStore(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserStore = () => {
  return useQuery({
    queryKey: ['stores', 'user'],
    queryFn: storesApi.getUserStore,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchStores = (
  query: string,
  filters?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['stores', 'search', query, filters],
    queryFn: () => storesApi.searchStores(query, filters),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: storesApi.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.invalidateQueries({ queryKey: ['stores', 'user'] })
    },
  })
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) =>
      storesApi.updateStore(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.invalidateQueries({ queryKey: ['stores', id] })
      queryClient.invalidateQueries({ queryKey: ['stores', 'user'] })
    },
  })
}

export const useDeleteStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: storesApi.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.invalidateQueries({ queryKey: ['stores', 'user'] })
    },
  })
}

export const useStoreStats = () => {
  return useQuery({
    queryKey: ['stores', 'stats'],
    queryFn: storesApi.getStoreStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserStoreStats = () => {
  return useQuery({
    queryKey: ['stores', 'stats', 'user'],
    queryFn: storesApi.getUserStoreStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStoreStatsById = (storeId: string) => {
  return useQuery({
    queryKey: ['stores', 'stats', storeId],
    queryFn: () => storesApi.getStoreStatsById(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['stores', 'dashboard', 'stats'],
    queryFn: storesApi.getDashboardStats,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useLowStockProducts = (limit?: number) => {
  return useQuery({
    queryKey: ['stores', 'dashboard', 'low-stock', limit],
    queryFn: () => storesApi.getLowStockProducts(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const usePromotedProducts = () => {
  return useQuery({
    queryKey: ['stores', 'dashboard', 'promoted'],
    queryFn: storesApi.getPromotedProducts,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}
