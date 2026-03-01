import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { Badge } from '@shared/components/ui/badge'
import { Button } from '@shared/components/ui/button'
import { Card, CardContent } from '@shared/components/ui/card'
import {
  Package,
  ShoppingCart,
  Eye,
  Star,
  Edit,
  Plus,
  MapPin,
  Truck,
  Barcode,
  Weight,
  Ruler,
  Tag,
  TrendingDown,
  DollarSign,
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reservedStock: number
  availableStock: number
  costPrice: number
  sellingPrice: number
  profit: number
  profitMargin: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  lastUpdated: string
  image: string
  description: string
  supplier: string
  location: string
  barcode?: string
  weight: number
  dimensions: string
  tags: string[]
  salesCount: number
  viewsCount: number
  rating: number
  isActive: boolean
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: InventoryItem | null
  onEdit?: (product: InventoryItem) => void
  onStockIn?: (product: InventoryItem) => void
}

const statusConfig = {
  in_stock: { label: 'Còn hàng', color: 'bg-green-500', icon: Package },
  low_stock: { label: 'Sắp hết', color: 'bg-yellow-500', icon: TrendingDown },
  out_of_stock: { label: 'Hết hàng', color: 'bg-red-500', icon: TrendingDown },
  discontinued: { label: 'Ngừng bán', color: 'bg-gray-500', icon: Package },
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onStockIn,
}: ProductDetailModalProps) {
  if (!product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusInfo = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock
    )
  }

  const statusInfo = getStatusInfo(product.status)
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 rounded-lg object-cover border"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <p className="text-muted-foreground mb-2">
                    SKU: {product.sku}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                </div>
                <Badge
                  className={`${statusInfo.color} text-white flex items-center gap-1`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{product.salesCount} bán</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{product.viewsCount} xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin tồn kho
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Tồn kho hiện tại
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.currentStock}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Có thể bán
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.availableStock}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Đã đặt trước
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {product.reservedStock}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Lợi nhuận
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {product.profitMargin}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Tồn kho tối thiểu
                  </p>
                  <p className="text-lg font-semibold">{product.minStock}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Tồn kho tối đa
                  </p>
                  <p className="text-lg font-semibold">{product.maxStock}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(product.lastUpdated)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thông tin giá cả
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Giá nhập</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(product.costPrice)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Giá bán</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(product.sellingPrice)}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Lợi nhuận
                  </p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatPrice(product.profit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin vận chuyển
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vị trí kho
                      </p>
                      <p className="font-medium">{product.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nhà cung cấp
                      </p>
                      <p className="font-medium">{product.supplier}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Barcode className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mã vạch</p>
                      <p className="font-medium">
                        {product.barcode || 'Không có'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin vật lý
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trọng lượng
                      </p>
                      <p className="font-medium">{product.weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Kích thước
                      </p>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Danh mục</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Sửa thông tin
              </Button>
            )}
            {onStockIn && (
              <Button onClick={() => onStockIn(product)}>
                <Plus className="h-4 w-4 mr-2" />
                Nhập hàng
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
