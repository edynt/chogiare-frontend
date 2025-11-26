import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingBag,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  id: string
  orderNumber: string
  buyerName: string
  buyerPhone: string
  fullAddress: string
  totalQuantity: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createdAt: string
}

// Mock data
const allOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    buyerName: 'Nguyễn Văn A',
    buyerPhone: '0901234567',
    fullAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    totalQuantity: 2,
    total: 29500000,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    buyerName: 'Trần Thị B',
    buyerPhone: '0987654321',
    fullAddress: '456 Đường XYZ, Phường 2, Quận 3, TP.HCM',
    totalQuantity: 1,
    total: 4500000,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    orderNumber: 'ORD003',
    buyerName: 'Lê Văn C',
    buyerPhone: '0912345678',
    fullAddress: '789 Đường DEF, Phường 3, Quận 5, TP.HCM',
    totalQuantity: 3,
    total: 7500000,
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    orderNumber: 'ORD004',
    buyerName: 'Phạm Thị D',
    buyerPhone: '0923456789',
    fullAddress: '321 Đường GHI, Phường 4, Quận 7, TP.HCM',
    totalQuantity: 1,
    total: 2500000,
    status: 'ready',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    orderNumber: 'ORD005',
    buyerName: 'Hoàng Văn E',
    buyerPhone: '0934567890',
    fullAddress: '654 Đường JKL, Phường 5, Quận 10, TP.HCM',
    totalQuantity: 2,
    total: 18000000,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    orderNumber: 'ORD006',
    buyerName: 'Vũ Thị F',
    buyerPhone: '0945678901',
    fullAddress: '987 Đường MNO, Phường 6, Quận Bình Thạnh, TP.HCM',
    totalQuantity: 1,
    total: 3200000,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

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
  const [orders] = useState<Order[]>(allOrders)
  const [activeTab, setActiveTab] = useState('pending')
  const [isRefreshing, setIsRefreshing] = useState(false)

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
    toast.success(`Đã xác nhận đơn hàng ${orderId}`)
    // In production, call API to confirm order
  }

  const handleCancel = (orderId: string) => {
    toast.success(`Đã hủy đơn hàng ${orderId}`)
    // In production, call API to cancel order
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast.success('Đã làm mới danh sách đơn hàng')
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length

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
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                                <h3 className="text-lg font-bold">Mã đơn: {order.orderNumber}</h3>
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
                              <span className="text-sm font-medium">{order.buyerName}</span>
                              <Phone className="h-4 w-4 text-muted-foreground ml-auto" />
                              <span className="text-sm text-muted-foreground">{order.buyerPhone}</span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground line-clamp-2">
                                {order.fullAddress}
                              </span>
                            </div>

                            {/* Products and Total */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-sm font-medium">
                                {order.totalQuantity} sản phẩm
                              </span>
                              <div className="text-right">
                                <span className="text-sm text-muted-foreground">Tổng tiền: </span>
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons for Pending Orders */}
                            {order.status === 'pending' && (
                              <div className="flex gap-3 pt-3 border-t">
                                <Button
                                  variant="outline"
                                  className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleConfirm(order.id)
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Xác nhận
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCancel(order.id)
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Hủy đơn
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
    </div>
  )
}


