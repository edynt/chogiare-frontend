import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'

/**
 * User Authentication Hooks
 * Dedicated hooks for user authentication - no conditional logic
 * All hooks directly call user-specific API endpoints
 * Uses token-based authentication (localStorage)
 */

/**
 * User Login Hook
 * Authenticates regular user and stores tokens in localStorage
 * Redirects to home or intended page on success
 */
export const useUserLogin = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      login(data.user, data.tokens)
      queryClient.setQueryData(['auth', 'profile', 'user'], data.user)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

/**
 * User Profile Hook
 * Fetches user profile using token-based authentication (localStorage)
 * Only enabled on non-admin routes (excluding auth pages)
 */
export const useUserProfile = () => {
  const location = useLocation()
  const { tokens, isAuthenticated } = useAuthStore()

  // Don't fetch on auth pages
  const isAuthPage = location.pathname.startsWith('/auth')

  // Don't fetch on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')

  // Only fetch if we have tokens or are authenticated, and not on auth/admin pages
  const shouldFetch = (tokens?.accessToken || isAuthenticated) && !isAuthPage && !isAdminPage

  return useQuery({
    queryKey: ['auth', 'profile', 'user'],
    queryFn: authApi.getProfile,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

/**
 * User Logout Hook
 * Clears user session and redirects to /auth/login
 * Always calls user-specific logout endpoint
 */
export const useUserLogout = () => {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: (error: Error) => {
      // Even if API fails, clear local state
      logout()
      queryClient.clear()
      console.error('User logout failed:', error)
    },
  })
}

/**
 * User Registration Hook
 * Registers new user account
 */
export const useUserRegister = () => {
  const { setError } = useAuthStore()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      console.log('Registration successful:', data)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

/**
 * User Forgot Password Hook
 * Sends password reset email to user
 */
export const useUserForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  })
}

/**
 * User Reset Password Hook
 * Resets user password with token from email
 */
export const useUserResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  })
}

/**
 * User Change Password Hook
 * Changes password for authenticated user
 */
export const useUserChangePassword = () => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => authApi.changePassword(currentPassword, newPassword),
  })
}

/**
 * User Update Profile Hook
 * Updates user profile information
 */
export const useUserUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'profile', 'user'], data)
    },
  })
}
