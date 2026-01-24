import { useState } from 'react'
import { ArrowLeft, X, MoreVertical, Trash2 } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar'
import { Button } from '@shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/components/ui/alert-dialog'
import { useDeleteConversation } from '@/hooks/useChat'
import { toast } from 'sonner'
import { cn, getApiErrorMessage } from '@/lib/utils'

interface ChatHeaderProps {
  title?: string
  subtitle?: string
  avatarUrl?: string
  isOnline?: boolean
  showBackButton?: boolean
  onBack?: () => void
  conversationId?: string
}

export function ChatHeader({
  title = 'Tin nhắn',
  subtitle,
  avatarUrl,
  isOnline,
  showBackButton = false,
  onBack,
  conversationId,
}: ChatHeaderProps) {
  const { closeChat, goBackToList } = useChatStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteConversation = useDeleteConversation()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      goBackToList()
    }
  }

  const handleDeleteConversation = () => {
    if (!conversationId) return

    deleteConversation.mutate(conversationId, {
      onSuccess: () => {
        toast.success('Đã xóa cuộc trò chuyện')
        closeChat()
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Không thể xóa cuộc trò chuyện'))
      },
    })
    setShowDeleteDialog(false)
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
        {conversationId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa cuộc trò chuyện
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={closeChat}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cuộc trò chuyện?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Tất cả tin nhắn sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteConversation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
