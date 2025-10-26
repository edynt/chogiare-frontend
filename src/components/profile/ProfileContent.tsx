import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/useAuth'
import { useUserOrders } from '@/hooks/useOrders'
import { User, Mail, Phone, MapPin, Package, Eye, Calendar, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function ProfileContent() {
  const { data: profile, isLoading } = useProfile()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
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
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
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
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Số bài đăng:</span>
              <span className="font-medium">{profile.postCount}</span>
            </div>
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
            ) : ordersData && ordersData.orders && ordersData.orders.length > 0 ? (
              <div className="space-y-4">
                {ordersData.orders.map((order) => (
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
                
                {ordersData.total > ordersData.orders.length && (
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
    </div>
  )
}
