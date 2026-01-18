/**
 * Cookie utility functions for client-side cookie management
 * Note: HttpOnly cookies (accessToken, refreshToken) cannot be accessed from JavaScript
 * These utilities are for non-sensitive client-side data only
 */

export interface CookieOptions {
  expires?: Date | number // Date object or days from now
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Check if browser has cookies enabled
 */
export function areCookiesEnabled(): boolean {
  try {
    document.cookie = 'cookieTest=1'
    const enabled = document.cookie.indexOf('cookieTest=') !== -1
    document.cookie = 'cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT'
    return enabled
  } catch {
    return false
  }
}

/**
 * Get a cookie value by name
 * Note: Cannot access HttpOnly cookies (accessToken, refreshToken)
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    const cookie = parts.pop()?.split(';').shift()
    return cookie ? decodeURIComponent(cookie) : null
  }

  return null
}

/**
 * Set a cookie
 * Note: Cannot set/modify HttpOnly cookies from JavaScript
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.expires) {
    let expires: Date
    if (typeof options.expires === 'number') {
      expires = new Date()
      expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000)
    } else {
      expires = options.expires
    }
    cookie += `; expires=${expires.toUTCString()}`
  }

  cookie += `; path=${options.path || '/'}`

  if (options.domain) {
    cookie += `; domain=${options.domain}`
  }

  if (options.secure) {
    cookie += '; secure'
  }

  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`
  }

  document.cookie = cookie
}

/**
 * Delete a cookie
 * Note: Cannot delete HttpOnly cookies from JavaScript
 */
export function deleteCookie(name: string, path: string = '/'): void {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}

/**
 * Clear all accessible cookies (non-HttpOnly only)
 * Note: Cannot clear HttpOnly cookies from JavaScript
 */
export function clearAllCookies(): void {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim()
    deleteCookie(name)
  }
}
