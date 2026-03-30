import { apiClient, parseApiError } from './axios'
import type {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AdminTokens,
  User,
  UserRole,
  ApiResponse,
} from '@/types'

// Helper to wrap API calls with proper error handling
async function withErrorHandling<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall()
  } catch (error: unknown) {
    const message = parseApiError(error)
    const customError = new Error(message) as Error & { code?: string }
    // Preserve error code if available
    const axiosErr = error as {
      response?: { data?: { error?: { code?: string }; errorCode?: string } }
    }
    if (
      axiosErr?.response?.data?.error?.code ||
      axiosErr?.response?.data?.errorCode
    ) {
      customError.code =
        axiosErr.response?.data?.error?.code ||
        axiosErr.response?.data?.errorCode
    }
    throw customError
  }
}

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{
          user: User
          tokens: AuthTokens
          roles?: string[]
          roleIds?: number[]
        }>
      >('/auth/login', credentials)
      const data = response.data.data
      const userWithRoles = {
        ...data.user,
        roles: (data.roles || []) as UserRole[],
        roleIds: data.roleIds || [],
      }
      return {
        user: userWithRoles,
        tokens: data.tokens,
      }
    })
  },

  adminLogin: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AdminTokens }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{
          user: User
          tokens: AdminTokens
          roles?: string[]
          roleIds?: number[]
        }>
      >('/auth/admin/login', credentials)
      const data = response.data.data
      const userWithRoles = {
        ...data.user,
        roles: (data.roles || []) as UserRole[],
        roleIds: data.roleIds || [],
      }
      return {
        user: userWithRoles,
        tokens: data.tokens,
      }
    })
  },

  register: async (
    data: RegisterData
  ): Promise<{ message: string; email: string }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{ message: string; email: string }>
      >('/auth/register', data)
      return response.data.data
    })
  },

  verifyEmail: async (
    code: string
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{ user: User; tokens: AuthTokens }>
      >('/auth/verify-email', { code })
      return response.data.data
    })
  },

  resendVerification: async (email: string): Promise<void> => {
    return withErrorHandling(async () => {
      await apiClient.post('/auth/resend-verification', { email })
    })
  },

  logout: async (): Promise<void> => {
    await apiClient.get('/auth/logout') // Changed to GET
    apiClient.clearAuthTokens()
    apiClient.clearRefreshFailureFlags()
  },

  adminLogout: async (): Promise<void> => {
    console.log('Calling /auth/admin/logout API')
    await apiClient.get('/auth/admin/logout') // Changed to GET
    console.log('API call finished, clearing local tokens')
    apiClient.clearAuthTokens()
    apiClient.clearRefreshFailureFlags()
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<ApiResponse<AuthTokens>>(
        '/auth/refresh',
        { refreshToken }
      )
      return response.data.data
    })
  },

  forgotPassword: async (email: string): Promise<void> => {
    return withErrorHandling(async () => {
      await apiClient.post('/auth/forgot-password', { email })
    })
  },

  verifyResetToken: async (token: string): Promise<{ valid: boolean }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.get<ApiResponse<{ valid: boolean }>>(
        `/auth/verify-reset-token?token=${encodeURIComponent(token)}`
      )
      return response.data.data
    })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    return withErrorHandling(async () => {
      await apiClient.post('/auth/reset-password', {
        resetToken: token,
        newPassword: password,
      })
    })
  },

  getProfile: async (): Promise<User> => {
    return withErrorHandling(async () => {
      const response = await apiClient.get<
        ApiResponse<{
          id: number
          email: string
          isVerified: boolean
          status: boolean
          language: string
          fullName: string | null
          avatarUrl: string | null
          gender: string | null
          dateOfBirth: string | null
          phoneNumber: string | null
          address: string | null
          country: string | null
          showEmail: boolean
          showPhone: boolean
          roles: string[]
        }>
      >('/auth/profile')
      const data = response.data.data
      return {
        id: data.id.toString(),
        name: data.fullName || '',
        email: data.email,
        phone: data.phoneNumber || undefined,
        avatar: data.avatarUrl || undefined,
        gender: data.gender || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        address: data.address || undefined,
        country: data.country || undefined,
        language: data.language,
        showEmail: data.showEmail ?? false,
        showPhone: data.showPhone ?? false,
        isVerified: data.isVerified,
        roles: data.roles as UserRole[],
        postCount: 0,
        createdAt: '',
        updatedAt: '',
      }
    })
  },

  getAdminProfile: async (): Promise<User> => {
    return withErrorHandling(async () => {
      const response = await apiClient.get<
        ApiResponse<{
          id: number
          email: string
          isVerified: boolean
          status: boolean
          language: string
          fullName: string | null
          avatarUrl: string | null
          gender: string | null
          dateOfBirth: string | null
          phoneNumber: string | null
          address: string | null
          country: string | null
          showEmail: boolean
          showPhone: boolean
          roles: string[]
        }>
      >('/auth/admin/profile')
      const data = response.data.data
      return {
        id: data.id.toString(),
        name: data.fullName || '',
        email: data.email,
        phone: data.phoneNumber || undefined,
        avatar: data.avatarUrl || undefined,
        gender: data.gender || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        address: data.address || undefined,
        country: data.country || undefined,
        language: data.language,
        showEmail: data.showEmail ?? false,
        showPhone: data.showPhone ?? false,
        isVerified: data.isVerified,
        roles: data.roles as UserRole[],
        postCount: 0,
        createdAt: '',
        updatedAt: '',
      }
    })
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
    return withErrorHandling(async () => {
      const response = await apiClient.put<ApiResponse<User>>(
        '/auth/profile',
        data
      )
      return response.data.data
    })
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    return withErrorHandling(async () => {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      })
    })
  },

  // OAuth methods
  googleAuth: async (
    accessToken: string,
    providerId?: string
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{ user: User; tokens: AuthTokens }>
      >('/auth/google', { accessToken, providerId })
      return response.data.data
    })
  },

  facebookAuth: async (
    accessToken: string,
    providerId?: string
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    return withErrorHandling(async () => {
      const response = await apiClient.post<
        ApiResponse<{ user: User; tokens: AuthTokens }>
      >('/auth/facebook', { accessToken, providerId })
      return response.data.data
    })
  },
}
