import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type QueryAdminUsersParams, type QueryAdminOrdersParams, type QueryAdminTransactionsParams } from '@/api/admin'

const defaultQueryOptions = {
  retry: (failureCount: number, error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      const status = axiosError.response?.status
      if (status === 403 || status === 404) {
        return false
      }
    }
    return failureCount < 2
  },
  retryDelay: 1000,
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminApi.getDashboardStats(),
    ...defaultQueryOptions,
  })
}

export function useAdminRecentActivities(limit?: number) {
  return useQuery({
    queryKey: ['admin-recent-activities', limit],
    queryFn: () => adminApi.getRecentActivities(limit),
    ...defaultQueryOptions,
  })
}

export function useAdminTopSellers(limit?: number) {
  return useQuery({
    queryKey: ['admin-top-sellers', limit],
    queryFn: () => adminApi.getTopSellers(limit),
    ...defaultQueryOptions,
  })
}

export function useAnalyticsOverview(timeRange?: string) {
  return useQuery({
    queryKey: ['analytics-overview', timeRange],
    queryFn: () => adminApi.getAnalyticsOverview(timeRange),
    ...defaultQueryOptions,
  })
}

export function useAnalyticsTopProducts(limit?: number) {
  return useQuery({
    queryKey: ['analytics-top-products', limit],
    queryFn: () => adminApi.getAnalyticsTopProducts(limit),
    ...defaultQueryOptions,
  })
}

export function useAnalyticsTopSellers(limit?: number) {
  return useQuery({
    queryKey: ['analytics-top-sellers', limit],
    queryFn: () => adminApi.getAnalyticsTopSellers(limit),
    ...defaultQueryOptions,
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: () => adminApi.getCategoryStats(),
    ...defaultQueryOptions,
  })
}

export function useAdminUsers(params?: QueryAdminUsersParams) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getUsers(params),
    ...defaultQueryOptions,
  })
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
    ...defaultQueryOptions,
  })
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: () => adminApi.getUserStats(),
    ...defaultQueryOptions,
  })
}

export function useApproveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useBulkApproveUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userIds: string[]) => adminApi.bulkApproveUsers(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useBulkSuspendUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userIds: string[]) => adminApi.bulkSuspendUsers(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useAdminOrders(params?: QueryAdminOrdersParams) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => adminApi.getOrders(params),
    ...defaultQueryOptions,
  })
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminApi.getOrder(id),
    enabled: !!id,
    ...defaultQueryOptions,
  })
}

export function useAdminOrderStats() {
  return useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: () => adminApi.getOrderStats(),
    ...defaultQueryOptions,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useUpdateOrderPaymentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) => adminApi.updateOrderPaymentStatus(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
    },
  })
}

export function useAdminTransactions(params?: QueryAdminTransactionsParams) {
  return useQuery({
    queryKey: ['admin-transactions', params],
    queryFn: () => adminApi.getTransactions(params),
    ...defaultQueryOptions,
  })
}

export function useAdminTransaction(id: number) {
  return useQuery({
    queryKey: ['admin-transaction', id],
    queryFn: () => adminApi.getTransaction(id),
    enabled: !!id,
    ...defaultQueryOptions,
  })
}

export function useAdminPaymentStats() {
  return useQuery({
    queryKey: ['admin-payment-stats'],
    queryFn: () => adminApi.getPaymentStats(),
    ...defaultQueryOptions,
  })
}


