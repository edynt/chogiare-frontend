import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'sonner'
import type { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  className?: string
}

export function AddToCartButton({
  product,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  
  const { addItem } = useCartStore()

  // Early return if product is not available
  if (!product) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Button disabled className="w-full" size="lg">
          Sản phẩm không khả dụng
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (quantity <= 0 || quantity > product.stock) {
      toast.error('Số lượng không hợp lệ')
      return
    }

    try {
      addItem(product, quantity)
      setIsAdded(true)
      
      // Reset added state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const isOutOfStock = product.stock <= 0
  const isDisabled = disabled || isOutOfStock

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Số lượng:</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              disabled={isDisabled}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            Còn {product.stock} sản phẩm
          </span>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full"
        size="lg"
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Đã thêm
          </>
        ) : isOutOfStock ? (
          'Hết hàng'
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm vào giỏ hàng
          </>
        )}
      </Button>

      {/* Stock Warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-orange-600">
          ⚠️ Chỉ còn {product.stock} sản phẩm
        </p>
      )}
    </div>
  )
}
