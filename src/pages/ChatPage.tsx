import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatList } from '@/components/chat/ChatList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, Search, Zap, Shield, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  
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
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                {chatId ? (
                  <ChatWindow chatId={chatId} />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chọn cuộc trò chuyện</h3>
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