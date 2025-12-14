import { useQuery } from '@tanstack/react-query'
import { shippingApi } from '@/api/shipping'
import type { ShippingProgressData } from '@/components/shipping/ShippingProgressBar'

export const useShippingProgress = (orderId: string) => {
  return useQuery({
    queryKey: ['shipping-progress', orderId],
    queryFn: async (): Promise<ShippingProgressData> => {
      // Get shipping info and convert to progress data
      const shippingInfo = await shippingApi.getShippingInfo(orderId)
      
      // Map shipping status to progress steps
      const statusToStep = {
        'processing': 1,
        'shipped': 2,
        'in_transit': 3,
        'out_for_delivery': 4,
        'delivered': 5,
        'delayed': 3 // Keep at step 3 if delayed
      }
      
      return {
        orderId: shippingInfo.orderId,
        status: shippingInfo.status,
        currentStep: statusToStep[shippingInfo.status] || 1,
        totalSteps: 5,
        estimatedDelivery: shippingInfo.estimatedDelivery,
        currentLocation: shippingInfo.currentLocation,
        trackingNumber: shippingInfo.trackingNumber
      }
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// Hook to get shipping progress for multiple orders
export const useMultipleShippingProgress = (orderIds: string[]) => {
  return useQuery({
    queryKey: ['shipping-progress-multiple', orderIds],
    queryFn: async (): Promise<Record<string, ShippingProgressData>> => {
      const results: Record<string, ShippingProgressData> = {}
      
      // Fetch all shipping progress data in parallel
      const promises = orderIds.map(async (orderId) => {
        try {
          const shippingInfo = await shippingApi.getShippingInfo(orderId)
          
          const statusToStep = {
            'processing': 1,
            'shipped': 2,
            'in_transit': 3,
            'out_for_delivery': 4,
            'delivered': 5,
            'delayed': 3
          }
          
          results[orderId] = {
            orderId: shippingInfo.orderId,
            status: shippingInfo.status,
            currentStep: statusToStep[shippingInfo.status] || 1,
            totalSteps: 5,
            estimatedDelivery: shippingInfo.estimatedDelivery,
            currentLocation: shippingInfo.currentLocation,
            trackingNumber: shippingInfo.trackingNumber
          }
        } catch {
          // If shipping info not available, create default progress
          results[orderId] = {
            orderId,
            status: 'processing',
            currentStep: 1,
            totalSteps: 5,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            currentLocation: 'Đang xử lý',
            trackingNumber: undefined
          }
        }
      })
      
      await Promise.all(promises)
      return results
    },
    enabled: orderIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

