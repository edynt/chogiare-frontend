import React, { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUserProfile } from '@user/hooks/use-user-auth'

interface UserAuthProviderProps {
  children: React.ReactNode
}

/**
 * User Authentication Provider
 * Manages authentication state for user routes
 * Features:
 * - Cookie-based authentication (HttpOnly cookies)
 * - Automatic profile fetching on mount
 * - Error handling for 401 responses
 * - No localStorage interaction (cookies handled by browser)
 */
export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const { setUser, setLoading, setError, isAuthenticated } = useAuthStore()
  const { data: profile, error, isLoading } = useUserProfile()
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

  // Show loading during initial auth check
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
