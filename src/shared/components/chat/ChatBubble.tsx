import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export function ChatBubble() {
  const { isAuthenticated } = useAuthStore()
  const { isOpen, openChat, totalUnreadCount } = useChatStore()
  const location = useLocation()

  // Hide when on chat page to avoid UI conflicts
  // Use regex to match /chat and /chat/:id but not /chatroom or similar
  const isOnChatPage = /^\/chat(\/|$)/.test(location.pathname)

  // Only show when authenticated, chat popup is not open, and not on chat page
  if (!isAuthenticated || isOpen || isOnChatPage) {
    return null
  }

  return (
    <button
      onClick={() => openChat()}
      className={cn(
        'fixed bottom-5 right-5 z-50',
        'flex h-14 w-14 items-center justify-center',
        'rounded-full bg-primary text-primary-foreground',
        'shadow-lg transition-all hover:scale-105 hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      aria-label="Mở chat"
    >
      <MessageCircle className="h-6 w-6" />

      {/* Unread badge */}
      {totalUnreadCount > 0 && (
        <span
          className={cn(
            'absolute -right-1 -top-1',
            'flex h-5 min-w-5 items-center justify-center',
            'rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground'
          )}
        >
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </button>
  )
}
