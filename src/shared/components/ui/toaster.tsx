import React from 'react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

interface ToasterProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function Toaster({ notifications, onRemove }: ToasterProps) {

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border p-4 shadow-lg',
            'bg-background text-foreground',
            {
              'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100':
                notification.type === 'success',
              'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100':
                notification.type === 'error',
              'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100':
                notification.type === 'warning',
              'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100':
                notification.type === 'info',
            }
          )}
        >
          <div className="flex-1">
            <h4 className="font-semibold">{notification.title}</h4>
            {notification.message && (
              <p className="text-sm opacity-90">{notification.message}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className="ml-2 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 hover:text-white dark:hover:text-white transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
