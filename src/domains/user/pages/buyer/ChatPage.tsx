import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { ChatList } from '@user/components/buyer/chat/ChatList'
import { ChatWindow } from '@user/components/buyer/chat/ChatWindow'
import { Card, CardContent } from '@shared/components/ui/card'
import { MessageCircle, Search, Zap, Shield, Clock, Loader2 } from 'lucide-react'
import { Input } from '@shared/components/ui/input'
import { useConversations, useCreateConversation } from '@/hooks/useChat'
import { useAuthStore } from '@/stores/authStore'

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  // Get sellerId from URL query params
  const sellerId = searchParams.get('sellerId')

  // Fetch conversations to check if conversation with seller already exists
  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations({ page: 1, pageSize: 100 })

  const createConversation = useCreateConversation()

  // Handle sellerId from URL - find or create conversation
  useEffect(() => {
    // Skip if no sellerId, already on a chat, or still loading
    if (!sellerId || chatId || conversationsLoading || isCreatingConversation) {
      return
    }

    const sellerIdNum = parseInt(sellerId)
    if (isNaN(sellerIdNum)) {
      // Invalid sellerId, redirect to chat list
      navigate('/chat', { replace: true })
      return
    }

    // Don't create conversation with yourself (compare as numbers)
    const currentUserId = typeof user?.id === 'string' ? parseInt(user.id) : user?.id
    if (sellerIdNum === currentUserId) {
      navigate('/chat', { replace: true })
      return
    }

    // Check if conversation with this seller already exists
    const existingConversation = conversationsData?.items?.find(conv => {
      // Check in otherUser field (compare as numbers)
      const otherUserId = conv.otherUser?.userId
      if (otherUserId === sellerIdNum) {
        return true
      }
      // Fallback: check in participants
      return conv.participants?.some(
        p => p.userId === sellerIdNum && p.userId !== currentUserId
      )
    })

    if (existingConversation) {
      // Navigate to existing conversation
      navigate(`/chat/${existingConversation.id}`, { replace: true })
    } else {
      // Create new conversation
      setIsCreatingConversation(true)
      createConversation.mutate(
        { otherUserId: sellerIdNum },
        {
          onSuccess: conversation => {
            navigate(`/chat/${conversation.id}`, { replace: true })
            setIsCreatingConversation(false)
          },
          onError: () => {
            // On error, just show chat list
            navigate('/chat', { replace: true })
            setIsCreatingConversation(false)
          },
        }
      )
    }
  }, [
    sellerId,
    chatId,
    conversationsData,
    conversationsLoading,
    isCreatingConversation,
    user?.id,
    navigate,
    createConversation,
  ])

  // Show loading when creating conversation or checking for existing
  const isInitializing = sellerId && !chatId && (conversationsLoading || isCreatingConversation)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col container mx-auto px-4 py-8 overflow-hidden">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Tin nhắn</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Liên hệ trực tiếp với người bán để được tư vấn và hỗ trợ tốt nhất
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-success" />
              <span>Bảo mật tuyệt đối</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>Phản hồi nhanh</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-warning" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1 h-full max-h-[calc(100vh-280px)]">
            <Card className="h-full flex flex-col">
              <CardContent className="p-4 h-full flex flex-col overflow-hidden">
                <div className="mb-4 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm cuộc trò chuyện..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                  <ChatList searchQuery={searchQuery} selectedChatId={chatId} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 order-1 lg:order-2 h-full max-h-[calc(100vh-280px)]">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col overflow-hidden">
                {isInitializing ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Đang mở cuộc trò chuyện...
                      </p>
                    </div>
                  </div>
                ) : chatId ? (
                  <ChatWindow chatId={chatId} />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Chọn cuộc trò chuyện
                      </h3>
                      <p className="text-muted-foreground">
                        Chọn một cuộc trò chuyện từ danh sách để bắt đầu chat
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
