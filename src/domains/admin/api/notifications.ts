import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface CreateNotificationRequest {
  type: 'order' | 'product' | 'payment' | 'system' | 'promotion' | 'message'
  title: string
  message: string
  actionUrl?: string
  metadata?: Record<string, unknown>
  targetUserIds?: number[]
  targetAllUsers?: boolean
}

export interface CreateNotificationResponse {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  sentCount: number
}

export const adminNotificationsApi = {
  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<CreateNotificationResponse> => {
    const response = await apiClient.post<
      ApiResponse<CreateNotificationResponse>
    >('/admin/notifications', data)
    return response.data.data
  },
}
