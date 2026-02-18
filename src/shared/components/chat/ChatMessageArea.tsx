import { useEffect, useRef, useCallback, useState } from 'react'
import {
  useConversationMessages,
  useConversation,
  useSendMessage,
} from '@/hooks/useChat'
import { useChatSocket, type ChatMessagePayload } from '@/hooks/useChatSocket'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { ChatHeader } from './ChatHeader'
import { ChatMessageItem } from './ChatMessageItem'
import { ChatMessageInput } from './ChatMessageInput'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessage } from '@user/api/chat'

interface ChatMessageAreaProps {
  conversationId: string
}

export function ChatMessageArea({ conversationId }: ChatMessageAreaProps) {
  const { user } = useAuthStore()
  const {
    typingUsers,
    onlineUsers,
    setUserTyping,
    pendingMessage,
    setPendingMessage,
  } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Local state for realtime messages (optimistic updates)
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([])

  // Fetch conversation and messages
  const { data: conversation } = useConversation(conversationId)
  const { data: messagesData, isLoading } = useConversationMessages(
    conversationId,
    { page: 1, pageSize: 50 }
  )

  // Clear realtime messages when conversation changes or when data refreshes
  useEffect(() => {
    setRealtimeMessages([])
  }, [conversationId])

  // Stable callback for new message (realtime)
  const handleNewMessageCallback = useCallback(
    (payload: ChatMessagePayload) => {
      if (payload.conversationId.toString() === conversationId) {
        // Add new message to realtime state for instant display
        setRealtimeMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === payload.message.id)) {
            return prev
          }
          return [...prev, payload.message]
        })
      }
    },
    [conversationId]
  )

  // Stable callback for typing
  const handleTypingCallback = useCallback(
    (payload: {
      conversationId: number
      userId: number
      isTyping: boolean
    }) => {
      if (payload.conversationId.toString() === conversationId) {
        setUserTyping(conversationId, payload.userId, payload.isTyping)
      }
    },
    [conversationId, setUserTyping]
  )

  // Socket connection with realtime message handler
  const {
    isConnected,
    sendMessage: sendSocketMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    sendTyping,
  } = useChatSocket({
    onNewMessage: handleNewMessageCallback,
    onUserTyping: handleTypingCallback,
  })

  // REST API fallback for sending messages
  const sendMessageMutation = useSendMessage()

  // Store functions in refs to avoid effect re-runs
  const joinRef = useRef(joinConversation)
  const leaveRef = useRef(leaveConversation)
  const markReadRef = useRef(markAsRead)

  useEffect(() => {
    joinRef.current = joinConversation
    leaveRef.current = leaveConversation
    markReadRef.current = markAsRead
  }, [joinConversation, leaveConversation, markAsRead])

  // Join conversation room on mount - only depends on conversationId
  useEffect(() => {
    const convId = parseInt(conversationId)
    if (isNaN(convId)) return

    joinRef.current(convId)
    markReadRef.current(convId)

    return () => {
      leaveRef.current(convId)
    }
  }, [conversationId])

  // Scroll to bottom when new messages arrive (from API or realtime)
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [messagesData?.items, realtimeMessages])

  // Get other user info - try otherUser first, then fallback to participants
  const otherUserFromConv = conversation?.otherUser
  const otherUserFromParticipants = conversation?.participants?.find(
    (p: { userId: number }) => String(p.userId) !== String(user?.id)
  )
  const otherUser = otherUserFromConv || otherUserFromParticipants
  const otherUserId = otherUser?.userId
  const isOtherUserOnline = otherUserId ? onlineUsers.has(otherUserId) : false

  // Get typing users for this conversation
  const conversationTypingUsers = typingUsers[conversationId] || []
  const isOtherUserTyping = otherUserId
    ? conversationTypingUsers.includes(otherUserId)
    : false

  // Handle send message - try socket first, fallback to REST API
  const handleSendMessage = async (content: string) => {
    const convId = parseInt(conversationId)
    if (isNaN(convId)) {
      toast.error('Cuộc hội thoại không hợp lệ')
      return
    }

    // Create optimistic message for instant display
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      senderId: user?.id || 0,
      messageType: 0,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        userId: user?.id,
        fullName: user?.fullName || null,
        avatarUrl: user?.avatarUrl || null,
      },
    }

    // Add optimistic message immediately
    setRealtimeMessages(prev => [...prev, optimisticMessage])

    try {
      // Try socket first if connected
      if (isConnected) {
        await sendSocketMessage(convId, content)
      } else {
        // Fallback to REST API
        await sendMessageMutation.mutateAsync({
          conversationId: conversationId,
          data: { content, messageType: 0 },
        })
      }
      // Remove optimistic message after success (real message will come via socket or query refresh)
      setRealtimeMessages(prev =>
        prev.filter(m => m.id !== optimisticMessage.id)
      )
    } catch (error) {
      console.error(
        'Failed to send message via socket, trying REST API:',
        error
      )
      // If socket fails, try REST API as backup
      try {
        await sendMessageMutation.mutateAsync({
          conversationId: conversationId,
          data: { content, messageType: 0 },
        })
        // Remove optimistic message after success
        setRealtimeMessages(prev =>
          prev.filter(m => m.id !== optimisticMessage.id)
        )
      } catch (apiError) {
        console.error('Failed to send message:', apiError)
        // Remove optimistic message on error
        setRealtimeMessages(prev =>
          prev.filter(m => m.id !== optimisticMessage.id)
        )
        toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.')
      }
    }
  }

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    const convId = parseInt(conversationId)
    if (!isNaN(convId)) {
      sendTyping(convId, isTyping)
    }
  }

  // Combine API messages with realtime messages
  // Sort all messages by createdAt ascending (oldest first, newest last at bottom)
  const apiMessages = [...(messagesData?.items || [])]
  const apiMessageIds = new Set(apiMessages.map(m => String(m.id)))
  const newRealtimeMessages = realtimeMessages.filter(
    m => !apiMessageIds.has(String(m.id))
  )
  const allMessages = [...apiMessages, ...newRealtimeMessages]

  // Sort by createdAt ascending - oldest at top, newest at bottom
  const messages = allMessages.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateA - dateB
  })

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <ChatHeader
        title={
          ('fullName' in (otherUser || {})
            ? (otherUser as { fullName?: string | null })?.fullName
            : null) || 'Cuộc hội thoại'
        }
        subtitle={isOtherUserOnline ? 'Đang hoạt động' : 'Không hoạt động'}
        avatarUrl={
          ('avatarUrl' in (otherUser || {})
            ? (otherUser as { avatarUrl?: string | null })?.avatarUrl
            : null) || undefined
        }
        isOnline={isOtherUserOnline}
        showBackButton
        conversationId={conversationId}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-sm text-muted-foreground">
              Chưa có tin nhắn nào
            </span>
            <span className="text-xs text-muted-foreground">
              Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((message, index) => {
              const isOwn = String(message.senderId) === String(user?.id)
              const prevMessage = index > 0 ? messages[index - 1] : null
              const showAvatar =
                !isOwn &&
                (!prevMessage ||
                  String(prevMessage.senderId) !== String(message.senderId))

              return (
                <ChatMessageItem
                  key={message.id}
                  content={message.content}
                  timestamp={message.createdAt}
                  isOwn={isOwn}
                  isRead={message.isRead}
                  senderName={message.sender?.fullName || undefined}
                  senderAvatar={message.sender?.avatarUrl}
                  showAvatar={showAvatar}
                />
              )
            })}

            {/* Typing indicator */}
            {isOtherUserTyping && (
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs text-muted-foreground">
                  {otherUser?.fullName || 'Người dùng'} đang nhập...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatMessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        initialMessage={pendingMessage || undefined}
        onInitialMessageUsed={() => setPendingMessage(null)}
      />
    </div>
  )
}
