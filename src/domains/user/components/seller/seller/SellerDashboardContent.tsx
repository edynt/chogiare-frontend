import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components/ui/tabs'
import { StockInModal } from '@user/components/seller/stock/StockInModal'
import { useNotification } from '@shared/components/notification-provider'
import { useSellerProducts } from '@/hooks/useProducts'
import {
  useSellerOrders,
  useConfirmOrder,
  useUpdateOrderStatus,
} from '@/hooks/useOrders'
import { useSellerDashboardStats, useLowStockProducts, useSellerBoostedProducts, useRemoveProductBoost } from '@/hooks/useSeller'
import { useAuth } from '@/hooks/useAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { Textarea } from '@shared/components/ui/textarea'
import { toast } from 'sonner'
import {
  Plus,
  Package,
  DollarSign,
  Users,
  Eye,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Wallet,
  Activity,
  FileSpreadsheet,
  Upload,
  XCircle,
  Timer,
  Sparkles,
  User,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  Clock,
  Rocket,
  Trash2,
} from 'lucide-react'
import { cn, getApiErrorMessage } from '@/lib/utils'
import type { Order } from '@user/api/orders'
import { BoostProductModal } from '@shared/components/product/BoostProductModal'
import { SelectProductToBoostModal } from '@shared/components/product/SelectProductToBoostModal'

interface StockInProduct {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  costPrice?: number
}

// Helper function to get total quantity from order items
const getTotalQuantity = (order: Order) => {
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

export function SellerDashboardContent() {
  const navigate = useNavigate()
  const { data: _products, isLoading: _isLoading } = useSellerProducts()
  const { user } = useAuth()
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useSellerOrders({ page: 1, pageSize: 10 })
  const { data: dashboardStats, isLoading: isLoadingStats } =
    useSellerDashboardStats()
  const { data: lowStockProductsData, isLoading: isLoadingLowStock } =
    useLowStockProducts(20)
  const { data: boostedProductsData, isLoading: isLoadingBoosted } =
    useSellerBoostedProducts()
  const { notify } = useNotification()
  const [activeTab, setActiveTab] = useState('overview')
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<StockInProduct | null>(
    null
  )
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [sellerNotes, setSellerNotes] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [isSelectProductModalOpen, setIsSelectProductModalOpen] = useState(false)
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false)
  const [selectedBoostProduct, setSelectedBoostProduct] = useState<{
    id: string
    title: string
  } | null>(null)

  const confirmOrderMutation = useConfirmOrder()
  const updateOrderStatusMutation = useUpdateOrderStatus()
  const removeBoostMutation = useRemoveProductBoost()

  const handleStockIn = async (data: {
    quantity: number
    costPrice: number
    supplier: string
    batchNumber?: string
    expiryDate?: string
    notes?: string
    location: string
    productId: string
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    notify({
      type: 'success',
      title: 'Nhập kho thành công',
      message: `Đã nhập ${data.quantity} sản phẩm vào kho`,
    })

    setIsStockInModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenStockInModal = (product: StockInProduct) => {
    setSelectedProduct(product)
    setIsStockInModalOpen(true)
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
      refetchOrders()
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Có lỗi xảy ra khi xác nhận đơn hàng')
      )
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
      refetchOrders()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Có lỗi xảy ra khi hủy đơn hàng'))
      console.error('Error cancelling order:', error)
    }
  }

  const handleSelectProductToBoost = (productId: string, productTitle: string) => {
    setSelectedBoostProduct({ id: productId, title: productTitle })
    setIsSelectProductModalOpen(false)
    setIsBoostModalOpen(true)
  }

  const handleCloseBoostModal = () => {
    setIsBoostModalOpen(false)
    setSelectedBoostProduct(null)
  }

  // Handle boost again for a product
  const handleBoostAgain = (productId: string, productTitle: string) => {
    setSelectedBoostProduct({ id: productId, title: productTitle })
    setIsBoostModalOpen(true)
  }

  // Handle remove boost from product
  const handleRemoveBoost = async (productId: string) => {
    try {
      await removeBoostMutation.mutateAsync(productId)
      toast.success('Đã xoá sản phẩm khỏi danh sách đẩy')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Có lỗi xảy ra khi xoá boost'))
    }
  }

  const formatNumber = (num: number): string => {
    if (!num) {
      return null
    }

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const stats = dashboardStats
    ? [
        {
          title: 'Tổng sản phẩm',
          value: dashboardStats.totalProducts.value.toString(),
          icon: Package,
          change: `${dashboardStats.totalProducts.change >= 0 ? '+' : ''}${dashboardStats.totalProducts.change.toFixed(1)}%`,
          changeType: dashboardStats.totalProducts.changeType,
          subtitle: dashboardStats.totalProducts.subtitle,
        },
        {
          title: 'Doanh thu tháng',
          value: formatCurrency(dashboardStats.revenue.value),
          icon: DollarSign,
          change: `${dashboardStats.revenue.change >= 0 ? '+' : ''}${dashboardStats.revenue.change.toFixed(1)}%`,
          changeType: dashboardStats.revenue.changeType,
          subtitle: dashboardStats.revenue.subtitle,
        },
        {
          title: 'Đơn hàng',
          value: formatNumber(dashboardStats.orders.value),
          icon: ShoppingCart,
          change: `${dashboardStats.orders.change >= 0 ? '+' : ''}${dashboardStats.orders.change.toFixed(1)}%`,
          changeType: dashboardStats.orders.changeType,
          subtitle: dashboardStats.orders.subtitle,
        },
        {
          title: 'Lượt xem',
          value: formatNumber(dashboardStats.views.value),
          icon: Eye,
          change: `${dashboardStats.views.change >= 0 ? '+' : ''}${dashboardStats.views.change.toFixed(1)}%`,
          changeType: dashboardStats.views.changeType,
          subtitle: dashboardStats.views.subtitle,
        },
      ]
    : []

  // Filter recent orders: within 7 days and not completed/cancelled
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentOrders = (ordersData?.items || []).filter(order => {
    // Handle both timestamp string and ISO date string
    const orderDate = /^\d+$/.test(order.createdAt)
      ? parseInt(order.createdAt, 10)
      : new Date(order.createdAt).getTime()
    const isRecent = orderDate >= sevenDaysAgo
    const isNotCompleted = order.status !== 'completed' && order.status !== 'cancelled'
    return isRecent && isNotCompleted
  })

  const lowStockProducts: (StockInProduct & { status: string })[] = (
    lowStockProductsData || []
  ).map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    currentStock: product.currentStock,
    minStock: product.minStock,
    maxStock: product.maxStock,
    status: product.status,
  }))

  // Get boosted products from product_boosts table via /seller/products/boosted API
  const boostedProducts = (boostedProductsData?.items || []).map(boost => ({
    id: boost.product?.id || boost.productId.toString(),
    name: boost.product?.title || boost.product?.name || 'Sản phẩm',
    image: boost.product?.images?.[0] || '',
    price: boost.product?.price || 0,
    viewCount: boost.product?.viewCount || 0,
    packageName: boost.packageName,
    endAt: boost.endAt,
    isActive: boost.isActive,
  }))

  // Calculate remaining time from endAt timestamp string
  const getRemainingTime = (endAtString: string) => {
    // Handle both numeric timestamp string and ISO date string
    const endTime = /^\d+$/.test(endAtString)
      ? parseInt(endAtString, 10)
      : new Date(endAtString).getTime()

    const now = Date.now()
    const diff = endTime - now

    if (diff <= 0) {
      return { text: 'Đã hết hạn', color: 'text-red-600' }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return {
        text: `Còn ${days} ngày ${hours} giờ`,
        color: days <= 1 ? 'text-orange-600' : 'text-green-600',
      }
    } else if (hours > 0) {
      return {
        text: `Còn ${hours} giờ ${minutes} phút`,
        color: 'text-orange-600',
      }
    } else {
      return { text: `Còn ${minutes} phút`, color: 'text-red-600' }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    // Handle both timestamp string (numeric) and ISO date string
    const date = /^\d+$/.test(dateString)
      ? new Date(parseInt(dateString, 10))
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'confirmed':
        return 'bg-blue-500'
      case 'preparing':
        return 'bg-purple-500'
      case 'ready':
        return 'bg-green-500'
      case 'ready_for_pickup':
        return 'bg-purple-500'
      case 'completed':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'refunded':
        return 'bg-gray-500'
      case 'shipped':
        return 'bg-blue-500' // Keep for backward compatibility
      case 'processing':
        return 'bg-purple-500'
      case 'delivered':
        return 'bg-green-500' // Keep for backward compatibility
      case 'low_stock':
        return 'bg-yellow-500'
      case 'out_of_stock':
        return 'bg-red-500'
      case 'in_stock':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'preparing':
        return 'Đang chuẩn bị'
      case 'ready':
        return 'Sẵn sàng lấy hàng'
      case 'ready_for_pickup':
        return 'Sẵn sàng lấy'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      case 'refunded':
        return 'Đã hoàn tiền'
      case 'shipped':
        return 'Đã giao' // Keep for backward compatibility
      case 'delivered':
        return 'Đã nhận' // Keep for backward compatibility
      case 'processing':
        return 'Đang xử lý'
      case 'low_stock':
        return 'Sắp hết'
      case 'out_of_stock':
        return 'Hết hàng'
      case 'in_stock':
        return 'Còn hàng'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard người bán</h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động kinh doanh của bạn
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/seller/products/import">
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Link>
          </Button>
          <Button asChild>
            <Link to="/seller/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="orders">
            Đơn hàng
            {recentOrders.filter(o => o.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {recentOrders.filter(o => o.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="promoted">
            <Sparkles className="h-4 w-4 mr-1" />
            Đang đẩy
          </TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant={
                        stat.changeType === 'positive'
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      so với tháng trước
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Quản lý sản phẩm</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Thêm, sửa, xóa sản phẩm
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/products">Quản lý</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-1">Import sản phẩm</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Import Excel/CSV hàng loạt
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/products/import">Import</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Quản lý khách hàng</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Xem danh sách khách hàng
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/customers">Xem</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Ví & Nạp tiền</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Nạp tiền để đẩy bài
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/top-up">Xem</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-1">Đơn hàng</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Quản lý đơn hàng
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/orders">Xem</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-1">Doanh thu & Báo cáo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Thống kê & Báo cáo
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/revenue">Xem</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Đơn hàng gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingOrders ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Đang tải...
                    </p>
                  </div>
                ) : recentOrders.length > 0 ? (
                  recentOrders.slice(0, 3).map(order => (
                    <div
                      key={order.id}
                      className="p-3 border rounded-lg space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items[0]?.productName || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(order.total)}
                          </p>
                          <Badge
                            className={`${getStatusColor(order.status)} text-white text-xs`}
                          >
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>
                      {order.status === 'pending' && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
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
                            variant="outline"
                            size="sm"
                            className="flex-1 border-red-500 text-red-700 hover:bg-red-50 text-xs"
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
                            Hủy đơn
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Chưa có đơn hàng nào</p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seller/orders">Xem tất cả đơn hàng</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Đang tải đơn hàng...
                  </p>
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="grid gap-3">
                  {recentOrders.map(order => {
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
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Chưa có đơn hàng nào
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Bạn chưa có đơn hàng nào. Hãy bắt đầu bán hàng!
                  </p>
                  <Button asChild>
                    <Link to="/seller/products/add">Thêm sản phẩm</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promoted" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Sản phẩm đang được đẩy
                </CardTitle>
                <Button
                  onClick={() => setIsSelectProductModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Đẩy sản phẩm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBoosted ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Đang tải danh sách sản phẩm đang đẩy...
                  </p>
                </div>
              ) : boostedProducts.length > 0 ? (
                <div className="space-y-4">
                  {boostedProducts.map(product => {
                    const remaining = product.endAt ? getRemainingTime(product.endAt) : null
                    const isExpired = remaining?.text === 'Đã hết hạn'
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "p-4 border rounded-lg hover:shadow-md transition-shadow",
                          isExpired
                            ? "border-red-200 bg-red-50/30 hover:bg-red-50"
                            : "border-orange-200 bg-orange-50/30 hover:bg-orange-50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="relative cursor-pointer"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              onError={e => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://via.placeholder.com/80'
                              }}
                            />
                            <Badge className={cn(
                              "absolute -top-2 -right-2 text-white text-xs px-1.5 py-0.5",
                              isExpired ? "bg-red-500" : "bg-orange-500"
                            )}>
                              <Sparkles className="h-3 w-3" />
                            </Badge>
                          </div>
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg truncate">
                                {product.name}
                              </h3>
                              <Badge className={cn(
                                "text-white text-xs flex-shrink-0",
                                isExpired ? "bg-red-500" : "bg-orange-500"
                              )}>
                                {isExpired ? 'Hết hạn' : (product.packageName || 'Đang đẩy')}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-primary mb-2">
                              {formatPrice(product.price)}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{product.viewCount.toLocaleString()} lượt xem</span>
                              </div>
                              {remaining && (
                                <div className={`flex items-center gap-1 ${remaining.color}`}>
                                  <Timer className="h-4 w-4" />
                                  <span>{remaining.text}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                              onClick={e => {
                                e.stopPropagation()
                                handleBoostAgain(product.id, product.name)
                              }}
                              disabled={removeBoostMutation.isPending}
                            >
                              <Rocket className="h-4 w-4 mr-1" />
                              Đẩy thêm
                            </Button>
                            {isExpired && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleRemoveBoost(product.id)
                                }}
                                disabled={removeBoostMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xoá
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Chưa có sản phẩm nào đang được đẩy
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Hãy đẩy sản phẩm của bạn để tăng lượt xem và doanh số!
                  </p>
                  <Button
                    onClick={() => setIsSelectProductModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đẩy sản phẩm ngay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Cảnh báo tồn kho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Tồn kho: {product.currentStock} / Tối thiểu:{' '}
                        {product.minStock}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${getStatusColor(product.status)} text-white`}
                      >
                        {getStatusLabel(product.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const { status: _status, ...productData } = product
                          handleOpenStockInModal(productData)
                        }}
                      >
                        Nhập hàng
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock In Modal */}
      <StockInModal
        isOpen={isStockInModalOpen}
        onClose={() => {
          setIsStockInModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        onStockIn={handleStockIn}
      />

      {/* Confirm Order Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng {selectedOrderId}? Đơn
              hàng sẽ chuyển sang trạng thái "Đã xác nhận".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
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
              Bạn có chắc chắn muốn hủy đơn hàng {selectedOrderId}? Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">
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

      {/* Select Product to Boost Modal */}
      <SelectProductToBoostModal
        isOpen={isSelectProductModalOpen}
        onClose={() => setIsSelectProductModalOpen(false)}
        onSelectProduct={handleSelectProductToBoost}
      />

      {/* Boost Product Modal */}
      {selectedBoostProduct && (
        <BoostProductModal
          isOpen={isBoostModalOpen}
          onClose={handleCloseBoostModal}
          productId={selectedBoostProduct.id}
          productTitle={selectedBoostProduct.title}
        />
      )}
    </div>
  )
}
