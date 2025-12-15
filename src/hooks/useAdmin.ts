import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminApi.getDashboardStats(),
  })
}

export function useAdminRecentActivities(limit?: number) {
  return useQuery({
    queryKey: ['admin-recent-activities', limit],
    queryFn: () => adminApi.getRecentActivities(limit),
  })
}

export function useAdminTopSellers(limit?: number) {
  return useQuery({
    queryKey: ['admin-top-sellers', limit],
    queryFn: () => adminApi.getTopSellers(limit),
  })
}

export function useAnalyticsOverview(timeRange?: string) {
  return useQuery({
    queryKey: ['analytics-overview', timeRange],
    queryFn: () => adminApi.getAnalyticsOverview(timeRange),
  })
}

export function useAnalyticsTopProducts(limit?: number) {
  return useQuery({
    queryKey: ['analytics-top-products', limit],
    queryFn: () => adminApi.getAnalyticsTopProducts(limit),
  })
}

export function useAnalyticsTopSellers(limit?: number) {
  return useQuery({
    queryKey: ['analytics-top-sellers', limit],
    queryFn: () => adminApi.getAnalyticsTopSellers(limit),
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: () => adminApi.getCategoryStats(),
  })
}
