import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatList } from '@/components/chat/ChatList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tin nhắn</h1>
          <p className="text-muted-foreground">
            Liên hệ với người bán và quản lý cuộc trò chuyện của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="mb-4">
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
                
                <div className="flex-1 overflow-hidden">
                  <ChatList searchQuery={searchQuery} selectedChatId={chatId} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                {chatId ? (
                  <ChatWindow chatId={chatId} />
                ) : (
                  <div className="h-full flex items-center justify-center">
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
