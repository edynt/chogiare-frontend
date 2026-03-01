import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import {
  Bell,
  Search,
  X,
  ShoppingBag,
  Tag,
  Package,
  Info,
  CreditCard,
  CheckCircle,
  RefreshCw,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications'
import type { Notification } from '@user/api/notifications'

const TYPE_INFO = {
  order: {
    icon: ShoppingBag,
    label: 'Đơn hàng',
    color: '#C81E1E',
  },
  promotion: {
    icon: Tag,
    label: 'Khuyến mãi',
    color: '#F59E0B',
  },
  product: {
    icon: Package,
    label: 'Sản phẩm',
    color: '#10B981',
  },
  system: {
    icon: Info,
    label: 'Hệ thống',
    color: '#3B82F6',
  },
  payment: {
    icon: CreditCard,
    label: 'Thanh toán',
    color: '#8B5CF6',
  },
  message: {
    icon: MessageCircle,
    label: 'Tin nhắn',
    color: '#3B82F6',
  },
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useNotifications({
    page: 1,
    pageSize: 100,
  })
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()

  const notifications = notificationsData?.items || []
  const unreadCount = notificationsData?.unreadCount || 0

  const getTimeAgo = (dateString: string) => {
    const timestamp = Number(dateString)
    const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp)
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
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !notification.title.toLowerCase().includes(query) &&
        !notification.message.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (selectedFilter !== 'Tất cả') {
      const filterMap: Record<string, Notification['type']> = {
        'Đơn hàng': 'order',
        'Khuyến mãi': 'promotion',
        'Sản phẩm': 'product',
        'Thanh toán': 'payment',
        'Hệ thống': 'system',
        'Tin nhắn': 'message',
      }
      return notification.type === filterMap[selectedFilter]
    }

    return true
  })

  const markAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id)
    } catch {
      toast.error('Không thể đánh dấu đã đọc')
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      toast.success('Đã đánh dấu tất cả là đã đọc')
    } catch {
      toast.error('Không thể đánh dấu tất cả là đã đọc')
    }
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success('Đã làm mới danh sách')
    } catch {
      toast.error('Không thể làm mới danh sách')
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
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
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {markAllAsReadMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Đọc tất cả'}
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
            {[
              'Tất cả',
              'Đơn hàng',
              'Khuyến mãi',
              'Sản phẩm',
              'Thanh toán',
              'Hệ thống',
              'Tin nhắn',
            ].map(filter => {
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
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-48 bg-muted rounded" />
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="h-3 w-32 bg-muted rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
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
                  {searchQuery
                    ? 'Không tìm thấy thông báo'
                    : 'Chưa có thông báo'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Các thông báo mới sẽ hiển thị ở đây'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => {
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
                            color: typeInfo.color,
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3
                              className={`font-semibold text-base ${
                                !notification.isRead ? 'text-primary' : ''
                              }`}
                            >
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
                                borderColor: `${typeInfo.color}30`,
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
              })}
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Làm mới
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
