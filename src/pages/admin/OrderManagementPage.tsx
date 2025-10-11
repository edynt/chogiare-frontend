import React, { useState } from 'react'
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
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Mock data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      seller: {
        name: 'TechStore Pro',
        email: 'contact@techstorepro.com',
        phone: '0909876543'
      },
      products: [
        {
          name: 'iPhone 14 Pro Max 256GB',
          quantity: 1,
          price: 25000000,
          image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=80&h=80&fit=crop'
        }
      ],
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      totalAmount: 25000000,
      shippingFee: 30000,
      commission: 125000,
      netAmount: 24875000,
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-16T14:20:00Z',
      shippingAddress: '456 Đường XYZ, Quận Cầu Giấy, Hà Nội',
      trackingNumber: 'VN123456789',
      notes: 'Giao hàng trong giờ hành chính'
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        address: '789 Đường DEF, Quận 3, TP.HCM'
      },
      seller: {
        name: 'Audio World',
        email: 'contact@audioworld.com',
        phone: '0912345678'
      },
      products: [
        {
          name: 'AirPods Pro 2nd Gen',
          quantity: 2,
          price: 4500000,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop'
        }
      ],
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'momo',
      totalAmount: 9000000,
      shippingFee: 25000,
      commission: 45000,
      netAmount: 8955000,
      createdAt: '2024-01-16T14:20:00Z',
      completedAt: null,
      shippingAddress: '321 Đường GHI, Quận Đống Đa, Hà Nội',
      trackingNumber: 'VN987654321',
      notes: 'Giao hàng nhanh'
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0912345678',
        address: '654 Đường JKL, Quận 5, TP.HCM'
      },
      seller: {
        name: 'Fashion Hub',
        email: 'contact@fashionhub.com',
        phone: '0923456789'
      },
      products: [
        {
          name: 'Nike Air Max 270',
          quantity: 1,
          price: 2500000,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop'
        }
      ],
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'bank_transfer',
      totalAmount: 2500000,
      shippingFee: 20000,
      commission: 12500,
      netAmount: 2487500,
      createdAt: '2024-01-20T09:15:00Z',
      completedAt: null,
      shippingAddress: '987 Đường MNO, Quận Hai Bà Trưng, Hà Nội',
      trackingNumber: null,
      notes: 'Chờ thanh toán'
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Phạm Thị D',
        email: 'phamthid@email.com',
        phone: '0923456789',
        address: '147 Đường PQR, Quận 7, TP.HCM'
      },
      seller: {
        name: 'Home & Garden',
        email: 'contact@homegarden.com',
        phone: '0934567890'
      },
      products: [
        {
          name: 'Cây cảnh mini',
          quantity: 3,
          price: 1500000,
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop'
        }
      ],
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'credit_card',
      totalAmount: 1500000,
      shippingFee: 15000,
      commission: 7500,
      netAmount: 1485000,
      createdAt: '2024-01-18T16:45:00Z',
      completedAt: null,
      shippingAddress: '258 Đường STU, Quận Hoàng Mai, Hà Nội',
      trackingNumber: null,
      notes: 'Khách hàng hủy đơn'
    }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

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
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for orders:`, selectedOrders)
    // Implement bulk actions
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
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Quản lý rút tiền
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                <p className="text-xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoa hồng</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(orders.reduce((sum, order) => sum + order.commission, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
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
              <Button variant="outline">
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
          <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
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
                {filteredOrders.map((order) => (
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
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-32">{order.customer.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.seller.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{order.seller.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={order.products[0].image}
                          alt={order.products[0].name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {order.products[0].name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Số lượng: {order.products[0].quantity}
                          </p>
                          {order.products.length > 1 && (
                            <p className="text-xs text-blue-600">
                              +{order.products.length - 1} sản phẩm khác
                            </p>
                          )}
                        </div>
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
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hoa hồng: {formatPrice(order.commission)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Thực nhận: {formatPrice(order.netAmount)}
                        </p>
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
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Truck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
