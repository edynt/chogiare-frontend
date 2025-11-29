import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProduct, useProductReviews, useProducts } from '@/hooks'
import { SimpleProductGrid } from '@/components/product/ProductGridWithPagination'
import type { Review } from '@/api/reviews'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SecurityWarning } from '@/components/ui/security-warning'
import { 
  Star, 
  Share2, 
  MapPin, 
  Clock, 
  Shield, 
  Truck, 
  MessageCircle,
  Mail,
  Eye,
  Minus,
  Plus,
  Calculator,
  TrendingUp,
  TrendingDown,
  History,
  Verified,
  Package,
  ShoppingBag,
  Table2,
  CheckCircle2,
  FileText,
  Send,
  Lightbulb,
  Edit,
  Image as ImageIcon
} from 'lucide-react'

interface ProductDetailsProps {
  productId?: string
  className?: string
}

export function ProductDetails({ productId, className }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const productIdToUse = productId || id
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [quoteQuantity, setQuoteQuantity] = useState<string>('')
  const [quoteMessage, setQuoteMessage] = useState<string>('')
  const [quoteMethod, setQuoteMethod] = useState<'chat' | 'email'>('chat')
  const [showPromoteDialog, setShowPromoteDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [reviewImages, setReviewImages] = useState<string[]>([])

  const { data: product, isLoading, error, refetch } = useProduct(productIdToUse || '')
  const { data: reviewsData } = useProductReviews(productIdToUse || '', { page: 1, pageSize: 5 })

  // Initialize selling price (1.5x wholesale price as suggestion)
  React.useEffect(() => {
    if (product && sellingPrice === 0) {
      setSellingPrice(Math.round(product.price * 1.5))
    }
  }, [product, sellingPrice])
  
  if (!productIdToUse) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn một sản phẩm để xem chi tiết.
        </p>
      </div>
    )
  }

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
          <Link to="/seller/products">Quay lại danh sách sản phẩm</Link>
        </Button>
      </div>
    )
  }

  const reviews: Review[] = reviewsData?.reviews || []
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

  const minOrderQty = 10 // Minimum order quantity
  const soldCount = (product.stock || 0) * 3 + product.reviewCount * 10 // Mock sold count

  // Calculate total amount
  const totalAmount = product.price * quantity

  // Mock price tiers
  const priceTiers = [
    { minQuantity: 10, maxQuantity: 49, price: product.price },
    { minQuantity: 50, maxQuantity: 99, price: Math.round(product.price * 0.95) },
    { minQuantity: 100, maxQuantity: 499, price: Math.round(product.price * 0.90) },
    { minQuantity: 500, maxQuantity: null, price: Math.round(product.price * 0.85) },
  ]

  // Get current tier price based on quantity
  const getCurrentTierPrice = () => {
    const sortedTiers = [...priceTiers].sort((a, b) => b.minQuantity - a.minQuantity)
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        return tier.price
      }
    }
    return product.price
  }

  const currentTierPrice = getCurrentTierPrice()
  const totalCost = currentTierPrice * quantity
  const totalRevenue = sellingPrice * quantity
  const totalProfit = totalRevenue - totalCost
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Mock price history (30 days)
  const getPriceHistory = () => {
    const history = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const variation = (i % 7) * 0.02 - 0.06
      const price = product.price * (1 + variation)
      history.push({ date, price })
    }
    return history
  }

  const priceHistory = getPriceHistory()
  const lowestPrice = Math.min(...priceHistory.map(h => h.price))
  const highestPrice = Math.max(...priceHistory.map(h => h.price))
  const todayPrice = priceHistory[priceHistory.length - 1].price
  const yesterdayPrice = priceHistory[priceHistory.length - 2]?.price || todayPrice
  const priceChange = todayPrice - yesterdayPrice
  const priceChangePercent = (priceChange / yesterdayPrice) * 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.images?.[selectedImageIndex] || product.images?.[0] || '/placeholder.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
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
        <div className="space-y-4">
          <div>
            {product.badges && product.badges.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
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

          <Separator className="my-4" />

          {/* Seller Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={product.seller?.avatar || product.store?.logo} />
                    <AvatarFallback>
                      {product.seller?.name?.charAt(0) || product.store?.name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg">{product.store?.name || product.seller?.name || 'Người bán'}</p>
                      {product.store?.isVerified && (
                        <Badge className="bg-green-500 text-white">
                          <Verified className="h-3 w-3 mr-1" />
                          Đã xác thực
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.seller?.name && product.store?.name ? `Người bán: ${product.seller.name}` : 'Nhà cung cấp uy tín'}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {renderStars(product.store?.rating || 4.8)}
                        <span className="font-semibold ml-1">{product.store?.rating?.toFixed(1) || '4.8'}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({product.store?.reviewCount || 1245} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/chat?sellerId=${product.sellerId}&productId=${product.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    onClick={() => setShowPromoteDialog(true)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Đẩy bài
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Security Warning */}
          <SecurityWarning variant="scam" className="my-4" />

          {/* Actions */}
          <div className="space-y-3 py-2">
            {/* Chat Button - Full width, Red, Top */}
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
              asChild
            >
              <Link to={`/chat?sellerId=${product.sellerId}&productId=${product.id}`}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat với người bán
              </Link>
            </Button>
            
            {/* Order and Quote Buttons - Side by side */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                asChild
              >
                <Link to={`/checkout?productId=${product.id}&quantity=${quantity}`}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Đặt hàng
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-white border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => setShowQuoteDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Xin báo giá
              </Button>
            </div>
            
            {/* Secondary Actions */}
            <div className="flex gap-2">
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

          <Separator className="my-4" />

          {/* Stock and Sold Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tồn kho</p>
                    <p className="text-lg font-bold">{product.stock} sản phẩm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Đã bán</p>
                    <p className="text-lg font-bold">{soldCount} sản phẩm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          {/* Quantity Selector */}
          <div className="space-y-2">
            <h4 className="font-medium">Số lượng:</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(minOrderQty, quantity - 1))}
                  disabled={quantity <= minOrderQty}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Tối thiểu {minOrderQty} sản phẩm
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Total Amount */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Wholesale Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>💰 Giá và thông tin mua sỉ</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Phần cực kỳ quan trọng trong app B2B – giúp bạn chốt đơn nhanh.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Giá sỉ</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(currentTierPrice)}/sản phẩm
              </span>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-semibold">
                Số lượng tối thiểu (Mua tối thiểu): Tối thiểu {minOrderQty} sản phẩm / mã
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Pricing Matrix */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Table2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Bảng giá theo số lượng</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Càng mua nhiều, giá càng rẻ
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 p-3 bg-primary/5 rounded-lg font-semibold text-primary">
              <div>Số lượng</div>
              <div className="text-center">Đơn giá</div>
              <div className="text-right">Tiết kiệm</div>
            </div>
            {priceTiers.map((tier, index) => {
              const isActive = quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity)
              const isBest = index === priceTiers.length - 1
              const savings = product.price - tier.price
              const savingsPercent = (savings / product.price) * 100
              
              return (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-3 rounded-lg border ${
                    isActive
                      ? 'bg-green-50 border-green-200'
                      : isBest
                      ? 'bg-green-50/50 border-green-200/50'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{tier.minQuantity}+</span>
                    {isBest && (
                      <Badge className="bg-green-500 text-white text-xs">TỐT NHẤT</Badge>
                    )}
                  </div>
                  <div className={`text-center font-bold ${isBest ? 'text-green-600' : 'text-primary'}`}>
                    {formatCurrency(tier.price)}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{formatCurrency(savings)}</div>
                    <div className="text-xs text-muted-foreground">({savingsPercent.toFixed(1)}%)</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Profit Calculator */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Dự tính lợi nhuận</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tính toán lợi nhuận dự kiến
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Giá bán (đơn vị)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập giá bán"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Số lượng</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(minOrderQty, Number(e.target.value)))}
                className="w-full p-3 border rounded-lg"
                placeholder="Số lượng"
              />
            </div>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold">Đơn giá sỉ:</span>
              <span className="font-bold">{formatCurrency(currentTierPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold">Tổng vốn:</span>
              <span className="font-bold">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold">Tổng doanh thu:</span>
              <span className="font-bold text-primary">{formatCurrency(totalRevenue)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-lg font-bold">Lợi nhuận dự kiến:</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</span>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-600">
                  Tỷ suất lợi nhuận: {profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Quality Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Verified className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Phân tích chất lượng nhà cung cấp</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Thông tin uy tín và đáng tin cậy
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">98%</p>
                    <p className="text-xs font-semibold">Tỉ lệ phản hồi chat</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Phản hồi nhanh
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-600">1.2 ngày</p>
                    <p className="text-xs font-semibold">Thời gian giao hàng</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trung bình
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
                    <p className="text-xs font-semibold">Điểm uy tín</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Rất tốt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">2.5%</p>
                    <p className="text-xs font-semibold">Tỉ lệ hủy đơn</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Rất thấp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Nhà cung cấp uy tín</p>
                <p className="text-sm text-muted-foreground">Đạt tiêu chuẩn chất lượng cao</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price History */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Lịch sử giá</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Biến động giá 30 ngày qua
                </p>
              </div>
            </div>
            <Badge
              variant={priceChange < 0 ? 'default' : 'destructive'}
              className={priceChange < 0 ? 'bg-green-500' : ''}
            >
              {priceChange < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
              {Math.abs(priceChangePercent).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 flex items-end gap-1">
              {priceHistory.map((item, index) => {
                const height = ((item.price - lowestPrice) / (highestPrice - lowestPrice)) * 100
                const isToday = index === priceHistory.length - 1
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                    style={{ height: '100%' }}
                  >
                    <div
                      className={`w-full rounded-t ${
                        isToday ? 'bg-primary' : 'bg-primary/60'
                      }`}
                      style={{ height: `${Math.max(5, height)}%` }}
                    />
                    {index % 7 === 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {isToday ? 'Hôm nay' : index + 1}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Giá thấp nhất</p>
                <p className="font-bold text-green-600">{formatCurrency(lowestPrice)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Giá hiện tại</p>
                <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Giá cao nhất</p>
                <p className="font-bold text-orange-600">{formatCurrency(highestPrice)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
          <TabsTrigger value="write-review">Viết đánh giá</TabsTrigger>
          <TabsTrigger value="seller">Thông tin người bán</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="certificates">Đảm bảo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="whitespace-pre-wrap">{product.description}</p>
              {product.tags && product.tags.length > 0 && (
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

          {/* Selling Guide Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Cách nhập bán hàng hiệu quả</CardTitle>
                  <p className="text-sm text-muted-foreground">Hướng dẫn và mẹo bán lại hiệu quả</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Hướng dẫn nhập hàng:</h4>
                <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                  <li>Đặt hàng tối thiểu theo mua tối thiểu để được giá tốt nhất</li>
                  <li>Kiểm tra số lượng tồn kho trước khi đặt hàng</li>
                  <li>Chọn phương thức vận chuyển phù hợp với nhu cầu</li>
                  <li>Thanh toán đúng hạn để được ưu đãi</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Mẹo bán lại hiệu quả:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h5 className="font-semibold">Định giá hợp lý</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nghiên cứu thị trường và đặt giá cạnh tranh nhưng vẫn đảm bảo lợi nhuận.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                      <h5 className="font-semibold">Chụp ảnh đẹp</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chụp ảnh sản phẩm thật, nhiều góc độ để khách hàng tin tưởng hơn.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <h5 className="font-semibold">Mô tả chi tiết</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Viết mô tả rõ ràng, nêu bật ưu điểm và đặc điểm nổi bật của sản phẩm.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-5 w-5 text-orange-600" />
                      <h5 className="font-semibold">Giao hàng nhanh</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Đảm bảo giao hàng đúng hẹn để tăng uy tín và nhận được đánh giá tốt.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Đánh giá sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
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
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>
                            {(review.userName || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.userName || 'Người dùng'}</p>
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

        <TabsContent value="write-review" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Edit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Viết đánh giá</CardTitle>
                  <p className="text-sm text-muted-foreground">Chia sẻ trải nghiệm của bạn về sản phẩm</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <div>
                <Label className="mb-3 block">Đánh giá của bạn</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewRating(rating)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          rating <= reviewRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment" className="mb-3 block">Nhận xét của bạn</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={5}
                />
              </div>
              <div>
                <Label className="mb-3 block">Thêm ảnh (tùy chọn, tối đa 5 ảnh)</Label>
                <div className="flex gap-2 flex-wrap">
                  {reviewImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Review ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {reviewImages.length < 5 && (
                    <button
                      onClick={() => {
                        // Simulate image upload
                        const url = prompt('Nhập URL ảnh (demo)')
                        if (url) setReviewImages([...reviewImages, url])
                      }}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (!reviewComment.trim()) {
                    alert('Vui lòng nhập đánh giá')
                    return
                  }
                  // Handle submit review
                  alert('Đã gửi đánh giá thành công!')
                  setReviewComment('')
                  setReviewImages([])
                  setReviewRating(5)
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi đánh giá
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seller" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Thông tin người bán</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
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

        <TabsContent value="faq" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">💬 Câu hỏi thường gặp</CardTitle>
              <p className="text-sm text-muted-foreground">Chọn câu hỏi để chat với người bán</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[
                  'Sản phẩm có đảm bảo chất lượng không?',
                  'Thời gian giao hàng là bao lâu?',
                  'Có hỗ trợ đổi trả không?',
                  'Giá có thể thương lượng không?',
                  'Có chính sách bảo hành không?',
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => {
                      // Navigate to chat with question
                      window.location.href = '/chat'
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">✅ Thông tin đảm bảo</CardTitle>
              <p className="text-sm text-muted-foreground">Nguồn gốc và chứng nhận</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Nguồn gốc xuất xứ</p>
                    <p className="text-sm text-muted-foreground">Sản phẩm có nguồn gốc rõ ràng, đảm bảo chất lượng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Chứng nhận chất lượng</p>
                    <p className="text-sm text-muted-foreground">Đã được kiểm định và chứng nhận bởi cơ quan có thẩm quyền</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Verified className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Nhà cung cấp uy tín</p>
                    <p className="text-sm text-muted-foreground">Đã được xác thực và đánh giá cao bởi khách hàng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Chính sách vận chuyển</p>
                    <p className="text-sm text-muted-foreground">Giao hàng nhanh, đóng gói cẩn thận, đảm bảo an toàn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Best Selling Products Section */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>🔥 Sản phẩm bán chạy dành cho shop</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gợi ý theo ngành hàng, vốn nhập, mùa vụ
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BestSellingProducts 
            productId={product.id} 
            categoryId={product.categoryId || product.category?.id || ''} 
          />
        </CardContent>
      </Card>

      {/* Request Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Xin báo giá
            </DialogTitle>
            <DialogDescription>
              Gửi yêu cầu báo giá cho sản phẩm <strong>{product.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Method Selection */}
            <div className="space-y-2">
              <Label>Chọn phương thức gửi yêu cầu *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteMethod('chat')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    quoteMethod === 'chat'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      quoteMethod === 'chat' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <MessageCircle className={`h-5 w-5 ${
                        quoteMethod === 'chat' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${
                        quoteMethod === 'chat' ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        Qua Chat
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Phản hồi nhanh
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuoteMethod('email')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    quoteMethod === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      quoteMethod === 'email' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <Mail className={`h-5 w-5 ${
                        quoteMethod === 'email' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${
                        quoteMethod === 'email' ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        Qua Email
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gửi email trực tiếp
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-quantity">Số lượng cần báo giá *</Label>
              <Input
                id="quote-quantity"
                type="number"
                placeholder="Nhập số lượng"
                value={quoteQuantity}
                onChange={(e) => setQuoteQuantity(e.target.value)}
                min={minOrderQty}
              />
              <p className="text-xs text-muted-foreground">
                Số lượng tối thiểu: {minOrderQty} sản phẩm
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-message">Tin nhắn (tùy chọn)</Label>
              <Textarea
                id="quote-message"
                placeholder="Nhập yêu cầu chi tiết về sản phẩm, giá cả, thời gian giao hàng..."
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Yêu cầu báo giá của bạn sẽ được gửi đến người bán {quoteMethod === 'chat' ? 'qua hệ thống chat' : 'qua email'}. 
                Người bán sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowQuoteDialog(false)
                setQuoteQuantity('')
                setQuoteMessage('')
                setQuoteMethod('chat')
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (!quoteQuantity || parseInt(quoteQuantity) < minOrderQty) {
                  alert(`Vui lòng nhập số lượng tối thiểu ${minOrderQty} sản phẩm`)
                  return
                }
                
                const message = `Xin chào, tôi muốn xin báo giá cho sản phẩm "${product.title}" với số lượng ${quoteQuantity}${quoteMessage ? `\n\nYêu cầu: ${quoteMessage}` : ''}`
                
                if (quoteMethod === 'chat') {
                  // Navigate to chat with quote request
                  window.location.href = `/chat?sellerId=${product.sellerId}&productId=${product.id}&message=${encodeURIComponent(message)}`
                } else {
                  // Send via email
                  const emailSubject = encodeURIComponent(`Yêu cầu báo giá sản phẩm: ${product.title}`)
                  const emailBody = encodeURIComponent(message)
                  const sellerEmail = product.seller?.email || product.store?.email || ''
                  if (sellerEmail) {
                    window.location.href = `mailto:${sellerEmail}?subject=${emailSubject}&body=${emailBody}`
                  } else {
                    alert('Không tìm thấy email của người bán')
                    return
                  }
                }
                
                setShowQuoteDialog(false)
                setQuoteQuantity('')
                setQuoteMessage('')
                setQuoteMethod('chat')
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {quoteMethod === 'chat' ? (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Gửi qua Chat
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi qua Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote Post Dialog */}

      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Đẩy bài viết
            </DialogTitle>
            <DialogDescription>
              Tăng độ hiển thị cho sản phẩm <strong>{product.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 mb-3">
                <strong>Lợi ích khi đẩy bài:</strong>
              </p>
              <ul className="space-y-2 text-sm text-orange-700 list-disc list-inside">
                <li>Hiển thị ở vị trí nổi bật trên trang chủ</li>
                <li>Tăng lượt xem và tương tác</li>
                <li>Xuất hiện trong danh sách sản phẩm được đề xuất</li>
                <li>Tăng khả năng bán hàng</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Gói 1 ngày</p>
                    <p className="text-sm text-muted-foreground">50,000 VNĐ</p>
                  </div>
                  <Badge>Phổ biến</Badge>
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Gói 1 tuần</p>
                    <p className="text-sm text-muted-foreground">250,000 VNĐ</p>
                  </div>
                  <Badge variant="secondary">Tiết kiệm</Badge>
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Gói 1 tháng</p>
                    <p className="text-sm text-muted-foreground">800,000 VNĐ</p>
                  </div>
                  <Badge variant="secondary">Tốt nhất</Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPromoteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                // Navigate to boost page
                window.location.href = `/boost-post?productId=${product.id}`
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Chọn gói đẩy bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Best Selling Products Component
function BestSellingProducts({ productId, categoryId }: { productId: string; categoryId: string }) {
  const { data: productsData } = useProducts({ 
    limit: 20, 
    ...(categoryId ? { categoryId } : {}),
    sortBy: 'reviewCount',
    sortOrder: 'desc'
  })
  
  const bestSelling = (productsData?.items || [])
    .filter(p => p.id !== productId && p.rating >= 4.5 && p.reviewCount >= 10)
    .sort((a, b) => {
      const reviewCompare = b.reviewCount - a.reviewCount
      if (reviewCompare !== 0) return reviewCompare
      return b.rating - a.rating
    })
    .slice(0, 8)

  if (bestSelling.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Chưa có sản phẩm bán chạy trong danh mục này</p>
      </div>
    )
  }

  return <SimpleProductGrid products={bestSelling} />
}