import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cartSlice'
import { setModal } from '@/store/slices/uiSlice'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(setModal({ modal: 'productQuickView', open: true, data: product.id }))
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement favorite functionality
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-shadow duration-200 flex flex-col h-full", className)}>
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="destructive" className="text-xs">
                SALE
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning" className="text-xs">
                SẮP HẾT
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={handleFavorite}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock indicator */}
          {product.stock === 0 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="destructive" className="text-xs">
                HẾT HÀNG
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={product.seller?.avatar} />
              <AvatarFallback className="text-xs">
                {product.seller?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {product.seller?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive" className="text-xs whitespace-nowrap">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
            <span>⭐ {product.rating}</span>
            <span>•</span>
            <span>{product.reviewCount} đánh giá</span>
            <span>•</span>
            <span>Còn {product.stock} sản phẩm</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </CardFooter>
    </Card>
  )
}
