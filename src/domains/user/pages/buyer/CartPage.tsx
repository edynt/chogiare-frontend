import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Separator } from '@shared/components/ui/separator'
import { useCartStore } from '@/stores/cartStore'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Package,
  Store,
  Verified,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { useBuyerProducts } from '@/hooks/useProducts'
import { initializeFakeCart } from '@/utils/seedCart'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    totalItems,
    totalValue,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore()
  const { data: productsData } = useBuyerProducts({ page: 1, limit: 50 })

  // Initialize fake cart data if cart is empty
  React.useEffect(() => {
    if (
      items.length === 0 &&
      productsData?.items &&
      productsData.items.length > 0
    ) {
      initializeFakeCart(productsData.items)
    }
  }, [items.length, productsData?.items])

  // Group items by seller
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, typeof items> = {}
    items.forEach(item => {
      const key = item.sellerId || 'unknown'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    return groups
  }, [items])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
      return
    }
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const handleClearCart = () => {
    if (items.length === 0) return
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?'
      )
    ) {
      clearCart()
      toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Giỏ hàng</h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý sản phẩm trong giỏ hàng của bạn
                </p>
              </div>
            </div>

            {/* Empty State */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Giỏ hàng của bạn đang trống
                </h2>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
                <Button onClick={() => navigate('/')} size="lg">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </CardContent>
            </Card>
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Giỏ hàng</h1>
                <p className="text-muted-foreground mt-1">
                  {totalItems} {totalItems === 1 ? 'sản phẩm' : 'sản phẩm'}{' '}
                  trong giỏ hàng
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Cart Items Grouped by Seller */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([sellerKey, sellerItems]) => {
                const firstItem = sellerItems[0]
                const sellerName = firstItem.sellerName || 'Nhà cung cấp'
                const sellerId = firstItem.sellerId
                const groupTotal = sellerItems.reduce(
                  (sum, item) => sum + item.productPrice * item.quantity,
                  0
                )
                const groupQuantity = sellerItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )

                return (
                  <Card key={sellerKey} className="overflow-hidden">
                    {/* Seller Header - Clickable */}
                    <CardHeader className="bg-muted/50 border-b">
                      <div className="flex items-center justify-between gap-4">
                        {sellerId ? (
                          <Link
                            to={`/shop/${sellerId}`}
                            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-muted/30 transition-colors rounded-lg p-2 -ml-2 -mr-2"
                          >
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                              <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <span className="font-bold hover:text-primary transition-colors truncate">
                                  {sellerName}
                                </span>
                                <Verified className="h-4 w-4 text-primary flex-shrink-0" />
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {groupQuantity}{' '}
                                {groupQuantity === 1 ? 'sản phẩm' : 'sản phẩm'}{' '}
                                • Tổng: {formatCurrency(groupTotal)}
                              </p>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                              <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <span className="font-bold truncate">
                                  {sellerName}
                                </span>
                                <Verified className="h-4 w-4 text-primary flex-shrink-0" />
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {groupQuantity}{' '}
                                {groupQuantity === 1 ? 'sản phẩm' : 'sản phẩm'}{' '}
                                • Tổng: {formatCurrency(groupTotal)}
                              </p>
                            </div>
                          </div>
                        )}
                        {sellerId && (
                          <div
                            className="flex-shrink-0"
                            onClick={e => e.stopPropagation()}
                          >
                            <Link to={`/shop/${sellerId}`}>
                              <Button variant="ghost" size="sm">
                                Xem shop
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {sellerItems.map(item => (
                          <div key={item.id} className="p-4">
                            <div className="flex gap-4">
                              {/* Product Image */}
                              <Link
                                to={`/products/${item.productId}`}
                                className="flex-shrink-0"
                              >
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-24 h-24 object-cover rounded-lg border"
                                />
                              </Link>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <Link to={`/products/${item.productId}`}>
                                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                                    {item.productName}
                                  </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {formatCurrency(item.productPrice)} / sản phẩm
                                </p>

                                {/* Stock Status */}
                                {item.productStock <= 5 &&
                                  item.productStock > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs mb-2 text-amber-600 border-amber-600"
                                    >
                                      Còn {item.productStock} sản phẩm
                                    </Badge>
                                  )}
                                {item.productStock === 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs mb-2"
                                  >
                                    Hết hàng
                                  </Badge>
                                )}

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-4 mt-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                      Số lượng:
                                    </span>
                                    <div className="flex items-center border rounded-lg">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-r-none"
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.productId,
                                            item.quantity - 1
                                          )
                                        }
                                        disabled={item.quantity <= 1}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <div className="w-12 text-center font-semibold">
                                        {item.quantity}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-l-none"
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.productId,
                                            item.quantity + 1
                                          )
                                        }
                                        disabled={
                                          item.productStock > 0 &&
                                          item.quantity >= item.productStock
                                        }
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Actions */}
                              <div className="flex flex-col items-end justify-between">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-primary">
                                    {formatCurrency(
                                      item.productPrice * item.quantity
                                    )}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-xs text-muted-foreground">
                                      {formatCurrency(item.productPrice)} ×{' '}
                                      {item.quantity}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveItem(item.productId)
                                  }
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tạm tính ({totalItems} sản phẩm)
                      </span>
                      <span>{formatCurrency(totalValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển
                      </span>
                      <span className="text-muted-foreground">
                        Tự vận chuyển
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg">Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(totalValue)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Đặt hàng ({totalItems})
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    Tiếp tục mua sắm
                  </Button>
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
