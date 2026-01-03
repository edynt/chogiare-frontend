/**
 * Status Constants
 * Centralized status values for consistent usage across the application
 */

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS]

// Product Status
export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SOLD: 'sold',
  ARCHIVED: 'archived',
  SUSPENDED: 'suspended',
} as const

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS]

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]

// Promotion Status
export const PROMOTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
} as const

export type PromotionStatus = typeof PROMOTION_STATUS[keyof typeof PROMOTION_STATUS]

// Store Status
export const STORE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
} as const

export type StoreStatus = typeof STORE_STATUS[keyof typeof STORE_STATUS]

// Export all status constants as a single object for convenience
export const STATUS_CONSTANTS = {
  USER: USER_STATUS,
  PRODUCT: PRODUCT_STATUS,
  ORDER: ORDER_STATUS,
  PAYMENT: PAYMENT_STATUS,
  PROMOTION: PROMOTION_STATUS,
  STORE: STORE_STATUS,
} as const
