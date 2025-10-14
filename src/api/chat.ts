import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface ConversationParticipant {
  id: string
  conversationId: string
  userId: number
  role: string
  joinedAt: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: number
  messageType: string
  content: string
  isRead: boolean
  senderName?: string
  senderEmail?: string
  senderAvatar?: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  type: string
  title?: string
  participants: ConversationParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  conversations: Conversation[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ChatMessageListResponse {
  messages: ChatMessage[]
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
  type: string
  title?: string
  userIds: number[]
}

export interface UpdateConversationRequest {
  type?: string
  title?: string
}

export interface CreateChatMessageRequest {
  conversationId: string
  messageType: string
  content: string
}

export const chatApi = {
  // Conversation operations
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/v1/chat/conversations', data)
    return response.data.data
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get<ApiResponse<Conversation>>(`/v1/chat/conversations/${id}`)
    return response.data.data
  },

  getConversations: async (filters?: { page?: number; pageSize?: number }): Promise<ConversationListResponse> => {
    const response = await apiClient.get<ApiResponse<ConversationListResponse>>('/v1/chat/conversations', {
      params: { 
        page: filters?.page || 1, 
        page_size: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listUserConversations: async (page = 1, pageSize = 10): Promise<ConversationListResponse> => {
    const response = await apiClient.get<ApiResponse<ConversationListResponse>>('/v1/chat/conversations', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  updateConversation: async (id: string, data: UpdateConversationRequest): Promise<Conversation> => {
    const response = await apiClient.put<ApiResponse<Conversation>>(`/v1/chat/conversations/${id}`, data)
    return response.data.data
  },

  deleteConversation: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/chat/conversations/${id}`)
  },

  // Conversation participant operations
  addParticipant: async (conversationId: string, userId: string): Promise<ConversationParticipant> => {
    const response = await apiClient.post<ApiResponse<ConversationParticipant>>(
      `/v1/chat/conversations/${conversationId}/participants/${userId}`
    )
    return response.data.data
  },

  removeParticipant: async (conversationId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/v1/chat/conversations/${conversationId}/participants/${userId}`)
  },

  // Chat message operations
  sendMessage: async (conversationId: string, data: CreateChatMessageRequest): Promise<ChatMessage> => {
    const response = await apiClient.post<ApiResponse<ChatMessage>>(`/v1/chat/conversations/${conversationId}/messages`, data)
    return response.data.data
  },

  createChatMessage: async (data: CreateChatMessageRequest): Promise<ChatMessage> => {
    const response = await apiClient.post<ApiResponse<ChatMessage>>('/v1/chat/messages', data)
    return response.data.data
  },

  getChatMessage: async (id: string): Promise<ChatMessage> => {
    const response = await apiClient.get<ApiResponse<ChatMessage>>(`/v1/chat/messages/${id}`)
    return response.data.data
  },

  getConversationMessages: async (conversationId: string, filters?: { page?: number; pageSize?: number }): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get<ApiResponse<ChatMessageListResponse>>(`/v1/chat/conversations/${conversationId}/messages`, {
      params: { 
        page: filters?.page || 1, 
        page_size: filters?.pageSize || 50 
      }
    })
    return response.data.data
  },

  listConversationMessages: async (conversationId: string, page = 1, pageSize = 50): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get<ApiResponse<ChatMessageListResponse>>(`/v1/chat/conversations/${conversationId}/messages`, {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  markMessageAsRead: async (conversationId: string, messageId: string): Promise<void> => {
    await apiClient.post(`/v1/chat/conversations/${conversationId}/messages/${messageId}/read`)
  },

  markConversationAsRead: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/chat/conversations/${id}/read`)
  },

  deleteMessage: async (conversationId: string, messageId: string): Promise<void> => {
    await apiClient.delete(`/v1/chat/conversations/${conversationId}/messages/${messageId}`)
  },

  deleteChatMessage: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/chat/messages/${id}`)
  },

  // Statistics
  getChatStats: async (): Promise<ChatStats> => {
    const response = await apiClient.get<ApiResponse<ChatStats>>('/v1/chat/stats')
    return response.data.data
  },
}
