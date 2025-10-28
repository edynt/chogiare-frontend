import React, { useState, useRef } from 'react'
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
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const { addItem } = useCartStore()

  // Animation functions
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `
    
    button.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

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

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (quantity <= 0 || quantity > product.stock) {
      toast.error('Số lượng không hợp lệ')
      return
    }

    // Create ripple effect
    createRipple(event)
    
    // Set animation state
    setIsAnimating(true)

    try {
      addItem(product, quantity)
      setIsAdded(true)
      
      // Reset animation state after ripple completes
      setTimeout(() => setIsAnimating(false), 300)
      
      // Reset added state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
      setIsAnimating(false)
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
      {/* Add CSS animations */}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .cart-icon-animate {
          animation: pulse 0.6s ease-in-out;
        }
        .check-icon-animate {
          animation: bounce 0.8s ease-in-out;
        }
        .quantity-button-animate {
          transition: all 0.2s ease-in-out;
        }
        .quantity-button-animate:hover {
          transform: scale(1.05);
        }
        .quantity-button-animate:active {
          transform: scale(0.95);
        }
      `}</style>

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
              className="quantity-button-animate"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center transition-all duration-200 hover:border-primary focus:border-primary"
              disabled={isDisabled}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="quantity-button-animate"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        ref={buttonRef}
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full relative overflow-hidden transition-all duration-300 ${
          isAnimating ? 'scale-95' : 'scale-100'
        } ${
          isAdded 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'hover:scale-105 active:scale-95'
        }`}
        size="lg"
      >
        {isAdded ? (
          <>
            <Check className={`mr-2 h-4 w-4 ${isAdded ? 'check-icon-animate' : ''}`} />
            <span className="transition-all duration-300">Đã thêm</span>
          </>
        ) : isOutOfStock ? (
          <span className="transition-all duration-300">Hết hàng</span>
        ) : (
          <>
            <ShoppingCart className={`mr-2 h-4 w-4 transition-all duration-300 ${
              isAnimating ? 'cart-icon-animate' : ''
            }`} />
            <span className="transition-all duration-300">Thêm vào giỏ hàng</span>
          </>
        )}
      </Button>

      {/* Stock Warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-orange-600 animate-pulse transition-all duration-300">
          ⚠️ Chỉ còn {product.stock} sản phẩm
        </p>
      )}
    </div>
  )
}
