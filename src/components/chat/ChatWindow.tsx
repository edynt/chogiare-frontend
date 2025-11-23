import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Clock
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

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
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Xin chào! Sản phẩm này còn hàng không ạ?',
        timestamp: '10:30',
        senderId: 'buyer1',
        senderName: 'Bạn',
        senderAvatar: 'https://i.pravatar.cc/150?img=10',
        isRead: true,
        type: 'text'
      },
      {
        id: '2',
        content: 'Chào bạn! Sản phẩm vẫn còn hàng ạ. Bạn có câu hỏi gì về sản phẩm không?',
        timestamp: '10:32',
        senderId: 'seller1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: 'https://i.pravatar.cc/150?img=1',
        isRead: true,
        type: 'text'
      },
      {
        id: '3',
        content: 'Sản phẩm có bảo hành không ạ?',
        timestamp: '10:35',
        senderId: 'buyer1',
        senderName: 'Bạn',
        senderAvatar: 'https://i.pravatar.cc/150?img=10',
        isRead: true,
        type: 'text'
      },
      {
        id: '4',
        content: 'Có ạ! Sản phẩm bảo hành 12 tháng chính hãng. Bạn có thể xem chi tiết trong mô tả sản phẩm.',
        timestamp: '10:37',
        senderId: 'seller1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: 'https://i.pravatar.cc/150?img=1',
        isRead: true,
        type: 'text'
      },
      {
        id: '5',
        content: 'Cảm ơn bạn! Tôi sẽ đặt hàng ngay.',
        timestamp: '10:40',
        senderId: 'buyer1',
        senderName: 'Bạn',
        senderAvatar: 'https://i.pravatar.cc/150?img=10',
        isRead: false,
        type: 'text'
      }
    ]

    setTimeout(() => {
      setMessages(mockMessages)
      setIsLoading(false)
    }, 1000)
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      senderId: 'buyer1',
      senderName: 'Bạn',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
      isRead: false,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        senderId: 'seller1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: 'https://i.pravatar.cc/150?img=1',
        isRead: true,
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageStatus = (isRead: boolean, senderId: string) => {
    if (senderId === 'buyer1') {
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
              <AvatarImage src="https://i.pravatar.cc/150?img=1" />
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Nguyễn Văn A</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Đang hoạt động</span>
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

      {/* Product Info */}
      <div className="p-4 border-b bg-muted/10">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=60&h=60&fit=crop"
                alt="Product"
                className="w-12 h-12 rounded object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">iPhone 14 Pro Max 256GB</h4>
                <p className="text-sm text-muted-foreground">Tình trạng: Mới 100%</p>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(25000000)}
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to="/seller/products">
                  Xem sản phẩm
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.senderId === 'buyer1' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex space-x-2 max-w-[70%]",
              message.senderId === 'buyer1' ? "flex-row-reverse space-x-reverse" : "flex-row"
            )}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "rounded-lg px-3 py-2",
                message.senderId === 'buyer1' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
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
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              onChange={(e) => setNewMessage(e.target.value)}
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
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
