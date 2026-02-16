import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

const NOTIFICATION_TYPE_TO_NUMBER: Record<string, number> = {
  order: 0,
  product: 1,
  payment: 2,
  system: 3,
  promotion: 4,
  message: 5,
}

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
    >('/admin/notifications', {
      ...data,
      type: NOTIFICATION_TYPE_TO_NUMBER[data.type] ?? 3,
    })
    return response.data.data
  },
}
