import { useState, useEffect, useRef } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@shared/components/ui/avatar'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
} from 'lucide-react'
import { cn, getApiErrorMessage } from '@/lib/utils'
import {
  useConversation,
  useConversationMessages,
} from '@/hooks/useChat'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import type { ChatMessage } from '@user/api/chat'
import { useChatSocket } from '@/hooks/useChatSocket'

interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  senderName: string
  senderAvatar: string
  isRead: boolean
  type: 'text' | 'image' | 'file'
  product?: {
    id: string
    title: string
    image: string
    price: number
  }
}

interface ChatWindowProps {
  chatId: string
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const { user } = useAuthStore()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: conversation, isLoading: conversationLoading } =
    useConversation(chatId)
  const { data: messagesData, isLoading: messagesLoading } =
    useConversationMessages(chatId, {
      page: 1,
      pageSize: 100,
    })
  const {
    sendMessage: sendSocketMessage,
    isConnected,
    joinConversation,
    leaveConversation,
    markAsRead,
  } = useChatSocket({
    onNewMessage: (payload) => {
      // Real-time message updates are handled automatically by React Query invalidation
      // in useChatSocket, no additional action needed here
    },
  })

  const isLoading = conversationLoading || messagesLoading

  const mapChatMessageToMessage = (msg: ChatMessage): Message => {
    const isCurrentUser = String(msg.senderId) === String(user?.id)
    const formatTime = (dateString: string) => {
      const date = new Date(parseInt(dateString) || dateString)
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return {
      id: msg.id.toString(),
      content: msg.content,
      timestamp: formatTime(msg.createdAt),
      senderId: msg.senderId.toString(),
      senderName: isCurrentUser
        ? 'Bạn'
        : msg.sender?.fullName || `User ${msg.senderId}`,
      senderAvatar: msg.sender?.avatarUrl || '',
      isRead: msg.isRead,
      type: (msg.messageType as 'text' | 'image' | 'file') || 'text',
    }
  }

  const messages: Message[] =
    messagesData?.items?.map(mapChatMessageToMessage) || []

  // Join conversation room when connected
  useEffect(() => {
    if (!chatId || !isConnected) return

    const conversationId = parseInt(chatId)
    if (isNaN(conversationId)) return

    joinConversation(conversationId)

    // Mark messages as read when viewing
    markAsRead(conversationId)

    return () => {
      leaveConversation(conversationId)
    }
  }, [chatId, isConnected, joinConversation, leaveConversation, markAsRead])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    // Validate chatId - must be non-empty and not "undefined" string
    if (!newMessage.trim() || !chatId || chatId === 'undefined') return

    // Check WebSocket connection
    if (!isConnected) {
      toast.error('Chưa kết nối đến máy chủ. Vui lòng thử lại.')
      return
    }

    const messageContent = newMessage.trim()
    setNewMessage('') // Clear input immediately for better UX

    try {
      await sendSocketMessage(parseInt(chatId), messageContent, 'text')
    } catch (error) {
      // Restore message if send failed
      setNewMessage(messageContent)
      toast.error(
        getApiErrorMessage(error, 'Không thể gửi tin nhắn. Vui lòng thử lại.')
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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

  // Get other user - prefer otherUser field, fallback to participants
  const otherUser = conversation?.otherUser
  const otherParticipant = otherUser || conversation?.participants.find(
    p => String(p.userId) !== String(user?.id)
  )

  // Display seller's full name
  const participantName =
    (otherUser?.fullName) ||
    conversation?.title ||
    (otherParticipant ? `User ${otherParticipant.userId}` : 'Người dùng')

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải tin nhắn...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser?.avatarUrl || ''} />
              <AvatarFallback>
                {participantName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{participantName}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.senderId === user?.id?.toString()
                ? 'justify-end'
                : 'justify-start'
            )}
          >
            <div
              className={cn(
                'flex space-x-2 max-w-[70%]',
                message.senderId === user?.id?.toString()
                  ? 'flex-row-reverse space-x-reverse'
                  : 'flex-row'
              )}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  'rounded-lg px-3 py-2',
                  message.senderId === user?.id?.toString()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp}
                  </span>
                  {getMessageStatus(message.isRead, message.senderId)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                <AvatarFallback>NV</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
