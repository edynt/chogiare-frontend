import { useState, useEffect, useRef } from 'react'
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
  const { chatId: urlChatId } = useParams<{ chatId?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  // Local state for active chatId (allows immediate update without URL change)
  const [activeChatId, setActiveChatId] = useState<string | undefined>(urlChatId)

  // Get sellerId from URL query params
  const sellerId = searchParams.get('sellerId')

  // Sync activeChatId with URL param when URL changes
  useEffect(() => {
    if (urlChatId) {
      setActiveChatId(urlChatId)
    }
  }, [urlChatId])

  // Fetch conversations to check if conversation with seller already exists
  // Only fetch when user is logged in
  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations({ page: 1, pageSize: 100 }, { enabled: !!user?.id })

  const createConversation = useCreateConversation()

  // Track if we've already processed this sellerId to prevent re-runs
  const processedSellerIdRef = useRef<string | null>(null)

  // Handle sellerId from URL - find or create conversation
  useEffect(() => {
    // Skip if no sellerId or already on a chat
    if (!sellerId || activeChatId) {
      return
    }

    // User must be logged in to chat - check first before loading
    if (!user?.id) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, { replace: true })
      return
    }

    // Skip if still loading conversations or currently creating
    if (conversationsLoading || isCreatingConversation) {
      return
    }

    // Skip if we've already processed this sellerId (prevent duplicate API calls)
    // But only if conversationsData is available (not first load)
    if (processedSellerIdRef.current === sellerId && conversationsData) {
      return
    }

    const sellerIdNum = parseInt(sellerId)
    if (isNaN(sellerIdNum)) {
      // Invalid sellerId, redirect to chat list
      navigate('/chat', { replace: true })
      return
    }

    // Don't create conversation with yourself (compare as numbers)
    const currentUserId = typeof user.id === 'string' ? parseInt(user.id) : user.id
    if (sellerIdNum === currentUserId) {
      navigate('/chat', { replace: true })
      return
    }

    // Mark this sellerId as processed
    processedSellerIdRef.current = sellerId

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

    if (existingConversation && existingConversation.id != null) {
      // Set active chat immediately - this will render ChatWindow
      const chatId = String(existingConversation.id)
      setActiveChatId(chatId)
      // Update URL without causing remount (same component, different route)
      window.history.replaceState(null, '', `/chat/${chatId}`)
    } else {
      // Create new conversation
      setIsCreatingConversation(true)
      createConversation.mutate(
        { otherUserId: sellerIdNum },
        {
          onSuccess: conversation => {
            // Validate conversation.id exists
            if (conversation?.id != null) {
              // Set active chat immediately - this will render ChatWindow
              const chatId = String(conversation.id)
              setActiveChatId(chatId)
              // Update URL without causing remount
              window.history.replaceState(null, '', `/chat/${chatId}`)
            }
          },
          onError: (error) => {
            console.error('Failed to create conversation:', error)
            // Clear sellerId from URL to prevent infinite retry
            window.history.replaceState(null, '', '/chat')
          },
          onSettled: () => {
            // Always reset creating state
            setIsCreatingConversation(false)
          },
        }
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellerId,
    activeChatId,
    conversationsData,
    conversationsLoading,
    isCreatingConversation,
    user?.id,
    navigate,
  ])

  // Show loading only when:
  // - We have sellerId AND no active chat AND (loading conversations OR creating conversation)
  // - AND we haven't processed this sellerId yet
  const isInitializing = sellerId && !activeChatId &&
    (conversationsLoading || isCreatingConversation) &&
    processedSellerIdRef.current !== sellerId

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
                  <ChatList searchQuery={searchQuery} selectedChatId={activeChatId} />
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
                ) : activeChatId ? (
                  <ChatWindow chatId={activeChatId} />
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
