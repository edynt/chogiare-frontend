import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications'
import type { QueryNotificationParams, CreateNotificationRequest } from '@/api/notifications'
import { queryKeys } from '@/constants/queryKeys'

export const useNotifications = (params?: QueryNotificationParams) => {
  return useQuery({
    queryKey: queryKeys.notifications.all(params),
    queryFn: async () => {
      try {
        return await notificationsApi.getNotifications(params)
      } catch {
        return {
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
          unreadCount: 0,
        }
      }
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 1,
  })
}

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: async () => {
      try {
        return await notificationsApi.getUnreadCount()
      } catch {
        return 0
      }
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 1,
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateNotificationRequest) => notificationsApi.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

