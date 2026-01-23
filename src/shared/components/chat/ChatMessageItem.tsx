import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Check, CheckCheck } from 'lucide-react'

interface ChatMessageItemProps {
  content: string
  timestamp: string
  isOwn: boolean
  isRead?: boolean
  senderName?: string
  senderAvatar?: string | null
  showAvatar?: boolean
}

export function ChatMessageItem({
  content,
  timestamp,
  isOwn,
  isRead = false,
  senderName,
  senderAvatar,
  showAvatar = true,
}: ChatMessageItemProps) {
  // Format time - handle both ISO string and timestamp
  const formatTime = (ts: string) => {
    // Try parsing as timestamp first, then as ISO string
    const parsed = parseInt(ts)
    const date = isNaN(parsed) ? new Date(ts) : new Date(parsed)
    if (isNaN(date.getTime())) {
      return '--:--'
    }
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className={cn(
        'flex w-full gap-2',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar for other user */}
      {!isOwn && showAvatar && (
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={senderAvatar || undefined} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Spacer when avatar is hidden */}
      {!isOwn && !showAvatar && <div className="w-7 flex-shrink-0" />}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-3 py-2',
          isOwn
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-muted text-foreground'
        )}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
        <div
          className={cn(
            'mt-1 flex items-center gap-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          <span
            className={cn(
              'text-[10px]',
              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {formatTime(timestamp)}
          </span>
          {isOwn && (
            isRead ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
            ) : (
              <Check className="h-3 w-3 text-primary-foreground/70" />
            )
          )}
        </div>
      </div>
    </div>
  )
}
