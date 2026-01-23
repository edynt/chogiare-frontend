import { useConversations } from '@/hooks/useChat'
import { useChatStore } from '@/stores/chatStore'
import { ChatConversationItem } from './ChatConversationItem'
import { Loader2 } from 'lucide-react'

export function ChatConversationList() {
  const { setActiveConversation, onlineUsers } = useChatStore()
  const { data, isLoading, error } = useConversations({ page: 1, pageSize: 20 })

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
        Không thể tải danh sách hội thoại
      </div>
    )
  }

  // Handle API response format (items array)
  const conversations = data?.items || []

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="text-sm text-muted-foreground">
          Chưa có cuộc hội thoại nào
        </span>
        <span className="text-xs text-muted-foreground">
          Bắt đầu trò chuyện với người bán để được hỗ trợ
        </span>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conversation => {
        const otherUser = conversation.otherUser
        const isOnline = otherUser?.userId
          ? onlineUsers.has(otherUser.userId)
          : false

        return (
          <ChatConversationItem
            key={conversation.id}
            id={conversation.id.toString()}
            name={otherUser?.fullName || 'Người dùng'}
            avatarUrl={otherUser?.avatarUrl}
            lastMessage={conversation.lastMessage?.content}
            lastMessageTime={conversation.lastMessage?.createdAt}
            unreadCount={conversation.unreadCount || 0}
            isOnline={isOnline}
            onClick={() => setActiveConversation(conversation.id.toString())}
          />
        )
      })}
    </div>
  )
}
