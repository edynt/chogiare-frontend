import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSellerProducts } from '@/hooks/useProducts'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Plus, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp,
  Eye,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Truck,
  Wallet,
  Star,
  MessageCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Target,
  Zap
} from 'lucide-react'

export function SellerDashboardContent() {
  const { data: products, isLoading } = useSellerProducts()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for enhanced dashboard
  const stats = [
    { 
      title: 'Tổng sản phẩm', 
      value: '156', 
      icon: Package, 
      change: '+12', 
      changeType: 'positive',
      subtitle: 'Hoạt động: 142'
    },
    { 
      title: 'Doanh thu tháng', 
      value: '25.7M', 
      icon: DollarSign, 
      change: '+18.5%', 
      changeType: 'positive',
      subtitle: 'Lợi nhuận: 4.2M'
    },
    { 
      title: 'Đơn hàng', 
      value: '1,247', 
      icon: ShoppingCart, 
      change: '+89', 
      changeType: 'positive',
      subtitle: 'Chờ xử lý: 23'
    },
    { 
      title: 'Lượt xem', 
      value: '15.6K', 
      icon: Eye, 
      change: '+1.2K', 
      changeType: 'positive',
      subtitle: 'Hôm nay: 234'
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 14 Pro Max',
      amount: 25000000,
      status: 'pending',
      date: '2024-01-15T14:30:00Z'
    },
    {
      id: 'ORD-002',
      customer: 'Trần Thị B',
      product: 'AirPods Pro 2nd Gen',
      amount: 4500000,
      status: 'shipped',
      date: '2024-01-15T12:15:00Z'
    },
    {
      id: 'ORD-003',
      customer: 'Lê Văn C',
      product: 'MacBook Air M2',
      amount: 28000000,
      status: 'delivered',
      date: '2024-01-14T16:45:00Z'
    }
  ]

  const lowStockProducts = [
    {
      id: '1',
      name: 'AirPods Pro 2nd Gen',
      currentStock: 5,
      minStock: 10,
      status: 'low_stock'
    },
    {
      id: '2',
      name: 'MacBook Air M2 13 inch',
      currentStock: 0,
      minStock: 5,
      status: 'out_of_stock'
    },
    {
      id: '3',
      name: 'iPhone 14 Pro Max 256GB',
      currentStock: 15,
      minStock: 10,
      status: 'in_stock'
    }
  ]

  const recentMessages = [
    {
      id: '1',
      customer: 'Nguyễn Văn A',
      message: 'Sản phẩm có còn hàng không?',
      time: '2 phút trước',
      unread: true
    },
    {
      id: '2',
      customer: 'Trần Thị B',
      message: 'Khi nào giao hàng?',
      time: '15 phút trước',
      unread: true
    },
    {
      id: '3',
      customer: 'Lê Văn C',
      message: 'Cảm ơn shop, sản phẩm rất tốt!',
      time: '1 giờ trước',
      unread: false
    }
  ]

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
      case 'pending': return 'bg-yellow-500'
      case 'shipped': return 'bg-blue-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'low_stock': return 'bg-yellow-500'
      case 'out_of_stock': return 'bg-red-500'
      case 'in_stock': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'shipped': return 'Đã giao'
      case 'delivered': return 'Đã nhận'
      case 'cancelled': return 'Đã hủy'
      case 'low_stock': return 'Sắp hết'
      case 'out_of_stock': return 'Hết hàng'
      case 'in_stock': return 'Còn hàng'
      default: return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard người bán</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động kinh doanh của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/inventory">
              <Package className="h-4 w-4 mr-2" />
              Quản lý kho
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="messages">Tin nhắn</TabsTrigger>
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
                      variant={stat.changeType === 'positive' ? 'default' : 'destructive'} 
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
                <p className="text-sm text-muted-foreground mb-3">Thêm, sửa, xóa sản phẩm</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/products">Quản lý</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Vận chuyển</h3>
                <p className="text-sm text-muted-foreground mb-3">Theo dõi đơn hàng</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/shipment">Xem</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Ví & Rút tiền</h3>
                <p className="text-sm text-muted-foreground mb-3">Quản lý tài chính</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/withdraw">Xem</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Cài đặt shop</h3>
                <p className="text-sm text-muted-foreground mb-3">Thông tin cửa hàng</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/shop-settings">Cài đặt</Link>
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
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.amount)}</p>
                      <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Xem tất cả đơn hàng
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Tin nhắn mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 p-3 border rounded-lg ${message.unread ? 'bg-blue-50' : ''}`}>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{message.customer}</p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{message.message}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/chat">Xem tất cả tin nhắn</Link>
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
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div>
                        <p className="font-medium">{order.product}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-lg">{formatPrice(order.amount)}</p>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Tồn kho: {product.currentStock} / Tối thiểu: {product.minStock}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(product.status)} text-white`}>
                        {getStatusLabel(product.status)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Nhập hàng
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/inventory">Quản lý tồn kho</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tin nhắn khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 p-4 border rounded-lg ${message.unread ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{message.customer}</p>
                        {message.unread && (
                          <Badge variant="destructive" className="text-xs">Mới</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.message}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/chat">Trả lời</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/chat">Xem tất cả tin nhắn</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
