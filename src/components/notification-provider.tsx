import React, { createContext, useContext } from 'react'
import { useAppDispatch } from '@/store'
import { addNotification } from '@/store/slices/uiSlice'

interface NotificationContextType {
  notify: (notification: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  const notify = (notification: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }) => {
    dispatch(addNotification(notification))
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
