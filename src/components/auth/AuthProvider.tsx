import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useProfile } from '@/hooks'
import { loginSuccess, logout } from '@/store/slices/authSlice'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, tokens } = useAppSelector((state) => state.auth)
  
  const { data: profile, error, isLoading } = useProfile()

  useEffect(() => {
    // Check if user has valid tokens in localStorage
    const storedTokens = localStorage.getItem('auth_tokens')
    if (storedTokens && !isAuthenticated) {
      try {
        const parsedTokens = JSON.parse(storedTokens)
        // Check if token is not expired
        if (parsedTokens.expiresIn && Date.now() < parsedTokens.expiresIn) {
          // We have valid tokens, but no user data yet
          // The useProfile hook will fetch user data
        } else {
          // Token expired, clear it
          localStorage.removeItem('auth_tokens')
        }
      } catch {
        // Invalid token format, clear it
        localStorage.removeItem('auth_tokens')
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (profile && tokens) {
      // User is authenticated and we have profile data
      dispatch(loginSuccess({ user: profile, tokens }))
    } else if (error && isAuthenticated) {
      // Profile fetch failed, user might not be authenticated anymore
      dispatch(logout())
    }
  }, [profile, tokens, error, isAuthenticated, dispatch])

  // Show loading state while checking authentication
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
