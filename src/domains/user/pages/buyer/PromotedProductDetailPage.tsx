import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Separator } from '@shared/components/ui/separator'
import { 
  ArrowLeft,
  Package,
  Timer,
  Eye,
  TrendingUp,
  Sparkles,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react'

interface PromotedProduct {
  id: string
  name: string
  image: string
  price: number
  currentViews: number
  totalViews: number
  startDate: Date
  endDate: Date
  remainingViews: number
  packageId: string
  packageName: string
  packageType: 'payPerView' | 'payPerDay' | 'featuredSlot' | 'boostToCategory'
  packagePrice: number
  packageDescription: string
  category?: string
  status: string
}

// Mock data - In production, this would come from API
const getPromotedProduct = (id: string): PromotedProduct | null => {
  const products: PromotedProduct[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=400&h=400&fit=crop',
      price: 25990000,
      currentViews: 1245,
      totalViews: 5000,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      remainingViews: 3755,
      packageId: 'ppv_5k',
      packageName: '5,000 lượt xem',
      packageType: 'payPerView',
      packagePrice: 200000,
      packageDescription: 'Trả phí theo số lượt xem thực tế',
      category: 'Điện thoại',
      status: 'active'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S23 Ultra',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      price: 22990000,
      currentViews: 892,
      totalViews: 3000,
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      remainingViews: 2108,
      packageId: 'ppv_5k',
      packageName: '5,000 lượt xem',
      packageType: 'payPerView',
      packagePrice: 200000,
      packageDescription: 'Trả phí theo số lượt xem thực tế',
      category: 'Điện thoại',
      status: 'active'
    },
    {
      id: '3',
      name: 'MacBook Air M2 13 inch',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      price: 32990000,
      currentViews: 2156,
      totalViews: 10000,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      remainingViews: 7844,
      packageId: 'ppv_10k',
      packageName: '10,000 lượt xem',
      packageType: 'payPerView',
      packagePrice: 350000,
      packageDescription: 'Trả phí theo số lượt xem thực tế',
      category: 'Laptop',
      status: 'active'
    },
    {
      id: '4',
      name: 'AirPods Pro 2nd Gen',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
      price: 5990000,
      currentViews: 456,
      totalViews: 2000,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      remainingViews: 1544,
      packageId: 'ppd_7',
      packageName: '7 ngày',
      packageType: 'payPerDay',
      packagePrice: 250000,
      packageDescription: 'Đẩy bài trong 7 ngày',
      category: 'Phụ kiện',
      status: 'active'
    }
  ]
  
  return products.find(p => p.id === id) || null
}

export default function PromotedProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  
  const product = productId ? getPromotedProduct(productId) : null

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600 mb-4">
              Sản phẩm bạn đang tìm kiếm không tồn tại.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ')
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRemainingTime = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    
    if (diff <= 0) {
      return { text: 'Đã hết hạn', color: 'text-red-600', bgColor: 'bg-red-50' }
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return { 
        text: `${days} ngày ${hours} giờ`, 
        color: days <= 1 ? 'text-orange-600' : 'text-green-600',
        bgColor: days <= 1 ? 'bg-orange-50' : 'bg-green-50'
      }
    } else if (hours > 0) {
      return { 
        text: `${hours} giờ ${minutes} phút`, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    } else {
      return { 
        text: `${minutes} phút`, 
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    }
  }

  const getPackageTypeLabel = (type: string) => {
    switch (type) {
      case 'payPerView': return 'Trả theo lượt xem'
      case 'payPerDay': return 'Trả theo ngày'
      case 'featuredSlot': return 'Vị trí nổi bật'
      case 'boostToCategory': return 'Đẩy lên danh mục'
      default: return type
    }
  }

  const getPackageTypeColor = (type: string) => {
    switch (type) {
      case 'payPerView': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'payPerDay': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'featuredSlot': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'boostToCategory': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const remainingTime = getRemainingTime(product.endDate)
  const viewProgress = (product.currentViews / product.totalViews) * 100
  const daysActive = Math.floor((Date.now() - product.startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil((product.endDate.getTime() - product.startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm đang đẩy</h1>
        </div>

        <div className="space-y-4">
          {/* Product Info Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128'
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
                      {product.category && (
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    <Badge className="bg-green-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Đang đẩy
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{product.currentViews.toLocaleString()} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Đang hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Gói đã mua
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-lg mb-1">{product.packageName}</p>
                  <p className="text-sm text-muted-foreground">{product.packageDescription}</p>
                </div>
                <Badge className={`${getPackageTypeColor(product.packageType)} border`}>
                  {getPackageTypeLabel(product.packageType)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giá gói</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(product.packagePrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mã gói</p>
                  <p className="text-lg font-semibold">{product.packageId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotion Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Thông tin chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Remaining */}
              <div className={`p-4 rounded-lg border-2 ${remainingTime.bgColor} border-current`}>
                <div className="flex items-center gap-2 mb-2">
                  <Timer className={`h-5 w-5 ${remainingTime.color}`} />
                  <span className="font-semibold">Thời gian còn lại</span>
                </div>
                <p className={`text-2xl font-bold ${remainingTime.color}`}>
                  {remainingTime.text}
                </p>
              </div>

              {/* Views Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Lượt xem</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.currentViews.toLocaleString()} / {product.totalViews.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${viewProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Đã đạt: {viewProgress.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-primary">
                    Còn lại: {product.remainingViews.toLocaleString()} lượt xem
                  </span>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bắt đầu đẩy</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Kết thúc</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Thời gian hoạt động</p>
                  <p className="text-lg font-semibold">
                    {daysActive} / {totalDays} ngày
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Lượt xem trung bình/ngày</p>
                  <p className="text-lg font-semibold">
                    {Math.round(product.currentViews / Math.max(daysActive, 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Package className="h-4 w-4 mr-2" />
              Xem chi tiết sản phẩm
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate('/boost-post')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Đẩy thêm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

