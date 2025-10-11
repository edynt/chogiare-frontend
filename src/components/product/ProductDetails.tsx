import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cartSlice'
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Truck, 
  Shield, 
  MessageCircle,
  ShoppingCart,
  Minus,
  Plus,
  Eye
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    selectedImage === index ? "border-primary" : "border-muted"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Badges */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(isLiked && "text-red-500")}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === 'NEW' ? 'default' : badge === 'SALE' ? 'destructive' : 'secondary'}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-success">
                Tiết kiệm {formatPrice(product.originalPrice - product.price)} 
                ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
              </div>
            )}
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="ml-2 text-sm font-medium">{product.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              {product.reviewCount} đánh giá
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              {product.viewCount} lượt xem
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tình trạng:</span>
              <span className="ml-2 capitalize">
                {product.condition === 'new' ? 'Mới' : 'Đã sử dụng'}
              </span>
            </div>
            <div>
              <span className="font-medium">Kho:</span>
              <span className="ml-2">{product.stock} sản phẩm</span>
            </div>
            <div>
              <span className="font-medium">Khu vực:</span>
              <span className="ml-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {product.location}
              </span>
            </div>
            <div>
              <span className="font-medium">Danh mục:</span>
              <span className="ml-2">{product.category.name}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button size="lg" variant="outline">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat với người bán
              </Button>
            </div>
          </div>

          {/* Seller Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thông tin người bán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.seller?.avatar} />
                  <AvatarFallback>{product.seller?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.seller?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.seller?.storeInfo?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      4.8 (120 đánh giá)
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Giao hàng nhanh
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem shop
                  </Button>
                  <Button size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-success" />
              <span>Miễn phí vận chuyển</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="shipping">Vận chuyển & Bảo hành</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3>Thông tin chi tiết</h3>
                  <p>{product.description}</p>
                  
                  <h4>Thông số kỹ thuật</h4>
                  <ul>
                    <li>Tình trạng: {product.condition === 'new' ? 'Mới 100%' : 'Đã sử dụng'}</li>
                    <li>Danh mục: {product.category.name}</li>
                    <li>Khu vực: {product.location}</li>
                    <li>Số lượng còn lại: {product.stock} sản phẩm</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chưa có đánh giá nào</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Thông tin vận chuyển</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
                      <li>• Giao hàng trong 24h tại TP.HCM</li>
                      <li>• Giao hàng 2-3 ngày tại các tỉnh thành khác</li>
                      <li>• Hỗ trợ đổi trả trong 7 ngày</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Chính sách bảo hành</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Bảo hành 12 tháng cho sản phẩm mới</li>
                      <li>• Bảo hành 6 tháng cho sản phẩm đã sử dụng</li>
                      <li>• Hỗ trợ sửa chữa tại các trung tâm ủy quyền</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}