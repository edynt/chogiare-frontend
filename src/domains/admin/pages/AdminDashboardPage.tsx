import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs'
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Target,
  Loader2
} from 'lucide-react'
import { useAdminDashboardStats, useAdminRecentActivities, useAdminTopSellers } from '@/hooks/useAdmin'

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')

  const { data: dashboardStats, isLoading: statsLoading } = useAdminDashboardStats()
  const { data: recentActivities = [], isLoading: activitiesLoading } = useAdminRecentActivities(5)
  const { data: topSellers = [], isLoading: sellersLoading } = useAdminTopSellers(5)

  const formatNumber = (num: number) => {
    if(!num) {
        return null;
    }
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num)
  }

  const stats = useMemo(() => {
    if (!dashboardStats) return []
    
    return [
      {
        title: 'Tổng người dùng',
        value: formatNumber(dashboardStats.totalUsers.value),
        change: `${dashboardStats.totalUsers.change > 0 ? '+' : ''}${dashboardStats.totalUsers.change.toFixed(1)}%`,
        changeType: dashboardStats.totalUsers.changeType,
        icon: Users,
        color: 'blue',
        subtitle: `Người bán: ${formatNumber(dashboardStats.totalUsers.sellers)} | Người mua: ${formatNumber(dashboardStats.totalUsers.buyers)}`
      },
      {
        title: 'Sản phẩm đã đăng',
        value: formatNumber(dashboardStats.totalProducts.value),
        change: `${dashboardStats.totalProducts.change > 0 ? '+' : ''}${dashboardStats.totalProducts.change.toFixed(1)}%`,
        changeType: dashboardStats.totalProducts.changeType,
        icon: Package,
        color: 'green',
        subtitle: `Đang hoạt động: ${formatNumber(dashboardStats.totalProducts.active)} | Chờ duyệt: ${formatNumber(dashboardStats.totalProducts.pending)}`
      },
      {
        title: 'Đơn hàng tháng này',
        value: formatNumber(dashboardStats.totalOrders.value),
        change: `${dashboardStats.totalOrders.change > 0 ? '+' : ''}${dashboardStats.totalOrders.change.toFixed(1)}%`,
        changeType: dashboardStats.totalOrders.changeType,
        icon: ShoppingCart,
        color: 'purple',
        subtitle: `Thành công: ${formatNumber(dashboardStats.totalOrders.completed)} | Đang xử lý: ${formatNumber(dashboardStats.totalOrders.processing)}`
      },
      {
        title: 'Doanh thu tháng',
        value: formatCurrency(dashboardStats.revenue.value),
        change: `${dashboardStats.revenue.change > 0 ? '+' : ''}${dashboardStats.revenue.change.toFixed(1)}%`,
        changeType: dashboardStats.revenue.changeType,
        icon: DollarSign,
        color: 'orange',
        subtitle: `Hoa hồng: ${formatCurrency(dashboardStats.revenue.commission)} | Lợi nhuận: ${formatCurrency(dashboardStats.revenue.profit)}`
      }
    ]
  }, [dashboardStats])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return Users
      case 'product_approval': return Package
      case 'order_completed': return ShoppingCart
      case 'payment_received': return DollarSign
      case 'system_alert': return AlertTriangle
      default: return Activity
    }
  }

  const formatTimeAgo = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    return `${diffDays} ngày trước`
  }

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
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => {
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
          })
        )}
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
          {sellersLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : topSellers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu người bán
            </div>
          ) : (
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
                          <span className="text-sm text-gray-600">{seller.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{seller.orders} đơn hàng</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(seller.revenue)}</p>
                    <p className="text-sm text-gray-500">Doanh thu</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
