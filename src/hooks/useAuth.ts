import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'

export const useLogin = (isAdmin = false) => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isAdmin ? authApi.adminLogin : authApi.login) as typeof authApi.login,
    onSuccess: data => {
      // Tokens are stored as HttpOnly cookies by the backend
      // We only store user info in the store
      login(data.user)
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useRegister = () => {
  const { setError } = useAuthStore()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      // Don't automatically login after registration
      // Just show success message and let user confirm email first
      console.log('Registration successful:', data)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useLogout = () => {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()
  const location = useLocation()

  // Determind if we are in admin context based on URL
  const isAdminContext = location.pathname.startsWith('/admin')

  return useMutation({
    mutationFn: (isAdminOverride?: boolean) => {
      // Use override if provided, otherwise default to context
      const isAdmin =
        typeof isAdminOverride === 'boolean' ? isAdminOverride : isAdminContext
      return isAdmin ? authApi.adminLogout() : authApi.logout()
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      // Let the router handle redirection
    },
    onError: (error: Error) => {
      // Even if API fails, we should clear local state
      logout()
      queryClient.clear()
      console.error('Logout failed:', error)
    },
  })
}

export const useProfile = () => {
  const location = useLocation()

  // Don't fetch profile on auth pages (login, register, reset-password, etc.)
  const isAuthPage =
    location.pathname.startsWith('/auth') ||
    location.pathname === '/admin/login'
  const isAdminPage =
    location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/admin/login')

  // Always try to fetch profile when not on auth pages
  // The backend will check the HttpOnly cookies automatically
  const shouldFetch = !isAuthPage

  return useQuery({
    queryKey: ['auth', 'profile', isAdminPage ? 'admin' : 'user'],
    queryFn: isAdminPage ? authApi.getAdminProfile : authApi.getProfile,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'profile'], data)
    },
  })
}

export const useChangePassword = () => {
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  })
}

export const useVerifyResetToken = () => {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyResetToken(token),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  })
}

export const useGoogleAuth = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      accessToken,
      providerId,
    }: {
      accessToken: string
      providerId?: string
    }) => authApi.googleAuth(accessToken, providerId),
    onSuccess: data => {
      // Tokens are stored as HttpOnly cookies by the backend
      login(data.user)
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useFacebookAuth = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      accessToken,
      providerId,
    }: {
      accessToken: string
      providerId?: string
    }) => authApi.facebookAuth(accessToken, providerId),
    onSuccess: data => {
      // Tokens are stored as HttpOnly cookies by the backend
      login(data.user)
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useVerifyEmail = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: data => {
      // Tokens are stored as HttpOnly cookies by the backend
      login(data.user)
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
  })
}

/**
 * Main auth hook that combines store state with profile data
 * Use this to get current user info and auth state
 */
export const useAuth = () => {
  const store = useAuthStore()
  const { data: profileData, isLoading: isProfileLoading } = useProfile()

  // Sync profile data to store when available
  if (profileData && !store.user) {
    store.setUser(profileData)
  }

  return {
    user: store.user || profileData,
    isAuthenticated: store.isAuthenticated || !!profileData,
    isLoading: store.isLoading || isProfileLoading,
    error: store.error,
  }
}
