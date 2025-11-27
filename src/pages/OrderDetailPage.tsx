import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
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
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ShoppingBag,
  FileText,
  Navigation,
  User
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
    }).format(price).replace('₫', 'đ')
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
      case 'pending': return '#F59E0B'
      case 'confirmed': return '#3B82F6'
      case 'preparing': return '#8B5CF6'
      case 'ready': return '#10B981'
      case 'completed': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'preparing': return 'Đang chuẩn bị'
      case 'ready': return 'Sẵn sàng lấy hàng'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'confirmed': return CheckCircle
      case 'preparing': return Package
      case 'ready': return Truck
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
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

  const isPaid = order.paymentStatus === 'completed'
  const confirmedTimestamp = (order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed') 
    ? order.updatedAt 
    : ''
  
  // Get buyer info - map from order data
  const buyerName = order.userName || 'N/A'
  const buyerPhone = order.userEmail || 'N/A' // Using userEmail as phone for now
  const fullAddress = order.shippingAddress || ''
  const buyerNotes = order.notes || ''
  const orderNumber = order.id // Using id as orderNumber

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
      navigate(-1)
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
      navigate(-1)
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
      navigate(-1)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
      console.error('Error updating order status:', error)
    }
  }

  const StatusIcon = getStatusIcon(order.status)
  const statusColor = getStatusColor(order.status)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng {orderNumber}</h1>
          </div>

          <div className="space-y-4">
            {/* Status Card */}
            <Card className="border-2" style={{ borderColor: statusColor }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-15 h-15 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      width: '60px',
                      height: '60px',
                      backgroundColor: statusColor + '1A',
                      borderRadius: '12px'
                    }}
                  >
                    <StatusIcon className="h-8 w-8" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: statusColor }}>
                      {getStatusLabel(order.status)}
                    </h3>
                    <p className="text-sm text-gray-600">Mã đơn: {orderNumber}</p>
                    {confirmedTimestamp && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Đã xác nhận: {formatDate(confirmedTimestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Info Card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-gray-900">Thông tin người mua</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-24 text-sm text-gray-600">Họ tên</div>
                    <div className="flex-1 text-sm font-semibold text-gray-900">{buyerName}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 text-sm text-gray-600">Số điện thoại</div>
                    <div className="flex-1 text-sm font-semibold text-gray-900">{buyerPhone}</div>
                  </div>
                  {fullAddress && (
                    <div className="flex">
                      <div className="w-24 text-sm text-gray-600">Địa chỉ</div>
                      <div className="flex-1 text-sm font-semibold text-gray-900">{fullAddress}</div>
                    </div>
                  )}
                  {buyerNotes && (
                    <div className="flex">
                      <div className="w-24 text-sm text-gray-600">Ghi chú</div>
                      <div className="flex-1 text-sm font-semibold text-gray-900">{buyerNotes}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-gray-900">Sản phẩm</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                        style={{ width: '60px', height: '60px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary flex-shrink-0">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-gray-900">Thanh toán</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-24 text-sm text-gray-600">Phương thức</div>
                    <div className="flex-1 text-sm font-semibold text-gray-900">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-24 text-sm text-gray-600">Trạng thái</div>
                    <div className="flex-1 text-sm font-semibold text-gray-900">
                      {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  </div>
                  {(order as any).paidAt && (
                    <div className="flex">
                      <div className="w-24 text-sm text-gray-600">Thời gian thanh toán</div>
                      <div className="flex-1 text-sm font-semibold text-gray-900">
                        {formatDate((order as any).paidAt)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-semibold text-gray-900">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vận chuyển</span>
                    <span className="font-semibold text-gray-900">Tự đến lấy</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Notes Card */}
            {(order as any).sellerNotes && (
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-bold text-gray-900">Ghi chú từ người bán</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {(order as any).sellerNotes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline Card (for confirmed orders) */}
            {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed') && confirmedTimestamp && (
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-bold text-gray-900">Lịch sử đơn hàng</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Timeline Item 1: Order Created */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border-2 border-green-500">
                        <ShoppingBag className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Đơn hàng được tạo</p>
                        <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    {/* Timeline Item 2: Order Confirmed */}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        order.status === 'confirmed' 
                          ? 'bg-blue-100 border-blue-500' 
                          : 'bg-blue-100 border-blue-500'
                      }`}>
                        <CheckCircle className={`h-4 w-4 ${
                          order.status === 'confirmed' ? 'text-blue-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          order.status === 'confirmed' ? 'font-bold text-blue-600' : 'font-medium text-gray-900'
                        }`}>
                          Đơn hàng đã được xác nhận
                        </p>
                        {confirmedTimestamp && (
                          <p className="text-xs text-gray-600">{formatDate(confirmedTimestamp)}</p>
                        )}
                      </div>
                    </div>
                    {/* Timeline Item 3: Preparing */}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        order.status === 'preparing' || order.status === 'ready' || order.status === 'completed'
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <Package className={`h-4 w-4 ${
                          order.status === 'preparing' || order.status === 'ready' || order.status === 'completed'
                            ? 'text-purple-600'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          order.status === 'preparing' 
                            ? 'font-bold text-purple-600' 
                            : order.status === 'ready' || order.status === 'completed'
                            ? 'font-medium text-gray-900'
                            : 'text-gray-500'
                        }`}>
                          Đang chuẩn bị hàng
                        </p>
                      </div>
                    </div>
                    {/* Timeline Item 4: Ready */}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        order.status === 'ready' || order.status === 'completed'
                          ? 'bg-green-100 border-green-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <Truck className={`h-4 w-4 ${
                          order.status === 'ready' || order.status === 'completed'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          order.status === 'ready'
                            ? 'font-bold text-green-600'
                            : order.status === 'completed'
                            ? 'font-medium text-gray-900'
                            : 'text-gray-500'
                        }`}>
                          Sẵn sàng lấy hàng
                        </p>
                      </div>
                    </div>
                    {/* Timeline Item 5: Completed */}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        order.status === 'completed'
                          ? 'bg-green-100 border-green-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <CheckCircle className={`h-4 w-4 ${
                          order.status === 'completed'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          order.status === 'completed'
                            ? 'font-bold text-green-600'
                            : 'text-gray-500'
                        }`}>
                          Hoàn thành
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-14" 
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Xác nhận đơn hàng
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-700 hover:bg-red-50 h-14" 
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Hủy đơn hàng
                </Button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14" 
                  onClick={() => setShowStartPreparingDialog(true)}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Bắt đầu chuẩn bị hàng
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-700 hover:bg-red-50 h-14" 
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Hủy đơn hàng
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Order Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng <strong>{orderNumber}</strong>?
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
              Bạn có chắc chắn muốn hủy đơn hàng <strong>{orderNumber}</strong>?
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
              Bạn có chắc chắn muốn bắt đầu chuẩn bị đơn hàng <strong>{orderNumber}</strong>?
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
