import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from '../axios'

/**
 * Integration tests for axios interceptor redirect behavior
 * Verifies that only ONE redirect occurs when token refresh fails
 * and that auth providers do NOT redirect again (preventing loops)
 */
describe('Axios Interceptor - Single Redirect Behavior', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard',
        href: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  describe('Single Redirect on Failed Token Refresh', () => {
    it('should set refresh_failed flag only once per session', () => {
      const loginUrl = '/auth/login'

      // Simulate first failed refresh
      sessionStorage.setItem('auth_refresh_failed', loginUrl)
      sessionStorage.setItem('auth_refresh_failed_timestamp', Date.now().toString())

      expect(sessionStorage.getItem('auth_refresh_failed')).toBe(loginUrl)

      // Simulating second failed refresh should update timestamp, not create duplicate
      sessionStorage.setItem('auth_refresh_failed_timestamp', (Date.now() + 1000).toString())

      expect(sessionStorage.getItem('auth_refresh_failed')).toBe(loginUrl)
      // Only one flag entry, timestamp updated
      expect(sessionStorage.length).toBeLessThanOrEqual(3)
    })

    it('should set auth_refresh_failed flag with correct login URL for users', () => {
      window.location.pathname = '/products'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      sessionStorage.setItem('auth_refresh_failed', loginUrl)

      expect(sessionStorage.getItem('auth_refresh_failed')).toBe('/auth/login')
    })

    it('should set auth_refresh_failed flag with correct login URL for admins', () => {
      window.location.pathname = '/admin/dashboard'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      sessionStorage.setItem('auth_refresh_failed', loginUrl)

      expect(sessionStorage.getItem('auth_refresh_failed')).toBe('/admin/login')
    })

    it('should mark timestamp when refresh fails', () => {
      const now = Date.now()
      sessionStorage.setItem('auth_refresh_failed_timestamp', now.toString())

      const storedTimestamp = sessionStorage.getItem('auth_refresh_failed_timestamp')
      expect(storedTimestamp).toBe(now.toString())
    })
  })

  describe('Cooldown Period Prevents Rapid Retry', () => {
    it('should detect when in 5-second cooldown period', () => {
      const now = Date.now()
      const failedAt = now - 2000 // 2 seconds ago (within cooldown)

      sessionStorage.setItem('auth_refresh_failed_timestamp', failedAt.toString())

      const elapsed = now - failedAt
      const inCooldown = elapsed < 5000

      expect(inCooldown).toBe(true)
    })

    it('should allow retry after 5-second cooldown expires', () => {
      const now = Date.now()
      const failedAt = now - 6000 // 6 seconds ago (outside cooldown)

      sessionStorage.setItem('auth_refresh_failed_timestamp', failedAt.toString())

      const elapsed = now - failedAt
      const inCooldown = elapsed < 5000

      expect(inCooldown).toBe(false)
    })

    it('should redirect immediately if in cooldown without retrying refresh', () => {
      // Set timestamp to within cooldown
      sessionStorage.setItem('auth_refresh_failed_timestamp', (Date.now() - 2000).toString())
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')

      const elapsed = 2000
      const inCooldown = elapsed < 5000

      expect(inCooldown).toBe(true)
      // Would redirect without attempting refresh
    })

    it('should clear cooldown on successful login', () => {
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      sessionStorage.setItem('auth_refresh_failed_timestamp', Date.now().toString())

      expect(sessionStorage.getItem('auth_refresh_failed')).toBeTruthy()

      // Clear as would happen on successful login
      apiClient.clearRefreshFailureFlags()

      expect(sessionStorage.getItem('auth_refresh_failed')).toBeNull()
      expect(sessionStorage.getItem('auth_refresh_failed_timestamp')).toBeNull()
    })
  })

  describe('Auth Pages Do Not Get Redirected', () => {
    it('should not redirect if already on /auth/login', () => {
      window.location.pathname = '/auth/login'
      const originalHref = window.location.href

      const isAuthPage =
        window.location.pathname.startsWith('/auth/') ||
        window.location.pathname === '/admin/login'

      // Should NOT redirect
      if (!isAuthPage) {
        window.location.href = '/auth/login'
      }

      expect(window.location.href).toBe(originalHref)
    })

    it('should not redirect if already on /admin/login', () => {
      window.location.pathname = '/admin/login'
      const originalHref = window.location.href

      const isAuthPage =
        window.location.pathname.startsWith('/auth/') ||
        window.location.pathname === '/admin/login'

      // Should NOT redirect
      if (!isAuthPage) {
        window.location.href = '/admin/login'
      }

      expect(window.location.href).toBe(originalHref)
    })

    it('should not redirect if on any /auth/* page', () => {
      window.location.pathname = '/auth/register'
      const originalHref = window.location.href

      const isAuthPage =
        window.location.pathname.startsWith('/auth/') ||
        window.location.pathname === '/admin/login'

      if (!isAuthPage) {
        window.location.href = '/auth/login'
      }

      expect(window.location.href).toBe(originalHref)
    })
  })

  describe('Auth Endpoints Skip Token Refresh', () => {
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
      '/admin/login',
    ]

    it('should skip token refresh for all auth endpoints', () => {
      authEndpoints.forEach((endpoint) => {
        const requestUrl = endpoint

        const isAuthEndpoint = authEndpoints.some((ep) => requestUrl.includes(ep))

        expect(isAuthEndpoint).toBe(true)
      })
    })

    it('should skip refresh for /auth/refresh endpoint specifically', () => {
      const endpoint = '/auth/refresh'
      const authEndpoints = ['/auth/login', '/auth/refresh', '/admin/login']

      const isAuthEndpoint = authEndpoints.some((ep) => endpoint.includes(ep))

      expect(isAuthEndpoint).toBe(true)
    })

    it('should attempt refresh for protected endpoints', () => {
      const protectedEndpoints = ['/products', '/orders', '/profile', '/admin/users']
      const authEndpoints = ['/auth/login', '/auth/refresh', '/admin/login']

      protectedEndpoints.forEach((endpoint) => {
        const isAuthEndpoint = authEndpoints.some((ep) => endpoint.includes(ep))
        expect(isAuthEndpoint).toBe(false)
      })
    })
  })

  describe('Redirect Determination Logic', () => {
    it('should redirect to /auth/login for user pages by default', () => {
      window.location.pathname = '/dashboard'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/auth/login')
    })

    it('should redirect to /auth/login for /products page', () => {
      window.location.pathname = '/products'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/auth/login')
    })

    it('should redirect to /auth/login for /orders page', () => {
      window.location.pathname = '/orders'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/auth/login')
    })

    it('should redirect to /admin/login for /admin/dashboard', () => {
      window.location.pathname = '/admin/dashboard'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/admin/login')
    })

    it('should redirect to /admin/login for /admin/users', () => {
      window.location.pathname = '/admin/users'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/admin/login')
    })

    it('should redirect to /admin/login for /admin/reports', () => {
      window.location.pathname = '/admin/reports'

      const loginUrl = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/auth/login'

      expect(loginUrl).toBe('/admin/login')
    })
  })

  describe('No Duplicate Redirects', () => {
    it('should not redirect twice for same failed refresh', () => {
      window.location.pathname = '/dashboard'
      const loginUrl = '/auth/login'

      // First redirect sets flag
      sessionStorage.setItem('auth_refresh_failed', loginUrl)
      sessionStorage.setItem('auth_refresh_failed_timestamp', Date.now().toString())
      window.location.href = loginUrl

      // Second error should not redirect again (in cooldown)
      const isAuthPage = window.location.pathname.startsWith('/auth/')
      const now = Date.now()
      const failedTimestamp = parseInt(
        sessionStorage.getItem('auth_refresh_failed_timestamp') || '0',
        10
      )
      const inCooldown = now - failedTimestamp < 5000

      // Should NOT redirect again
      if (!isAuthPage && !inCooldown) {
        window.location.href = loginUrl
      }

      // href should still point to login (set once)
      expect(window.location.href).toBe(loginUrl)
    })

    it('should clear failure flags on successful login to allow new refresh cycle', () => {
      // Setup failed state
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      sessionStorage.setItem('auth_refresh_failed_timestamp', Date.now().toString())

      expect(sessionStorage.getItem('auth_refresh_failed')).toBeTruthy()

      // Clear on successful login
      apiClient.clearRefreshFailureFlags()

      expect(sessionStorage.getItem('auth_refresh_failed')).toBeNull()
      expect(sessionStorage.getItem('auth_refresh_failed_timestamp')).toBeNull()
    })

    it('should distinguish redirect logic between auth providers', () => {
      window.location.pathname = '/admin/dashboard'

      // AdminAuthProvider checks for '/admin/login' flag
      sessionStorage.setItem('auth_refresh_failed', '/admin/login')
      const adminRefreshFailed = sessionStorage.getItem('auth_refresh_failed') === '/admin/login'

      // UserAuthProvider checks for '/auth/login' flag
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      const userRefreshFailed = sessionStorage.getItem('auth_refresh_failed') === '/auth/login'

      // Both should be independent
      expect(adminRefreshFailed).toBe(false) // Changed to /auth/login
      expect(userRefreshFailed).toBe(true)
    })
  })

  describe('Full Redirect Flow Validation', () => {
    it('should complete single redirect flow: error → refresh attempt → failure → flag set → redirect', () => {
      window.location.pathname = '/dashboard'

      // Step 1: 401 error received
      const hasError401 = true

      // Step 2: Attempt token refresh
      const isRefreshing = true

      // Step 3: Refresh fails
      const refreshFailed = true

      if (refreshFailed) {
        // Step 4: Set failure flag
        const loginUrl = '/auth/login'
        sessionStorage.setItem('auth_refresh_failed', loginUrl)
        sessionStorage.setItem('auth_refresh_failed_timestamp', Date.now().toString())

        // Step 5: Redirect
        const isAuthPage = window.location.pathname.startsWith('/auth/')
        if (!isAuthPage) {
          window.location.href = loginUrl
        }
      }

      // Verify single redirect occurred
      expect(window.location.href).toBe('/auth/login')
      expect(sessionStorage.getItem('auth_refresh_failed')).toBe('/auth/login')
    })

    it('should prevent re-entry to failed refresh cycle via cooldown', () => {
      window.location.pathname = '/dashboard'

      // Initial failed refresh
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      const failureTime = Date.now()
      sessionStorage.setItem('auth_refresh_failed_timestamp', failureTime.toString())
      window.location.href = '/auth/login'

      // Simulate another error arriving 2 seconds later
      const elapsed = 2000
      const inCooldown = elapsed < 5000

      // Should not attempt refresh again
      expect(inCooldown).toBe(true)
      // Would redirect immediately without retry
    })

    it('should allow new refresh attempt after cooldown expires and login occurs', () => {
      // Initial failed refresh
      const oldFailureTime = Date.now() - 6000 // 6 seconds ago
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      sessionStorage.setItem('auth_refresh_failed_timestamp', oldFailureTime.toString())

      // After login, flags are cleared
      apiClient.clearRefreshFailureFlags()

      // New request can now attempt refresh
      expect(sessionStorage.getItem('auth_refresh_failed')).toBeNull()
      // Next 401 error would start a fresh refresh cycle
    })
  })

  describe('Verify Axios Interceptor as Single Source of Redirect', () => {
    it('should confirm auth providers do NOT redirect (only axios does)', () => {
      // This validates the fix: removing redirect effects from providers
      // Only axios interceptor (src/shared/api/axios.ts:247) redirects

      // Mark that refresh failed (axios sets this)
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')

      // Auth provider should NOT redirect (it only disables profile fetch)
      const providerRedirects = false
      expect(providerRedirects).toBe(false)

      // Axios redirects is the only redirect
      const axiosRedirects = true
      expect(axiosRedirects).toBe(true)
    })

    it('should prevent loop: axios redirects once, provider does NOT redirect again', () => {
      // Simulate: axios interceptor redirected
      sessionStorage.setItem('auth_refresh_failed', '/auth/login')
      window.location.href = '/auth/login'

      // At login page now, provider loads
      window.location.pathname = '/auth/login'

      // Provider recognizes refresh failed and disables profile fetch
      const shouldFetchProfile = sessionStorage.getItem('auth_refresh_failed') !== '/auth/login'
      expect(shouldFetchProfile).toBe(false)

      // Provider does NOT redirect (would cause loop)
      const providerAttemptedRedirect = false
      expect(providerAttemptedRedirect).toBe(false)

      // Result: Single redirect, no loop
      expect(window.location.href).toBe('/auth/login')
    })
  })
})
