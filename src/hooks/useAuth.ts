import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export const useLogin = () => {
  const { login, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
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
    onSuccess: (data) => {
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

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: () => {
      logout()
      queryClient.clear()
    },
  })
}

export const useProfile = () => {
  const { tokens } = useAuthStore()
  
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'profile'], data)
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
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
    mutationFn: ({ accessToken, providerId }: { accessToken: string; providerId?: string }) =>
      authApi.googleAuth(accessToken, providerId),
    onSuccess: (data) => {
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
    mutationFn: ({ accessToken, providerId }: { accessToken: string; providerId?: string }) =>
      authApi.facebookAuth(accessToken, providerId),
    onSuccess: (data) => {
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
    onSuccess: (data) => {
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
