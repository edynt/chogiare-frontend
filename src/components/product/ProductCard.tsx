import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Eye, MapPin, Store, Verified, Clock, ShoppingBag, Zap, Award, TrendingUp, Star, Sparkles, Shield } from 'lucide-react'
// Removed Redux imports
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Quick view functionality can be implemented later
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement favorite functionality
  }

  // Calculate badges based on product data
  const getProductBadges = () => {
    const badges: Array<{ label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline'; icon?: React.ReactNode; className?: string }> = []
    
    // Featured badge
    if (product.isFeatured) {
      badges.push({
        label: 'NỔI BẬT',
        variant: 'default',
        icon: <Sparkles className="h-3 w-3" />,
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
      })
    }
    
    // Promoted badge
    if (product.isPromoted) {
      badges.push({
        label: 'QUẢNG CÁO',
        variant: 'default',
        icon: <TrendingUp className="h-3 w-3" />,
        className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0'
      })
    }
    
    // Hot badge (high view count)
    if ((product.viewCount || 0) > 1000) {
      badges.push({
        label: 'HOT',
        variant: 'destructive',
        icon: <Zap className="h-3 w-3" />,
        className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 animate-pulse'
      })
    }
    
    // Top rated badge
    if (product.rating >= 4.5 && product.reviewCount >= 50) {
      badges.push({
        label: 'TOP RATED',
        variant: 'default',
        icon: <Award className="h-3 w-3" />,
        className: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0'
      })
    }
    
    // Best seller badge
    const soldCount = (product.viewCount || 0) * 2 + product.reviewCount * 5
    if (soldCount > 500) {
      badges.push({
        label: 'BÁN CHẠY',
        variant: 'default',
        icon: <Star className="h-3 w-3" />,
        className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
      })
    }
    
    // New product badge (created within last 7 days)
    const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated <= 7) {
      badges.push({
        label: 'MỚI',
        variant: 'default',
        className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0'
      })
    }
    
    // Verified seller badge
    if (product.store?.isVerified) {
      badges.push({
        label: 'ĐÃ XÁC THỰC',
        variant: 'outline',
        icon: <Shield className="h-3 w-3" />,
        className: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800'
      })
    }
    
    return badges
  }

  const productBadges = getProductBadges()

  return (
    <Card className={cn("group card-hover flex flex-col h-full overflow-hidden border-border/50 bg-card", className)}>
      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
            }}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {/* Sale Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge 
                variant="destructive" 
                className="text-xs font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
              >
                <Zap className="h-3 w-3 mr-1" />
                SALE
              </Badge>
            )}
            {/* Low Stock Badge */}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge 
                className="text-xs font-bold shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
              >
                SẮP HẾT
              </Badge>
            )}
            {/* Product Badges */}
            {productBadges.slice(0, 2).map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant}
                className={`text-xs font-bold shadow-lg flex items-center gap-1 ${badge.className || ''}`}
              >
                {badge.icon}
                {badge.label}
              </Badge>
            ))}
          </div>
          
          {/* Additional Badges - Top Right */}
          {productBadges.length > 2 && (
            <div className="absolute top-2 right-12 flex flex-col gap-1.5 z-10">
              {productBadges.slice(2, 4).map((badge, index) => (
                <Badge
                  key={index}
                  variant={badge.variant}
                  className={`text-xs font-bold shadow-lg flex items-center gap-1 ${badge.className || ''}`}
                >
                  {badge.icon}
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={handleFavorite}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
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

        <CardContent className="p-4 flex-1 flex flex-col space-y-3">
          {/* Seller Info */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Avatar className="h-6 w-6">
              <AvatarImage src={product.seller?.avatar || product.store?.logo} />
              <AvatarFallback className="text-xs">
                {(product.store?.name || product.seller?.name || 'S').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-medium truncate">
                  {product.store?.name || product.seller?.name || 'Người bán'}
                </p>
                {product.store?.isVerified && (
                  <Verified className="h-3 w-3 text-blue-500 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {/* Location */}
          {product.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
          )}

          {/* Product Info Row */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount})</span>
              </div>
              {/* Sold Count (mock) */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="h-3 w-3" />
                <span>{(product.viewCount || 0) * 2 + product.reviewCount * 5}</span>
              </div>
            </div>
            {/* Stock */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Còn</span>
              <span className="font-semibold text-foreground">{product.stock}</span>
            </div>
          </div>

          {/* Condition & Time */}
          <div className="flex items-center justify-between text-xs pt-1">
            <Badge 
              variant="outline" 
              className="text-xs font-medium bg-muted/50"
            >
              {product.condition === 'new' ? '✨ Mới 100%' : 
               product.condition === 'like_new' ? '✨ Như mới' :
               product.condition === 'good' ? '✓ Tốt' : product.condition}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{formatDate(product.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
