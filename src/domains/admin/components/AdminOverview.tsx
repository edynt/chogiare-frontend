import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageCircle,
  Star,
  AlertCircle,
} from 'lucide-react'

export function AdminOverview() {
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '12,345',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Sản phẩm',
      value: '5,678',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Package,
      color: 'text-green-600',
    },
    {
      title: 'Đơn hàng',
      value: '2,890',
      change: '-2.1%',
      trend: 'down' as const,
      icon: ShoppingCart,
      color: 'text-orange-600',
    },
    {
      title: 'Doanh thu',
      value: '2.5B VNĐ',
      change: '+15.3%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-purple-600',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'Người dùng mới đăng ký: Nguyễn Văn A',
      time: '5 phút trước',
      status: 'success',
    },
    {
      id: 2,
      type: 'product',
      message: 'Sản phẩm mới được thêm: iPhone 15 Pro',
      time: '15 phút trước',
      status: 'info',
    },
    {
      id: 3,
      type: 'order',
      message: 'Đơn hàng mới: #12345 - 2.5M VNĐ',
      time: '30 phút trước',
      status: 'success',
    },
    {
      id: 4,
      type: 'alert',
      message: 'Sản phẩm cần kiểm duyệt: MacBook Pro',
      time: '1 giờ trước',
      status: 'warning',
    },
    {
      id: 5,
      type: 'user',
      message: 'Người dùng bị khóa: Trần Thị B',
      time: '2 giờ trước',
      status: 'error',
    },
  ]

  const topProducts = [
    { name: 'iPhone 14 Pro Max', sales: 156, revenue: '3.9B VNĐ' },
    { name: 'Samsung Galaxy S23', sales: 134, revenue: '3.4B VNĐ' },
    { name: 'MacBook Pro M2', sales: 89, revenue: '3.1B VNĐ' },
    { name: 'iPad Air', sales: 67, revenue: '1.7B VNĐ' },
    { name: 'AirPods Pro', sales: 234, revenue: '1.2B VNĐ' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />
      case 'product':
        return <Package className="h-4 w-4" />
      case 'order':
        return <ShoppingCart className="h-4 w-4" />
      case 'alert':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success'
      case 'info':
        return 'text-info'
      case 'warning':
        return 'text-warning'
      case 'error':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === 'up'
                            ? 'text-success'
                            : 'text-destructive'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full bg-muted ${getActivityColor(activity.status)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem tất cả hoạt động
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem báo cáo chi tiết
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Quản lý người dùng</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Kiểm duyệt sản phẩm</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Xem đơn hàng</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
