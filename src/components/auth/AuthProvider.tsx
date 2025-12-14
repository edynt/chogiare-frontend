import React, { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, tokens, setUser, setTokens, setLoading, setError } = useAuthStore()
  const { data: profile, error, isLoading } = useProfile()
  const hasInitialized = useRef(false)

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

  useEffect(() => {
    if (profile && tokens) {
      setUser(profile)
    }
  }, [profile, tokens, setUser])

  useEffect(() => {
    if (error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401 && tokens) {
        setUser(null)
        setTokens(null)
        localStorage.removeItem('auth_tokens')
        setError(null)
      }
    }
  }, [error, tokens, setUser, setTokens, setError])

  useEffect(() => {
    if (tokens && !isAuthenticated) {
      setLoading(isLoading)
    } else {
      setLoading(false)
    }
  }, [isLoading, tokens, isAuthenticated, setLoading])

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
