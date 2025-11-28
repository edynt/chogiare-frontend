import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Download,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Package,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react'

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [reportType, setReportType] = useState('overview')

  // Mock data
  const overviewStats = [
    {
      title: 'Tổng lượt truy cập',
      value: '2.4M',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
      color: 'blue',
      subtitle: 'Tháng này: 180K'
    },
    {
      title: 'Người dùng mới',
      value: '15,847',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      color: 'green',
      subtitle: 'Tỷ lệ tăng trưởng: 8.2%'
    },
    {
      title: 'Đơn hàng',
      value: '8,934',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'purple',
      subtitle: 'Tỷ lệ chuyển đổi: 3.7%'
    },
    {
      title: 'Doanh thu',
      value: '2.4B VNĐ',
      change: '+22.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange',
      subtitle: 'Lợi nhuận: 480M VNĐ'
    }
  ]

  const topProducts = [
    { name: 'iPhone 14 Pro Max', views: 12500, orders: 234, revenue: 5850000000, growth: '+15%' },
    { name: 'MacBook Air M2', views: 8900, orders: 156, revenue: 4368000000, growth: '+22%' },
    { name: 'AirPods Pro 2nd Gen', views: 15600, orders: 445, revenue: 2002500000, growth: '+8%' },
    { name: 'Samsung Galaxy S23', views: 7800, orders: 123, revenue: 2706000000, growth: '+18%' },
    { name: 'iPad Pro 12.9', views: 5600, orders: 89, revenue: 2672000000, growth: '+12%' }
  ]

  const topSellers = [
    { name: 'TechStore Pro', orders: 1247, revenue: 450000000, growth: '+25%', rating: 4.9 },
    { name: 'Audio World', orders: 892, revenue: 320000000, growth: '+18%', rating: 4.8 },
    { name: 'Fashion Hub', orders: 756, revenue: 280000000, growth: '+12%', rating: 4.7 },
    { name: 'Home & Garden', orders: 634, revenue: 195000000, growth: '+8%', rating: 4.6 },
    { name: 'Sports Zone', orders: 521, revenue: 168000000, growth: '+15%', rating: 4.5 }
  ]

  const categoryStats = [
    { name: 'Điện thoại', products: 1250, orders: 2340, revenue: 1200000000, percentage: 35 },
    { name: 'Laptop', products: 890, orders: 1560, revenue: 980000000, percentage: 28 },
    { name: 'Phụ kiện', products: 2100, orders: 3450, revenue: 450000000, percentage: 13 },
    { name: 'Thời trang', products: 1800, orders: 2100, revenue: 380000000, percentage: 11 },
    { name: 'Gia dụng', products: 950, orders: 1200, revenue: 290000000, percentage: 8 },
    { name: 'Khác', products: 650, orders: 800, revenue: 150000000, percentage: 5 }
  ]

  const dailyStats = [
    { date: '2024-01-20', visitors: 12500, orders: 234, revenue: 125000000 },
    { date: '2024-01-21', visitors: 13200, orders: 256, revenue: 138000000 },
    { date: '2024-01-22', visitors: 11800, orders: 198, revenue: 112000000 },
    { date: '2024-01-23', visitors: 14500, orders: 287, revenue: 156000000 },
    { date: '2024-01-24', visitors: 16200, orders: 312, revenue: 178000000 },
    { date: '2024-01-25', visitors: 13800, orders: 245, revenue: 134000000 },
    { date: '2024-01-26', visitors: 15200, orders: 278, revenue: 167000000 }
  ]

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (changeType: string) => {
    return changeType === 'positive' ? ArrowUpRight : ArrowDownLeft
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Phân tích dữ liệu và hiệu suất của nền tảng</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">90 ngày qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon
          const ChangeIcon = getChangeIcon(stat.changeType)
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
                    <ChangeIcon className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Doanh thu theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Phân bố theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sản phẩm bán chạy nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Tăng trưởng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatNumber(product.views)}</TableCell>
                    <TableCell>{formatNumber(product.orders)}</TableCell>
                    <TableCell>{formatPrice(product.revenue)}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs">
                        {product.growth}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Sellers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top người bán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người bán</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Tăng trưởng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellers.map((seller, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{seller.name}</TableCell>
                    <TableCell>{formatNumber(seller.orders)}</TableCell>
                    <TableCell>{formatPrice(seller.revenue)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{seller.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(seller.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs">
                        {seller.growth}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Thống kê hàng ngày (7 ngày qua)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Lượt truy cập</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Tỷ lệ chuyển đổi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyStats.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(day.date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>{formatNumber(day.visitors)}</TableCell>
                    <TableCell>{formatNumber(day.orders)}</TableCell>
                    <TableCell>{formatPrice(day.revenue)}</TableCell>
                    <TableCell>
                      {((day.orders / day.visitors) * 100).toFixed(2)}%
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
