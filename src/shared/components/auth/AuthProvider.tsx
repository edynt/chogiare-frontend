import React, { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const location = useLocation()
  const { isAuthenticated, tokens, setUser, setTokens, setLoading, setError } = useAuthStore()
  const { data: profile, error, isLoading } = useProfile()
  const hasInitialized = useRef(false)
  const errorHandled = useRef(false)

  // Check if we're in admin context (admin cookies are httpOnly, not stored in localStorage)
  const isAdminPage = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login')

  // Initialize tokens from localStorage (only for non-admin context)
  useEffect(() => {
    if (hasInitialized.current || isAdminPage) return

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
  }, [setTokens, isAdminPage])

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
    if (!isAdminPage) {
      localStorage.removeItem('auth_tokens')
    }
    setError(null)
  }, [setUser, setTokens, setError, isAdminPage])

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
    const shouldLoad = !isAdminPage && tokens && !isAuthenticated
    setLoading(shouldLoad ? isLoading : false)
  }, [isLoading, tokens, isAuthenticated, setLoading, isAdminPage])

  // Show loading only during initial non-admin auth check
  if (isLoading && tokens && !isAuthenticated && !isAdminPage && !hasInitialized.current) {
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
