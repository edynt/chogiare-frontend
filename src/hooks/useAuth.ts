import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'

export const useLogin = (isAdmin = false) => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: isAdmin ? authApi.adminLogin : authApi.login,
    onSuccess: data => {
      login(data.user, data.tokens)
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
  const { tokens, isAuthenticated } = useAuthStore()

  // Don't fetch profile on auth pages (login, register, reset-password, etc.)
  const isAuthPage =
    location.pathname.startsWith('/auth') ||
    location.pathname === '/admin/login'
  const isAdminPage =
    location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/admin/login')

  // For admin pages: always try to fetch (uses httpOnly cookies, not localStorage tokens)
  // For user pages: only fetch if we have tokens or are authenticated
  const hasAuth = isAdminPage || !!(tokens?.accessToken || isAuthenticated)

  return useQuery({
    queryKey: ['auth', 'profile', isAdminPage ? 'admin' : 'user'],
    queryFn: isAdminPage ? authApi.getAdminProfile : authApi.getProfile,
    enabled: !isAuthPage && hasAuth,
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
      login(data.user, data.tokens)
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
      login(data.user, data.tokens)
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
      login(data.user, data.tokens)
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
