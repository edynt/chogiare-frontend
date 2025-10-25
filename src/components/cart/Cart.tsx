import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function Cart() {
  const { items, totalItems, totalValue, isOpen, updateQuantity, removeItem, clearCart, closeCart } = useCartStore()
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
    closeCart()
    navigate('/payment')
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => useCartStore.getState().openCart()}
          className="rounded-full p-3 shadow-lg"
          size="lg"
        >
          <ShoppingBag className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={closeCart}
    >
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">
              Giỏ hàng ({totalItems} sản phẩm)
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Giỏ hàng trống</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.productPrice)}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(totalValue)}
                </span>
              </div>
              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Thanh toán
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
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