import React, { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const location = useLocation()
  const { isAuthenticated, setUser, setLoading, setError } = useAuthStore()
  const { data: profile, error, isLoading } = useProfile()
  const errorHandled = useRef(false)

  // Sync profile to auth store
  useEffect(() => {
    if (profile) {
      setUser(profile)
      errorHandled.current = false
    }
  }, [profile, setUser])

  // Handle 401 errors - clear auth state
  const handleAuthError = useCallback(() => {
    if (errorHandled.current) return
    errorHandled.current = true

    setUser(null)
    setError(null)
  }, [setUser, setError])

  useEffect(() => {
    if (error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        handleAuthError()
      }
    }
  }, [error, handleAuthError])

  // Update loading state
  useEffect(() => {
    setLoading(isLoading && !isAuthenticated)
  }, [isLoading, isAuthenticated, setLoading])

  // Show loading only during initial auth check
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
