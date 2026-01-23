import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

/**
 * Helper to unwrap nested response from backend
 * Backend returns { message, data } which interceptor wraps to { success, data: { data: ... } }
 * This function extracts the actual data from nested structure
 */
function unwrapResponse<T>(data: T | { data: T }): T {
  if (data && typeof data === 'object' && 'data' in data) {
    // Check if it's the nested structure by verifying inner data has expected properties
    const inner = (data as { data: T }).data
    if (inner !== undefined) {
      return inner
    }
  }
  return data as T
}

export interface ConversationParticipant {
  id?: string
  conversationId?: string
  userId: number
  role?: string
  joinedAt?: string
  fullName?: string | null
  avatarUrl?: string | null
}

export interface ChatMessageSender {
  userId?: number
  fullName?: string | null
  avatarUrl?: string | null
}

export interface ChatMessage {
  id: number | string
  conversationId: number | string
  senderId: number
  messageType: string
  content: string
  isRead: boolean
  messageMetadata?: Record<string, unknown>
  sender?: ChatMessageSender
  createdAt: string
  updatedAt: string
}

export interface LastMessage {
  id: number | string
  content: string
  messageType: string
  senderId: number
  createdAt: string
}

export interface OtherUser {
  userId: number
  fullName?: string | null
  avatarUrl?: string | null
}

export interface Conversation {
  id: number | string
  type: string
  title?: string | null
  metadata?: Record<string, unknown>
  participants?: ConversationParticipant[]
  otherUser?: OtherUser | null
  lastMessage?: LastMessage | null
  unreadCount?: number
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  items: Conversation[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ChatMessageListResponse {
  items: ChatMessage[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ChatStats {
  totalConversations: number
  totalMessages: number
  unreadMessages: number
  activeConversations: number
}

export interface CreateConversationRequest {
  otherUserId: number
  title?: string
}

export interface UpdateConversationRequest {
  type?: string
  title?: string
}

export interface CreateChatMessageRequest {
  content: string
  messageType?: string
}

export const chatApi = {
  // Conversation operations
  createConversation: async (
    data: CreateConversationRequest
  ): Promise<Conversation> => {
    const response = await apiClient.post<ApiResponse<Conversation>>(
      '/chat/conversations',
      data
    )
    return unwrapResponse(response.data.data)
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get<ApiResponse<Conversation>>(
      `/chat/conversations/${id}`
    )
    return unwrapResponse(response.data.data)
  },

  getConversations: async (filters?: {
    page?: number
    pageSize?: number
  }): Promise<ConversationListResponse> => {
    const response = await apiClient.get<ApiResponse<ConversationListResponse>>(
      '/chat/conversations',
      {
        params: {
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 10,
        },
      }
    )
    return unwrapResponse(response.data.data)
  },

  listUserConversations: async (
    page = 1,
    pageSize = 10
  ): Promise<ConversationListResponse> => {
    const response = await apiClient.get<ApiResponse<ConversationListResponse>>(
      '/chat/conversations',
      {
        params: { page, pageSize },
      }
    )
    return unwrapResponse(response.data.data)
  },

  updateConversation: async (
    id: string,
    data: UpdateConversationRequest
  ): Promise<Conversation> => {
    const response = await apiClient.put<ApiResponse<Conversation>>(
      `/chat/conversations/${id}`,
      data
    )
    return unwrapResponse(response.data.data)
  },

  deleteConversation: async (id: string): Promise<void> => {
    await apiClient.delete(`/chat/conversations/${id}`)
  },

  // Conversation participant operations
  addParticipant: async (
    conversationId: string,
    userId: string
  ): Promise<ConversationParticipant> => {
    const response = await apiClient.post<ApiResponse<ConversationParticipant>>(
      `/chat/conversations/${conversationId}/participants/${userId}`
    )
    return unwrapResponse(response.data.data)
  },

  removeParticipant: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/chat/conversations/${conversationId}/participants/${userId}`
    )
  },

  // Chat message operations
  sendMessage: async (
    conversationId: string,
    data: CreateChatMessageRequest
  ): Promise<ChatMessage> => {
    // Validate conversationId before making API call
    if (!conversationId || conversationId === 'undefined' || conversationId.trim() === '') {
      throw new Error('Vui lòng chọn cuộc trò chuyện trước khi gửi tin nhắn')
    }
    const response = await apiClient.post<ApiResponse<ChatMessage>>(
      `/chat/conversations/${conversationId}/messages`,
      {
        content: data.content,
        messageType: data.messageType,
      }
    )
    return unwrapResponse(response.data.data)
  },

  createChatMessage: async (
    conversationId: string,
    data: CreateChatMessageRequest
  ): Promise<ChatMessage> => {
    const response = await apiClient.post<ApiResponse<ChatMessage>>(
      '/chat/messages',
      {
        content: data.content,
        messageType: data.messageType,
      },
      {
        params: { conversationId },
      }
    )
    return unwrapResponse(response.data.data)
  },

  getChatMessage: async (id: string): Promise<ChatMessage> => {
    const response = await apiClient.get<ApiResponse<ChatMessage>>(
      `/chat/messages/${id}`
    )
    return unwrapResponse(response.data.data)
  },

  getConversationMessages: async (
    conversationId: string,
    filters?: { page?: number; pageSize?: number }
  ): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get<ApiResponse<ChatMessageListResponse>>(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: {
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 50,
        },
      }
    )
    return unwrapResponse(response.data.data)
  },

  listConversationMessages: async (
    conversationId: string,
    page = 1,
    pageSize = 50
  ): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get<ApiResponse<ChatMessageListResponse>>(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: { page, pageSize },
      }
    )
    return unwrapResponse(response.data.data)
  },

  markMessageAsRead: async (
    conversationId: string,
    messageId: string
  ): Promise<void> => {
    await apiClient.post(
      `/chat/conversations/${conversationId}/messages/${messageId}/read`
    )
  },

  markConversationAsRead: async (id: string): Promise<void> => {
    await apiClient.post(`/chat/conversations/${id}/read`)
  },

  deleteMessage: async (
    conversationId: string,
    messageId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/chat/conversations/${conversationId}/messages/${messageId}`
    )
  },

  deleteChatMessage: async (id: string): Promise<void> => {
    await apiClient.delete(`/chat/messages/${id}`)
  },

  // Statistics
  getChatStats: async (): Promise<ChatStats> => {
    const response = await apiClient.get<ApiResponse<ChatStats>>('/chat/stats')
    return unwrapResponse(response.data.data)
  },
}
