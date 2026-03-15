import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/authStore'
import { notificationsApi } from '@user/api/notifications'
import { toast } from 'sonner'

export interface NotificationPayload {
  id: string
  type: string
  title: string
  message: string
  actionUrl?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface UseNotificationSocketOptions {
  onNotification?: (notification: NotificationPayload) => void
  showToast?: boolean
}

// Derive socket URL from API URL - use origin for relative paths (e.g. "/api")
const SOCKET_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL || ''
  if (apiUrl.startsWith('http')) {
    return apiUrl.replace(/\/api\/?$/, '')
  }
  return window.location.origin
})()

export const useNotificationSocket = (
  options: UseNotificationSocketOptions = {}
) => {
  const { onNotification, showToast = true } = options
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [isConnected, setIsConnected] = useState(false)

  const handleNewNotification = useCallback(
    (notification: NotificationPayload) => {
      // Invalidate queries to refresh notification list and count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      })

      // Show toast notification
      if (showToast) {
        toast(notification.title, {
          description: notification.message,
          action: notification.actionUrl
            ? {
                label: 'Xem',
                onClick: () => {
                  // Mark as read then navigate
                  notificationsApi.markAsRead(notification.id).catch(() => {})
                  window.location.href = notification.actionUrl!
                },
              }
            : undefined,
        })
      }

      // Call custom handler if provided
      onNotification?.(notification)
    },
    [queryClient, showToast, onNotification]
  )

  useEffect(() => {
    // Only connect if authenticated
    if (!isAuthenticated) {
      return
    }

    // Create socket connection to /notifications namespace
    // Auth is handled via cookies (withCredentials: true)
    const socket = io(`${SOCKET_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('[NotificationSocket] Connected')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('[NotificationSocket] Disconnected')
    })

    socket.on('connect_error', error => {
      console.error('[NotificationSocket] Connection error:', error.message)
      setIsConnected(false)
    })

    socket.on('new_notification', handleNewNotification)

    return () => {
      socket.off('new_notification', handleNewNotification)
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [isAuthenticated, handleNewNotification])

  return {
    isConnected,
    socket: socketRef.current,
  }
}
