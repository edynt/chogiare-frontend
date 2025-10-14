import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storesApi } from '@/api/stores'
import type { UpdateStoreRequest } from '@/api/stores'

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

export const useSearchStores = (query: string, filters?: { page?: number; pageSize?: number }) => {
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
