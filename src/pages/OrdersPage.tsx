import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShoppingBag,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { useStoreOrders, useConfirmOrder, useUpdateOrderStatus } from '@/hooks/useOrders'
import type { Order as OrderType } from '@/api/orders'

// Helper function to get total quantity from order items
const getTotalQuantity = (order: OrderType) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const STATUS_CONFIG = {
  pending: {
    label: 'Cần xác nhận',
    color: '#F59E0B',
    icon: Clock,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#3B82F6',
    icon: CheckCircle,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  preparing: {
    label: 'Đang chuẩn bị',
    color: '#8B5CF6',
    icon: Package,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  ready: {
    label: 'Sẵn sàng',
    color: '#10B981',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  completed: {
    label: 'Hoàn thành',
    color: '#10B981',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#EF4444',
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  }
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [sellerNotes, setSellerNotes] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  
  // Get store ID from auth context or use a default
  // TODO: Replace with actual store ID from auth context
  const storeId = 'default-store-id'
  
  const { data: ordersData, isLoading, refetch } = useStoreOrders(storeId, { page: 1, pageSize: 100 })
  const confirmOrderMutation = useConfirmOrder()
  const updateOrderStatusMutation = useUpdateOrderStatus()
  
  const orders = ordersData?.items || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOrdersByStatus = (status: string) => {
    if (status === 'pending') return orders.filter(o => o.status === 'pending')
    if (status === 'confirmed') return orders.filter(o => o.status === 'confirmed')
    if (status === 'preparing') return orders.filter(o => o.status === 'preparing')
    if (status === 'ready') return orders.filter(o => o.status === 'ready')
    if (status === 'completed') return orders.filter(o => o.status === 'completed')
    if (status === 'cancelled') return orders.filter(o => o.status === 'cancelled')
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
        sellerNotes: sellerNotes || undefined
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
        status: 'cancelled'
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

  const pendingCount = orders.filter(o => o.status === 'pending').length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Đang tải danh sách đơn hàng...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
              <p className="text-muted-foreground mt-1">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={confirmOrderMutation.isPending || updateOrderStatusMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(confirmOrderMutation.isPending || updateOrderStatusMutation.isPending) ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="pending" className="relative">
                Cần xác nhận
                {pendingCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
              <TabsTrigger value="preparing">Đang chuẩn bị</TabsTrigger>
              <TabsTrigger value="ready">Sẵn sàng</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
            </TabsList>

            {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => {
              const statusOrders = getOrdersByStatus(status)
              const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
              const StatusIcon = statusConfig.icon

              return (
                <TabsContent key={status} value={status} className="space-y-4">
                  {statusOrders.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng</h3>
                        <p className="text-muted-foreground text-center">
                          Các đơn hàng {statusConfig.label.toLowerCase()} sẽ hiển thị ở đây
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    statusOrders.map((order) => (
                      <Card
                        key={order.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          statusConfig.borderColor
                        } border-2`}
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold">Mã đơn: {order.id}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <Badge
                              className={`${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} flex items-center gap-1.5 px-3 py-1`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="border-t pt-4 space-y-3">
                            {/* Customer Info */}
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{order.userName || 'Khách hàng'}</span>
                              {order.userEmail && (
                                <>
                                  <Phone className="h-4 w-4 text-muted-foreground ml-auto" />
                                  <span className="text-sm text-muted-foreground">{order.userEmail}</span>
                                </>
                              )}
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground line-clamp-2">
                                {order.shippingAddress || 'Chưa có địa chỉ'}
                              </span>
                            </div>

                            {/* Products and Total */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-sm font-medium">
                                {getTotalQuantity(order)} sản phẩm
                              </span>
                              <div className="text-right">
                                <span className="text-sm text-muted-foreground">Tổng tiền: </span>
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-3 border-t">
                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleConfirm(order.id)
                                    }}
                                    disabled={confirmOrderMutation.isPending || updateOrderStatusMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Xác nhận đơn hàng
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCancel(order.id)
                                    }}
                                    disabled={confirmOrderMutation.isPending || updateOrderStatusMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Hủy đơn
                                  </Button>
                                </>
                              )}
                              {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready') && (
                                <>
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCancel(order.id)
                                    }}
                                    disabled={confirmOrderMutation.isPending || updateOrderStatusMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Hủy đơn
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/orders/${order.id}`)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </Button>
                                </>
                              )}
                              {(order.status === 'completed' || order.status === 'cancelled') && (
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/orders/${order.id}`)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng {selectedOrderId}? Đơn hàng sẽ chuyển sang trạng thái "Đã xác nhận".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
              <Textarea
                placeholder="Nhập ghi chú cho đơn hàng..."
                value={sellerNotes}
                onChange={(e) => setSellerNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowConfirmDialog(false)
              setSellerNotes('')
              setSelectedOrderId(null)
            }}>
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmOrder}
              disabled={confirmOrderMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {confirmOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng {selectedOrderId}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Lý do hủy (tùy chọn)</label>
              <Textarea
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCancelDialog(false)
              setCancelReason('')
              setSelectedOrderId(null)
            }}>
              Không
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={updateOrderStatusMutation.isPending}
            >
              {updateOrderStatusMutation.isPending ? 'Đang xử lý...' : 'Hủy đơn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


