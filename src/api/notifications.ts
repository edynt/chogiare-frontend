import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface Notification {
  id: string
  type: 'order' | 'product' | 'payment' | 'system' | 'promotion' | 'message'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, unknown>
}

export interface NotificationListResponse {
  items: Notification[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  unreadCount: number
}

export interface QueryNotificationParams {
  page?: number
  pageSize?: number
  type?: 'order' | 'product' | 'payment' | 'system' | 'promotion' | 'message'
  isRead?: boolean
}

export interface MarkAsReadResponse {
  success: boolean
  unreadCount: number
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

export const notificationsApi = {
  getNotifications: async (params?: QueryNotificationParams): Promise<NotificationListResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>('/notifications', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        type: params?.type,
        isRead: params?.isRead,
      },
    })
    return response.data.data
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count')
      return response.data.data?.unreadCount ?? 0
    } catch {
      return 0
    }
  },

  markAsRead: async (id: string): Promise<MarkAsReadResponse> => {
    const response = await apiClient.post<ApiResponse<MarkAsReadResponse>>(`/notifications/${id}/read`)
    return response.data.data
  },

  markAllAsRead: async (): Promise<MarkAsReadResponse> => {
    const response = await apiClient.post<ApiResponse<MarkAsReadResponse>>('/notifications/read-all')
    return response.data.data
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`)
  },

  createNotification: async (data: CreateNotificationRequest): Promise<CreateNotificationResponse> => {
    const response = await apiClient.post<ApiResponse<CreateNotificationResponse>>('/admin/notifications', data)
    return response.data.data
  },
}

