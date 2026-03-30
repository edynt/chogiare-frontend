import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@shared/components/ui/dialog'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import { Skeleton } from '@shared/components/ui/skeleton'
import { useSellerProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'
import { Search, Package, Sparkles, TrendingUp } from 'lucide-react'

interface SelectProductToBoostModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct: (productId: string, productTitle: string) => void
}

export function SelectProductToBoostModal({
  isOpen,
  onClose,
  onSelectProduct,
}: SelectProductToBoostModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: productsData, isLoading } = useSellerProducts()

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    const products = productsData?.items || []
    if (!searchQuery.trim()) {
      return products
    }
    const query = searchQuery.toLowerCase()
    return products.filter(
      product =>
        product.title?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
    )
  }, [productsData, searchQuery])

  const handleSelectProduct = (productId: string, productTitle: string) => {
    onSelectProduct(productId, productTitle)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Chọn sản phẩm để đẩy
          </DialogTitle>
          <DialogDescription>
            Chọn sản phẩm bạn muốn đẩy để tăng lượt xem và doanh số
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Product List */}
        <div className="h-[400px] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-2">
              {filteredProducts.map(product => {
                // Use the isPromoted field directly from the product
                const isPromoted = product.isPromoted === true
                const productImage =
                  product.images?.[0] || 'https://via.placeholder.com/64'

                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      isPromoted
                        ? 'border-orange-200 bg-orange-50/50 hover:border-orange-300'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() =>
                      handleSelectProduct(product.id, product.title)
                    }
                  >
                    <img
                      src={productImage}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={e => {
                        ;(e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/64'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {product.title}
                        </h4>
                        {isPromoted && (
                          <Badge className="bg-orange-500 text-white text-xs flex-shrink-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Đang đẩy
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-primary font-semibold">
                        {formatCurrency(product.price)}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isPromoted ? 'outline' : 'default'}
                      className={
                        isPromoted
                          ? 'border-orange-500 text-orange-600 hover:bg-orange-50'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {isPromoted ? 'Gia hạn' : 'Đẩy'}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? 'Không tìm thấy sản phẩm'
                  : 'Chưa có sản phẩm nào'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'Thử tìm kiếm với từ khóa khác'
                  : 'Hãy thêm sản phẩm trước khi đẩy'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
