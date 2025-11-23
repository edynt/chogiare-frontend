import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Target,
  FileSpreadsheet,
  Filter
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface RevenueData {
  date: string
  revenue: number
  orders: number
  productsSold: number
}

interface TopProduct {
  name: string
  orders: number
  revenue: number
  growth: string
  quantity: number
}

export default function RevenueReportsPage() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('30d')
  const [reportType, setReportType] = useState('overview')

  // Mock data - Replace with actual API calls
  const overviewStats = [
    {
      title: 'Doanh thu tổng',
      value: '125.7M',
      change: '+18.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      subtitle: 'Tháng này: 125.7M VNĐ'
    },
    {
      title: 'Đơn hàng',
      value: '1,247',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      subtitle: 'Đơn hàng thành công: 1,189'
    },
    {
      title: 'Sản phẩm đã bán',
      value: '3,456',
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: Package,
      subtitle: 'Tăng trưởng: 8.7%'
    },
    {
      title: 'Lợi nhuận',
      value: '25.2M',
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      subtitle: 'Tỷ suất lợi nhuận: 20%'
    }
  ]

  const revenueData: RevenueData[] = [
    { date: '2024-01-01', revenue: 2500000, orders: 12, productsSold: 34 },
    { date: '2024-01-02', revenue: 3200000, orders: 15, productsSold: 42 },
    { date: '2024-01-03', revenue: 2800000, orders: 13, productsSold: 38 },
    { date: '2024-01-04', revenue: 4100000, orders: 18, productsSold: 51 },
    { date: '2024-01-05', revenue: 3500000, orders: 16, productsSold: 45 },
    { date: '2024-01-06', revenue: 3900000, orders: 17, productsSold: 48 },
    { date: '2024-01-07', revenue: 4200000, orders: 19, productsSold: 53 }
  ]

  const topProducts: TopProduct[] = [
    { name: 'iPhone 14 Pro Max', orders: 234, revenue: 58500000, growth: '+15%', quantity: 234 },
    { name: 'MacBook Air M2', orders: 156, revenue: 43680000, growth: '+22%', quantity: 156 },
    { name: 'AirPods Pro 2nd Gen', orders: 445, revenue: 20025000, growth: '+8%', quantity: 445 },
    { name: 'Samsung Galaxy S23', orders: 123, revenue: 27060000, growth: '+18%', quantity: 123 },
    { name: 'iPad Pro 12.9', orders: 89, revenue: 26720000, growth: '+12%', quantity: 89 }
  ]

  const categoryRevenue = [
    { name: 'Điện thoại', revenue: 85560000, percentage: 35, orders: 357 },
    { name: 'Laptop', revenue: 69800000, percentage: 28, orders: 234 },
    { name: 'Phụ kiện', revenue: 31200000, percentage: 13, orders: 521 },
    { name: 'Thời trang', revenue: 26340000, percentage: 11, orders: 189 },
    { name: 'Gia dụng', revenue: 20350000, percentage: 8, orders: 156 },
    { name: 'Khác', revenue: 10200000, percentage: 5, orders: 87 }
  ]

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0)
  const totalProductsSold = revenueData.reduce((sum, item) => sum + item.productsSold, 0)

  const handleExportReport = (format: 'excel' | 'pdf' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Doanh thu & Báo cáo</h1>
              <p className="text-muted-foreground">
                Theo dõi doanh thu, đơn hàng và hiệu suất kinh doanh của bạn
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 ngày qua</SelectItem>
                  <SelectItem value="30d">30 ngày qua</SelectItem>
                  <SelectItem value="90d">90 ngày qua</SelectItem>
                  <SelectItem value="1y">1 năm qua</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.subtitle}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
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
                          so với kỳ trước
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ doanh thu</CardTitle>
                <CardDescription>Doanh thu theo ngày trong {timeRange === '7d' ? '7 ngày' : timeRange === '30d' ? '30 ngày' : timeRange === '90d' ? '90 ngày' : '1 năm'} qua</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueData.map((item, index) => {
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
                    const height = (item.revenue / maxRevenue) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${formatDate(item.date)}: ${formatPrice(item.revenue)}`}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top sản phẩm bán chạy</CardTitle>
                <CardDescription>Top 5 sản phẩm có doanh thu cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.orders} đơn hàng • {product.quantity} sản phẩm
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(product.revenue)}</p>
                        <Badge variant="default" className="text-xs">
                          {product.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết doanh thu</CardTitle>
                <CardDescription>Bảng chi tiết doanh thu theo ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Doanh thu</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead>Sản phẩm đã bán</TableHead>
                        <TableHead>Doanh thu trung bình/đơn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatPrice(item.revenue)}
                          </TableCell>
                          <TableCell>{item.orders}</TableCell>
                          <TableCell>{item.productsSold}</TableCell>
                          <TableCell>
                            {formatPrice(Math.round(item.revenue / item.orders))}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted font-bold">
                        <TableCell>Tổng cộng</TableCell>
                        <TableCell className="text-green-600">{formatPrice(totalRevenue)}</TableCell>
                        <TableCell>{totalOrders}</TableCell>
                        <TableCell>{totalProductsSold}</TableCell>
                        <TableCell>
                          {formatPrice(Math.round(totalRevenue / totalOrders))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo danh mục</CardTitle>
                <CardDescription>Phân tích doanh thu theo từng danh mục sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryRevenue.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {category.orders} đơn hàng
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(category.revenue)}</p>
                          <Badge variant="outline">{category.percentage}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Doanh thu</TableHead>
                        <TableHead>Tăng trưởng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.orders}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatPrice(product.revenue)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{product.growth}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tạo báo cáo</CardTitle>
                <CardDescription>Xuất báo cáo doanh thu và thống kê ra file Excel, PDF hoặc CSV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Xuất Excel</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Báo cáo chi tiết định dạng Excel
                      </p>
                      <Button onClick={() => handleExportReport('excel')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-red-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Xuất PDF</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Báo cáo định dạng PDF để in
                      </p>
                      <Button onClick={() => handleExportReport('pdf')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Xuất CSV</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Dữ liệu thô định dạng CSV
                      </p>
                      <Button onClick={() => handleExportReport('csv')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

