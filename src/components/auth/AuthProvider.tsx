import React, { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, tokens, user, setUser, setTokens, setLoading, setError } = useAuthStore()
  const { data: profile, error, isLoading } = useProfile()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    
    const currentPath = window.location.pathname
    const isAdminRoute = currentPath.startsWith('/admin')
    const tokenKey = isAdminRoute ? 'admin_tokens' : 'auth_tokens'
    
    if (!tokens) {
      const storedTokens = localStorage.getItem(tokenKey)
      if (storedTokens) {
        try {
          const parsedTokens = JSON.parse(storedTokens)
          if (parsedTokens.accessToken) {
            setTokens(parsedTokens)
          } else {
            localStorage.removeItem(tokenKey)
          }
        } catch {
          localStorage.removeItem(tokenKey)
        }
      }
    }
    
    hasInitialized.current = true
  }, [setTokens, tokens])

  useEffect(() => {
    if (profile && tokens) {
      setUser(profile)
    } else if (tokens && !profile && !isLoading && !error && hasInitialized.current) {
      setLoading(true)
    }
  }, [profile, tokens, setUser, isLoading, error])

  useEffect(() => {
    if (error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401 && tokens) {
        setUser(null)
        setTokens(null)
        const currentPath = window.location.pathname
        const isAdminRoute = currentPath.startsWith('/admin')
        const tokenKey = isAdminRoute ? 'admin_tokens' : 'auth_tokens'
        localStorage.removeItem(tokenKey)
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('admin_tokens')
        setError(null)
      }
    }
  }, [error, tokens, setUser, setTokens, setError])

  useEffect(() => {
    if (tokens && !isAuthenticated && !user) {
      setLoading(isLoading)
    } else {
      setLoading(false)
    }
  }, [isLoading, tokens, isAuthenticated, user, setLoading])

  if (isLoading && tokens && !isAuthenticated && !user && hasInitialized.current) {
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
