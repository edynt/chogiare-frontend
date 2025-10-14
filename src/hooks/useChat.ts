import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '@/api/chat'
import type { UpdateConversationRequest, CreateChatMessageRequest } from '@/api/chat'

export const useConversations = (filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['chat', 'conversations', filters],
    queryFn: () => chatApi.getConversations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ['chat', 'conversations', id],
    queryFn: () => chatApi.getConversation(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useConversationMessages = (conversationId: string, filters?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId, filters],
    queryFn: () => chatApi.getConversationMessages(conversationId, filters),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  })
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

export const useUpdateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConversationRequest }) =>
      chatApi.updateConversation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', id] })
    },
  })
}

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

export const useAddParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      chatApi.addParticipant(conversationId, userId),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', conversationId] })
    },
  })
}

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      chatApi.removeParticipant(conversationId, userId),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', conversationId] })
    },
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, data }: { conversationId: string; data: CreateChatMessageRequest }) =>
      chatApi.sendMessage(conversationId, data),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      chatApi.markMessageAsRead(conversationId, messageId),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      chatApi.deleteMessage(conversationId, messageId),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] })
    },
  })
}

export const useChatStats = () => {
  return useQuery({
    queryKey: ['chat', 'stats'],
    queryFn: chatApi.getChatStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
