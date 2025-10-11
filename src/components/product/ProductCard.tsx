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
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.map((badge) => (
              <Badge
                key={badge}
                variant={badge === 'NEW' ? 'default' : badge === 'SALE' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {badge}
              </Badge>
            ))}
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
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="warning" className="text-xs">
                Còn {product.stock} sản phẩm
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={product.seller?.avatar} />
              <AvatarFallback className="text-xs">
                {product.seller?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {product.seller?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>⭐ {product.rating}</span>
            <span>•</span>
            <span>{product.reviewCount} đánh giá</span>
            <span>•</span>
            <span>{product.viewCount} lượt xem</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
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
