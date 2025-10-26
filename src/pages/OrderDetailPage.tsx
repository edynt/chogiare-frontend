import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Download,
  Star,
  Eye,
  ShoppingBag,
  Store,
  FileText,
  Navigation
} from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import { ErrorBoundary } from '@/components/ui/error-boundary'

interface OrderTimelineItem {
  id: string
  status: string
  title: string
  description: string
  timestamp: string
  completed: boolean
  icon: React.ReactNode
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'products'>('details')
  
  const { data: order, isLoading, error } = useOrder(orderId || '')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-4">
              Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'shipped': return 'Đã giao hàng'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      case 'processing': return 'Đang xử lý'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã thanh toán'
      case 'pending': return 'Chờ thanh toán'
      case 'failed': return 'Thanh toán thất bại'
      case 'refunded': return 'Đã hoàn tiền'
      default: return status
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4" />
      case 'momo': return <DollarSign className="h-4 w-4" />
      case 'bank_transfer': return <DollarSign className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const timelineItems: OrderTimelineItem[] = [
    {
      id: '1',
      status: 'order_placed',
      title: 'Đặt hàng thành công',
      description: 'Đơn hàng đã được đặt và chờ xác nhận từ người bán',
      timestamp: order.createdAt,
      completed: true,
      icon: <ShoppingBag className="h-4 w-4" />
    },
    {
      id: '2',
      status: 'confirmed',
      title: 'Xác nhận đơn hàng',
      description: 'Người bán đã xác nhận đơn hàng và chuẩn bị hàng',
      timestamp: order.status === 'processing' || order.status === 'shipped' || order.status === 'completed' ? order.updatedAt : '',
      completed: order.status === 'processing' || order.status === 'shipped' || order.status === 'completed',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: '3',
      status: 'shipped',
      title: 'Đã giao hàng',
      description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      timestamp: order.status === 'shipped' || order.status === 'completed' ? order.updatedAt : '',
      completed: order.status === 'shipped' || order.status === 'completed',
      icon: <Truck className="h-4 w-4" />
    },
    {
      id: '4',
      status: 'delivered',
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao đến địa chỉ nhận hàng',
      timestamp: order.status === 'completed' ? order.updatedAt : '',
      completed: order.status === 'completed',
      icon: <Package className="h-4 w-4" />
    }
  ]

  const handleCancelOrder = () => {
    // Implement cancel order logic
    console.log('Cancel order:', order.id)
  }

  const handleTrackOrder = () => {
    // Navigate to shipping tracking page
    navigate(`/shipping/${order.id}`)
  }

  const handleContactSeller = () => {
    // Implement contact seller logic
    console.log('Contact seller:', order.storeId)
  }

  const handleDownloadInvoice = () => {
    // Implement download invoice logic
    console.log('Download invoice:', order.id)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                <p className="text-gray-600 mt-1">Mã đơn hàng: {order.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleDownloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Tải hóa đơn
                </Button>
                <Button variant="outline" onClick={handleTrackOrder}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Theo dõi đơn hàng
                </Button>
                {order.status === 'pending' && (
                  <Button variant="destructive" onClick={handleCancelOrder}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy đơn hàng
                  </Button>
                )}
              </div>
            </div>

            {/* Order Status */}
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-medium`}>
                {getStatusLabel(order.status)}
              </Badge>
              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} px-4 py-2 text-sm font-medium`}>
                {getPaymentStatusLabel(order.paymentStatus)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <Card>
                <CardContent className="p-0">
                  <div className="flex border-b">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'details'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FileText className="h-4 w-4 mr-2 inline" />
                      Thông tin chi tiết
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'timeline'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-2 inline" />
                      Lịch sử đơn hàng
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'products'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Package className="h-4 w-4 mr-2 inline" />
                      Sản phẩm ({order.items.length})
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Order Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Thông tin đơn hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Mã đơn hàng</label>
                          <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Ngày đặt hàng</label>
                          <p className="text-lg font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                          <Badge className={`${getStatusColor(order.status)} mt-1`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Thanh toán</label>
                          <Badge className={`${getPaymentStatusColor(order.paymentStatus)} mt-1`}>
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </Badge>
                        </div>
                      </div>
                      {order.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                          <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{order.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Địa chỉ giao hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-900">{order.userName || 'Nguyễn Văn A'}</p>
                        <p className="text-gray-700">{order.shippingAddress}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{order.userEmail || '0901234567'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{order.userEmail || 'user@example.com'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seller Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Thông tin người bán
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {order.storeLogo && (
                            <img
                              src={order.storeLogo}
                              alt={order.storeName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{order.storeName || 'TechStore Pro'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>4.8 (128 đánh giá)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>0909876543</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" onClick={handleContactSeller}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Liên hệ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'timeline' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Lịch sử đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {timelineItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {item.completed ? item.icon : <Clock className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.title}
                              </h3>
                              {item.timestamp && (
                                <span className="text-sm text-gray-500">{formatDate(item.timestamp)}</span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'products' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Sản phẩm trong đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.productName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>Số lượng: {item.quantity}</span>
                              <span>Giá: {formatPrice(item.price)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                            <Button variant="ghost" size="sm" className="mt-2">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phương thức</span>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span className="capitalize font-medium">{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trạng thái</span>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số tiền</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={handleTrackOrder}>
                    <Navigation className="h-4 w-4 mr-2" />
                    Theo dõi đơn hàng
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ người bán
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                  {order.status === 'pending' && (
                    <Button variant="destructive" className="w-full" onClick={handleCancelOrder}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đơn hàng
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

