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
  ArrowDownLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useReportsOverview,
  useRevenueChart,
  useCategoryDistribution,
  useTopProductsReport,
  useTopSellersReport,
  useDailyStats,
  useExportReport,
} from '@/hooks/useAdmin'
import type { QueryReportsParams } from '@/api/admin'

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const params: QueryReportsParams = { timeRange }

  const { data: overview, isLoading: isLoadingOverview } = useReportsOverview(params)
  const { data: revenueChart = [] } = useRevenueChart(params)
  const { data: categoryDistribution = [] } = useCategoryDistribution()
  const { data: topProducts = [], isLoading: isLoadingProducts } = useTopProductsReport({ limit: 5, timeRange })
  const { data: topSellers = [], isLoading: isLoadingSellers } = useTopSellersReport({ limit: 5, timeRange })
  const { data: dailyStats = [], isLoading: isLoadingDaily } = useDailyStats(params)
  const exportMutation = useExportReport()

  const handleExport = () => {
    exportMutation.mutate(params, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${timeRange}-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Đã xuất báo cáo thành công')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xuất báo cáo')
      },
    })
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

  const formatValue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return formatNumber(value)
  }

  const overviewStats = [
    {
      title: 'Tổng lượt truy cập',
      value: overview ? formatValue(overview.totalViews.value) : '0',
      change: overview ? `${overview.totalViews.change > 0 ? '+' : ''}${overview.totalViews.change}%` : '0%',
      changeType: overview?.totalViews.changeType || 'positive',
      icon: Eye,
      color: 'blue',
    },
    {
      title: 'Người dùng mới',
      value: overview ? formatValue(overview.newUsers.value) : '0',
      change: overview ? `${overview.newUsers.change > 0 ? '+' : ''}${overview.newUsers.change}%` : '0%',
      changeType: overview?.newUsers.changeType || 'positive',
      icon: Users,
      color: 'green',
    },
    {
      title: 'Đơn hàng',
      value: overview ? formatValue(overview.orders.value) : '0',
      change: overview ? `${overview.orders.change > 0 ? '+' : ''}${overview.orders.change}%` : '0%',
      changeType: overview?.orders.changeType || 'positive',
      icon: ShoppingCart,
      color: 'purple',
    },
    {
      title: 'Doanh thu',
      value: overview ? formatValue(overview.revenue.value) + ' VNĐ' : '0 VNĐ',
      change: overview ? `${overview.revenue.change > 0 ? '+' : ''}${overview.revenue.change}%` : '0%',
      changeType: overview?.revenue.changeType || 'positive',
      icon: DollarSign,
      color: 'orange',
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Phân tích dữ liệu và hiệu suất của nền tảng</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeRange(value)}>
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
          <Button variant="outline" onClick={handleExport} disabled={exportMutation.isPending}>
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingOverview ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          overviewStats.map((stat, index) => {
            const Icon = stat.icon
            const ChangeIcon = getChangeIcon(stat.changeType)
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
          })
        )}
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
            {revenueChart.length === 0 ? (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Không có dữ liệu</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-end gap-1">
                {revenueChart.slice(-14).map((item, index) => {
                  const maxRevenue = Math.max(...revenueChart.map(r => r.revenue))
                  const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                        style={{ height: `${height}%`, minHeight: item.revenue > 0 ? '4px' : '0' }}
                        title={`${item.date}: ${formatPrice(item.revenue)}`}
                      />
                      <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                        {new Date(item.date).getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
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
            {categoryDistribution.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            ) : (
              <div className="space-y-4">
                {categoryDistribution.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' :
                        index === 4 ? 'bg-pink-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-purple-500' :
                            index === 4 ? 'bg-pink-500' :
                            'bg-gray-500'
                          }`}
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
            )}
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
          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatNumber(product.views)}</TableCell>
                      <TableCell>{formatNumber(product.sales)}</TableCell>
                      <TableCell>{formatPrice(product.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
          {isLoadingSellers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : topSellers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người bán</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Doanh thu</TableHead>
                    <TableHead>Đánh giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSellers.map((seller, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{formatNumber(seller.products)}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Thống kê hàng ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDaily ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dailyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Lượt truy cập</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Doanh thu</TableHead>
                    <TableHead>Người dùng mới</TableHead>
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
                      <TableCell>{formatNumber(day.newUsers)}</TableCell>
                      <TableCell>
                        {day.visitors > 0 ? ((day.orders / day.visitors) * 100).toFixed(2) : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
