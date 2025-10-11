import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Target
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '12,547',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      subtitle: 'Người bán: 2,341 | Người mua: 10,206'
    },
    {
      title: 'Sản phẩm đã đăng',
      value: '45,892',
      change: '+8.2%',
      changeType: 'positive',
      icon: Package,
      color: 'green',
      subtitle: 'Đang hoạt động: 38,456 | Chờ duyệt: 1,234'
    },
    {
      title: 'Đơn hàng tháng này',
      value: '8,934',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'purple',
      subtitle: 'Thành công: 8,456 | Đang xử lý: 478'
    },
    {
      title: 'Doanh thu tháng',
      value: '2.4B VNĐ',
      change: '+22.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange',
      subtitle: 'Hoa hồng: 120M VNĐ | Lợi nhuận: 2.28B VNĐ'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      title: 'Người dùng mới đăng ký',
      description: 'Nguyễn Văn A đã đăng ký tài khoản người bán',
      time: '2 phút trước',
      status: 'pending',
      icon: Users
    },
    {
      id: 2,
      type: 'product_approval',
      title: 'Sản phẩm cần duyệt',
      description: 'iPhone 14 Pro Max - Chờ phê duyệt',
      time: '15 phút trước',
      status: 'warning',
      icon: Package
    },
    {
      id: 3,
      type: 'order_completed',
      title: 'Đơn hàng hoàn thành',
      description: 'Đơn hàng #ORD-2024-001 đã được giao thành công',
      time: '1 giờ trước',
      status: 'success',
      icon: ShoppingCart
    },
    {
      id: 4,
      type: 'payment_received',
      title: 'Thanh toán nhận được',
      description: 'Nhận thanh toán 2.5M VNĐ từ TechStore Pro',
      time: '2 giờ trước',
      status: 'success',
      icon: DollarSign
    },
    {
      id: 5,
      type: 'system_alert',
      title: 'Cảnh báo hệ thống',
      description: 'Lưu lượng truy cập cao bất thường',
      time: '3 giờ trước',
      status: 'error',
      icon: AlertTriangle
    }
  ]

  const topSellers = [
    { name: 'TechStore Pro', orders: 1247, revenue: '450M VNĐ', rating: 4.9 },
    { name: 'Audio World', orders: 892, revenue: '320M VNĐ', rating: 4.8 },
    { name: 'Fashion Hub', orders: 756, revenue: '280M VNĐ', rating: 4.7 },
    { name: 'Home & Garden', orders: 634, revenue: '195M VNĐ', rating: 4.6 },
    { name: 'Sports Zone', orders: 521, revenue: '168M VNĐ', rating: 4.5 }
  ]

  const systemHealth = [
    { name: 'API Response Time', value: '120ms', status: 'good', color: 'green' },
    { name: 'Database Performance', value: '98.5%', status: 'good', color: 'green' },
    { name: 'Server Uptime', value: '99.9%', status: 'excellent', color: 'blue' },
    { name: 'Error Rate', value: '0.02%', status: 'good', color: 'green' },
    { name: 'Active Users', value: '2,341', status: 'normal', color: 'yellow' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getHealthColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600'
      case 'blue': return 'text-blue-600'
      case 'yellow': return 'text-yellow-600'
      case 'red': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại, Admin! Đây là bảng điều khiển tổng quan của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7 ngày</TabsTrigger>
              <TabsTrigger value="30d">30 ngày</TabsTrigger>
              <TabsTrigger value="90d">90 ngày</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                )
              })}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem tất cả hoạt động
            </Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tình trạng hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className={`text-lg font-bold ${getHealthColor(item.color)}`}>
                      {item.value}
                    </p>
                  </div>
                  <Badge 
                    variant={item.status === 'excellent' ? 'default' : 'outline'}
                    className={getHealthColor(item.color)}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Hệ thống hoạt động bình thường
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Sellers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top người bán hàng đầu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSellers.map((seller, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{seller.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{seller.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{seller.orders} đơn hàng</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{seller.revenue}</p>
                  <p className="text-sm text-gray-500">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Duyệt người dùng</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Kiểm duyệt sản phẩm</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Xem đơn hàng</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Báo cáo chi tiết</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
