import { useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { useConversations } from '@/hooks/useChat'
import { useChatSocket } from '@/hooks/useChatSocket'
import { ChatHeader } from './ChatHeader'
import { ChatConversationList } from './ChatConversationList'
import { ChatMessageArea } from './ChatMessageArea'
import { cn } from '@/lib/utils'

export function ChatPopup() {
  const { isAuthenticated } = useAuthStore()
  const {
    isOpen,
    view,
    activeConversationId,
    setTotalUnreadCount,
    incrementUnreadCount,
    setUserTyping,
  } = useChatStore()

  // Fetch conversations to get unread count
  const { data: conversationsData } = useConversations({ page: 1, pageSize: 50 })

  // Socket connection for realtime updates
  useChatSocket({
    onNewMessage: payload => {
      // Increment unread count when receiving new message
      // Only if not in the active conversation
      if (payload.conversationId.toString() !== activeConversationId) {
        incrementUnreadCount()
      }
    },
    onUserTyping: payload => {
      setUserTyping(
        payload.conversationId.toString(),
        payload.userId,
        payload.isTyping
      )
    },
  })

  // Update total unread count from conversations
  useEffect(() => {
    if (conversationsData?.items) {
      const totalUnread = conversationsData.items.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0
      )
      setTotalUnreadCount(totalUnread)
    }
  }, [conversationsData, setTotalUnreadCount])

  // Don't render if not authenticated or not open
  if (!isAuthenticated || !isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-50',
        'flex flex-col overflow-hidden rounded-lg border bg-background shadow-2xl',
        // Desktop size
        'h-[500px] w-[380px]',
        // Mobile: full screen
        'max-md:bottom-0 max-md:right-0 max-md:h-full max-md:w-full max-md:rounded-none'
      )}
    >
      {view === 'list' ? (
        <>
          <ChatHeader title="Tin nhắn" />
          <ChatConversationList />
        </>
      ) : activeConversationId ? (
        <ChatMessageArea conversationId={activeConversationId} />
      ) : null}
    </div>
  )
}
