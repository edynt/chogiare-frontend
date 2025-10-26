import { useQuery } from '@tanstack/react-query'
import { shippingApi } from '@/api/shipping'
import type { ShippingInfo } from '@/components/shipping/ShippingTracking'

export const useShippingTracking = (orderId: string) => {
  return useQuery({
    queryKey: ['shipping', orderId],
    queryFn: () => shippingApi.getShippingInfo(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for real-time updates
  })
}

export const useShippingHistory = (orderId: string) => {
  return useQuery({
    queryKey: ['shipping-history', orderId],
    queryFn: () => shippingApi.getShippingHistory(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
