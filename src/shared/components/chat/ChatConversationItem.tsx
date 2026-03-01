import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@shared/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ChatConversationItemProps {
  id: string
  name: string
  avatarUrl?: string | null
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
  isActive?: boolean
  onClick?: () => void
}

export function ChatConversationItem({
  name,
  avatarUrl,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isOnline = false,
  isActive = false,
  onClick,
}: ChatConversationItemProps) {
  // Format time display
  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp))
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffDays === 1) {
      return 'Hôm qua'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      })
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
        'hover:bg-accent',
        isActive && 'bg-accent'
      )}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl || undefined} alt={name} />
          <AvatarFallback className="text-sm">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'truncate text-sm',
              unreadCount > 0 ? 'font-semibold' : 'font-medium'
            )}
          >
            {name}
          </span>
          {lastMessageTime && (
            <span className="flex-shrink-0 text-xs text-muted-foreground">
              {formatTime(lastMessageTime)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'truncate text-xs',
              unreadCount > 0
                ? 'font-medium text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {lastMessage || 'Chưa có tin nhắn'}
          </span>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
