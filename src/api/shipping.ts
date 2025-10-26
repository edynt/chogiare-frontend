import { apiClient } from './axios'
import type { ApiResponse } from '@/types'
import type { ShippingInfo } from '@/components/shipping/ShippingTracking'

export interface ShippingUpdate {
  id: string
  orderId: string
  status: string
  location: string
  timestamp: string
  description: string
  estimatedDelivery?: string
}

export interface ShippingHistoryItem {
  id: string
  orderId: string
  status: string
  location: string
  timestamp: string
  description: string
  carrier: string
}

export const shippingApi = {
  getShippingInfo: async (orderId: string): Promise<ShippingInfo> => {
    const response = await apiClient.get<ApiResponse<ShippingInfo>>(`/shipping/${orderId}`)
    return response.data.data
  },

  getShippingHistory: async (orderId: string): Promise<ShippingHistoryItem[]> => {
    const response = await apiClient.get<ApiResponse<ShippingHistoryItem[]>>(`/shipping/${orderId}/history`)
    return response.data.data
  },

  updateShippingStatus: async (orderId: string, status: string): Promise<ShippingUpdate> => {
    const response = await apiClient.patch<ApiResponse<ShippingUpdate>>(`/shipping/${orderId}`, { status })
    return response.data.data
  },

  trackPackage: async (trackingNumber: string): Promise<ShippingInfo> => {
    const response = await apiClient.get<ApiResponse<ShippingInfo>>(`/shipping/track/${trackingNumber}`)
    return response.data.data
  }
}
