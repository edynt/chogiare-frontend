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
import { 
  ShoppingBag,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Eye,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useUserOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import type { Order as OrderType } from '@/api/orders'

// Helper function to get total quantity from order items
const getTotalQuantity = (order: OrderType) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận',
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
  ready: {
    label: 'Sẵn sàng lấy',
    color: '#10B981',
    icon: Package,
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
  }
}

export default function CustomerOrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showConfirmReceivedDialog, setShowConfirmReceivedDialog] = useState(false)
  
  const { data: ordersData, isLoading, refetch } = useUserOrders({ page: 1, pageSize: 100 })
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
    if (status === 'confirmed') return orders.filter(o => o.status === 'confirmed' || o.status === 'preparing')
    if (status === 'ready') return orders.filter(o => o.status === 'ready')
    if (status === 'completed') return orders.filter(o => o.status === 'completed')
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
        status: 'completed'
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
              <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
              <p className="text-muted-foreground mt-1">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={updateOrderStatusMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${updateOrderStatusMutation.isPending ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending" className="relative">
                Chờ xác nhận
                {pendingCount > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
              <TabsTrigger value="ready">Sẵn sàng lấy</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            </TabsList>

            {['pending', 'confirmed', 'ready', 'completed'].map((status) => {
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
                          {/* Header với mã đơn và trạng thái */}
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
                            {/* Products and Total */}
                            <div className="flex items-center justify-between">
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

                            {/* Action Button cho đơn sẵn sàng */}
                            {order.status === 'ready' && (
                              <div className="pt-3 border-t">
                                <Button
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleConfirmReceived(order.id)
                                  }}
                                  disabled={updateOrderStatusMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Xác nhận đã nhận hàng
                                </Button>
                              </div>
                            )}
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

      {/* Confirm Received Dialog */}
      <Dialog open={showConfirmReceivedDialog} onOpenChange={setShowConfirmReceivedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đã nhận hàng</DialogTitle>
            <DialogDescription>
              Bạn đã nhận được đơn hàng {selectedOrderId}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowConfirmReceivedDialog(false)
              setSelectedOrderId(null)
            }}>
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmReceivedOrder}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateOrderStatusMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

