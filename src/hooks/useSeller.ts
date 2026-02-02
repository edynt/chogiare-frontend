import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sellerApi } from '@user/api/seller'
import type { Product } from '@/types'
import type { CreateProductFormDataInput } from '@shared/utils/form-data'

// Dashboard Stats Hook
export const useSellerDashboardStats = () => {
  return useQuery({
    queryKey: ['seller', 'dashboard', 'stats'],
    queryFn: sellerApi.getDashboardStats,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Product Management Hooks
export const useSellerProducts = (filters?: {
  page?: number
  pageSize?: number
  categoryId?: number
  status?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['seller', 'products', filters],
    queryFn: () => sellerApi.getMyProducts(filters || {}),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSellerProduct = (id: string) => {
  return useQuery({
    queryKey: ['seller', 'products', id],
    queryFn: () => sellerApi.getMyProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateProductWithImages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateProductFormDataInput
      files: File[]
    }) => sellerApi.createProductWithImages(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      sellerApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products', id] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.bulkUpdateProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

// Stock Management Hooks
export const useUpdateStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      sellerApi.updateStock(productId, stock),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({
        queryKey: ['seller', 'products', productId],
      })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

export const useLowStockProducts = (threshold?: number) => {
  return useQuery({
    queryKey: ['seller', 'products', 'low-stock', threshold],
    queryFn: () => sellerApi.getLowStockProducts(threshold),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Order Management Hooks
export const useSellerOrders = (params?: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['seller', 'orders', params],
    queryFn: () => sellerApi.getMyOrders(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useSellerOrder = (id: string) => {
  return useQuery({
    queryKey: ['seller', 'orders', id],
    queryFn: () => sellerApi.getMyOrder(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      sellerApi.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders', orderId] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'dashboard'] })
    },
  })
}

// Revenue & Analytics Hooks
export const useRevenueStats = (params?: {
  startDate?: string
  endDate?: string
  period?: 'daily' | 'weekly' | 'monthly'
}) => {
  return useQuery({
    queryKey: ['seller', 'revenue', params],
    queryFn: () => sellerApi.getRevenueStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Notification Hooks
export const useSellerNotifications = (params?: {
  page?: number
  pageSize?: number
  read?: boolean
}) => {
  return useQuery({
    queryKey: ['seller', 'notifications', params],
    queryFn: () => sellerApi.getMyNotifications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'notifications'] })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'notifications'] })
    },
  })
}
