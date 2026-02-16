import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface SupportTicket {
  id: number
  title: string
  description: string
  category: number
  priority: number
  status: number
  replies: number
  createdAt: string
  updatedAt: string
}

export interface TicketReplyItem {
  id: number
  message: string
  isInternal: boolean
  createdAt: string
  user: { id: number; email: string; fullName: string | null }
}

export interface SupportTicketDetail {
  id: number
  title: string
  description: string
  category: number
  priority: number
  status: number
  createdAt: string
  updatedAt: string
  user: { id: number; email: string; fullName: string | null }
  replies: TicketReplyItem[]
}

export interface SupportTicketListResponse {
  items: SupportTicket[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateSupportTicketDto {
  title: string
  description: string
  category: number
  priority?: number
}

export interface QuerySupportTicketsParams {
  page?: number
  pageSize?: number
  status?: number
  category?: number
}

export const supportTicketApi = {
  create: async (data: CreateSupportTicketDto): Promise<SupportTicket> => {
    const response = await apiClient.post<ApiResponse<SupportTicket>>(
      '/support-tickets',
      data
    )
    const result = response.data.data
    return 'data' in result
      ? (result as unknown as { data: SupportTicket }).data
      : (result as unknown as SupportTicket)
  },

  getMyTickets: async (
    params?: QuerySupportTicketsParams
  ): Promise<SupportTicketListResponse> => {
    const response = await apiClient.get<
      ApiResponse<SupportTicketListResponse>
    >('/support-tickets', { params })
    // Backend returns { message, data } wrapped by TransformInterceptor, causing double nesting
    const result = response.data.data
    return 'data' in result
      ? (result as unknown as { data: SupportTicketListResponse }).data
      : (result as unknown as SupportTicketListResponse)
  },

  getById: async (id: number): Promise<SupportTicketDetail> => {
    const response = await apiClient.get<ApiResponse<SupportTicketDetail>>(
      `/support-tickets/${id}`
    )
    const result = response.data.data
    return 'data' in result
      ? (result as unknown as { data: SupportTicketDetail }).data
      : (result as unknown as SupportTicketDetail)
  },

  reply: async (ticketId: number, message: string): Promise<TicketReplyItem> => {
    const response = await apiClient.post<ApiResponse<TicketReplyItem>>(
      `/support-tickets/${ticketId}/replies`,
      { message }
    )
    const result = response.data.data
    return 'data' in result
      ? (result as unknown as { data: TicketReplyItem }).data
      : (result as unknown as TicketReplyItem)
  },
}
