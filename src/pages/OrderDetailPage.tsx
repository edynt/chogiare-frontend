import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  ShoppingBag,
  FileText,
  Navigation,
  User,
  Calendar,
  Receipt
} from 'lucide-react'
import { useOrder, useConfirmOrder, useUpdateOrderStatus } from '@/hooks/useOrders'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { toast } from 'sonner'

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showStartPreparingDialog, setShowStartPreparingDialog] = useState(false)
  const [sellerNotes, setSellerNotes] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  
  const { data: order, isLoading, error } = useOrder(orderId || '')
  const confirmOrderMutation = useConfirmOrder()
  const updateOrderStatusMutation = useUpdateOrderStatus()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'shipped': return 'Đã giao hàng'
      case 'pending': return 'Chờ xác nhận'
      case 'cancelled': return 'Đã hủy'
      case 'processing': return 'Đang xử lý'
      case 'confirmed': return 'Đã xác nhận'
      case 'preparing': return 'Đang chuẩn bị'
      case 'ready': return 'Sẵn sàng lấy hàng'
      default: return status
    }
  }

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B'
      case 'confirmed': return '#3B82F6'
      case 'preparing': return '#8B5CF6'
      case 'ready': return '#10B981'
      case 'completed': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#6B7280'
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng'
      case 'bank': return 'Chuyển khoản ngân hàng'
      case 'bank_transfer': return 'Chuyển khoản ngân hàng'
      case 'ewallet': return 'Ví điện tử'
      case 'momo': return 'Ví điện tử MoMo'
      case 'credit_card': return 'Thẻ tín dụng'
      default: return method.replace('_', ' ')
    }
  }

  const confirmedTimestamp = order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' 
    ? order.updatedAt 
    : ''

  const handleConfirmOrder = async () => {
    if (!orderId) return
    
    try {
      await confirmOrderMutation.mutateAsync({
        id: orderId,
        sellerNotes: sellerNotes || undefined
      })
      toast.success('Đã xác nhận đơn hàng thành công')
      setShowConfirmDialog(false)
      setSellerNotes('')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận đơn hàng')
      console.error('Error confirming order:', error)
    }
  }

  const handleCancelOrder = async () => {
    if (!orderId) return
    
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'cancelled'
      })
      toast.success('Đã hủy đơn hàng')
      setShowCancelDialog(false)
      setCancelReason('')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng')
      console.error('Error cancelling order:', error)
    }
  }

  const handleStartPreparing = async () => {
    if (!orderId) return
    
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'preparing'
      })
      toast.success('Đã bắt đầu chuẩn bị hàng')
      setShowStartPreparingDialog(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
      console.error('Error updating order status:', error)
    }
  }

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                <p className="text-gray-600 mt-1">Mã đơn hàng: <span className="font-semibold">{order.id}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/shipping/${order.id}`)}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Theo dõi
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Hóa đơn
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="border-2 overflow-hidden" style={{ borderColor: getStatusIconColor(order.status) }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getStatusIconColor(order.status) + '20' }}
                    >
                      {order.status === 'pending' && <Clock className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                      {order.status === 'confirmed' && <CheckCircle className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                      {order.status === 'preparing' && <Package className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                      {order.status === 'ready' && <Truck className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                      {order.status === 'completed' && <CheckCircle className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                      {order.status === 'cancelled' && <XCircle className="h-8 w-8" style={{ color: getStatusIconColor(order.status) }} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold" style={{ color: getStatusIconColor(order.status) }}>
                          {getStatusLabel(order.status)}
                        </h3>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Đặt hàng: {formatDate(order.createdAt)}</span>
                        </div>
                        {confirmedTimestamp && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Xác nhận: {formatDate(confirmedTimestamp)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Thông tin người mua
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Họ tên</label>
                      <p className="text-base font-semibold text-gray-900">{order.userName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Số điện thoại</label>
                      <p className="text-base font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {order.userEmail || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {order.shippingAddress && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Địa chỉ giao hàng</label>
                      <p className="text-base text-gray-900 flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{order.shippingAddress}</span>
                      </p>
                    </div>
                  )}
                  {order.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Ghi chú từ khách hàng</label>
                      <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    Sản phẩm ({totalQuantity})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 rounded-lg object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.productName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>Số lượng: <strong>{item.quantity}</strong></span>
                            <span>Đơn giá: <strong>{formatPrice(item.price)}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{formatPrice(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Phương thức thanh toán</span>
                    <span className="font-semibold text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Trạng thái thanh toán</span>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Notes */}
              {(order as any).sellerNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Ghi chú từ người bán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      {(order as any).sellerNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">Tự đến lấy</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Tổng cộng</span>
                    <span className="text-primary text-xl">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thao tác</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.status === 'pending' && (
                    <>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => setShowConfirmDialog(true)}
                        size="lg"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Xác nhận đơn hàng
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-500 text-red-700 hover:bg-red-50" 
                        onClick={() => setShowCancelDialog(true)}
                        size="lg"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Hủy đơn hàng
                      </Button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                        onClick={() => setShowStartPreparingDialog(true)}
                        size="lg"
                      >
                        <Package className="h-5 w-5 mr-2" />
                        Bắt đầu chuẩn bị hàng
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-500 text-red-700 hover:bg-red-50" 
                        onClick={() => setShowCancelDialog(true)}
                        size="lg"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Hủy đơn hàng
                      </Button>
                    </>
                  )}
                  {(order.status === 'preparing' || order.status === 'ready' || order.status === 'completed') && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/shipping/${order.id}`)}
                      size="lg"
                    >
                      <Truck className="h-5 w-5 mr-2" />
                      Theo dõi đơn hàng
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Order Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng <strong>{order?.id}</strong>? Đơn hàng sẽ chuyển sang trạng thái "Đã xác nhận".
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
              Bạn có chắc chắn muốn hủy đơn hàng <strong>{order?.id}</strong>? Hành động này không thể hoàn tác.
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

      {/* Start Preparing Dialog */}
      <Dialog open={showStartPreparingDialog} onOpenChange={setShowStartPreparingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bắt đầu chuẩn bị hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn bắt đầu chuẩn bị đơn hàng <strong>{order?.id}</strong>? Đơn hàng sẽ chuyển sang trạng thái "Đang chuẩn bị".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartPreparingDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleStartPreparing}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateOrderStatusMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}
