import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Separator } from '@shared/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { Textarea } from '@shared/components/ui/textarea'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  FileText,
  User,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Upload,
  ImageIcon,
  ExternalLink,
} from 'lucide-react'
import {
  useOrder,
  useConfirmOrder,
  useUpdateOrderStatus,
  useUpdateOrderPaymentStatus,
  useUploadPaymentImage,
} from '@/hooks/useOrders'
import { useAuthStore } from '@/stores/authStore'
import { ErrorBoundary } from '@shared/components/ui/error-boundary'
import { toast } from 'sonner'
import { cn, getApiErrorMessage } from '@/lib/utils'

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showBuyerCancelInfoDialog, setShowBuyerCancelInfoDialog] =
    useState(false)
  const [showStartPreparingDialog, setShowStartPreparingDialog] =
    useState(false)
  const [showReadyDialog, setShowReadyDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false)
  const [sellerNotes, setSellerNotes] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null
  )

  const { user } = useAuthStore()
  const { data: order, isLoading, error, refetch } = useOrder(orderId || '')
  const confirmOrderMutation = useConfirmOrder()
  const updateOrderStatusMutation = useUpdateOrderStatus()
  const updatePaymentStatusMutation = useUpdateOrderPaymentStatus()
  const uploadPaymentImageMutation = useUploadPaymentImage()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md border-2 border-dashed">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Không tìm thấy đơn hàng
            </h2>
            <p className="text-muted-foreground mb-6">
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
      currency: 'VND',
    })
      .format(price)
      .replace('₫', 'đ')
  }

  const formatDate = (dateString: string) => {
    // Handle timestamp string (BigInt from backend) or ISO date string
    const timestamp = Number(dateString)
    const date =
      !isNaN(timestamp) && timestamp > 0
        ? new Date(timestamp)
        : new Date(dateString)

    if (isNaN(date.getTime())) {
      return 'N/A'
    }

    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: '#F59E0B',
          bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          icon: Clock,
        }
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          color: '#3B82F6',
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          icon: CheckCircle,
        }
      case 'preparing':
        return {
          label: 'Đang chuẩn bị',
          color: '#8B5CF6',
          bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700',
          icon: Package,
        }
      case 'ready':
        return {
          label: 'Sẵn sàng lấy hàng',
          color: '#10B981',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: Truck,
        }
      case 'completed':
        return {
          label: 'Hoàn thành',
          color: '#10B981',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: CheckCircle,
        }
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: '#EF4444',
          bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          icon: XCircle,
        }
      default:
        return {
          label: status,
          color: '#6B7280',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-muted-foreground',
          icon: Clock,
        }
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng'
      case 'bank':
        return 'Chuyển khoản ngân hàng'
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng'
      case 'ewallet':
        return 'Ví điện tử'
      case 'momo':
        return 'Ví điện tử MoMo'
      case 'credit_card':
        return 'Thẻ tín dụng'
      default:
        return method.replace('_', ' ')
    }
  }

  const isPaid = order.paymentStatus === 'completed'
  const confirmedTimestamp =
    order.status === 'confirmed' ||
    order.status === 'preparing' ||
    order.status === 'ready' ||
    order.status === 'completed'
      ? order.updatedAt
      : ''

  // Determine if current user is seller or buyer
  // Seller: user's ID matches order's sellerId
  // Buyer: any other user viewing the order
  const isSeller =
    user?.id != null &&
    order.sellerId != null &&
    String(user.id) === String(order.sellerId)

  const buyerName = order.buyerName || 'N/A'
  const buyerPhone = order.buyerEmail || 'N/A'
  const fullAddress = order.shippingAddress || ''
  const buyerNotes = order.notes || ''
  const orderNumber = order.orderNo || order.id

  const handleConfirmOrder = async () => {
    if (!orderId) return

    try {
      await confirmOrderMutation.mutateAsync({
        id: orderId,
        sellerNotes: sellerNotes || undefined,
      })
      toast.success('Đã xác nhận đơn hàng thành công')
      setShowConfirmDialog(false)
      setSellerNotes('')
      navigate(-1)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Có lỗi xảy ra khi xác nhận đơn hàng')
      )
      console.error('Error confirming order:', error)
    }
  }

  const handleCancelOrder = async () => {
    if (!orderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'cancelled',
      })
      toast.success('Đã hủy đơn hàng')
      setShowCancelDialog(false)
      setCancelReason('')
      navigate(-1)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Có lỗi xảy ra khi hủy đơn hàng'))
      console.error('Error cancelling order:', error)
    }
  }

  const handleStartPreparing = async () => {
    if (!orderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'preparing',
      })
      toast.success('Đã bắt đầu chuẩn bị hàng')
      setShowStartPreparingDialog(false)
      navigate(-1)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Có lỗi xảy ra khi cập nhật trạng thái')
      )
      console.error('Error updating order status:', error)
    }
  }

  const handleMarkReady = async () => {
    if (!orderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'ready_for_pickup',
      })
      toast.success('Đơn hàng đã sẵn sàng để lấy')
      setShowReadyDialog(false)
      navigate(-1)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Có lỗi xảy ra khi cập nhật trạng thái')
      )
      console.error('Error updating order status:', error)
    }
  }

  const handleMarkComplete = async () => {
    if (!orderId) return

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: 'completed',
      })
      toast.success('Đơn hàng đã hoàn thành')
      setShowCompleteDialog(false)
      navigate(-1)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Có lỗi xảy ra khi cập nhật trạng thái')
      )
      console.error('Error updating order status:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh tối đa 5MB')
        return
      }
      setPaymentProofFile(file)
      setPaymentProofPreview(URL.createObjectURL(file))
    }
  }

  const handleMarkPaid = async () => {
    if (!orderId) return

    if (!paymentProofFile) {
      toast.error('Vui lòng upload ảnh chứng minh thanh toán')
      return
    }

    try {
      // Upload payment image and save to order in a single API call
      await uploadPaymentImageMutation.mutateAsync({
        orderId,
        file: paymentProofFile,
      })

      // Then update payment status to completed
      await updatePaymentStatusMutation.mutateAsync({
        id: orderId,
        paymentStatus: 'completed',
      })

      toast.success('Đã đánh dấu đơn hàng đã thanh toán')
      setShowMarkPaidDialog(false)
      setPaymentProofFile(null)
      setPaymentProofPreview(null)
      refetch()
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Có lỗi xảy ra khi cập nhật trạng thái thanh toán'
        )
      )
      console.error('Error updating payment status:', error)
    }
  }

  const handleCloseMarkPaidDialog = () => {
    setShowMarkPaidDialog(false)
    setPaymentProofFile(null)
    setPaymentProofPreview(null)
  }

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Đơn hàng #{orderNumber}
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Đặt hàng lúc {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card
                className={cn(
                  'border-2 overflow-hidden shadow-lg',
                  statusConfig.borderColor
                )}
              >
                <div className={cn('h-2 w-full', statusConfig.bgColor)} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md',
                        statusConfig.bgColor
                      )}
                    >
                      <StatusIcon
                        className="h-8 w-8"
                        style={{ color: statusConfig.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <Badge
                        className={cn(
                          'mb-2 px-3 py-1 text-sm font-semibold',
                          statusConfig.bgColor,
                          statusConfig.textColor,
                          statusConfig.borderColor,
                          'border'
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Mã đơn: {orderNumber}
                      </p>
                      {confirmedTimestamp && (
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Đã xác nhận: {formatDate(confirmedTimestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Card */}
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <span>Sản phẩm</span>
                    <Badge variant="secondary" className="ml-auto">
                      {order.items.length} sản phẩm
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md',
                        index !== order.items.length - 1 && 'border-b'
                      )}
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border shadow-sm"
                        onError={e => {
                          ;(e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/80'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Số lượng:{' '}
                            <strong className="text-foreground">
                              {item.quantity}
                            </strong>
                          </span>
                          <span className="text-xs">×</span>
                          <span>{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Timeline Card */}
              {(order.status === 'confirmed' ||
                order.status === 'preparing' ||
                order.status === 'ready' ||
                order.status === 'completed') && (
                <Card className="shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <span>Lịch sử đơn hàng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Timeline Items */}
                      {[
                        {
                          status: 'created',
                          label: 'Đơn hàng được tạo',
                          date: order.createdAt,
                          icon: ShoppingBag,
                          color: 'green',
                        },
                        {
                          status: 'confirmed',
                          label: 'Đơn hàng đã được xác nhận',
                          date: confirmedTimestamp,
                          icon: CheckCircle,
                          color: 'blue',
                        },
                        {
                          status: 'preparing',
                          label: 'Đang chuẩn bị hàng',
                          date: '',
                          icon: Package,
                          color: 'purple',
                        },
                        {
                          status: 'ready',
                          label: 'Sẵn sàng lấy hàng',
                          date: '',
                          icon: Truck,
                          color: 'green',
                        },
                        {
                          status: 'completed',
                          label: 'Hoàn thành',
                          date: '',
                          icon: CheckCircle,
                          color: 'green',
                        },
                      ].map((timeline, index, array) => {
                        const isActive =
                          timeline.status === 'created' ||
                          (timeline.status === 'confirmed' &&
                            (order.status === 'confirmed' ||
                              order.status === 'preparing' ||
                              order.status === 'ready' ||
                              order.status === 'completed')) ||
                          (timeline.status === 'preparing' &&
                            (order.status === 'preparing' ||
                              order.status === 'ready' ||
                              order.status === 'completed')) ||
                          (timeline.status === 'ready' &&
                            (order.status === 'ready' ||
                              order.status === 'completed')) ||
                          (timeline.status === 'completed' &&
                            order.status === 'completed')

                        const isCurrent =
                          (timeline.status === 'created' &&
                            order.status === 'pending') ||
                          (timeline.status === 'confirmed' &&
                            order.status === 'confirmed') ||
                          (timeline.status === 'preparing' &&
                            order.status === 'preparing') ||
                          (timeline.status === 'ready' &&
                            order.status === 'ready') ||
                          (timeline.status === 'completed' &&
                            order.status === 'completed')

                        const Icon = timeline.icon
                        const colorClasses = {
                          green: {
                            bg: 'bg-green-100 border-green-500 text-green-600',
                            line: 'bg-green-200',
                            text: 'text-green-600',
                          },
                          blue: {
                            bg: 'bg-blue-100 border-blue-500 text-blue-600',
                            line: 'bg-blue-200',
                            text: 'text-blue-600',
                          },
                          purple: {
                            bg: 'bg-purple-100 border-purple-500 text-purple-600',
                            line: 'bg-purple-200',
                            text: 'text-purple-600',
                          },
                        }

                        const colorClass =
                          colorClasses[
                            timeline.color as keyof typeof colorClasses
                          ] || colorClasses.green

                        return (
                          <div key={timeline.status} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all',
                                  isActive
                                    ? colorClass.bg
                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              {index < array.length - 1 && (
                                <div
                                  className={cn(
                                    'w-0.5 flex-1 my-2',
                                    isActive ? colorClass.line : 'bg-gray-200'
                                  )}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p
                                className={cn(
                                  'text-sm font-medium mb-1',
                                  isCurrent
                                    ? cn(colorClass.text, 'font-bold')
                                    : isActive
                                      ? 'text-foreground'
                                      : 'text-muted-foreground'
                                )}
                              >
                                {timeline.label}
                              </p>
                              {timeline.date && (
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(timeline.date)}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Buyer Info Card */}
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span>Thông tin người mua</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          Họ tên
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {buyerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          Số điện thoại
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {buyerPhone}
                        </p>
                      </div>
                    </div>
                    {fullAddress && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            Địa chỉ
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {fullAddress}
                          </p>
                        </div>
                      </div>
                    )}
                    {buyerNotes && (
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            Ghi chú
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {buyerNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info Card */}
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <span>Thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Trạng thái
                      </p>
                      <Badge
                        variant={isPaid ? 'default' : 'secondary'}
                        className={cn(
                          'mt-1',
                          isPaid
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        )}
                      >
                        {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </Badge>
                    </div>
                    {(order.paymentProofUrl || order.paymentImage) && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Ảnh chứng minh thanh toán
                        </p>
                        <a
                          href={order.paymentProofUrl || order.paymentImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-lg overflow-hidden border-2 border-muted hover:border-primary/50 transition-colors">
                            <img
                              src={order.paymentProofUrl || order.paymentImage}
                              alt="Ảnh chứng minh thanh toán"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                                <ExternalLink className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                            <ImageIcon className="h-3 w-3" />
                            Nhấn để xem ảnh gốc
                          </span>
                        </a>
                      </div>
                    )}
                    {isSeller && !isPaid && order.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        onClick={() => setShowMarkPaidDialog(true)}
                        disabled={updatePaymentStatusMutation.isPending}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Đánh dấu đã thanh toán
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary Card */}
              <Card className="shadow-md border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <span>Tóm tắt đơn hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giảm giá</span>
                        <span className="font-semibold text-red-600">
                          -{formatPrice(order.discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vận chuyển</span>
                      <span className="font-semibold text-foreground">
                        Tự đến lấy
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-foreground">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Notes Card */}
              {(order as any).sellerNotes && (
                <Card className="shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>Ghi chú từ người bán</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-foreground leading-relaxed">
                        {(order as any).sellerNotes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons - Only show status change buttons for seller */}
              {isSeller && order.status === 'pending' && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 shadow-md"
                    onClick={() => setShowConfirmDialog(true)}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Xác nhận đơn hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 h-12"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Hủy đơn hàng
                  </Button>
                </div>
              )}

              {isSeller && order.status === 'confirmed' && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 shadow-md"
                    onClick={() => setShowStartPreparingDialog(true)}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Bắt đầu chuẩn bị hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 h-12"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Hủy đơn hàng
                  </Button>
                </div>
              )}

              {isSeller && order.status === 'preparing' && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white h-12 shadow-md"
                    onClick={() => setShowReadyDialog(true)}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Sẵn sàng lấy hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 h-12"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Hủy đơn hàng
                  </Button>
                </div>
              )}

              {isSeller && order.status === 'ready' && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 shadow-md"
                    onClick={() => setShowCompleteDialog(true)}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Hoàn thành đơn hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 h-12"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Hủy đơn hàng
                  </Button>
                </div>
              )}

              {/* Cancel button for buyer - only show when order is not completed/cancelled */}
              {!isSeller &&
                order.status !== 'completed' &&
                order.status !== 'cancelled' && (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 h-12"
                      onClick={() => setShowBuyerCancelInfoDialog(true)}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Hủy đơn hàng
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Confirm Order Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng{' '}
              <strong>{orderNumber}</strong>?
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
              Bạn có chắc chắn muốn hủy đơn hàng <strong>{orderNumber}</strong>?
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

      {/* Start Preparing Dialog */}
      <Dialog
        open={showStartPreparingDialog}
        onOpenChange={setShowStartPreparingDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Bắt đầu chuẩn bị hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn bắt đầu chuẩn bị đơn hàng{' '}
              <strong>{orderNumber}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStartPreparingDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleStartPreparing}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {updateOrderStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ready for Pickup Dialog */}
      <Dialog open={showReadyDialog} onOpenChange={setShowReadyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Sẵn sàng lấy hàng</DialogTitle>
            <DialogDescription>
              Xác nhận đơn hàng <strong>{orderNumber}</strong> đã sẵn sàng để
              khách đến lấy?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReadyDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleMarkReady}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
            >
              {updateOrderStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Order Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Hoàn thành đơn hàng</DialogTitle>
            <DialogDescription>
              Xác nhận đơn hàng <strong>{orderNumber}</strong> đã được giao cho
              khách hàng thành công?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompleteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleMarkComplete}
              disabled={updateOrderStatusMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {updateOrderStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Hoàn thành'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Paid Dialog */}
      <Dialog
        open={showMarkPaidDialog}
        onOpenChange={handleCloseMarkPaidDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Đánh dấu đã thanh toán
            </DialogTitle>
            <DialogDescription>
              Xác nhận đơn hàng <strong>{orderNumber}</strong> đã được khách
              hàng thanh toán? Vui lòng upload ảnh chứng minh.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="payment-proof" className="text-sm font-medium">
              Ảnh chứng minh thanh toán <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <Input
                ref={fileInputRef}
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {paymentProofPreview ? (
                <div className="relative">
                  <img
                    src={paymentProofPreview}
                    alt="Payment proof preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPaymentProofFile(null)
                      setPaymentProofPreview(null)
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click để chọn ảnh chứng minh thanh toán
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG (tối đa 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseMarkPaidDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleMarkPaid}
              disabled={
                updatePaymentStatusMutation.isPending ||
                uploadPaymentImageMutation.isPending ||
                !paymentProofFile
              }
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              {uploadPaymentImageMutation.isPending ||
              updatePaymentStatusMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận đã thanh toán'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buyer Cancel Info Dialog - Only close button, no cancel action */}
      <Dialog
        open={showBuyerCancelInfoDialog}
        onOpenChange={setShowBuyerCancelInfoDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Hủy đơn hàng</DialogTitle>
            <DialogDescription className="pt-4 text-base">
              Vui lòng liên hệ với người bán để hủy đơn hàng.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowBuyerCancelInfoDialog(false)}
              className="w-full"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}
