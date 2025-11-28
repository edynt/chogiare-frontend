import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import type { UpdateOrderRequest } from '@/api/orders'

export const useOrders = (filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserOrders = (filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['orders', 'user', filters],
    queryFn: () => ordersApi.getUserOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useStoreOrders = (storeId: string, filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['orders', 'store', storeId, filters],
    queryFn: () => ordersApi.getStoreOrders(storeId, filters),
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      ordersApi.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
  })
}

export const useUpdateOrderPaymentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) =>
      ordersApi.updateOrderPaymentStatus(id, paymentStatus),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersApi.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: ordersApi.getOrderStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStoreOrderStats = (storeId: string) => {
  return useQuery({
    queryKey: ['orders', 'stats', 'store', storeId],
    queryFn: () => ordersApi.getStoreOrderStats(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserOrderStats = () => {
  return useQuery({
    queryKey: ['orders', 'stats', 'user'],
    queryFn: ordersApi.getUserOrderStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useConfirmOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, sellerNotes }: { id: string; sellerNotes?: string }) =>
      ordersApi.confirmOrder(id, sellerNotes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
  })
}