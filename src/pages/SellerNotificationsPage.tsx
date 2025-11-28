import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  Search, 
  X, 
  ShoppingBag,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Home
} from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'order' | 'product' | 'payment' | 'system' | 'promotion'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, unknown>
}

// Mock data for seller notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới #ORD001',
    message: 'Bạn có đơn hàng mới từ khách hàng Nguyễn Văn A',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD001',
    metadata: { orderId: 'ORD001', amount: 2500000 }
  },
  {
    id: '2',
    type: 'order',
    title: 'Đơn hàng đã được thanh toán',
    message: 'Đơn hàng #ORD002 đã được thanh toán thành công',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD002',
    metadata: { orderId: 'ORD002', amount: 1500000 }
  },
  {
    id: '3',
    type: 'product',
    title: 'Sản phẩm sắp hết hàng',
    message: 'iPhone 14 Pro Max 256GB chỉ còn 5 sản phẩm trong kho',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/seller/products',
    metadata: { productId: 'prod-1', stock: 5 }
  },
  {
    id: '4',
    type: 'order',
    title: 'Đơn hàng đã được xác nhận',
    message: 'Khách hàng đã xác nhận nhận hàng cho đơn hàng #ORD003',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD003',
    metadata: { orderId: 'ORD003' }
  },
  {
    id: '5',
    type: 'payment',
    title: 'Thanh toán thành công',
    message: 'Bạn đã nhận được 2.500.000đ từ đơn hàng #ORD001',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/orders/ORD001',
    metadata: { orderId: 'ORD001', amount: 2500000 }
  },
  {
    id: '6',
    type: 'product',
    title: 'Sản phẩm đã hết hàng',
    message: 'MacBook Air M2 13 inch đã hết hàng trong kho',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/seller/products',
    metadata: { productId: 'prod-2', stock: 0 }
  },
  {
    id: '7',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống đã được cập nhật với nhiều tính năng mới',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    type: 'promotion',
    title: 'Gói đẩy sản phẩm sắp hết hạn',
    message: 'Gói đẩy cho iPhone 14 Pro Max sẽ hết hạn trong 2 ngày',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/promoted-products/1',
    metadata: { productId: 'prod-1' }
  }
]

const TYPE_INFO = {
  order: {
    icon: ShoppingBag,
    label: 'Đơn hàng',
    color: '#3B82F6'
  },
  product: {
    icon: Package,
    label: 'Sản phẩm',
    color: '#10B981'
  },
  payment: {
    icon: DollarSign,
    label: 'Thanh toán',
    color: '#8B5CF6'
  },
  system: {
    icon: AlertTriangle,
    label: 'Hệ thống',
    color: '#F59E0B'
  },
  promotion: {
    icon: Bell,
    label: 'Khuyến mãi',
    color: '#EF4444'
  }
}

export default function SellerNotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
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

    // Filter by tab
    if (selectedTab === 'unread') {
      return !notification.isRead
    }
    if (selectedTab !== 'all') {
      return notification.type === selectedTab
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
    toast.success('Đã làm mới danh sách')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-primary/10"
                aria-label="Về trang chủ"
              >
                <Home className="h-5 w-5" />
              </Button>
              <Bell className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white px-3 py-1">
                  {unreadCount} chưa đọc
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đọc tất cả
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
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
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              Tất cả
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Chưa đọc
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="order">Đơn hàng</TabsTrigger>
            <TabsTrigger value="product">Sản phẩm</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          </TabsList>
        </Tabs>

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
                          {notification.metadata?.amount && typeof notification.metadata.amount === 'number' && (
                            <Badge variant="outline" className="text-xs">
                              {formatPrice(notification.metadata.amount)}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
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
      </div>
    </div>
  )
}

