import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Shield,
  Zap,
  Crown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Settings,
  FileText,
  AlertTriangle
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = {
    totalUsers: 12543,
    totalProducts: 8947,
    totalOrders: 3456,
    totalRevenue: 1250000000,
    pendingReviews: 23,
    activeUsers: 8921,
    newProducts: 156,
    completedOrders: 3201
  }

  const recentActivities = [
    { id: 1, type: 'user', message: 'Người dùng mới đăng ký: Nguyễn Văn A', time: '5 phút trước', status: 'success' },
    { id: 2, type: 'product', message: 'Sản phẩm mới cần kiểm duyệt: iPhone 15 Pro', time: '10 phút trước', status: 'warning' },
    { id: 3, type: 'order', message: 'Đơn hàng mới: #ORD-2024-001', time: '15 phút trước', status: 'info' },
    { id: 4, type: 'review', message: 'Báo cáo sản phẩm: Sản phẩm giả mạo', time: '20 phút trước', status: 'error' }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Quản trị hệ thống</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Quản lý toàn bộ hoạt động của nền tảng Chogiare - Nơi mua sắm giá tốt
              </p>
              
              {/* Performance indicators */}
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>+25% doanh thu tháng này</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>99.9% uptime</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-info" />
                  <span>Bảo mật cao</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Super Admin
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Người dùng
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Sản phẩm
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.activeUsers.toLocaleString()} đang hoạt động
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.newProducts} sản phẩm mới
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedOrders.toLocaleString()} đã hoàn thành
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    +25% so với tháng trước
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hoạt động gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-success' :
                        activity.status === 'warning' ? 'bg-warning' :
                        activity.status === 'error' ? 'bg-destructive' :
                        'bg-info'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Thao tác nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Kiểm duyệt sản phẩm ({stats.pendingReviews})
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý người dùng
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Xem báo cáo
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Xử lý khiếu nại
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quản lý người dùng</h3>
                  <p className="text-muted-foreground mb-4">
                    Xem, chỉnh sửa và quản lý tài khoản người dùng
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      <span>Danh sách người dùng</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Shield className="h-6 w-6" />
                      <span>Phân quyền</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Báo cáo vi phạm</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quản lý sản phẩm</h3>
                  <p className="text-muted-foreground mb-4">
                    Kiểm duyệt, phân loại và quản lý sản phẩm trên nền tảng
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Eye className="h-6 w-6" />
                      <span>Kiểm duyệt sản phẩm</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Package className="h-6 w-6" />
                      <span>Danh mục sản phẩm</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Sản phẩm vi phạm</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quản lý đơn hàng</h3>
                  <p className="text-muted-foreground mb-4">
                    Theo dõi, xử lý và quản lý đơn hàng trên hệ thống
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Clock className="h-6 w-6" />
                      <span>Đơn hàng chờ xử lý</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <CheckCircle className="h-6 w-6" />
                      <span>Đơn hàng hoàn thành</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <XCircle className="h-6 w-6" />
                      <span>Đơn hàng hủy</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Cài đặt hệ thống</h3>
                  <p className="text-muted-foreground mb-4">
                    Cấu hình các thông số và tùy chọn của hệ thống
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Shield className="h-6 w-6" />
                      <span>Bảo mật</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>Thống kê</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      <span>Cấu hình chung</span>
                    </Button>
                  </div>
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
