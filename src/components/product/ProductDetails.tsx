import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { AddToCartButton } from './AddToCartButton'
import { useProduct, useProductReviews } from '@/hooks'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  Star, 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  Shield, 
  Truck, 
  MessageCircle,
  Eye
} from 'lucide-react'

interface ProductDetailsProps {
  productId?: string
  className?: string
}

export function ProductDetails({ productId, className }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const productIdToUse = productId || id
  
  const { data: product, isLoading, error, refetch } = useProduct(productIdToUse!)
  const { data: reviewsData } = useProductReviews(productIdToUse!, { page: 1, pageSize: 5 })
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleRetry = () => {
    refetch()
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
        onRetry={handleRetry}
        className="min-h-[400px]"
      />
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
        <p className="text-muted-foreground mb-4">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link to="/products">Quay lại danh sách sản phẩm</Link>
        </Button>
      </div>
    )
  }

  const reviews = reviewsData?.items || []
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span>({product.reviewCount} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.viewCount} lượt xem</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Tình trạng: <span className="font-medium">{product.condition}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Còn lại: <span className="font-medium text-green-600">{product.stock} sản phẩm</span>
            </p>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={product.seller?.avatar} />
              <AvatarFallback>
                {product.seller?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{product.seller?.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.store?.name || 'Cá nhân'}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <AddToCartButton
              productId={product.id}
              productName={product.title}
              stock={product.stock}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex-1"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>Giao hàng nhanh</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Đăng {formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
          <TabsTrigger value="seller">Thông tin người bán</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{product.description}</p>
              {product.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có đánh giá nào cho sản phẩm này.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.buyer?.avatar} />
                          <AvatarFallback>
                            {review.buyer?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.buyer?.name}</p>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground ml-12">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin người bán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={product.seller?.avatar} />
                  <AvatarFallback>
                    {product.seller?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{product.seller?.name}</h3>
                  <p className="text-muted-foreground">
                    {product.store?.name || 'Người bán cá nhân'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(4.5)}
                    <span className="text-sm text-muted-foreground">(4.5/5)</span>
                  </div>
                </div>
              </div>
              
              {product.store && (
                <div className="space-y-2">
                  <p><strong>Địa chỉ:</strong> {product.store.address}</p>
                  <p><strong>Email:</strong> {product.store.email}</p>
                  <p><strong>Điện thoại:</strong> {product.store.phone}</p>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>
                <Button variant="outline" className="flex-1">
                  Xem shop
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}