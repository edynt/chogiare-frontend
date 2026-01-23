import { useEffect, useRef, useCallback } from 'react'
import { useConversationMessages, useConversation } from '@/hooks/useChat'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { ChatHeader } from './ChatHeader'
import { ChatMessageItem } from './ChatMessageItem'
import { ChatMessageInput } from './ChatMessageInput'
import { Loader2 } from 'lucide-react'

interface ChatMessageAreaProps {
  conversationId: string
}

export function ChatMessageArea({ conversationId }: ChatMessageAreaProps) {
  const { user } = useAuthStore()
  const { typingUsers, onlineUsers, setUserTyping } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversation and messages
  const { data: conversation } = useConversation(conversationId)
  const { data: messagesData, isLoading } = useConversationMessages(
    conversationId,
    { page: 1, pageSize: 50 }
  )

  // Stable callback for typing
  const handleTypingCallback = useCallback(
    (payload: { conversationId: number; userId: number; isTyping: boolean }) => {
      if (payload.conversationId.toString() === conversationId) {
        setUserTyping(conversationId, payload.userId, payload.isTyping)
      }
    },
    [conversationId, setUserTyping]
  )

  // Socket connection
  const { sendMessage, joinConversation, leaveConversation, markAsRead, sendTyping } =
    useChatSocket({
      onUserTyping: handleTypingCallback,
    })

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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData?.items])

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

  // Handle send message
  const handleSendMessage = async (content: string) => {
    const convId = parseInt(conversationId)
    if (isNaN(convId)) return

    try {
      await sendMessage(convId, content)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    const convId = parseInt(conversationId)
    if (!isNaN(convId)) {
      sendTyping(convId, isTyping)
    }
  }

  // Messages are in reverse order (newest first), so reverse for display
  const messages = [...(messagesData?.items || [])].reverse()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <ChatHeader
        title={('fullName' in (otherUser || {}) ? (otherUser as { fullName?: string | null })?.fullName : null) || 'Cuộc hội thoại'}
        subtitle={isOtherUserOnline ? 'Đang hoạt động' : 'Không hoạt động'}
        avatarUrl={('avatarUrl' in (otherUser || {}) ? (otherUser as { avatarUrl?: string | null })?.avatarUrl : null) || undefined}
        isOnline={isOtherUserOnline}
        showBackButton
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
                (!prevMessage || String(prevMessage.senderId) !== String(message.senderId))

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
      />
    </div>
  )
}
