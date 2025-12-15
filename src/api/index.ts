// Export all API modules
export { authApi } from './auth'
export { productsApi, categoriesApi } from './products'
export { cartApi } from './cart'
export { ordersApi } from './orders'
export { reviewsApi } from './reviews'
export { storesApi } from './stores'
export { chatApi } from './chat'
export { uploadApi } from './upload'
export { addressesApi } from './addresses'
export { reportsApi } from './reports'
export { adminApi } from './admin'
export { walletApi } from './wallet'
export { notificationsApi } from './notifications'
export { apiClient } from './axios'

// Re-export types for convenience
export type { 
  Cart, 
  CartItem, 
  CartStats, 
  AddCartItemRequest, 
  UpdateCartItemQuantityRequest 
} from './cart'

export type { 
  Order, 
  OrderItem, 
  OrderListResponse, 
  OrderStats, 
  CreateOrderRequest, 
  CreateOrderItemRequest, 
  UpdateOrderRequest 
} from './orders'

export type { 
  Review, 
  ReviewListResponse, 
  ReviewStats, 
  CreateReviewRequest, 
  UpdateReviewRequest 
} from './reviews'

export type { 
  Store, 
  StoreListResponse, 
  StoreStats, 
  CreateStoreRequest, 
  UpdateStoreRequest 
} from './stores'

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
} from './chat'

export type {
  WalletBalance,
  Transaction,
  TransactionListResponse,
  DepositRequest,
  DepositResponse,
  QueryTransactionParams
} from './wallet'

export type {
  Notification,
  NotificationListResponse,
  QueryNotificationParams,
  MarkAsReadResponse,
  CreateNotificationRequest,
  CreateNotificationResponse
} from './notifications'
