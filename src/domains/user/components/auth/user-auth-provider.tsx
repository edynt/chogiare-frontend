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
 * - Token-based authentication (localStorage)
 * - Automatic profile fetching on mount
 * - Error handling for 401 responses
 * - Token persistence across sessions
 */
export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const { setUser, setTokens, setLoading, setError, tokens, isAuthenticated } = useAuthStore()
  const { data: profile, error, isLoading } = useUserProfile()
  const hasInitialized = useRef(false)
  const errorHandled = useRef(false)

  // Initialize tokens from localStorage
  useEffect(() => {
    if (hasInitialized.current) return

    const storedTokens = localStorage.getItem('auth_tokens')
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens)
        if (parsedTokens.accessToken) {
          setTokens(parsedTokens)
        } else {
          localStorage.removeItem('auth_tokens')
        }
      } catch {
        localStorage.removeItem('auth_tokens')
      }
    }
    hasInitialized.current = true
  }, [setTokens])

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
    setTokens(null)
    localStorage.removeItem('auth_tokens')
    setError(null)
  }, [setUser, setTokens, setError])

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
    const shouldLoad = tokens && !isAuthenticated
    setLoading(shouldLoad ? isLoading : false)
  }, [isLoading, tokens, isAuthenticated, setLoading])

  // Show loading during initial auth check
  if (isLoading && tokens && !isAuthenticated && !hasInitialized.current) {
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
