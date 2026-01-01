// Re-export all API modules from their new domain locations
// This file provides backward compatibility

// Shared APIs
export { authApi } from '@shared/api/auth'
export { uploadApi } from '@shared/api/upload'
export { apiClient } from '@shared/api/axios'

// Admin APIs
export { adminApi } from '@admin/api/admin'
export { adminNotificationsApi } from '@admin/api/notifications'
export type { CreateNotificationRequest, CreateNotificationResponse } from '@admin/api/notifications'

// User APIs
export { productsApi, categoriesApi } from '@user/api/products'
export { cartApi } from '@user/api/cart'
export { ordersApi } from '@user/api/orders'
export { reviewsApi } from '@user/api/reviews'
export { storesApi } from '@user/api/stores'
export { chatApi } from '@user/api/chat'
export { addressesApi } from '@user/api/addresses'
export { reportsApi } from '@user/api/reports'
export { walletApi } from '@user/api/wallet'
export { notificationsApi } from '@user/api/notifications'

// Re-export types for convenience
export type {
  Cart,
  CartItem,
  CartStats,
  AddCartItemRequest,
  UpdateCartItemQuantityRequest
} from '@user/api/cart'

export type {
  Order,
  OrderItem,
  OrderListResponse,
  OrderStats,
  CreateOrderRequest,
  CreateOrderItemRequest,
  UpdateOrderRequest
} from '@user/api/orders'

export type {
  Review,
  ReviewListResponse,
  ReviewStats,
  CreateReviewRequest,
  UpdateReviewRequest
} from '@user/api/reviews'

export type {
  Store,
  StoreListResponse,
  StoreStats,
  CreateStoreRequest,
  UpdateStoreRequest
} from '@user/api/stores'

export type {
  Conversation,
  ConversationParticipant,
  ChatMessage,
  ConversationListResponse,
  ChatMessageListResponse,
  ChatStats,
  CreateConversationRequest,
  UpdateConversationRequest,
  CreateChatMessageRequest
} from '@user/api/chat'

export type {
  WalletBalance,
  Transaction,
  TransactionListResponse,
  DepositRequest,
  DepositResponse,
  QueryTransactionParams
} from '@user/api/wallet'

export type {
  Notification,
  NotificationListResponse,
  QueryNotificationParams,
  MarkAsReadResponse
} from '@user/api/notifications'
