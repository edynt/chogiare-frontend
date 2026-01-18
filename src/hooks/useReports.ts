import { useQuery } from '@tanstack/react-query'
import { reportsApi, type QueryRevenueReportParams } from '@user/api/reports'

export function useRevenueOverview(params?: QueryRevenueReportParams) {
  return useQuery({
    queryKey: ['revenue-overview', params],
    queryFn: () => reportsApi.getRevenueOverview(params),
  })
}

export function useRevenueData(params?: QueryRevenueReportParams) {
  return useQuery({
    queryKey: ['revenue-data', params],
    queryFn: () => reportsApi.getRevenueData(params),
  })
}

export function useTopProducts(params?: QueryRevenueReportParams) {
  return useQuery({
    queryKey: ['top-products', params],
    queryFn: () => reportsApi.getTopProducts(params),
  })
}

export function useCategoryRevenue(params?: QueryRevenueReportParams) {
  return useQuery({
    queryKey: ['category-revenue', params],
    queryFn: () => reportsApi.getCategoryRevenue(params),
  })
}
