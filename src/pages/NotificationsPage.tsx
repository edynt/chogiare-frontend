import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Search, 
  X, 
  ShoppingBag,
  LocalOffer,
  Inventory2,
  Info,
  Payment,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'order' | 'promo' | 'product' | 'system' | 'payment'
  title: string
  message: string
  detailMessage?: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  imageUrl?: string
  metadata?: Record<string, any>
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng của bạn đã được xác nhận',
    message: 'Đơn hàng #ORD001 đã được xác nhận và đang được chuẩn bị',
    detailMessage: 'Đơn hàng #ORD001 của bạn đã được xác nhận thành công. Chúng tôi đang chuẩn bị hàng và sẽ giao đến bạn trong 2-3 ngày tới.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD001',
    metadata: { orderId: 'ORD001' }
  },
  {
    id: '2',
    type: 'promo',
    title: 'Khuyến mãi đặc biệt - Giảm 50%',
    message: 'Giảm giá lên đến 50% cho tất cả sản phẩm điện tử',
    detailMessage: 'Chương trình khuyến mãi đặc biệt dành cho bạn! Giảm giá lên đến 50% cho tất cả sản phẩm điện tử.',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600'
  },
  {
    id: '3',
    type: 'product',
    title: 'Sản phẩm đã có hàng trở lại',
    message: 'iPhone 15 Pro Max đã có hàng trở lại trong kho',
    detailMessage: 'Sản phẩm iPhone 15 Pro Max mà bạn đã quan tâm hiện đã có hàng trở lại trong kho.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'
  },
  {
    id: '4',
    type: 'order',
    title: 'Đơn hàng đang được giao',
    message: 'Đơn hàng #ORD002 đang được giao đến bạn',
    detailMessage: 'Đơn hàng #ORD002 của bạn đã được đóng gói và đang trên đường giao đến bạn.',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD002',
    metadata: { orderId: 'ORD002', trackingNumber: 'VN123456789' }
  },
  {
    id: '5',
    type: 'promo',
    title: 'Chúc mừng sinh nhật!',
    message: 'Bạn có phiếu giảm giá 20% cho đơn hàng tiếp theo',
    detailMessage: 'Chúc mừng sinh nhật bạn! Chúng tôi gửi tặng bạn phiếu giảm giá 20% cho đơn hàng tiếp theo.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    type: 'payment',
    title: 'Thanh toán thành công',
    message: 'Đơn hàng #ORD003 đã được thanh toán thành công',
    detailMessage: 'Đơn hàng #ORD003 của bạn đã được thanh toán thành công qua chuyển khoản ngân hàng.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { orderId: 'ORD003', amount: 1250000, transactionId: 'TXN001234' }
  },
  {
    id: '7',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Ứng dụng đã được cập nhật với nhiều tính năng mới',
    detailMessage: 'Chúng tôi đã cập nhật ứng dụng với nhiều tính năng mới và cải thiện hiệu suất.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const TYPE_INFO = {
  order: {
    icon: ShoppingBag,
    label: 'Đơn hàng',
    color: '#C81E1E'
  },
  promo: {
    icon: LocalOffer,
    label: 'Khuyến mãi',
    color: '#F59E0B'
  },
  product: {
    icon: Inventory2,
    label: 'Sản phẩm',
    color: '#10B981'
  },
  system: {
    icon: Info,
    label: 'Hệ thống',
    color: '#3B82F6'
  },
  payment: {
    icon: Payment,
    label: 'Thanh toán',
    color: '#8B5CF6'
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    return `${diffDays} ngày trước`
  }

  const filteredNotifications = notifications.filter(notification => {
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!notification.title.toLowerCase().includes(query) && 
          !notification.message.toLowerCase().includes(query)) {
        return false
      }
    }

    // Filter by type
    if (selectedFilter !== 'Tất cả') {
      const filterMap: Record<string, Notification['type']> = {
        'Đơn hàng': 'order',
        'Khuyến mãi': 'promo',
        'Sản phẩm': 'product',
        'Thanh toán': 'payment',
        'Hệ thống': 'system'
      }
      return notification.type === filterMap[selectedFilter]
    }

    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
    toast.success('Đã đánh dấu là đã đọc')
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    toast.success('Đã đánh dấu tất cả là đã đọc')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Thông báo</h1>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-white px-3 py-1">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Đọc tất cả
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['Tất cả', 'Đơn hàng', 'Khuyến mãi', 'Sản phẩm', 'Thanh toán', 'Hệ thống'].map((filter) => {
              const isSelected = selectedFilter === filter
              return (
                <Button
                  key={filter}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`whitespace-nowrap ${
                    isSelected ? 'bg-primary text-white' : ''
                  }`}
                >
                  {filter}
                </Button>
              )
            })}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    {searchQuery ? (
                      <Search className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Bell className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'Không tìm thấy thông báo' : 'Chưa có thông báo'}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery 
                      ? 'Thử tìm kiếm với từ khóa khác'
                      : 'Các thông báo mới sẽ hiển thị ở đây'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map(notification => {
                const typeInfo = TYPE_INFO[notification.type]
                const Icon = typeInfo.icon
                return (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.isRead 
                        ? 'border-2 border-primary/30 bg-primary/5' 
                        : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: `${typeInfo.color}15`,
                            color: typeInfo.color
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className={`font-semibold text-base ${
                              !notification.isRead ? 'text-primary' : ''
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2"
                                style={{ backgroundColor: typeInfo.color }}
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: `${typeInfo.color}15`,
                                color: typeInfo.color,
                                borderColor: `${typeInfo.color}30`
                              }}
                            >
                              {typeInfo.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
