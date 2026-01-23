import { ArrowLeft, X, MoreVertical } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar'
import { Button } from '@shared/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  title?: string
  subtitle?: string
  avatarUrl?: string
  isOnline?: boolean
  showBackButton?: boolean
  onBack?: () => void
}

export function ChatHeader({
  title = 'Tin nhắn',
  subtitle,
  avatarUrl,
  isOnline,
  showBackButton = false,
  onBack,
}: ChatHeaderProps) {
  const { closeChat, goBackToList } = useChatStore()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      goBackToList()
    }
  }

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-3">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {avatarUrl !== undefined && (
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} alt={title} />
              <AvatarFallback className="text-xs">
                {title?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
            )}
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">{title}</span>
          {subtitle && (
            <span
              className={cn(
                'text-xs leading-tight',
                isOnline ? 'text-green-600' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={closeChat}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
