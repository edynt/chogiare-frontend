import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Ngày không hợp lệ'
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj)
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Ngày không hợp lệ'
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+'

/**
 * Extract error message from API error response
 * Backend error format: { success: false, error: { code, message, details }, code }
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = 'Đã xảy ra lỗi'): string {
  if (!error) return fallbackMessage

  // Handle axios error
  if (typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: { message?: string }; message?: string } } }
    const data = axiosError.response?.data

    // Backend error format: { error: { message } }
    if (data?.error?.message) {
      return data.error.message
    }

    // Alternative format: { message }
    if (data?.message) {
      return data.message
    }
  }

  // Handle regular Error object
  if (error instanceof Error) {
    return error.message
  }

  // Handle string error
  if (typeof error === 'string') {
    return error
  }

  return fallbackMessage
}

/**
 * Extract success message from API response
 * Backend success format: { success: true, data, message }
 */
export function getApiSuccessMessage(response: unknown, fallbackMessage = 'Thành công'): string {
  if (!response) return fallbackMessage

  if (typeof response === 'object' && 'message' in response) {
    return (response as { message?: string }).message || fallbackMessage
  }

  return fallbackMessage
}
