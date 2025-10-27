import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProduct } from '@/hooks/useProducts'
import { 
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  ShoppingCart,
  Star,
  Calendar,
  MapPin,
  Tag,
  AlertTriangle,
  BarChart3,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface StockMovement {
  id: string
  type: 'in' | 'out'
  quantity: number
  reason: string
  date: string
  user: string
}

interface SalesData {
  date: string
  sales: number
  revenue: number
}

export default function ProductDetailSellerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id || '')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const mockProduct = {
    id: '1',
    name: 'iPhone 14 Pro Max 256GB',
    sku: 'IPH14PM-256',
    description: 'iPhone 14 Pro Max 256GB chính hãng Apple với chip A16 Bionic mạnh mẽ',
    price: 25000000,
    costPrice: 22000000,
    stock: 15,
    minStock: 10,
    maxStock: 50,
    category: 'Điện thoại',
    brand: 'Apple',
    condition: 'new',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    ],
    tags: ['apple', 'iphone', 'premium'],
    rating: 4.8,
    reviewCount: 125,
    viewCount: 1250,
    salesCount: 45,
    profit: 3000000,
    profitMargin: 13.6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    location: 'Kho A - Kệ 1',
    supplier: 'Apple Vietnam',
    weight: 0.5,
    dimensions: '20x15x8 cm',
    isActive: true
  }

  const mockStockMovements: StockMovement[] = [
    {
      id: '1',
      type: 'in',
      quantity: 10,
      reason: 'Nhập kho định kỳ',
      date: '2024-01-15T10:30:00Z',
      user: 'Nguyễn Văn A'
    },
    {
      id: '2',
      type: 'out',
      quantity: 2,
      reason: 'Bán hàng',
      date: '2024-01-14T15:20:00Z',
      user: 'Hệ thống'
    },
    {
      id: '3',
      type: 'out',
      quantity: 1,
      reason: 'Bán hàng',
      date: '2024-01-13T09:15:00Z',
      user: 'Hệ thống'
    },
    {
      id: '4',
      type: 'in',
      quantity: 5,
      reason: 'Nhập kho bổ sung',
      date: '2024-01-10T14:45:00Z',
      user: 'Trần Thị B'
    }
  ]

  const mockSalesData: SalesData[] = [
    { date: '2024-01-01', sales: 2, revenue: 50000000 },
    { date: '2024-01-02', sales: 1, revenue: 25000000 },
    { date: '2024-01-03', sales: 3, revenue: 75000000 },
    { date: '2024-01-04', sales: 1, revenue: 25000000 },
    { date: '2024-01-05', sales: 2, revenue: 50000000 },
  ]

  const extendedProduct = (product || mockProduct) as typeof mockProduct

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Đang bán'
      case 'draft': return 'Bản nháp'
      case 'sold': return 'Đã bán'
      case 'archived': return 'Lưu trữ'
      case 'suspended': return 'Tạm dừng'
      default: return status
    }
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'bg-red-100 text-red-800' }
    if (stock <= minStock) return { label: 'Sắp hết hàng', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Còn hàng', color: 'bg-green-100 text-green-800' }
  }

  const stockStatus = getStockStatus(extendedProduct.stock, extendedProduct.minStock)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Đang tải thông tin sản phẩm...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{extendedProduct.name}</h1>
                <p className="text-muted-foreground">SKU: {extendedProduct.sku}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/seller/products/edit/${extendedProduct.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button onClick={() => navigate(`/stock-in/${extendedProduct.id}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Nhập kho
              </Button>
            </div>
          </div>

          {/* Product Status Alert */}
          <Alert className={`mb-6 ${stockStatus.color}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Trạng thái tồn kho:</strong> {stockStatus.label} ({extendedProduct.stock} sản phẩm)
              {extendedProduct.stock <= extendedProduct.minStock && (
                <span className="ml-2">- Cần nhập thêm hàng!</span>
              )}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Giá bán</Label>
                      <p className="text-2xl font-bold text-primary">{formatPrice(extendedProduct.price)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Giá nhập</Label>
                      <p className="text-xl font-semibold">{formatPrice(extendedProduct.costPrice)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Lợi nhuận</Label>
                      <p className="text-lg font-semibold text-green-600">{formatPrice(extendedProduct.profit)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tỷ lệ lợi nhuận</Label>
                      <p className="text-lg font-semibold text-green-600">{extendedProduct.profitMargin}%</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Danh mục</Label>
                      <p className="font-medium">{typeof extendedProduct.category === 'string' ? extendedProduct.category : (extendedProduct.category as any)?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Thương hiệu</Label>
                      <p className="font-medium">{extendedProduct.brand}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tình trạng</Label>
                      <Badge className={getStatusColor(extendedProduct.condition)}>
                        {extendedProduct.condition === 'new' ? 'Mới 100%' : extendedProduct.condition}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                      <Badge className={getStatusColor(extendedProduct.status)}>
                        {getStatusLabel(extendedProduct.status)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                    <p className="mt-1">{extendedProduct.description}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      {extendedProduct.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quản lý tồn kho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tồn kho hiện tại</p>
                      <p className="text-2xl font-bold text-primary">{extendedProduct.stock}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-100 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tồn kho tối thiểu</p>
                      <p className="text-2xl font-bold text-yellow-800">{extendedProduct.minStock}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-100 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tồn kho tối đa</p>
                      <p className="text-2xl font-bold text-blue-800">{extendedProduct.maxStock}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/stock-in/${extendedProduct.id}`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nhập kho
                    </Button>
                    <Button variant="outline" size="sm">
                      <Minus className="h-4 w-4 mr-2" />
                      Xuất kho
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt tồn kho
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for detailed info */}
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="stock">Tồn kho</TabsTrigger>
                    <TabsTrigger value="sales">Bán hàng</TabsTrigger>
                    <TabsTrigger value="analytics">Phân tích</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Lượt xem:</span>
                        <Badge variant="outline">{extendedProduct.viewCount}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Đã bán:</span>
                        <Badge variant="outline">{extendedProduct.salesCount}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Đánh giá:</span>
                        <Badge variant="outline">{extendedProduct.rating}/5 ({extendedProduct.reviewCount})</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tạo ngày:</span>
                        <span className="text-sm">{formatDate(extendedProduct.createdAt)}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stock" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Lịch sử nhập/xuất kho</h4>
                      {mockStockMovements.map((movement) => (
                        <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <p className="font-medium">{movement.reason}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(movement.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">{movement.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sales" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Dữ liệu bán hàng gần đây</h4>
                      {mockSalesData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{formatDate(data.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{data.sales} sản phẩm</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(data.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Tăng trưởng</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">+15%</p>
                        <p className="text-sm text-muted-foreground">So với tháng trước</p>
                      </div>
                      <div className="p-4 bg-blue-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Chuyển đổi</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">3.6%</p>
                        <p className="text-sm text-muted-foreground">Tỷ lệ mua hàng</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {extendedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${extendedProduct.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline" onClick={() => navigate(`/seller/products/edit/${extendedProduct.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa sản phẩm
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate(`/stock-in/${extendedProduct.id}`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nhập kho
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Cập nhật hàng loạt
                  </Button>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vị trí:</span>
                    <span className="text-sm font-medium">{extendedProduct.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Nhà cung cấp:</span>
                    <span className="text-sm font-medium">{extendedProduct.supplier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Trọng lượng:</span>
                    <span className="text-sm font-medium">{extendedProduct.weight} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Kích thước:</span>
                    <span className="text-sm font-medium">{extendedProduct.dimensions}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
