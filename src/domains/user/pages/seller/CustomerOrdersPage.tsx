import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Eye,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { useInfiniteUserOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import type { Order as OrderType } from '@user/api/orders'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@shared/components/ui/loading'

// Helper function to get total quantity from order items
const getTotalQuantity = (order: OrderType) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận',
    color: '#F59E0B',
    icon: Clock,
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-500',
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#3B82F6',
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-500',
  },
  ready: {
    label: 'Sẵn sàng lấy',
    color: '#10B981',
    icon: Package,
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-500',
  },
  completed: {
    label: 'Hoàn thành',
    color: '#10B981',
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-500',
  },
}

export default function CustomerOrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showConfirmReceivedDialog, setShowConfirmReceivedDialog] =
    useState(false)

  const {
    data: ordersData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteUserOrders(20)
  const updateOrderStatusMutation = useUpdateOrderStatus()

  // Flatten all pages into a single array
  const orders = ordersData?.pages.flatMap(page => page.items || []).filter(Boolean) || []
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOrdersByStatus = (status: string) => {
    if (status === 'pending') return orders.filter(o => o.status === 'pending')
    if (status === 'confirmed')
      return orders.filter(
        o => o.status === 'confirmed' || o.status === 'preparing'
      )
    if (status === 'ready') return orders.filter(o => o.status === 'ready')
    if (status === 'completed')
      return orders.filter(o => o.status === 'completed')
    return []
  }

  const handleConfirmReceived = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShowConfirmReceivedDialog(true)
  }

  const handleConfirmReceivedOrder = async () => {
    if (!selectedOrderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: selectedOrderId,
        status: 'completed',
      })
      toast.success('Đã xác nhận nhận hàng thành công')
      setShowConfirmReceivedDialog(false)
      setSelectedOrderId(null)
      refetch()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận nhận hàng')
      console.error('Error confirming received order:', error)
    }
  }

  const handleRefresh = async () => {
    await refetch()
    toast.success('Đã làm mới danh sách đơn hàng')
  }

  // Intersection Observer để detect khi scroll đến cuối
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin: '200px', // Load trước khi scroll đến cuối 200px
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const confirmedCount = orders.filter(
    o => o.status === 'confirmed' || o.status === 'preparing'
  ).length
  const readyCount = orders.filter(o => o.status === 'ready').length
  const completedCount = orders.filter(o => o.status === 'completed').length

  const totalSpent = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Đang tải danh sách đơn hàng...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Đơn hàng của tôi
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Theo dõi và quản lý tất cả đơn hàng của bạn
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={updateOrderStatusMutation.isPending}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <RefreshCw
                  className={cn(
                    'h-4 w-4 mr-2',
                    updateOrderStatusMutation.isPending && 'animate-spin'
                  )}
                />
                Làm mới
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Chờ xác nhận
                      </p>
                      <p className="text-2xl font-bold text-amber-700">
                        {pendingCount}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Đang xử lý
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {confirmedCount}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Sẵn sàng lấy
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {readyCount}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Đã chi tiêu
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatPrice(totalSpent)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger
                value="pending"
                className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Chờ xác nhận
                {pendingCount > 0 && (
                  <Badge className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="confirmed"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Đã xác nhận
                {confirmedCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {confirmedCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sẵn sàng lấy
                {readyCount > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {readyCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Hoàn thành
                {completedCount > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {completedCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {['pending', 'confirmed', 'ready', 'completed'].map(status => {
              const statusOrders = getOrdersByStatus(status)
              const statusConfig =
                STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
              const StatusIcon = statusConfig.icon

              return (
                <TabsContent
                  key={status}
                  value={status}
                  className="space-y-4 mt-6"
                >
                  {statusOrders.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Chưa có đơn hàng
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                          Các đơn hàng {statusConfig.label.toLowerCase()} sẽ
                          hiển thị ở đây
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {statusOrders.map(order => (
                        <Card
                          key={order.id}
                          className={cn(
                            'group cursor-pointer transition-all duration-200 hover:shadow-md border overflow-hidden',
                            statusConfig.borderColor,
                            'hover:border-primary/50'
                          )}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              {/* Left: Order Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-base font-bold text-foreground">
                                    #{order.id}
                                  </h3>
                                  <Badge
                                    className={cn(
                                      'flex items-center gap-1 px-2 py-0.5 text-xs font-medium',
                                      statusConfig.bgColor,
                                      statusConfig.textColor,
                                      statusConfig.borderColor,
                                      'border'
                                    )}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig.label}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(order.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ShoppingBag className="h-3 w-3" />
                                    {getTotalQuantity(order)} sản phẩm
                                  </span>
                                </div>
                              </div>

                              {/* Right: Price and Action */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-primary">
                                    {formatPrice(order.total)}
                                  </p>
                                </div>

                                {order.status === 'ready' ? (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleConfirmReceived(order.id)
                                    }}
                                    disabled={
                                      updateOrderStatusMutation.isPending
                                    }
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Đã nhận
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-8"
                                    onClick={e => {
                                      e.stopPropagation()
                                      navigate(`/orders/${order.id}`)
                                    }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Chi tiết
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Load More Sentinel */}
                  {statusOrders.length > 0 && (
                    <div
                      ref={loadMoreRef}
                      className="h-20 flex items-center justify-center"
                    >
                      {isFetchingNextPage && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm">
                            Đang tải thêm đơn hàng...
                          </span>
                        </div>
                      )}
                      {!hasNextPage && orders.length > 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          Đã hiển thị tất cả đơn hàng
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Confirm Received Dialog */}
      <Dialog
        open={showConfirmReceivedDialog}
        onOpenChange={setShowConfirmReceivedDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Xác nhận đã nhận hàng</DialogTitle>
            <DialogDescription>
              Bạn đã nhận được đơn hàng <strong>{selectedOrderId}</strong>? Hành
              động này sẽ hoàn tất đơn hàng.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmReceivedDialog(false)
                setSelectedOrderId(null)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReceivedOrder}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {updateOrderStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
