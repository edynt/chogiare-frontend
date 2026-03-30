/**
 * Transform product data from backend (numeric enums) to frontend (string enums).
 * The backend stores condition/status/badges as integers but the frontend uses string values.
 * This transformation is applied at the API boundary when receiving product data.
 */

import {
  PRODUCT_CONDITION,
  PRODUCT_STATUS,
  PRODUCT_BADGE,
} from '@/constants/status.constants'
import type {
  ProductConditionType,
  ProductStatusType,
  ProductBadgeType,
} from '@/constants/status.constants'

const CONDITION_NUM_TO_STR: Record<number, ProductConditionType> = {
  0: PRODUCT_CONDITION.NEW,
  1: PRODUCT_CONDITION.LIKE_NEW,
  2: PRODUCT_CONDITION.GOOD,
  3: PRODUCT_CONDITION.FAIR,
  4: PRODUCT_CONDITION.POOR,
}

const STATUS_NUM_TO_STR: Record<number, ProductStatusType> = {
  0: PRODUCT_STATUS.DRAFT,
  1: PRODUCT_STATUS.ACTIVE,
  2: PRODUCT_STATUS.OUT_OF_STOCK,
}

const BADGE_NUM_TO_STR: Record<number, ProductBadgeType> = {
  0: PRODUCT_BADGE.NEW,
  1: PRODUCT_BADGE.FEATURED,
  2: PRODUCT_BADGE.PROMO,
  3: PRODUCT_BADGE.HOT,
  4: PRODUCT_BADGE.SALE,
}

/**
 * Transform a single product's numeric enum fields to string values.
 * Safe to call on already-transformed data (string values pass through unchanged).
 */

export function transformProduct<T>(product: T): T {
  const result = { ...(product as Record<string, unknown>) }

  if (typeof result.condition === 'number') {
    result.condition =
      CONDITION_NUM_TO_STR[result.condition] ?? result.condition
  }

  if (typeof result.status === 'number') {
    result.status = STATUS_NUM_TO_STR[result.status] ?? result.status
  }

  if (Array.isArray(result.badges)) {
    result.badges = result.badges.map((b: number | string) =>
      typeof b === 'number' ? (BADGE_NUM_TO_STR[b] ?? b) : b
    )
  }

  return result as T
}

/**
 * Transform an array of products.
 */
export function transformProducts<T>(products: T[]): T[] {
  return products.map(transformProduct)
}

/**
 * Transform a paginated response containing products.
 */

export function transformPaginatedProducts<T>(response: T): T {
  const result = { ...(response as Record<string, unknown>) }
  if (Array.isArray(result.items)) {
    result.items = transformProducts(result.items)
  }
  return result as T
}
