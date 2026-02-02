import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'

// Error messages mapping for user-friendly display
const ERROR_MESSAGES: Record<string, string> = {
  'invalid credentials': 'Email hoặc mật khẩu không chính xác',
  'invalid email or password': 'Email hoặc mật khẩu không chính xác',
  'user not found': 'Tài khoản không tồn tại',
  'email not verified':
    'Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn',
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

// Session storage keys for tracking refresh failures
const REFRESH_FAILURE_KEY = 'auth_refresh_failed'
const REFRESH_FAILURE_TIMESTAMP_KEY = 'auth_refresh_failed_timestamp'
const REFRESH_COOLDOWN_MS = 5000

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: Array<() => void> = []
  private refreshTokenPromise: Promise<void> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env['VITE_API_URL'] || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies to be sent with requests
    })

    this.setupInterceptors()
  }

  /**
   * Check if we're in refresh cooldown period to prevent rapid retry loops
   * Returns true if in cooldown, false if can attempt refresh
   */
  private isInRefreshCooldown(): boolean {
    const failedTimestamp = sessionStorage.getItem(
      REFRESH_FAILURE_TIMESTAMP_KEY
    )
    if (!failedTimestamp) return false

    const elapsed = Date.now() - parseInt(failedTimestamp, 10)
    return elapsed < REFRESH_COOLDOWN_MS
  }

  /**
   * Mark refresh as failed to prevent infinite loops
   * Sets both flag and timestamp for cooldown tracking
   */
  private markRefreshFailed(loginUrl: string): void {
    sessionStorage.setItem(REFRESH_FAILURE_KEY, loginUrl)
    sessionStorage.setItem(REFRESH_FAILURE_TIMESTAMP_KEY, Date.now().toString())
  }

  /**
   * Clear refresh failure flags (called on successful auth)
   */
  public clearRefreshFailureFlags(): void {
    sessionStorage.removeItem(REFRESH_FAILURE_KEY)
    sessionStorage.removeItem(REFRESH_FAILURE_TIMESTAMP_KEY)
  }

  private setupInterceptors(): void {
    // Request interceptor - cookies handle auth automatically via withCredentials
    this.client.interceptors.request.use(
      config => {
        // Cookies (accessToken, refreshToken) are sent automatically with withCredentials: true
        // No need to manually set Authorization header
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor to handle 401 errors
    this.client.interceptors.response.use(
      response => response,
      async error => {
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
          '/auth/refresh',
          '/auth/admin/login',
          '/auth/admin/refresh',
        ]
        const isAuthEndpoint = authEndpoints.some(endpoint =>
          requestUrl.includes(endpoint)
        )

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          const isAuthPage =
            window.location.pathname.startsWith('/auth/') ||
            window.location.pathname === '/admin/login'

          const loginUrl = window.location.pathname.startsWith('/admin')
            ? '/admin/login'
            : '/auth/login'

          // Check if we're in cooldown period - if yes, redirect immediately without retry
          if (this.isInRefreshCooldown()) {
            if (!isAuthPage) {
              window.location.href = loginUrl
            }
            return Promise.reject(
              new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
            )
          }

          // Try token refresh with cookies
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push(() => {
                this.client(originalRequest).then(resolve).catch(reject)
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            await this.refreshAccessToken()
            // Refresh succeeded - clear failure flags
            this.clearRefreshFailureFlags()
            this.refreshSubscribers.forEach(callback => callback())
            this.refreshSubscribers = []
            return this.client(originalRequest)
          } catch (refreshError) {
            this.refreshSubscribers = []

            // Mark refresh as failed to prevent immediate retry
            this.markRefreshFailed(loginUrl)

            // Redirect to appropriate login page
            if (!isAuthPage) {
              window.location.href = loginUrl
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

  private async refreshAccessToken(): Promise<void> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = this.performTokenRefresh()

    try {
      await this.refreshTokenPromise
    } finally {
      this.refreshTokenPromise = null
    }
  }

  private async performTokenRefresh(): Promise<void> {
    try {
      const baseURL = import.meta.env['VITE_API_URL'] || '/api'
      // Determine if we're on admin pages to use the correct refresh endpoint
      const isAdminPage = window.location.pathname.startsWith('/admin')
      const refreshEndpoint = isAdminPage
        ? `${baseURL}/auth/admin/refresh`
        : `${baseURL}/auth/refresh`
      // The refresh token is sent automatically via cookies (withCredentials: true)
      // Admin uses adminRefreshToken cookie, user uses refreshToken cookie
      await axios.post(refreshEndpoint, {}, { withCredentials: true })
      // New tokens are set as cookies by the server
    } catch (error) {
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
    }
  }

  // Public methods
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  /**
   * Clear authentication state
   * Note: HttpOnly cookies are cleared by the server on logout
   * This method is kept for compatibility but does nothing
   */
  clearAuthTokens(): void {
    // Cookies are HttpOnly and managed by the server
    // No client-side cleanup needed
  }
}

export const apiClient = new ApiClient()
export default apiClient
