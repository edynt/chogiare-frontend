import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { EmptyCart } from '@/components/ui/empty-state'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export function CartPage() {
  const { data: cartData, isLoading, error, refetch } = useCart()
  const updateCartItem = useUpdateCartItem()
  const removeFromCart = useRemoveFromCart()
  const clearCart = useClearCart()

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart.mutate(itemId)
    } else {
      updateCartItem.mutate({ itemId, data: { quantity: newQuantity } })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart.mutate(itemId)
  }

  const handleClearCart = () => {
    clearCart.mutate()
  }

  const handleCheckout = () => {
    // Navigate to payment page
    window.location.href = '/payment'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => refetch()}
        className="min-h-[400px]"
      />
    )
  }

  const cartItems = cartData?.items || []
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <EmptyCart
        onContinueShopping={() => window.location.href = '/products'}
      />
    )
  }

  return (
    <div className="space-y-6">
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
          disabled={clearCart.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
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
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updateCartItem.isPending}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updateCartItem.isPending || item.quantity >= item.productStock}
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
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeFromCart.isPending}
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
                  <span>{formatCurrency(totalAmount)}</span>
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
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={clearCart.isPending}
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
