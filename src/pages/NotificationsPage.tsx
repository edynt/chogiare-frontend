import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Check, X, AlertCircle, Info, ShoppingCart, Package, MessageCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'order' | 'product' | 'message' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng mới #ORD001 từ khách hàng Nguyễn Văn A',
    isRead: false,
    createdAt: '2024-03-10T10:30:00Z',
    actionUrl: '/orders/ORD001'
  },
  {
    id: '2',
    type: 'product',
    title: 'Sản phẩm sắp hết hàng',
    message: 'iPhone 14 Pro Max chỉ còn 2 sản phẩm trong kho',
    isRead: false,
    createdAt: '2024-03-10T09:15:00Z',
    actionUrl: '/inventory'
  },
  {
    id: '3',
    type: 'message',
    title: 'Tin nhắn mới',
    message: 'Khách hàng Trần Thị B đã gửi tin nhắn về sản phẩm MacBook Pro',
    isRead: true,
    createdAt: '2024-03-09T16:45:00Z',
    actionUrl: '/chat'
  },
  {
    id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống đã được cập nhật với các tính năng mới',
    isRead: true,
    createdAt: '2024-03-09T14:20:00Z'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />
      case 'product':
        return <Package className="h-4 w-4 text-orange-500" />
      case 'message':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'system':
        return <Info className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'Đơn hàng'
      case 'product':
        return 'Sản phẩm'
      case 'message':
        return 'Tin nhắn'
      case 'system':
        return 'Hệ thống'
      default:
        return 'Khác'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.isRead
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Thông báo</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã được đọc'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
              <TabsTrigger value="order">Đơn hàng</TabsTrigger>
              <TabsTrigger value="product">Sản phẩm</TabsTrigger>
              <TabsTrigger value="message">Tin nhắn</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không có thông báo</h3>
                    <p className="text-muted-foreground text-center">
                      {activeTab === 'unread' 
                        ? 'Tất cả thông báo đã được đọc'
                        : 'Chưa có thông báo nào trong danh mục này'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map(notification => (
                  <Card key={notification.id} className={`${!notification.isRead ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-primary' : ''}`}>
                              {notification.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {getNotificationTypeLabel(notification.type)}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={notification.actionUrl}>Xem</Link>
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
