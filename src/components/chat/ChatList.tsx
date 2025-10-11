import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import { MessageCircle, Clock, Check, CheckCheck } from 'lucide-react'

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
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        participant: {
          id: 'seller1',
          name: 'Nguyễn Văn A',
          avatar: 'https://i.pravatar.cc/150?img=1',
          isOnline: true
        },
        lastMessage: {
          content: 'Xin chào! Sản phẩm này còn hàng không ạ?',
          timestamp: '10:30',
          isRead: true,
          senderId: 'buyer1'
        },
        unreadCount: 0,
        product: {
          id: '1',
          title: 'iPhone 14 Pro Max 256GB',
          image: 'https://via.placeholder.com/60x60',
          price: 25000000
        }
      },
      {
        id: '2',
        participant: {
          id: 'seller2',
          name: 'Trần Thị B',
          avatar: 'https://i.pravatar.cc/150?img=2',
          isOnline: false
        },
        lastMessage: {
          content: 'Cảm ơn bạn đã quan tâm!',
          timestamp: '09:15',
          isRead: false,
          senderId: 'seller2'
        },
        unreadCount: 2,
        product: {
          id: '2',
          title: 'MacBook Pro M2 13 inch',
          image: 'https://via.placeholder.com/60x60',
          price: 35000000
        }
      },
      {
        id: '3',
        participant: {
          id: 'seller3',
          name: 'Lê Văn C',
          avatar: 'https://i.pravatar.cc/150?img=3',
          isOnline: true
        },
        lastMessage: {
          content: 'Bạn có thể giao hàng đến quận 1 không?',
          timestamp: '08:45',
          isRead: true,
          senderId: 'buyer1'
        },
        unreadCount: 0,
        product: {
          id: '3',
          title: 'Samsung Galaxy S23 Ultra',
          image: 'https://via.placeholder.com/60x60',
          price: 28000000
        }
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setChats(mockChats)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredChats = chats.filter(chat =>
    chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.product?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: string) => {
    return timestamp
  }

  const getMessageStatus = (isRead: boolean, senderId: string) => {
    if (senderId === 'buyer1') { // Current user
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
                  !chat.lastMessage.isRead && chat.lastMessage.senderId !== 'buyer1' 
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
