import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserOrders } from '@/hooks/useOrders'
import { APP_NAME } from '@/constants/app.constants'
import { 
  ShoppingBag, 
  Package, 
  Heart, 
  Store, 
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Search
} from 'lucide-react'

export default function BuyerDashboardPage() {
  const navigate = useNavigate()
  const { data: ordersData } = useUserOrders({ page: 1, pageSize: 5 })
  
  const orders = ordersData?.items || []
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const activeOrders = orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status))

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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Chào mừng đến với {APP_NAME}</h1>
            <p className="text-blue-100">Nền tảng mua sỉ hàng đầu - Tìm kiếm sản phẩm tốt nhất cho bạn</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Tìm kiếm sản phẩm</h3>
                <p className="text-sm text-muted-foreground">Khám phá hàng ngàn sản phẩm</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer-orders')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Đơn hàng của tôi</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingOrders.length > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {pendingOrders.length} đơn chờ
                    </Badge>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/profile?tab=favorites')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Yêu thích</h3>
                <p className="text-sm text-muted-foreground">Sản phẩm đã lưu</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/chat')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Tin nhắn</h3>
                <p className="text-sm text-muted-foreground">Chat với người bán</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          {orders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Đơn hàng gần đây
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/customer-orders">
                      Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Đơn hàng #{order.id.slice(0, 8)}</h3>
                            <Badge
                              className={
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {order.status === 'pending' && 'Chờ xác nhận'}
                              {order.status === 'confirmed' && 'Đã xác nhận'}
                              {order.status === 'preparing' && 'Đang chuẩn bị'}
                              {order.status === 'ready' && 'Sẵn sàng lấy'}
                              {order.status === 'completed' && 'Hoàn thành'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} sản phẩm •{' '}
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seller Mode Card */}
          <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Bạn cũng là người bán?</h3>
                    <p className="text-sm text-muted-foreground">
                      Truy cập dashboard dành cho người bán để quản lý sản phẩm và đơn hàng
                    </p>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/dashboard">
                    <Store className="h-4 w-4 mr-2" />
                    Vào Dashboard Người Bán
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Đơn đang xử lý</p>
                    <p className="text-2xl font-bold">{activeOrders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Đơn chờ xác nhận</p>
                    <p className="text-2xl font-bold">{pendingOrders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

