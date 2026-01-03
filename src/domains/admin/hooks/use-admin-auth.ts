import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@shared/api/axios'

/**
 * Admin Authentication Hooks
 * Dedicated hooks for admin authentication - no conditional logic
 * All hooks directly call admin-specific API endpoints
 * Uses cookie-based authentication (httpOnly cookies set by backend)
 */

/**
 * Admin Login Hook
 * Authenticates admin user and stores session
 * Redirects to /admin dashboard on success
 */
export const useAdminLogin = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.adminLogin,
    onSuccess: data => {
      // Tokens are stored as HttpOnly cookies by the backend
      login(data.user)
      queryClient.setQueryData(['auth', 'profile', 'admin'], data.user)
      apiClient.clearRefreshFailureFlags()
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

/**
 * Admin Profile Hook
 * Fetches admin profile using cookie-based authentication
 * Only enabled on /admin/* routes (excluding /admin/login)
 */
export const useAdminProfile = (options?: { enabled?: boolean }) => {
  const location = useLocation()

  // Don't fetch on admin login page
  const isAdminLoginPage = location.pathname === '/admin/login'

  // Check if we're on admin routes (and not login page)
  const isAdminRoute =
    location.pathname.startsWith('/admin') && !isAdminLoginPage

  const enabled = options?.enabled !== undefined ? options.enabled : isAdminRoute

  return useQuery({
    queryKey: ['auth', 'profile', 'admin'],
    queryFn: authApi.getAdminProfile,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

/**
 * Admin Logout Hook
 * Clears admin session and redirects to /admin/login
 * Always calls admin-specific logout endpoint
 */
export const useAdminLogout = () => {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.adminLogout,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: (error: Error) => {
      // Even if API fails, clear local state
      logout()
      queryClient.clear()
      console.error('Admin logout failed:', error)
    },
  })
}
