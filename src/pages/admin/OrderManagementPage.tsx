import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Truck,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { 
  useAdminOrders, 
  useAdminOrderStats,
  useUpdateOrderStatus,
  useUpdateOrderPaymentStatus
} from '@/hooks/useAdmin'
import { PLACEHOLDER_IMAGE, getApiErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  const queryParams = useMemo(() => ({
    page,
    pageSize,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
    dateFilter: dateFilter !== 'all' ? dateFilter : undefined,
  }), [page, pageSize, searchQuery, statusFilter, paymentFilter, dateFilter])

  const { data: ordersData, isLoading: ordersLoading, error: ordersError, refetch } = useAdminOrders(queryParams)
  const { data: orderStats, isLoading: statsLoading } = useAdminOrderStats()
  const updateOrderStatusMutation = useUpdateOrderStatus()
  const updateOrderPaymentStatusMutation = useUpdateOrderPaymentStatus()

  const orders = ordersData?.items || []
  const totalOrders = ordersData?.total || 0
  const totalPages = ordersData?.totalPages || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'shipped': return 'Đã giao'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      case 'processing': return 'Đang xử lý'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán'
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

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length 
        ? [] 
        : orders.map(order => order.id)
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return

    try {
      if (action === 'process') {
        for (const orderId of selectedOrders) {
          await updateOrderStatusMutation.mutateAsync({ id: orderId, status: 'processing' })
        }
        toast.success(`Đã xử lý ${selectedOrders.length} đơn hàng`)
        setSelectedOrders([])
      } else if (action === 'cancel') {
        for (const orderId of selectedOrders) {
          await updateOrderStatusMutation.mutateAsync({ id: orderId, status: 'cancelled' })
        }
        toast.success(`Đã hủy ${selectedOrders.length} đơn hàng`)
        setSelectedOrders([])
      } else if (action === 'export') {
        toast.info('Tính năng xuất báo cáo đang được phát triển')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể thực hiện thao tác'))
    }
  }

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status })
      toast.success('Đã cập nhật trạng thái đơn hàng')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái'))
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await updateOrderPaymentStatusMutation.mutateAsync({ id: orderId, paymentStatus })
      toast.success('Đã cập nhật trạng thái thanh toán')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái thanh toán'))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng & Thanh toán</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng và giao dịch trên nền tảng</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" onClick={() => handleBulkAction('export')}>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                  <p className="text-xl font-bold text-gray-900">{orderStats?.totalOrders || 0}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(orderStats?.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hoa hồng</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(orderStats?.totalCommission || 0)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chờ xử lý</p>
                  <p className="text-xl font-bold text-gray-900">
                    {orderStats?.pendingOrders || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc người bán..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã giao</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setPage(1)}>
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Đã chọn {selectedOrders.length} đơn hàng
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('process')}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Xử lý
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Xuất
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('cancel')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Hủy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({totalOrders})</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Không thể tải danh sách đơn hàng</p>
              </div>
            </div>
          ) : ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có đơn hàng nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Người bán</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-12">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-500">
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.userName || 'N/A'}</p>
                            {order.userPhone && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{order.userPhone}</span>
                              </div>
                            )}
                            {order.userEmail && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-32">{order.userEmail}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.sellerName || order.storeName || 'N/A'}</p>
                            {order.sellerPhone && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{order.sellerPhone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.items && order.items.length > 0 && (
                              <>
                                <img
                                  src={order.items[0].productImage || PLACEHOLDER_IMAGE}
                                  alt={order.items[0].productName}
                                  className="w-12 h-12 rounded-lg object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = PLACEHOLDER_IMAGE
                                  }}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {order.items[0].productName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Số lượng: {order.items[0].quantity}
                                  </p>
                                  {order.items.length > 1 && (
                                    <p className="text-xs text-blue-600">
                                      +{order.items.length - 1} sản phẩm khác
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              {getPaymentStatusLabel(order.paymentStatus)}
                            </Badge>
                            {order.paymentMethod && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                {getPaymentMethodIcon(order.paymentMethod)}
                                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                            {order.commission && (
                              <p className="text-xs text-gray-500">
                                Hoa hồng: {formatPrice(order.commission)}
                              </p>
                            )}
                            {order.netAmount && (
                              <p className="text-xs text-gray-500">
                                Thực nhận: {formatPrice(order.netAmount)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                            {order.completedAt && (
                              <p className="text-gray-500">
                                Hoàn thành: {formatDate(order.completedAt)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleUpdateStatus(order.id, 'processing')}
                                disabled={updateOrderStatusMutation.isPending}
                                title="Xử lý đơn hàng"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            {order.paymentStatus === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleUpdatePaymentStatus(order.id, 'paid')}
                                disabled={updateOrderPaymentStatusMutation.isPending}
                                title="Xác nhận thanh toán"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || ordersLoading}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || ordersLoading}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
