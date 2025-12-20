import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { AuthTokens } from '@/types'

// Error messages mapping for user-friendly display
const ERROR_MESSAGES: Record<string, string> = {
  'invalid credentials': 'Email hoặc mật khẩu không chính xác',
  'invalid email or password': 'Email hoặc mật khẩu không chính xác',
  'user not found': 'Tài khoản không tồn tại',
  'email not verified': 'Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn',
  'account disabled': 'Tài khoản đã bị vô hiệu hóa',
  'account locked': 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ',
  'too many attempts': 'Quá nhiều lần thử. Vui lòng thử lại sau',
  'email already exists': 'Email này đã được đăng ký',
  'invalid token': 'Mã xác thực không hợp lệ',
  'token expired': 'Mã xác thực đã hết hạn',
  'session expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  'network error': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet',
  'server error': 'Lỗi hệ thống. Vui lòng thử lại sau',
}

// API Error response structure
interface ApiErrorResponse {
  success?: boolean
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
  message?: string // fallback for simple error responses
  code?: number
}

// Helper function to parse error message from API response
export function parseApiError(error: unknown): string {
  // Handle non-object errors
  if (!error || typeof error !== 'object') {
    return 'Đã xảy ra lỗi. Vui lòng thử lại'
  }

  const axiosError = error as AxiosError<ApiErrorResponse>

  // Check if it's a network error (no response from server)
  if (!axiosError.response) {
    // Check if it's actually an Axios error with no response
    if (axiosError.isAxiosError) {
      if (axiosError.code === 'ECONNABORTED') {
        return 'Yêu cầu quá thời gian chờ. Vui lòng thử lại'
      }
      if (axiosError.code === 'ERR_NETWORK') {
        return ERROR_MESSAGES['network error']
      }
    }
    // If error has message property, use it
    if ('message' in error && typeof (error as Error).message === 'string') {
      return (error as Error).message
    }
    return ERROR_MESSAGES['network error']
  }

  const status = axiosError.response.status
  const data = axiosError.response.data

  // Try to get error message from response
  // API returns: { success: false, error: { code, message }, code }
  let message = ''

  if (data) {
    if (typeof data === 'object') {
      // Check nested error object first
      if (data.error && typeof data.error === 'object' && data.error.message) {
        message = data.error.message
      } else if (data.message) {
        message = data.message
      }
    } else if (typeof data === 'string') {
      message = data
    }
  }

  // Normalize message for matching
  const normalizedMessage = message.toLowerCase().trim()

  // Check if we have a mapped message
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (normalizedMessage.includes(key)) {
      return value
    }
  }

  // Handle by status code if no specific message
  switch (status) {
    case 400:
      return message || 'Dữ liệu không hợp lệ'
    case 401:
      return message || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
    case 403:
      return 'Bạn không có quyền thực hiện hành động này'
    case 404:
      return 'Không tìm thấy dữ liệu yêu cầu'
    case 409:
      return message || 'Dữ liệu đã tồn tại'
    case 422:
      return message || 'Dữ liệu không hợp lệ'
    case 429:
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau'
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES['server error']
    default:
      return message || 'Đã xảy ra lỗi. Vui lòng thử lại'
  }
}

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []
  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env['VITE_API_URL'] || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens()
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        const requestUrl = originalRequest?.url || ''

        // Skip token refresh for auth endpoints (login, register, etc.)
        const authEndpoints = [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/resend-verification',
          '/auth/verify-reset-token',
          '/auth/google',
          '/auth/facebook',
        ]
        const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint))

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(this.client(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshAccessToken()
            this.refreshSubscribers.forEach((callback) => callback(newToken))
            this.refreshSubscribers = []

            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.refreshSubscribers = []
            this.clearStoredTokens()
            const isAuthPage = window.location.pathname.startsWith('/auth/')
            if (!isAuthPage) {
              window.location.href = '/auth/login'
            }
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshTokenPromise
      return newToken
    } finally {
      this.refreshTokenPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const tokens = this.getStoredTokens()
    if (!tokens?.refreshToken) {
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
    }

    try {
      const baseURL = import.meta.env['VITE_API_URL'] || '/api'
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      })

      const newTokens: AuthTokens = response.data.data || response.data
      this.storeTokens(newTokens)
      
      return newTokens.accessToken
    } catch (error) {
      this.clearStoredTokens()
      throw error
    }
  }

  private getStoredTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      return tokens ? JSON.parse(tokens) : null
    } catch {
      return null
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens))
  }

  private clearStoredTokens(): void {
    localStorage.removeItem('auth_tokens')
  }

  // Public methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  setAuthTokens(tokens: AuthTokens): void {
    this.storeTokens(tokens)
  }

  clearAuthTokens(): void {
    this.clearStoredTokens()
  }
}

export const apiClient = new ApiClient()
export default apiClient
