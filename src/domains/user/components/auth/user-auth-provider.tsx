import React, { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUserProfile } from '@user/hooks/use-user-auth'

interface UserAuthProviderProps {
  children: React.ReactNode
}

// Session storage key for tracking refresh failures
const REFRESH_FAILURE_KEY = 'auth_refresh_failed'

/**
 * User Authentication Provider
 * Manages authentication state for user routes
 * Features:
 * - Cookie-based authentication (HttpOnly cookies)
 * - Automatic profile fetching on mount (unless refresh just failed)
 * - Error handling for 401 responses
 * - No localStorage interaction (cookies handled by browser)
 * - Prevents infinite refresh loops via cooldown checking
 */
export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const { setUser, setLoading, setError, isAuthenticated } = useAuthStore()

  const refreshJustFailed =
    sessionStorage.getItem(REFRESH_FAILURE_KEY) === '/auth/login'

  const {
    data: profile,
    error,
    isLoading,
  } = useUserProfile({
    enabled: !refreshJustFailed, // Disable profile fetch if refresh just failed
  })
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
    setLoading(isLoading && !isAuthenticated && !refreshJustFailed)
  }, [isLoading, isAuthenticated, refreshJustFailed, setLoading])

  // Render children immediately - auth state loads in background
  // This allows guests to view public pages without waiting for auth check
  return <>{children}</>
}
