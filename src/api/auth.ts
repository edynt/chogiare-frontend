import { apiClient } from './axios'
import type { LoginCredentials, RegisterData, AuthTokens, User, UserRole, ApiResponse } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    )
    return response.data.data
  },

  register: async (data: RegisterData): Promise<{ message: string; email: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string; email: string }>>(
      '/auth/register',
      data
    )
    return response.data.data
  },

  verifyEmail: async (code: string): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/verify-email',
      { code }
    )
    return response.data.data
  },

  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', { email })
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
    apiClient.clearAuthTokens()
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email })
  },

  verifyResetToken: async (token: string): Promise<{ valid: boolean }> => {
    const response = await apiClient.get<ApiResponse<{ valid: boolean }>>(
      `/auth/verify-reset-token?token=${encodeURIComponent(token)}`
    )
    return response.data.data
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { resetToken: token, newPassword: password })
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{
      id: number
      email: string
      isVerified: boolean
      status: boolean
      language: string
      userInfo: {
        fullName: string | null
        avatarUrl: string | null
        gender: string | null
        dateOfBirth: string | null
        phoneNumber: string | null
        address: string | null
        country: string | null
        showEmail: boolean
        showPhone: boolean
      } | null
      roles: string[]
    }>>('/auth/profile')
    const data = response.data.data
    return {
      id: data.id.toString(),
      name: data.userInfo?.fullName || '',
      email: data.email,
      phone: data.userInfo?.phoneNumber || undefined,
      avatar: data.userInfo?.avatarUrl || undefined,
      gender: data.userInfo?.gender || undefined,
      dateOfBirth: data.userInfo?.dateOfBirth || undefined,
      address: data.userInfo?.address || undefined,
      country: data.userInfo?.country || undefined,
      language: data.language,
      showEmail: data.userInfo?.showEmail ?? false,
      showPhone: data.userInfo?.showPhone ?? false,
      isVerified: data.isVerified,
      roles: data.roles as UserRole[],
      postCount: 0,
      createdAt: '',
      updatedAt: '',
    }
  },

  updateProfile: async (data: {
    fullName?: string
    phoneNumber?: string
    avatarUrl?: string
    gender?: string
    dateOfBirth?: string
    address?: string
    country?: string
    language?: string
    showEmail?: boolean
    showPhone?: boolean
  }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data)
    return response.data.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  // OAuth methods
  googleAuth: async (accessToken: string, providerId?: string): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/google',
      { accessToken, providerId }
    )
    return response.data.data
  },

  facebookAuth: async (accessToken: string, providerId?: string): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/facebook',
      { accessToken, providerId }
    )
    return response.data.data
  },
}
