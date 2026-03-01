import { useQuery } from '@tanstack/react-query'
import { sellerApi } from '@user/api/seller'

interface UseSellerCustomersParams {
  page?: number
  pageSize?: number
  search?: string
}

export const useSellerCustomers = (params?: UseSellerCustomersParams) => {
  return useQuery({
    queryKey: ['seller', 'customers', params],
    queryFn: () => sellerApi.getMyCustomers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSellerCustomerStats = () => {
  return useQuery({
    queryKey: ['seller', 'customers', 'stats'],
    queryFn: () => sellerApi.getCustomerStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSellerCustomerOrders = (
  customerId: string,
  params?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['seller', 'customers', customerId, 'orders', params],
    queryFn: () => sellerApi.getCustomerOrders(customerId, params),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
