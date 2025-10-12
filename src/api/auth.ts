import { apiClient } from './axios'
import type { LoginCredentials, RegisterData, AuthTokens, User, ApiResponse } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/v1/auth/login',
      credentials
    )
    return response.data.data
  },

  register: async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/v1/auth/register',
      data
    )
    return response.data.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout')
    apiClient.clearAuthTokens()
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/v1/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/v1/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/v1/auth/reset-password', { token, password })
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/v1/auth/profile')
    return response.data.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/v1/auth/profile', data)
    return response.data.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/v1/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  // OAuth methods
  googleAuth: async (): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/v1/auth/google'
    )
    return response.data.data
  },

  facebookAuth: async (): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/v1/auth/facebook'
    )
    return response.data.data
  },
}
