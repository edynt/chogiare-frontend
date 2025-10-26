import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useProfile } from '@/hooks/useAuth'
import { useUserOrders } from '@/hooks/useOrders'
import { 
  User, Mail, Phone, MapPin, Package, Eye, Calendar, 
  Star, Heart, ShoppingBag, Shield, Award, TrendingUp,
  Settings, Edit, Camera, Lock, Globe
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function ProfileContent() {
  const { data: profile, isLoading } = useProfile()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites' | 'settings'>('profile')
  const { data: ordersData, isLoading: isLoadingOrders } = useUserOrders({ page: 1, pageSize: 10 })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'shipped': return 'Đã giao hàng'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      case 'processing': return 'Đang xử lý'
      default: return status
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="h-4 w-4 mr-2 inline" />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-4 w-4 mr-2 inline" />
              Lịch sử đơn hàng
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="h-4 w-4 mr-2 inline" />
              Yêu thích
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Cài đặt
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Thành viên VIP
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Đã xác thực
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Họ và tên</label>
              <Input value={profile.name} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input value={profile.phone || ''} disabled />
            </div>
            <Button>Chỉnh sửa thông tin</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê hoạt động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{profile.postCount}</p>
                <p className="text-sm text-muted-foreground">Sản phẩm đã bán</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">156</p>
                <p className="text-sm text-muted-foreground">Sản phẩm yêu thích</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">98%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ hài lòng</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Vai trò:</span>
                <span className="font-medium">{profile.roles.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày tham gia:</span>
                <span className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lần đăng nhập cuối:</span>
                <span className="font-medium">2 giờ trước</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {profile.storeInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên cửa hàng</label>
                <Input value={profile.storeInfo.name} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input value={profile.storeInfo.description || ''} disabled />
              </div>
              <div className="flex justify-between">
                <span>Đánh giá:</span>
                <span className="font-medium">
                  ⭐ {profile.storeInfo.rating} ({profile.storeInfo.reviewCount} đánh giá)
                </span>
              </div>
              <Button>Chỉnh sửa cửa hàng</Button>
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lịch sử đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Đang tải đơn hàng...</p>
              </div>
            ) : ordersData && ordersData.items && ordersData.items.length > 0 ? (
              <div className="space-y-4">
                {ordersData.items.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity} • {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Đặt hàng: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {ordersData.total > ordersData.items.length && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      Xem thêm đơn hàng
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                </p>
                <Button asChild>
                  <Link to="/products">Mua sắm ngay</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Sản phẩm yêu thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có sản phẩm yêu thích</h3>
              <p className="text-muted-foreground mb-6">
                Hãy bắt đầu yêu thích những sản phẩm bạn quan tâm!
              </p>
              <Button asChild>
                <Link to="/products">Khám phá sản phẩm</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thông báo email</h4>
                  <p className="text-sm text-muted-foreground">Nhận thông báo về đơn hàng và khuyến mãi</p>
                </div>
                <Button variant="outline" size="sm">Bật</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thông báo push</h4>
                  <p className="text-sm text-muted-foreground">Nhận thông báo trực tiếp trên thiết bị</p>
                </div>
                <Button variant="outline" size="sm">Bật</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Chế độ riêng tư</h4>
                  <p className="text-sm text-muted-foreground">Ẩn thông tin cá nhân khỏi người khác</p>
                </div>
                <Button variant="outline" size="sm">Tắt</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Xác thực số điện thoại
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Xác thực email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Quyền riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Hiển thị email công khai</h4>
                  <p className="text-sm text-muted-foreground">Cho phép người khác xem email của bạn</p>
                </div>
                <Button variant="outline" size="sm">Tắt</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Hiển thị số điện thoại</h4>
                  <p className="text-sm text-muted-foreground">Cho phép người khác xem số điện thoại</p>
                </div>
                <Button variant="outline" size="sm">Tắt</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
