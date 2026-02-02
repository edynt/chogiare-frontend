/**
 * Status Constants
 * Centralized status values for consistent usage across the application
 * All values are numeric to match backend database storage
 */

// ==================== USER STATUS ====================
export const USER_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
} as const

export type UserStatus = boolean

// ==================== LANGUAGE ====================
export const LANGUAGE = {
  VI: 0,
  EN: 1,
} as const

export type LanguageType = (typeof LANGUAGE)[keyof typeof LANGUAGE]

export const LANGUAGE_LABELS: Record<number, string> = {
  [LANGUAGE.VI]: 'Tiếng Việt',
  [LANGUAGE.EN]: 'English',
}

// ==================== PRODUCT CONDITION ====================
export const PRODUCT_CONDITION = {
  NEW: 0,
  LIKE_NEW: 1,
  GOOD: 2,
  FAIR: 3,
  POOR: 4,
} as const

export type ProductConditionType =
  (typeof PRODUCT_CONDITION)[keyof typeof PRODUCT_CONDITION]

export const PRODUCT_CONDITION_LABELS: Record<number, string> = {
  [PRODUCT_CONDITION.NEW]: 'Mới',
  [PRODUCT_CONDITION.LIKE_NEW]: 'Như mới',
  [PRODUCT_CONDITION.GOOD]: 'Tốt',
  [PRODUCT_CONDITION.FAIR]: 'Khá',
  [PRODUCT_CONDITION.POOR]: 'Trung bình',
}

// ==================== PRODUCT STATUS ====================
export const PRODUCT_STATUS = {
  DRAFT: 0,
  ACTIVE: 1,
  OUT_OF_STOCK: 2,
} as const

export type ProductStatusType =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]

export const PRODUCT_STATUS_LABELS: Record<number, string> = {
  [PRODUCT_STATUS.DRAFT]: 'Nháp',
  [PRODUCT_STATUS.ACTIVE]: 'Đang bán',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'Hết hàng',
}

// ==================== PRODUCT BADGE ====================
export const PRODUCT_BADGE = {
  NEW: 0,
  FEATURED: 1,
  PROMO: 2,
  HOT: 3,
  SALE: 4,
} as const

export type ProductBadgeType =
  (typeof PRODUCT_BADGE)[keyof typeof PRODUCT_BADGE]

export const PRODUCT_BADGE_LABELS: Record<number, string> = {
  [PRODUCT_BADGE.NEW]: 'Mới',
  [PRODUCT_BADGE.FEATURED]: 'Nổi bật',
  [PRODUCT_BADGE.PROMO]: 'Khuyến mãi',
  [PRODUCT_BADGE.HOT]: 'Hot',
  [PRODUCT_BADGE.SALE]: 'Giảm giá',
}

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY_FOR_PICKUP: 3,
  COMPLETED: 4,
  CANCELLED: 5,
  REFUNDED: 6,
} as const

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const ORDER_STATUS_LABELS: Record<number, string> = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
  [ORDER_STATUS.READY_FOR_PICKUP]: 'Sẵn sàng nhận hàng',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy',
  [ORDER_STATUS.REFUNDED]: 'Hoàn tiền',
}

// ==================== PAYMENT STATUS ====================
export const PAYMENT_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  REFUNDED: 3,
} as const

export type PaymentStatusType =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const PAYMENT_STATUS_LABELS: Record<number, string> = {
  [PAYMENT_STATUS.PENDING]: 'Chờ thanh toán',
  [PAYMENT_STATUS.COMPLETED]: 'Đã thanh toán',
  [PAYMENT_STATUS.FAILED]: 'Thất bại',
  [PAYMENT_STATUS.REFUNDED]: 'Đã hoàn tiền',
}

// ==================== PAYMENT METHOD ====================
export const PAYMENT_METHOD = {
  BANK_TRANSFER: 0,
} as const

export type PaymentMethodType =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const PAYMENT_METHOD_LABELS: Record<number, string> = {
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
}

// ==================== TRANSACTION TYPE ====================
export const TRANSACTION_TYPE = {
  DEPOSIT: 0,
  SALE: 1,
  REFUND: 2,
  COMMISSION: 3,
  BONUS: 4,
  SUBSCRIPTION_PURCHASE: 5,
  BOOST: 6,
} as const

export type TransactionTypeValue =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

export const TRANSACTION_TYPE_LABELS: Record<number, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'Nạp tiền',
  [TRANSACTION_TYPE.SALE]: 'Bán hàng',
  [TRANSACTION_TYPE.REFUND]: 'Hoàn tiền',
  [TRANSACTION_TYPE.COMMISSION]: 'Hoa hồng',
  [TRANSACTION_TYPE.BONUS]: 'Thưởng',
  [TRANSACTION_TYPE.SUBSCRIPTION_PURCHASE]: 'Mua gói',
  [TRANSACTION_TYPE.BOOST]: 'Đẩy tin',
}

// ==================== CONVERSATION TYPE ====================
export const CONVERSATION_TYPE = {
  DIRECT: 0,
  GROUP: 1,
} as const

export type ConversationTypeValue =
  (typeof CONVERSATION_TYPE)[keyof typeof CONVERSATION_TYPE]

// ==================== MESSAGE TYPE ====================
export const MESSAGE_TYPE = {
  TEXT: 0,
  IMAGE: 1,
  FILE: 2,
} as const

export type MessageTypeValue =
  (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE]

export const MESSAGE_TYPE_LABELS: Record<number, string> = {
  [MESSAGE_TYPE.TEXT]: 'Văn bản',
  [MESSAGE_TYPE.IMAGE]: 'Hình ảnh',
  [MESSAGE_TYPE.FILE]: 'Tệp tin',
}

// ==================== NOTIFICATION TYPE ====================
export const NOTIFICATION_TYPE = {
  ORDER: 0,
  PRODUCT: 1,
  PAYMENT: 2,
  SYSTEM: 3,
  PROMOTION: 4,
  MESSAGE: 5,
} as const

export type NotificationTypeValue =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export const NOTIFICATION_TYPE_LABELS: Record<number, string> = {
  [NOTIFICATION_TYPE.ORDER]: 'Đơn hàng',
  [NOTIFICATION_TYPE.PRODUCT]: 'Sản phẩm',
  [NOTIFICATION_TYPE.PAYMENT]: 'Thanh toán',
  [NOTIFICATION_TYPE.SYSTEM]: 'Hệ thống',
  [NOTIFICATION_TYPE.PROMOTION]: 'Khuyến mãi',
  [NOTIFICATION_TYPE.MESSAGE]: 'Tin nhắn',
}

// ==================== TICKET STATUS ====================
export const TICKET_STATUS = {
  OPEN: 0,
  IN_PROGRESS: 1,
  PENDING: 2,
  RESOLVED: 3,
  CLOSED: 4,
} as const

export type TicketStatusType =
  (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]

export const TICKET_STATUS_LABELS: Record<number, string> = {
  [TICKET_STATUS.OPEN]: 'Mở',
  [TICKET_STATUS.IN_PROGRESS]: 'Đang xử lý',
  [TICKET_STATUS.PENDING]: 'Chờ xử lý',
  [TICKET_STATUS.RESOLVED]: 'Đã giải quyết',
  [TICKET_STATUS.CLOSED]: 'Đã đóng',
}

// ==================== TICKET PRIORITY ====================
export const TICKET_PRIORITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  URGENT: 3,
} as const

export type TicketPriorityType =
  (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY]

export const TICKET_PRIORITY_LABELS: Record<number, string> = {
  [TICKET_PRIORITY.LOW]: 'Thấp',
  [TICKET_PRIORITY.MEDIUM]: 'Trung bình',
  [TICKET_PRIORITY.HIGH]: 'Cao',
  [TICKET_PRIORITY.URGENT]: 'Khẩn cấp',
}

// ==================== TICKET CATEGORY ====================
export const TICKET_CATEGORY = {
  ACCOUNT: 0,
  PRODUCT: 1,
  PAYMENT: 2,
  TECHNICAL: 3,
  REPORT: 4,
  QUESTION: 5,
  OTHER: 6,
} as const

export type TicketCategoryType =
  (typeof TICKET_CATEGORY)[keyof typeof TICKET_CATEGORY]

export const TICKET_CATEGORY_LABELS: Record<number, string> = {
  [TICKET_CATEGORY.ACCOUNT]: 'Tài khoản',
  [TICKET_CATEGORY.PRODUCT]: 'Sản phẩm',
  [TICKET_CATEGORY.PAYMENT]: 'Thanh toán',
  [TICKET_CATEGORY.TECHNICAL]: 'Kỹ thuật',
  [TICKET_CATEGORY.REPORT]: 'Báo cáo',
  [TICKET_CATEGORY.QUESTION]: 'Câu hỏi',
  [TICKET_CATEGORY.OTHER]: 'Khác',
}

// ==================== PROMOTION STATUS (for UI only) ====================
export const PROMOTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
} as const

export type PromotionStatus =
  (typeof PROMOTION_STATUS)[keyof typeof PROMOTION_STATUS]

// ==================== STORE STATUS (for UI only) ====================
export const STORE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
} as const

export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS]

// ==================== HELPER FUNCTIONS ====================

/**
 * Get label for enum value
 */
export function getEnumLabel(
  labels: Record<number, string>,
  value: number | undefined | null
): string {
  if (value === undefined || value === null) return ''
  return labels[value] ?? `Unknown (${value})`
}

// ==================== EXPORT ALL ====================
export const STATUS_CONSTANTS = {
  USER: USER_STATUS,
  LANGUAGE,
  PRODUCT_CONDITION,
  PRODUCT_STATUS,
  PRODUCT_BADGE,
  ORDER: ORDER_STATUS,
  PAYMENT: PAYMENT_STATUS,
  PAYMENT_METHOD,
  TRANSACTION_TYPE,
  CONVERSATION_TYPE,
  MESSAGE_TYPE,
  NOTIFICATION_TYPE,
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
  PROMOTION: PROMOTION_STATUS,
  STORE: STORE_STATUS,
} as const
