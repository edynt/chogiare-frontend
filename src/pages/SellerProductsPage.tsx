import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/product/ProductCard'
import { useMyProducts } from '@/hooks/useProducts'
import { useNotification } from '@/components/notification-provider'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  BarChart3
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { ProductStatus } from '@/types'

export default function SellerProductsPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')

  const { data: productsData, isLoading, error } = useMyProducts({
    query: searchQuery || undefined,
    sortBy: sortBy as 'createdAt' | 'price' | 'rating' | 'viewCount',
  })

  const handleDeleteProduct = (productId: string) => {
    // TODO: Implement delete functionality
    notify({
      type: 'warning',
      title: 'Chức năng chưa hoàn thiện',
      message: 'Chức năng xóa sản phẩm sẽ được thêm sau.',
    })
  }

  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    // TODO: Implement status change functionality
    notify({
      type: 'info',
      title: 'Cập nhật trạng thái',
      message: `Đã thay đổi trạng thái sản phẩm thành ${newStatus}`,
    })
  }

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Đang bán</Badge>
      case 'draft':
        return <Badge variant="secondary">Bản nháp</Badge>
      case 'sold':
        return <Badge variant="outline">Đã bán</Badge>
      case 'archived':
        return <Badge variant="outline">Lưu trữ</Badge>
      case 'suspended':
        return <Badge variant="destructive">Tạm dừng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'draft':
        return 'text-muted-foreground'
      case 'sold':
        return 'text-blue-600'
      case 'archived':
        return 'text-gray-600'
      case 'suspended':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  // Calculate stats
  const stats = {
    total: productsData?.total || 0,
    active: productsData?.items?.filter(p => p.status === 'active').length || 0,
    draft: productsData?.items?.filter(p => p.status === 'draft').length || 0,
    sold: productsData?.items?.filter(p => p.status === 'sold').length || 0,
    totalViews: productsData?.items?.reduce((sum, p) => sum + p.viewCount, 0) || 0,
    totalRevenue: productsData?.items?.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0) || 0,
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive mb-4">Lỗi tải sản phẩm</h2>
              <p className="text-muted-foreground mb-4">
                Đã có lỗi xảy ra khi tải danh sách sản phẩm: {error.message}
              </p>
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Quản lý và theo dõi tất cả sản phẩm của bạn
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Đang bán</p>
                    <p className="text-2xl font-bold text-success">{stats.active}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lượt xem</p>
                    <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng giá trị</p>
                    <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
                <SelectItem value="suspended">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="price-high">Giá cao</SelectItem>
                <SelectItem value="price-low">Giá thấp</SelectItem>
                <SelectItem value="views">Lượt xem</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => navigate('/seller/products/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>

          {/* Results Count */}
          {productsData && (
            <div className="mb-4 text-sm text-muted-foreground">
              Hiển thị {productsData.items?.length} trong tổng số {productsData.total} sản phẩm
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products Grid/List */}
          {!isLoading && productsData && (
            <>
              {productsData.items?.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Chưa có sản phẩm nào</h3>
                    <p className="text-muted-foreground mb-6">
                      Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên của bạn
                    </p>
                    <Button onClick={() => navigate('/seller/products/add')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm sản phẩm đầu tiên
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {productsData.items?.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          {getStatusBadge(product.status)}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold line-clamp-2 mb-1">{product.title}</h3>
                            <p className="text-lg font-bold text-primary">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{product.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{product.rating}</span>
                            </div>
                            <span className={getStatusColor(product.status)}>
                              {product.stock} sản phẩm
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
