import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { ordersApi } from '@user/api/orders'
import type { UpdateOrderRequest } from '@user/api/orders'

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

export const useUserOrders = (filters?: {
  page?: number
  pageSize?: number
}) => {
  return useQuery({
    queryKey: ['orders', 'user', filters],
    queryFn: () => ordersApi.getUserOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useStoreOrders = (
  sellerId: string,
  filters?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['orders', 'seller', sellerId, filters],
    queryFn: () => ordersApi.getSellerOrdersById(sellerId, filters),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useInfiniteStoreOrders = (
  sellerId: string,
  pageSize: number = 20
) => {
  return useInfiniteQuery({
    queryKey: ['orders', 'seller', 'infinite', sellerId],
    queryFn: ({ pageParam = 1 }) => {
      return ordersApi.getSellerOrdersById(sellerId, {
        page: pageParam,
        pageSize,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      const totalPages = lastPage.totalPages || 1
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useInfiniteUserOrders = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['orders', 'user', 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      return ordersApi.getUserOrders({ page: pageParam, pageSize })
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      const totalPages = lastPage.totalPages || 1
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSellerOrders = (filters?: {
  page?: number
  pageSize?: number
  status?: string
  paymentStatus?: string
}) => {
  return useQuery({
    queryKey: ['orders', 'seller', filters],
    queryFn: () => ordersApi.getSellerOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useInfiniteSellerOrders = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['orders', 'seller', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[useInfiniteSellerOrders] Fetching page:', pageParam)
      const result = await ordersApi.getSellerOrders({
        page: pageParam,
        pageSize,
      })
      console.log('[useInfiniteSellerOrders] Result:', result)
      return result
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      const totalPages = lastPage?.totalPages || 1
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
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
    mutationFn: ({
      id,
      paymentStatus,
      paymentProofUrl,
    }: {
      id: string
      paymentStatus: string
      paymentProofUrl?: string
    }) =>
      ordersApi.updateOrderPaymentStatus(id, paymentStatus, paymentProofUrl),
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

export const useStoreOrderStats = (sellerId: string) => {
  return useQuery({
    queryKey: ['orders', 'stats', 'seller', sellerId],
    queryFn: () => ordersApi.getSellerOrderStats(sellerId),
    enabled: !!sellerId,
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

/**
 * Hook to upload payment proof image for an order
 * Supports progress tracking during upload
 */
export const useUploadPaymentImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      file,
      onProgress,
    }: {
      orderId: string
      file: File
      onProgress?: (progress: {
        loaded: number
        total: number
        percentage: number
      }) => void
    }) => ordersApi.uploadPaymentImage(orderId, file, onProgress),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
    },
  })
}
