import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { useConversations, useCreateConversation } from '@/hooks/useChat'
import { useChatSocket } from '@/hooks/useChatSocket'
import { ChatHeader } from './ChatHeader'
import { ChatConversationList } from './ChatConversationList'
import { ChatMessageArea } from './ChatMessageArea'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function ChatPopup() {
  const { isAuthenticated } = useAuthStore()
  const {
    isOpen,
    view,
    activeConversationId,
    pendingSellerId,
    setTotalUnreadCount,
    incrementUnreadCount,
    setUserTyping,
    setActiveConversation,
    setPendingSellerId,
  } = useChatStore()

  // Fetch conversations to get unread count
  const { data: conversationsData } = useConversations({
    page: 1,
    pageSize: 50,
  })

  // Create conversation mutation
  const createConversation = useCreateConversation()

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

  // Store functions in refs to avoid effect re-runs
  const setActiveConvRef = useRef(setActiveConversation)
  const setPendingSellerRef = useRef(setPendingSellerId)
  useEffect(() => {
    setActiveConvRef.current = setActiveConversation
    setPendingSellerRef.current = setPendingSellerId
  }, [setActiveConversation, setPendingSellerId])

  // Handle pending seller - create/find conversation when popup opens
  useEffect(() => {
    if (!isOpen || !pendingSellerId || createConversation.isPending) return

    createConversation.mutate(
      { otherUserId: pendingSellerId },
      {
        onSuccess: conversation => {
          // Validate conversation has id before setting
          if (conversation?.id != null) {
            setActiveConvRef.current(conversation.id.toString())
          }
          setPendingSellerRef.current(null)
        },
        onError: error => {
          console.error('Failed to create conversation:', error)
          setPendingSellerRef.current(null)
        },
      }
    )
  }, [isOpen, pendingSellerId, createConversation])

  // Don't render if not authenticated or not open
  if (!isAuthenticated || !isOpen) {
    return null
  }

  // Show loading when creating conversation for new seller
  // pendingSellerId means we're waiting to create/find conversation
  const isCreatingConversation = !!pendingSellerId

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
      {isCreatingConversation ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Đang mở cuộc trò chuyện...
          </span>
        </div>
      ) : view === 'conversation' && activeConversationId ? (
        <ChatMessageArea conversationId={activeConversationId} />
      ) : (
        <>
          <ChatHeader title="Tin nhắn" />
          <ChatConversationList />
        </>
      )}
    </div>
  )
}
