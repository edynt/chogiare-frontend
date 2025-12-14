import { apiClient } from './axios'
import type { LoginCredentials, RegisterData, AuthTokens, User, ApiResponse } from '@/types'

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
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile')
    return response.data.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
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

  adminLogin: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens; roles?: string[]; permissions?: string[] }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens; roles?: string[]; permissions?: string[] }>>(
      '/auth/admin/login',
      credentials
    )
    return response.data.data
  },
}
