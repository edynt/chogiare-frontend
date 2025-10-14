import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAppDispatch } from '@/store'
import { loginSuccess, loginFailure, logout } from '@/store/slices/authSlice'

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message))
    },
  })
}

export const useRegister = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Don't automatically login after registration
      // Just show success message and let user confirm email first
      console.log('Registration successful:', data)
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message))
    },
  })
}

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(logout())
      queryClient.clear()
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  })
}

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message))
    },
  })
}

export const useFacebookAuth = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.facebookAuth,
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      queryClient.setQueryData(['auth', 'profile'], data.user)
    },
    onError: (error: Error) => {
      dispatch(loginFailure(error.message))
    },
  })
}
