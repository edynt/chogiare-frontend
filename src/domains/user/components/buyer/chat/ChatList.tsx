import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar'
import { Badge } from '@shared/components/ui/badge'
import { cn, formatPrice } from '@/lib/utils'
import { MessageCircle, Check, CheckCheck } from 'lucide-react'
import { useConversations } from '@/hooks/useChat'
import { useAuthStore } from '@/stores/authStore'
import type { Conversation } from '@user/api/chat'

interface Chat {
  id: string
  participant: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
    senderId: string
  }
  unreadCount: number
  product?: {
    id: string
    title: string
    image: string
    price: number
  }
}

interface ChatListProps {
  searchQuery: string
  selectedChatId?: string | undefined
}

export function ChatList({ searchQuery, selectedChatId }: ChatListProps) {
  const { user } = useAuthStore()
  const { data: conversationsData, isLoading } = useConversations({ page: 1, pageSize: 100 })

  const mapConversationToChat = (conversation: Conversation): Chat | null => {
    const otherParticipant = conversation.participants.find(p => String(p.userId) !== String(user?.id))
    if (!otherParticipant) return null

    const lastMessage = conversation.lastMessage
    const formatTime = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    return {
      id: conversation.id,
      participant: {
        id: otherParticipant.userId.toString(),
        name: conversation.title || `User ${otherParticipant.userId}`,
        avatar: '',
        isOnline: false,
      },
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            timestamp: formatTime(lastMessage.createdAt),
            isRead: lastMessage.isRead,
            senderId: lastMessage.senderId.toString(),
          }
        : {
            content: 'Chưa có tin nhắn',
            timestamp: formatTime(conversation.createdAt),
            isRead: true,
            senderId: '',
          },
      unreadCount: conversation.unreadCount,
    }
  }

  const chats: Chat[] = conversationsData?.conversations
    ? conversationsData.conversations
        .map(mapConversationToChat)
        .filter((chat): chat is Chat => chat !== null)
    : []

  const filteredChats = chats.filter(chat =>
    chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.product?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: string) => {
    return timestamp
  }

  const getMessageStatus = (isRead: boolean, senderId: string) => {
    if (senderId === user?.id?.toString()) {
      return isRead ? (
        <CheckCheck className="h-4 w-4 text-blue-500" />
      ) : (
        <Check className="h-4 w-4 text-muted-foreground" />
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredChats.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {filteredChats.map((chat) => (
        <Link
          key={chat.id}
          to={`/chat/${chat.id}`}
          className={cn(
            "block p-3 rounded-lg transition-colors hover:bg-muted/50",
            selectedChatId === chat.id && "bg-muted"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={chat.participant.avatar} />
                <AvatarFallback>{chat.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.participant.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm truncate">
                  {chat.participant.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                  {getMessageStatus(chat.lastMessage.isRead, chat.lastMessage.senderId)}
                </div>
              </div>
              
              {chat.product && (
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={chat.product.image}
                    alt={chat.product.title}
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {chat.product.title}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {formatPrice(chat.product.price)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-sm truncate",
                  !chat.lastMessage.isRead && chat.lastMessage.senderId !== user?.id?.toString() 
                    ? "font-semibold text-foreground" 
                    : "text-muted-foreground"
                )}>
                  {chat.lastMessage.content}
                </p>
                {chat.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
