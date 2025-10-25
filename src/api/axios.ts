import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { AuthTokens } from '@/types'

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

        if (error.response?.status === 401 && !originalRequest._retry) {
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
            // Redirect to login or handle auth failure
            window.location.href = '/auth/login'
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
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: tokens.refreshToken,
      })

      const newTokens: AuthTokens = response.data
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
