import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cartStore'
import { EmptyCart } from '@/components/ui/empty-state'
import { SEOHead } from '@/components/seo/SEOHead'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export function CartPage() {
  const { items, totalItems, totalValue, updateQuantity, removeItem, clearCart } = useCartStore()
  const navigate = useNavigate()

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleCheckout = () => {
    navigate('/payment')
  }

  if (items.length === 0) {
    return (
      <EmptyCart
        onContinueShopping={() => navigate('/products')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <SEOHead
        title="Giỏ hàng của bạn"
        description="Xem và quản lý các sản phẩm trong giỏ hàng của bạn. Cập nhật số lượng, xóa sản phẩm và tiến hành thanh toán an toàn."
        keywords="giỏ hàng, mua sắm, thanh toán, chogiare"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ShoppingCart",
          "name": "Giỏ hàng Chogiare",
          "description": "Giỏ hàng mua sắm trực tuyến"
        }}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
            <p className="text-muted-foreground">
              {totalItems} sản phẩm trong giỏ hàng
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleClearCart}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatCurrency(item.productPrice)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.productStock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end space-y-2">
                    <p className="font-medium text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính ({totalItems} sản phẩm):</span>
                  <span>{formatCurrency(totalValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế:</span>
                  <span>0 VNĐ</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatCurrency(totalValue)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Bằng việc thanh toán, bạn đồng ý với{' '}
                <Link to="/terms" className="underline">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="underline">
                  Chính sách bảo mật
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
