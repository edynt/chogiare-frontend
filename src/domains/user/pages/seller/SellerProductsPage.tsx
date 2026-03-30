import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import { useMyProducts, useDeleteProduct } from '@/hooks/useProducts'
import { useNotification } from '@shared/components/notification-provider'
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  Star,
  Filter,
} from 'lucide-react'
import { formatPrice, PLACEHOLDER_IMAGE } from '@/lib/utils'
import type { ProductStatusType } from '@/constants/status.constants'
import type { ProductStatus } from '@/types'

export default function SellerProductsPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()

  // Pending values (before submit)
  const [pendingSearch, setPendingSearch] = useState('')
  const [pendingStatus, setPendingStatus] = useState<string>('all')
  const [pendingSortBy, setPendingSortBy] = useState('newest')

  // Applied values (after submit)
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedStatus, setAppliedStatus] = useState<string>('all')
  const [appliedSortBy, setAppliedSortBy] = useState('newest')

  const {
    data: productsData,
    isLoading,
    error,
  } = useMyProducts({
    query: appliedSearch || undefined,
    status:
      appliedStatus !== 'all'
        ? (appliedStatus as ProductStatusType)
        : undefined,
    sortBy: appliedSortBy as 'createdAt' | 'price' | 'rating' | 'viewCount',
  })

  // Handle filter submit
  const handleFilterSubmit = () => {
    setAppliedSearch(pendingSearch)
    setAppliedStatus(pendingStatus)
    setAppliedSortBy(pendingSortBy)
  }

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilterSubmit()
    }
  }

  const { mutate: deleteProduct } = useDeleteProduct()

  const handleDeleteProduct = (productId: string) => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.'
      )
    ) {
      deleteProduct(productId, {
        onSuccess: () => {
          notify({
            type: 'success',
            title: 'Xóa thành công',
            message: 'Sản phẩm đã được xóa khỏi hệ thống.',
          })
        },
        onError: error => {
          notify({
            type: 'error',
            title: 'Xóa thất bại',
            message:
              error instanceof Error
                ? error.message
                : 'Có lỗi xảy ra khi xóa sản phẩm.',
          })
        },
      })
    }
  }

  const _handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    // TODO: Implement status change functionality
    notify({
      type: 'info',
      title: 'Cập nhật trạng thái',
      message: `Đã thay đổi trạng thái sản phẩm thành ${newStatus}`,
    })
  }

  const getStatusBadge = (status: ProductStatus) => {
    const statusNum =
      typeof status === 'string' ? parseInt(String(status), 10) : status
    switch (statusNum) {
      case 1: // ACTIVE
        return <Badge variant="success">Đang bán</Badge>
      case 0: // DRAFT
        return <Badge variant="secondary">Nháp</Badge>
      case 2: // OUT_OF_STOCK
        return <Badge variant="destructive">Hết</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusColor = (status: ProductStatus) => {
    const statusNum =
      typeof status === 'string' ? parseInt(String(status), 10) : status
    switch (statusNum) {
      case 1: // ACTIVE
        return 'text-success'
      case 0: // DRAFT
        return 'text-muted-foreground'
      case 2: // OUT_OF_STOCK
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  // Calculate stats with proper null checks (status is numeric: 0=draft, 1=active, 2=out_of_stock)
  const _stats = {
    total: productsData?.total || 0,
    active:
      productsData?.items?.filter(p => Number(p.status) === 1).length || 0,
    draft: productsData?.items?.filter(p => Number(p.status) === 0).length || 0,
    outOfStock:
      productsData?.items?.filter(p => Number(p.status) === 2).length || 0,
    totalViews:
      productsData?.items?.reduce((sum, p) => sum + (p.viewCount || 0), 0) || 0,
    totalRevenue:
      productsData?.items?.reduce(
        (sum, p) => sum + p.price * (p.stock || 0),
        0
      ) || 0,
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Lỗi tải sản phẩm
              </h2>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/seller/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={pendingSearch}
                onChange={e => setPendingSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10"
              />
            </div>

            <Select value={pendingStatus} onValueChange={setPendingStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="out_of_stock">Hết</SelectItem>
              </SelectContent>
            </Select>

            <Select value={pendingSortBy} onValueChange={setPendingSortBy}>
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

            <Button variant="secondary" onClick={handleFilterSubmit}>
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>

            <Button onClick={() => navigate('/seller/products/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>

          {/* Results Count */}
          {productsData && productsData.items && (
            <div className="mb-4 text-sm text-muted-foreground">
              Hiển thị {productsData.items.length} trong tổng số{' '}
              {productsData.total} sản phẩm
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
              {!productsData.items || productsData.items.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Chưa có sản phẩm nào
                    </h3>
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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {productsData.items.map(product => (
                    <Card
                      key={product.id}
                      className="group hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : PLACEHOLDER_IMAGE
                          }
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={e => {
                            e.currentTarget.src = PLACEHOLDER_IMAGE
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          {getStatusBadge(product.status)}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold line-clamp-2 mb-1">
                              {product.title}
                            </h3>
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
                              onClick={() =>
                                navigate(`/products/${product.id}`)
                              }
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                navigate(`/seller/products/edit/${product.id}`)
                              }
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
