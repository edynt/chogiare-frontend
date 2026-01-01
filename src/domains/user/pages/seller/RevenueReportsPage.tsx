import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  FileSpreadsheet,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  useRevenueOverview,
  useRevenueData,
  useTopProducts,
  useCategoryRevenue,
} from '@/hooks/useReports'

export default function RevenueReportsPage() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [reportType, setReportType] = useState('overview')

  const handleTimeRangeChange = (value: string) => {
    const validTimeRange = value as '7d' | '30d' | '90d' | '1y'
    if (
      value === '7d' ||
      value === '30d' ||
      value === '90d' ||
      value === '1y'
    ) {
      setTimeRange(validTimeRange)
    }
  }

  const { data: overviewData, isLoading: isLoadingOverview } =
    useRevenueOverview({ timeRange })
  const { data: revenueData = [], isLoading: isLoadingRevenue } =
    useRevenueData({ timeRange })
  const { data: topProducts = [], isLoading: isLoadingTopProducts } =
    useTopProducts({ timeRange, limit: 5 })
  const { data: categoryRevenue = [], isLoading: isLoadingCategory } =
    useCategoryRevenue({ timeRange })

  const formatNumber = (num: number): string => {
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

  const formatChange = (change: number): string => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  const overviewStats = overviewData
    ? [
        {
          title: 'Doanh thu tổng',
          value: formatNumber(overviewData.totalRevenue.value),
          change: formatChange(overviewData.totalRevenue.change),
          changeType: overviewData.totalRevenue.changeType,
          icon: DollarSign,
          subtitle: `Tháng này: ${formatNumber(overviewData.totalRevenue.value)} VNĐ`,
        },
        {
          title: 'Đơn hàng',
          value: overviewData.totalOrders.value.toLocaleString(),
          change: formatChange(overviewData.totalOrders.change),
          changeType: overviewData.totalOrders.changeType,
          icon: ShoppingCart,
          subtitle: `Đơn hàng thành công: ${overviewData.totalOrders.value}`,
        },
        {
          title: 'Sản phẩm đã bán',
          value: overviewData.productsSold.value.toLocaleString(),
          change: formatChange(overviewData.productsSold.change),
          changeType: overviewData.productsSold.changeType,
          icon: Package,
          subtitle: `Tăng trưởng: ${formatChange(overviewData.productsSold.change)}`,
        },
        {
          title: 'Lợi nhuận',
          value: formatNumber(overviewData.profit.value),
          change: formatChange(overviewData.profit.change),
          changeType: overviewData.profit.changeType,
          icon: TrendingUp,
          subtitle: `Tỷ suất lợi nhuận: ${((overviewData.profit.value / overviewData.totalRevenue.value) * 100).toFixed(0)}%`,
        },
      ]
    : []

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0)
  const totalProductsSold = revenueData.reduce(
    (sum, item) => sum + item.productsSold,
    0
  )

  const handleExportReport = (format: 'excel' | 'pdf' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
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
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
              <Button
                variant="outline"
                onClick={() => handleExportReport('excel')}
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          value={reportType}
          onValueChange={setReportType}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isLoadingOverview ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : (
              <>
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
                    <CardDescription>
                      Doanh thu theo ngày trong{' '}
                      {timeRange === '7d'
                        ? '7 ngày'
                        : timeRange === '30d'
                          ? '30 ngày'
                          : timeRange === '90d'
                            ? '90 ngày'
                            : '1 năm'}{' '}
                      qua
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {revenueData.map((item, index) => {
                        const maxRevenue = Math.max(
                          ...revenueData.map(d => d.revenue)
                        )
                        const height = (item.revenue / maxRevenue) * 100
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                              style={{ height: `${height}%` }}
                              title={`${formatDate(item.date)}: ${formatPrice(item.revenue)}`}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(item.date).getDate()}/
                              {new Date(item.date).getMonth() + 1}
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
                    <CardDescription>
                      Top 5 sản phẩm có doanh thu cao nhất
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTopProducts ? (
                      <div className="text-center py-8">Đang tải...</div>
                    ) : (
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="font-bold text-primary">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.orders} đơn hàng • {product.quantity}{' '}
                                  sản phẩm
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">
                                {formatPrice(product.revenue)}
                              </p>
                              <Badge variant="default" className="text-xs">
                                {product.growth}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết doanh thu</CardTitle>
                <CardDescription>
                  Bảng chi tiết doanh thu theo ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRevenue ? (
                  <div className="text-center py-8">Đang tải...</div>
                ) : (
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
                              {formatPrice(
                                Math.round(item.revenue / item.orders)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted font-bold">
                          <TableCell>Tổng cộng</TableCell>
                          <TableCell className="text-green-600">
                            {formatPrice(totalRevenue)}
                          </TableCell>
                          <TableCell>{totalOrders}</TableCell>
                          <TableCell>{totalProductsSold}</TableCell>
                          <TableCell>
                            {formatPrice(
                              totalOrders > 0
                                ? Math.round(totalRevenue / totalOrders)
                                : 0
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo danh mục</CardTitle>
                <CardDescription>
                  Phân tích doanh thu theo từng danh mục sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCategory ? (
                  <div className="text-center py-8">Đang tải...</div>
                ) : (
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
                            <p className="font-semibold">
                              {formatPrice(category.revenue)}
                            </p>
                            <Badge variant="outline">
                              {category.percentage}%
                            </Badge>
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
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTopProducts ? (
                  <div className="text-center py-8">Đang tải...</div>
                ) : (
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
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tạo báo cáo</CardTitle>
                <CardDescription>
                  Xuất báo cáo doanh thu và thống kê ra file Excel, PDF hoặc CSV
                </CardDescription>
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
                      <Button
                        onClick={() => handleExportReport('excel')}
                        variant="outline"
                      >
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
                      <Button
                        onClick={() => handleExportReport('pdf')}
                        variant="outline"
                      >
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
                      <Button
                        onClick={() => handleExportReport('csv')}
                        variant="outline"
                      >
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
