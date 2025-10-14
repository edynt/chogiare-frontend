import React from 'react'
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { closeCart } from '@/store/slices/cartSlice'
import { formatCurrency } from '@/lib/utils'

export function Cart() {
  const dispatch = useAppDispatch()
  const { isOpen } = useAppSelector((state) => state.cart)
  
  const { data: cartData, isLoading } = useCart()
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
    // Navigate to checkout page
    window.location.href = '/checkout'
  }

  if (!isOpen) return null

  const cartItems = cartData?.items || []
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => dispatch(closeCart())}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Giỏ hàng</h2>
              {totalItems > 0 && (
                <Badge variant="secondary">{totalItems}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(closeCart())}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Đang tải...</div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Giỏ hàng trống</h3>
                <p className="text-muted-foreground mb-4">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
                <Button onClick={() => dispatch(closeCart())}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        {/* Product Image */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
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
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.productPrice)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mt-2">
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
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tổng cộng:</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={clearCart.isPending}
                >
                  Thanh toán
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
