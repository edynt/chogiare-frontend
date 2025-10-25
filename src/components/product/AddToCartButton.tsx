import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { useAddToCart } from '@/hooks'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productId: string
  productName: string
  stock: number
  disabled?: boolean
  className?: string
}

export function AddToCartButton({
  productId,
  productName,
  stock,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  
  const addToCart = useAddToCart()

  const handleAddToCart = async () => {
    if (quantity <= 0 || quantity > stock) {
      toast.error('Số lượng không hợp lệ')
      return
    }

    try {
      await addToCart.mutateAsync({
        productId,
        quantity,
      })
      
      setIsAdded(true)
      // Cart will be opened automatically by the Cart component
      toast.success(`Đã thêm ${productName} vào giỏ hàng`)
      
      // Reset added state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000)
    } catch {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity)
    }
  }

  const isOutOfStock = stock <= 0
  const isDisabled = disabled || isOutOfStock || addToCart.isPending

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
              max={stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              disabled={isDisabled}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            Còn {stock} sản phẩm
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
        {addToCart.isPending ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            Đang thêm...
          </>
        ) : isAdded ? (
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
      {stock > 0 && stock <= 5 && (
        <p className="text-xs text-orange-600">
          ⚠️ Chỉ còn {stock} sản phẩm
        </p>
      )}
    </div>
  )
}
