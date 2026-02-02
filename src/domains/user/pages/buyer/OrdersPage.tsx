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
import { Textarea } from '@shared/components/ui/textarea'
import {
  ShoppingBag,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  Eye,
  Calendar,
  CreditCard,
  ImageIcon,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useInfiniteUserOrders,
  useConfirmOrder,
  useUpdateOrderStatus,
} from '@/hooks/useOrders'
import type { Order as OrderType } from '@user/api/orders'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@shared/components/ui/loading'

// Helper function to get total quantity from order items
const getTotalQuantity = (order: OrderType) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const STATUS_CONFIG = {
  pending: {
    label: 'Cần xác nhận',
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
  preparing: {
    label: 'Đang chuẩn bị',
    color: '#8B5CF6',
    icon: Package,
    bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    badgeColor: 'bg-purple-500',
  },
  ready: {
    label: 'Sẵn sàng',
    color: '#10B981',
    icon: CheckCircle,
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
  cancelled: {
    label: 'Đã hủy',
    color: '#EF4444',
    icon: XCircle,
    bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-500',
  },
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [sellerNotes, setSellerNotes] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const {
    data: ordersData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteUserOrders(20)
  const confirmOrderMutation = useConfirmOrder()
  const updateOrderStatusMutation = useUpdateOrderStatus()

  // Flatten all pages into a single array, filter out undefined values
  const orders =
    ordersData?.pages.flatMap(page => page.items || []).filter(Boolean) || []
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
    if (status === 'all') return orders
    if (status === 'pending') return orders.filter(o => o.status === 'pending')
    if (status === 'confirmed')
      return orders.filter(o => o.status === 'confirmed')
    if (status === 'preparing')
      return orders.filter(o => o.status === 'preparing')
    if (status === 'ready') return orders.filter(o => o.status === 'ready')
    if (status === 'completed')
      return orders.filter(o => o.status === 'completed')
    if (status === 'cancelled')
      return orders.filter(o => o.status === 'cancelled')
    return []
  }

  const handleConfirm = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShowConfirmDialog(true)
  }

  const handleConfirmOrder = async () => {
    if (!selectedOrderId) return

    try {
      await confirmOrderMutation.mutateAsync({
        id: selectedOrderId,
        sellerNotes: sellerNotes || undefined,
      })
      toast.success('Đã xác nhận đơn hàng thành công')
      setShowConfirmDialog(false)
      setSellerNotes('')
      setSelectedOrderId(null)
      refetch()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận đơn hàng')
      console.error('Error confirming order:', error)
    }
  }

  const handleCancel = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShowCancelDialog(true)
  }

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: selectedOrderId,
        status: 'cancelled',
      })
      toast.success('Đã hủy đơn hàng')
      setShowCancelDialog(false)
      setCancelReason('')
      setSelectedOrderId(null)
      refetch()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng')
      console.error('Error cancelling order:', error)
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
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length
  const readyCount = orders.filter(o => o.status === 'ready').length
  const completedCount = orders.filter(o => o.status === 'completed').length
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length

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
                  Quản lý đơn hàng
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Theo dõi và quản lý tất cả đơn hàng của bạn
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={
                  confirmOrderMutation.isPending ||
                  updateOrderStatusMutation.isPending
                }
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <RefreshCw
                  className={cn(
                    'h-4 w-4 mr-2',
                    (confirmOrderMutation.isPending ||
                      updateOrderStatusMutation.isPending) &&
                      'animate-spin'
                  )}
                />
                Làm mới
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Chờ xác nhận */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Chờ xác nhận
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-amber-700">
                        {pendingCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Đã xác nhận */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Đã xác nhận
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-blue-700">
                        {confirmedCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Đang chuẩn bị */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Đang chuẩn bị
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-purple-700">
                        {preparingCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Package className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sẵn sàng lấy hàng */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-50 to-teal-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Sẵn sàng lấy hàng
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-cyan-700">
                        {readyCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Đã hoàn thành */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Đã hoàn thành
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-green-700">
                        {completedCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Đã huỷ */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-rose-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        Đã huỷ
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-red-700">
                        {cancelledCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
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
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 h-auto p-1 bg-muted/50">
              <TabsTrigger
                value="all"
                className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Tất cả
                {orders.length > 0 && (
                  <Badge className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                    {orders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Cần xác nhận
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
                value="preparing"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Đang chuẩn bị
                {preparingCount > 0 && (
                  <Badge className="ml-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {preparingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sẵn sàng
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
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Đã hủy
                {cancelledCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {cancelledCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab "Tất cả" - Hiển thị tất cả đơn hàng */}
            <TabsContent value="all" className="space-y-4 mt-6">
              {orders.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Chưa có đơn hàng
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Các đơn hàng của bạn sẽ hiển thị ở đây
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {orders.map(order => {
                    const statusConfig =
                      STATUS_CONFIG[
                        order.status as keyof typeof STATUS_CONFIG
                      ] || STATUS_CONFIG.pending
                    const StatusIcon = statusConfig.icon
                    const isPaid =
                      order.paymentStatus === 'completed' ||
                      order.paymentStatus === 'paid'
                    const getPaymentStatusLabel = () => {
                      if (isPaid) return 'Đã thanh toán'
                      if (order.paymentStatus === 'pending')
                        return 'Chờ thanh toán'
                      if (order.paymentStatus === 'failed')
                        return 'Thanh toán thất bại'
                      return 'Chưa thanh toán'
                    }

                    return (
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

                              <div className="space-y-1 mb-2">
                                {/* Customer Info - Compact */}
                                <div className="flex items-center gap-3 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium text-foreground">
                                      {order.userName || 'Khách hàng'}
                                    </span>
                                  </div>
                                  {order.userEmail && (
                                    <>
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          {order.userEmail}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Payment Status and Info - Compact */}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-3 w-3" />
                                    <Badge
                                      variant={isPaid ? 'default' : 'secondary'}
                                      className={cn(
                                        'text-xs px-1.5 py-0.5 h-auto font-medium',
                                        isPaid
                                          ? 'bg-green-100 text-green-700 border-green-200'
                                          : 'bg-amber-100 text-amber-700 border-amber-200'
                                      )}
                                    >
                                      {getPaymentStatusLabel()}
                                    </Badge>
                                  </div>
                                  {isPaid && order.paymentProofUrl && (
                                    <>
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <a
                                        href={order.paymentProofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <ImageIcon className="h-3 w-3" />
                                        Ảnh thanh toán
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>
                                    </>
                                  )}
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(order.createdAt)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ShoppingBag className="h-3 w-3" />
                                    {getTotalQuantity(order)} sản phẩm
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Price and Action */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  {formatPrice(order.total)}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {order.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleConfirm(order.id)
                                      }}
                                      disabled={
                                        confirmOrderMutation.isPending ||
                                        updateOrderStatusMutation.isPending
                                      }
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Xác nhận
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 text-xs h-8"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleCancel(order.id)
                                      }}
                                      disabled={
                                        confirmOrderMutation.isPending ||
                                        updateOrderStatusMutation.isPending
                                      }
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Hủy
                                    </Button>
                                  </>
                                )}
                                {(order.status === 'confirmed' ||
                                  order.status === 'preparing' ||
                                  order.status === 'ready') && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary/10 text-xs h-8"
                                    onClick={e => {
                                      e.stopPropagation()
                                      navigate(`/orders/${order.id}`)
                                    }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Chi tiết
                                  </Button>
                                )}
                                {(order.status === 'completed' ||
                                  order.status === 'cancelled') && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary/10 text-xs h-8"
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
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Load More Sentinel */}
              {orders.length > 0 && (
                <div
                  ref={loadMoreRef}
                  className="h-20 flex items-center justify-center"
                >
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">Đang tải thêm đơn hàng...</span>
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

            {[
              'pending',
              'confirmed',
              'preparing',
              'ready',
              'completed',
              'cancelled',
            ].map(status => {
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
                      {statusOrders.map(order => {
                        const isPaid =
                          order.paymentStatus === 'completed' ||
                          order.paymentStatus === 'paid'
                        const getPaymentStatusLabel = () => {
                          if (isPaid) return 'Đã thanh toán'
                          if (order.paymentStatus === 'pending')
                            return 'Chờ thanh toán'
                          if (order.paymentStatus === 'failed')
                            return 'Thanh toán thất bại'
                          return 'Chưa thanh toán'
                        }

                        return (
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

                                  <div className="space-y-1 mb-2">
                                    {/* Customer Info - Compact */}
                                    <div className="flex items-center gap-3 text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                        <span className="font-medium text-foreground">
                                          {order.userName || 'Khách hàng'}
                                        </span>
                                      </div>
                                      {order.userEmail && (
                                        <>
                                          <span className="text-muted-foreground">
                                            •
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                              {order.userEmail}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Payment Status and Info - Compact */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <CreditCard className="h-3 w-3" />
                                        <Badge
                                          variant={
                                            isPaid ? 'default' : 'secondary'
                                          }
                                          className={cn(
                                            'text-xs px-1.5 py-0.5 h-auto font-medium',
                                            isPaid
                                              ? 'bg-green-100 text-green-700 border-green-200'
                                              : 'bg-amber-100 text-amber-700 border-amber-200'
                                          )}
                                        >
                                          {getPaymentStatusLabel()}
                                        </Badge>
                                      </div>
                                      {isPaid && order.paymentProofUrl && (
                                        <>
                                          <span className="text-muted-foreground">
                                            •
                                          </span>
                                          <a
                                            href={order.paymentProofUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-primary hover:underline"
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <ImageIcon className="h-3 w-3" />
                                            Ảnh thanh toán
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        </>
                                      )}
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(order.createdAt)}
                                      </span>
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <ShoppingBag className="h-3 w-3" />
                                        {getTotalQuantity(order)} sản phẩm
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Price and Action */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-primary">
                                      {formatPrice(order.total)}
                                    </p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2">
                                    {order.status === 'pending' && (
                                      <>
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                          onClick={e => {
                                            e.stopPropagation()
                                            handleConfirm(order.id)
                                          }}
                                          disabled={
                                            confirmOrderMutation.isPending ||
                                            updateOrderStatusMutation.isPending
                                          }
                                        >
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Xác nhận
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 text-xs h-8"
                                          onClick={e => {
                                            e.stopPropagation()
                                            handleCancel(order.id)
                                          }}
                                          disabled={
                                            confirmOrderMutation.isPending ||
                                            updateOrderStatusMutation.isPending
                                          }
                                        >
                                          <XCircle className="h-3 w-3 mr-1" />
                                          Hủy
                                        </Button>
                                      </>
                                    )}
                                    {(order.status === 'confirmed' ||
                                      order.status === 'preparing' ||
                                      order.status === 'ready') && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10 text-xs h-8"
                                        onClick={e => {
                                          e.stopPropagation()
                                          navigate(`/orders/${order.id}`)
                                        }}
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        Chi tiết
                                      </Button>
                                    )}
                                    {(order.status === 'completed' ||
                                      order.status === 'cancelled') && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10 text-xs h-8"
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
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
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

      {/* Confirm Order Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng{' '}
              <strong>{selectedOrderId}</strong>? Đơn hàng sẽ chuyển sang trạng
              thái "Đã xác nhận".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Nhập ghi chú cho đơn hàng..."
                value={sellerNotes}
                onChange={e => setSellerNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setSellerNotes('')
                setSelectedOrderId(null)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={confirmOrderMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {confirmOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng{' '}
              <strong>{selectedOrderId}</strong>? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Lý do hủy (tùy chọn)
              </label>
              <Textarea
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false)
                setCancelReason('')
                setSelectedOrderId(null)
              }}
            >
              Không
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={updateOrderStatusMutation.isPending}
            >
              {updateOrderStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Hủy đơn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
