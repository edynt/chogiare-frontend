import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@shared/api/axios'

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
 * Only enabled on /admin/* routes (excluding /admin/login) AND user has admin role
 */
export const useAdminProfile = (options?: { enabled?: boolean }) => {
  const location = useLocation()
  const { user } = useAuthStore()

  // Don't fetch on admin login page
  const isAdminLoginPage = location.pathname === '/admin/login'

  // Check if we're on admin routes (and not login page)
  const isAdminRoute =
    location.pathname.startsWith('/admin') && !isAdminLoginPage

  const hasAdminRole = user?.roles?.includes('admin') || false

  const shouldFetch = isAdminRoute && hasAdminRole

  const enabled = options?.enabled !== undefined ? options.enabled : shouldFetch

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
