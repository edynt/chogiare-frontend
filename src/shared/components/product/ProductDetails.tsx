import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import { Button } from '@shared/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@shared/components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components/ui/tabs'
import { Separator } from '@shared/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import { Textarea } from '@shared/components/ui/textarea'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@shared/components/ui/alert'
import { useProduct, useProductReviews, useProducts, useProfile, useBoostStatus } from '@/hooks'
import { SimpleProductGrid } from '@shared/components/product/ProductGridWithPagination'
import type { Review } from '@user/api/reviews'
import { ErrorMessage } from '@shared/components/ui/error-boundary'
import {
  ProductDetailSkeleton,
  ProductDetailSectionSkeleton,
} from '@shared/components/skeleton/ProductDetailSkeleton'
import { LazySection } from './LazySection'
import { BoostProductModal } from './BoostProductModal'
import { formatCurrency, formatDate, PLACEHOLDER_IMAGE } from '@/lib/utils'
import { SecurityWarning } from '@shared/components/ui/security-warning'
import { useCartStore } from '@/stores/cartStore'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
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
  ShoppingCart,
  Table2,
  CheckCircle2,
  FileText,
  Send,
  Lightbulb,
  Edit,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
} from 'lucide-react'

interface ProductDetailsProps {
  productId?: string
  className?: string
}

export function ProductDetails({ productId, className }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const productIdToUse = productId || id
  const { addItem } = useCartStore()
  const { openChatWithSeller } = useChatStore()
  const { isAuthenticated } = useAuthStore()
  const { data: user } = useProfile()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [showBoostDialog, setShowBoostDialog] = useState(false)
  const [quoteQuantity, setQuoteQuantity] = useState<string>('')
  const [quoteMessage, setQuoteMessage] = useState<string>('')
  const [quoteMethod, setQuoteMethod] = useState<'chat' | 'email'>('chat')
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>('')

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProduct(productIdToUse || '')
  const { data: reviewsData } = useProductReviews(productIdToUse || '', {
    page: 1,
    pageSize: 5,
  })

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
    return <ProductDetailSkeleton />
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
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  // Get seller ID - prefer sellerId, fallback to seller.id
  const getSellerIdForChat = () => {
    if (product.sellerId != null && product.sellerId !== '') {
      return String(product.sellerId)
    }
    if (product.seller?.id != null) {
      return String(product.seller.id)
    }
    return null
  }
  const sellerIdForChat = getSellerIdForChat()

  // Handle opening chat with seller
  const handleChatWithSeller = (message?: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để chat với người bán')
      window.location.href = '/auth/login'
      return
    }
    if (!sellerIdForChat) {
      toast.error('Không thể xác định người bán')
      return
    }
    openChatWithSeller(Number(sellerIdForChat), message)
  }

  // Check if current user is the product owner
  // Compare as strings to handle both string and number IDs from API
  const isOwnProduct =
    user?.id != null &&
    sellerIdForChat != null &&
    String(user.id) === sellerIdForChat

  // Get boost status for owner's product
  const { data: boostStatus } = useBoostStatus(
    productIdToUse || '',
    isOwnProduct
  )

  // Helper function to calculate remaining boost time
  const getRemainingBoostTime = (endAtString: string) => {
    const endTime = /^\d+$/.test(endAtString)
      ? parseInt(endAtString, 10)
      : new Date(endAtString).getTime()

    const now = Date.now()
    const diff = endTime - now

    if (diff <= 0) {
      return { text: 'Đã hết hạn', color: 'text-red-600', isExpired: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return {
        text: `Còn ${days} ngày ${hours} giờ`,
        color: days <= 1 ? 'text-orange-600' : 'text-green-600',
        isExpired: false,
      }
    } else if (hours > 0) {
      return {
        text: `Còn ${hours} giờ ${minutes} phút`,
        color: 'text-orange-600',
        isExpired: false,
      }
    } else {
      return {
        text: `Còn ${minutes} phút`,
        color: 'text-red-600',
        isExpired: false,
      }
    }
  }

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
    {
      minQuantity: 50,
      maxQuantity: 99,
      price: Math.round(product.price * 0.95),
    },
    {
      minQuantity: 100,
      maxQuantity: 499,
      price: Math.round(product.price * 0.9),
    },
    {
      minQuantity: 500,
      maxQuantity: null,
      price: Math.round(product.price * 0.85),
    },
  ]

  // Get current tier price based on quantity
  const getCurrentTierPrice = () => {
    const sortedTiers = [...priceTiers].sort(
      (a, b) => b.minQuantity - a.minQuantity
    )
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
  const yesterdayPrice =
    priceHistory[priceHistory.length - 2]?.price || todayPrice
  const priceChange = todayPrice - yesterdayPrice
  const priceChangePercent = (priceChange / yesterdayPrice) * 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Header - Load immediately */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted border-2 border-border">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[selectedImageIndex] || product.images[0]
                  : PLACEHOLDER_IMAGE
              }
              alt={product.title}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onError={e => {
                e.currentTarget.src = PLACEHOLDER_IMAGE
              }}
              onClick={() => {
                if (product.images && product.images.length > 1) {
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % product.images.length
                  )
                }
              }}
            />
          </div>

          {product.images && product.images.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Hình ảnh sản phẩm ({product.images.length})
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedImageIndex + 1} / {product.images.length}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có hình ảnh</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            {product.badges && product.badges.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                {product.badges.map(badge => (
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
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  </>
                )}
            </div>
            <p className="text-sm text-muted-foreground">
              Tình trạng:{' '}
              <span className="font-medium">{product.condition}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Còn lại:{' '}
              <span className="font-medium text-green-600">
                {product.stock} sản phẩm
              </span>
            </p>
          </div>

          {/* Seller Info Card - Hide for own products */}
          {!isOwnProduct && (
            <>
              <Separator className="my-4" />

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex items-start gap-4 flex-1 cursor-pointer"
                      onClick={() => {
                        if (product.sellerId) {
                          window.location.href = `/shop/${product.sellerId}`
                        }
                      }}
                    >
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={product.seller?.avatar} />
                        <AvatarFallback>
                          {product.seller?.name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-lg">
                            {product.seller?.name || 'Người bán'}
                          </p>
                          {product.seller?.isVerified && (
                            <Badge className="bg-green-500 text-white">
                              <Verified className="h-3 w-3 mr-1" />
                              Đã xác thực
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Nhà cung cấp uy tín
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating || 0)}
                            <span className="font-semibold ml-1">
                              {product.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            ({product.reviewCount || 0} đánh giá)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="whitespace-nowrap"
                      >
                        <Link to={`/shop/${product.sellerId || ''}`}>
                          <Package className="h-4 w-4 mr-2" />
                          Xem sản phẩm
                        </Link>
                      </Button>
                      {sellerIdForChat && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleChatWithSeller}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator className="my-4" />

              {/* Security Warning */}
              <SecurityWarning variant="scam" className="my-4" />

              {/* Buyer Warning - Protect Seller */}
              <Alert className="border-amber-500 bg-amber-50/50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-900 font-semibold mb-1">
                  ⚠️ Lưu ý quan trọng cho người mua
                </AlertTitle>
                <AlertDescription className="text-amber-800 text-sm space-y-1">
                  <p className="font-medium">
                    Vui lòng chỉ đặt hàng hoặc liên hệ khi bạn thực sự có nhu
                    cầu mua sản phẩm.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Không spam tin nhắn hoặc đặt hàng giả để tội người bán
                    </li>
                    <li>Hãy tôn trọng thời gian và công sức của người bán</li>
                    <li>
                      Đặt hàng nghiêm túc giúp tạo môi trường mua bán lành mạnh
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="space-y-3 py-2">
                {/* Primary Action - Chat Button */}
                {sellerIdForChat ? (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                    onClick={handleChatWithSeller}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat với người bán
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gray-400 text-white text-lg py-6 cursor-not-allowed"
                    disabled
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Không thể chat (thiếu thông tin người bán)
                  </Button>
                )}

                {/* Secondary Actions - Add to Cart & Order */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      addItem(product, quantity)
                      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm giỏ
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                    asChild
                  >
                    <Link
                      to={`/checkout?productId=${product.id}&quantity=${quantity}`}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Đặt hàng
                    </Link>
                  </Button>
                </div>

                {/* Tertiary Actions - Outline style */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    onClick={() => setShowQuoteDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Xin báo giá
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 hover:bg-muted/50"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Đã sao chép link sản phẩm')
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Owner Actions - Show Share and Promote buttons for own products */}
          {isOwnProduct && (
            <div className="space-y-3 py-2">
              <Separator className="my-4" />

              {/* Show remaining boost time if product is being boosted */}
              {boostStatus?.isPromoted && boostStatus.boost?.endAt && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Đang được đẩy
                      </p>
                      <p className={`text-lg font-bold ${getRemainingBoostTime(boostStatus.boost.endAt).color}`}>
                        {getRemainingBoostTime(boostStatus.boost.endAt).text}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      onClick={() => setShowBoostDialog(true)}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Đẩy thêm
                    </Button>
                  </div>
                </div>
              )}

              <div className={`grid gap-2 ${boostStatus?.isPromoted ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Show Boost button only when not being boosted */}
                {!boostStatus?.isPromoted && (
                  <Button
                    variant="outline"
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    onClick={() => setShowBoostDialog(true)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Đẩy sản phẩm
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-2 hover:bg-muted/50"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Đã sao chép link sản phẩm')
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          )}

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
                    <p className="text-lg font-bold">
                      {product.stock} sản phẩm
                    </p>
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
                  onClick={() =>
                    setQuantity(Math.max(minOrderQty, quantity - 1))
                  }
                  disabled={quantity <= minOrderQty}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-semibold">
                  {quantity}
                </span>
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

      {/* Wholesale Info Section - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>💰 Giá và thông tin mua sỉ</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Phần cực kỳ quan trọng trong app B2B – giúp bạn chốt đơn
                  nhanh.
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
                  Số lượng tối thiểu (Mua tối thiểu): Tối thiểu {minOrderQty}{' '}
                  sản phẩm / mã
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </LazySection>

      {/* Tier Pricing Matrix - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
        <Card className="mt-6 border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Table2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Bảng giá theo số lượng
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Càng mua nhiều, giá càng rẻ - Ưu đãi tốt nhất cho đơn hàng
                    lớn
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                <TrendingDown className="h-3 w-3 mr-1" />
                Giảm giá theo số lượng
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {priceTiers.map((tier, index) => {
                const isActive =
                  quantity >= tier.minQuantity &&
                  (tier.maxQuantity === null || quantity <= tier.maxQuantity)
                const isBest = index === priceTiers.length - 1
                const savings = product.price - tier.price
                const savingsPercent = (savings / product.price) * 100
                const totalAtTier = tier.price * (tier.minQuantity || 1)

                return (
                  <div
                    key={index}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg scale-105'
                        : isBest
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-md'
                          : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 -right-3">
                        <Badge className="bg-green-500 text-white shadow-lg animate-pulse">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Đang chọn
                        </Badge>
                      </div>
                    )}

                    {isBest && !isActive && (
                      <div className="absolute -top-3 -right-3">
                        <Badge className="bg-blue-500 text-white shadow-lg">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Tốt nhất
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Quantity Range */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="font-bold text-lg text-primary">
                            {tier.minQuantity}
                            {tier.maxQuantity
                              ? ` - ${tier.maxQuantity}`
                              : '+'}{' '}
                            sản phẩm
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground">Đơn giá</p>
                        <p
                          className={`text-2xl font-bold ${
                            isActive
                              ? 'text-green-600'
                              : isBest
                                ? 'text-blue-600'
                                : 'text-primary'
                          }`}
                        >
                          {formatCurrency(tier.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          / sản phẩm
                        </p>
                      </div>

                      {/* Savings */}
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Tiết kiệm:
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(savings)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Tỷ lệ:
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-300"
                          >
                            -{savingsPercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Example Total */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground text-center mb-1">
                          Tổng tiền ({tier.minQuantity} sản phẩm):
                        </p>
                        <p className="text-center font-semibold text-primary">
                          {formatCurrency(totalAtTier)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Current Selection Info */}
            {quantity > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        Bạn đang chọn: {quantity} sản phẩm
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Áp dụng mức giá: {formatCurrency(currentTierPrice)}/sản
                        phẩm
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(totalCost)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </LazySection>

      {/* Profit Calculator - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
        <Card className="mt-6 border-2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Dự tính lợi nhuận</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tính toán lợi nhuận dự kiến khi bán lại sản phẩm
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                <Lightbulb className="h-3 w-3 mr-1" />
                Công cụ hỗ trợ
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="selling-price"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4 text-primary" />
                    Giá bán dự kiến (đơn vị)
                  </Label>
                  <div className="relative">
                    <Input
                      id="selling-price"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={sellingPrice || ''}
                      onChange={e => {
                        const value = e.target.value
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setSellingPrice(parseFloat(value) || 0)
                        }
                      }}
                      placeholder="Nhập giá bán dự kiến"
                      className="pl-10 text-lg"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gợi ý: {formatCurrency(Math.round(currentTierPrice * 1.5))}{' '}
                    (1.5x giá sỉ)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="profit-quantity"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Package className="h-4 w-4 text-primary" />
                    Số lượng bán
                  </Label>
                  <div className="relative">
                    <Input
                      id="profit-quantity"
                      type="number"
                      value={quantity}
                      onChange={e =>
                        setQuantity(
                          Math.max(
                            minOrderQty,
                            Number(e.target.value) || minOrderQty
                          )
                        )
                      }
                      placeholder="Số lượng"
                      className="pl-10 text-lg"
                      min={minOrderQty}
                    />
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tối thiểu: {minOrderQty} sản phẩm
                  </p>
                </div>

                {/* Quick Price Suggestions */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">
                    Gợi ý giá bán nhanh:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1.2, 1.5, 1.8, 2.0].map(multiplier => {
                      const suggestedPrice = Math.round(
                        currentTierPrice * multiplier
                      )
                      return (
                        <Button
                          key={multiplier}
                          variant="outline"
                          size="sm"
                          onClick={() => setSellingPrice(suggestedPrice)}
                          className="text-xs"
                        >
                          {multiplier}x = {formatCurrency(suggestedPrice)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-muted-foreground">
                          Tổng vốn
                        </p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(totalCost)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(currentTierPrice)} × {quantity}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <p className="text-xs text-muted-foreground">
                          Tổng doanh thu
                        </p>
                      </div>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(totalRevenue)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(sellingPrice)} × {quantity}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Profit Highlight */}
                <Card
                  className={`border-2 ${
                    totalProfit > 0
                      ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                      : totalProfit < 0
                        ? 'border-red-400 bg-gradient-to-br from-red-50 to-rose-50'
                        : 'border-gray-300 bg-muted'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Lợi nhuận dự kiến
                        </p>
                        <p
                          className={`text-4xl font-bold ${
                            totalProfit > 0
                              ? 'text-green-600'
                              : totalProfit < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {formatCurrency(totalProfit)}
                        </p>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-center gap-2">
                        {totalProfit > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : totalProfit < 0 ? (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        ) : null}
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Tỷ suất lợi nhuận
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              profitMargin > 0
                                ? 'text-green-600'
                                : profitMargin < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {profitMargin > 0 ? '+' : ''}
                            {profitMargin.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {totalProfit > 0 && (
                        <div className="mt-3 p-3 bg-green-100 rounded-lg">
                          <p className="text-xs font-semibold text-green-800">
                            ✓ Lợi nhuận tích cực - Đây là mức giá hợp lý để bán
                            lại
                          </p>
                        </div>
                      )}
                      {totalProfit <= 0 && sellingPrice > 0 && (
                        <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                          <p className="text-xs font-semibold text-yellow-800">
                            ⚠ Cần điều chỉnh giá bán để có lợi nhuận
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold mb-3 text-muted-foreground">
                      Chi tiết tính toán:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Đơn giá sỉ:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(currentTierPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Giá bán dự kiến:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(sellingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Lợi nhuận/đơn vị:
                        </span>
                        <span
                          className={`font-medium ${
                            sellingPrice > currentTierPrice
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(sellingPrice - currentTierPrice)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Lợi nhuận tổng:</span>
                        <span
                          className={
                            totalProfit > 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {formatCurrency(totalProfit)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </LazySection>

      {/* Supplier Quality Dashboard - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
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
                      <p className="text-xs font-semibold">
                        Tỉ lệ phản hồi chat
                      </p>
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
                      <p className="text-2xl font-bold text-cyan-600">
                        1.2 ngày
                      </p>
                      <p className="text-xs font-semibold">
                        Thời gian giao hàng
                      </p>
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
                      <p className="text-2xl font-bold text-yellow-600">
                        4.8/5
                      </p>
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
                  <p className="text-sm text-muted-foreground">
                    Đạt tiêu chuẩn chất lượng cao
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </LazySection>

      {/* Price History - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
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
                {priceChange < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(priceChangePercent).toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 flex items-end gap-1">
                {priceHistory.map((item, index) => {
                  const height =
                    ((item.price - lowestPrice) /
                      (highestPrice - lowestPrice)) *
                    100
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
                  <p className="text-xs text-muted-foreground mb-1">
                    Giá thấp nhất
                  </p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(lowestPrice)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Giá hiện tại
                  </p>
                  <p className="font-bold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Giá cao nhất
                  </p>
                  <p className="font-bold text-orange-600">
                    {formatCurrency(highestPrice)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </LazySection>

      {/* Product Details Tabs - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
        <Tabs defaultValue="description" className="w-full mt-6">
          <TabsList
            className={`grid w-full ${isOwnProduct ? 'grid-cols-4' : 'grid-cols-6'}`}
          >
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="reviews">
              Đánh giá ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="write-review">Viết đánh giá</TabsTrigger>
            {!isOwnProduct && (
              <TabsTrigger value="seller">Thông tin người bán</TabsTrigger>
            )}
            {!isOwnProduct && <TabsTrigger value="faq">FAQ</TabsTrigger>}
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
                      {product.tags.map(tag => (
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
                    <CardTitle className="text-lg">
                      Cách nhập bán hàng hiệu quả
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Hướng dẫn và mẹo bán lại hiệu quả
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Hướng dẫn nhập hàng:</h4>
                  <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                    <li>
                      Đặt hàng tối thiểu theo mua tối thiểu để được giá tốt nhất
                    </li>
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
                        Nghiên cứu thị trường và đặt giá cạnh tranh nhưng vẫn
                        đảm bảo lợi nhuận.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="h-5 w-5 text-green-600" />
                        <h5 className="font-semibold">Chụp ảnh đẹp</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Chụp ảnh sản phẩm thật, nhiều góc độ để khách hàng tin
                        tưởng hơn.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h5 className="font-semibold">Mô tả chi tiết</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Viết mô tả rõ ràng, nêu bật ưu điểm và đặc điểm nổi bật
                        của sản phẩm.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-orange-600" />
                        <h5 className="font-semibold">Giao hàng nhanh</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Đảm bảo giao hàng đúng hẹn để tăng uy tín và nhận được
                        đánh giá tốt.
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
                    {reviews.map(review => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>
                              {(review.userName || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {review.userName || 'Người dùng'}
                            </p>
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
                    <p className="text-sm text-muted-foreground">
                      Chia sẻ trải nghiệm của bạn về sản phẩm
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                <div>
                  <Label className="mb-3 block">Đánh giá của bạn</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
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
                  <Label htmlFor="review-comment" className="mb-3 block">
                    Nhận xét của bạn
                  </Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={5}
                  />
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
                    setReviewRating(5)
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Gửi đánh giá
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller Tab - Hide for own products */}
          {!isOwnProduct && (
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
                        {product.seller?.name?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {product.seller?.name || 'Người bán'}
                      </h3>
                      {product.seller?.isVerified && (
                        <Badge className="bg-green-500 text-white mt-1">
                          <Verified className="h-3 w-3 mr-1" />
                          Đã xác thực
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(product.rating || 0)}
                        <span className="text-sm text-muted-foreground">
                          ({product.rating?.toFixed(1) || '0.0'}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {sellerIdForChat && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleChatWithSeller}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/shop/${sellerIdForChat || ''}`}>
                        <Package className="h-4 w-4 mr-2" />
                        Xem sản phẩm
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* FAQ Tab - Hide for own products since it's about chatting with seller */}
          {!isOwnProduct && (
            <TabsContent value="faq" className="mt-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    💬 Câu hỏi thường gặp
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Chọn câu hỏi để chat với người bán
                  </p>
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
                          // Open chat popup with question
                          handleChatWithSeller(
                            `Xin chào, tôi có câu hỏi về sản phẩm "${product.title}": ${question}`
                          )
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
          )}

          <TabsContent value="certificates" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">✅ Thông tin đảm bảo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Bảo hành và chính sách đổi trả
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {product.warranty ? (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Bảo hành</p>
                        <p className="text-sm text-muted-foreground">
                          {product.warranty}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-500">Bảo hành</p>
                        <p className="text-sm text-muted-foreground">
                          Không có thông tin bảo hành
                        </p>
                      </div>
                    </div>
                  )}
                  {product.returnPolicy ? (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Chính sách đổi trả</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {product.returnPolicy}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-500">
                          Chính sách đổi trả
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Không có thông tin đổi trả
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <Verified className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Nhà cung cấp uy tín</p>
                      <p className="text-sm text-muted-foreground">
                        Đã được xác thực và đánh giá cao bởi khách hàng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LazySection>

      {/* Best Selling Products Section - Lazy Load */}
      <LazySection fallback={<ProductDetailSectionSkeleton />}>
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
              categoryId={String(
                product.categoryId || product.category?.id || ''
              )}
            />
          </CardContent>
        </Card>
      </LazySection>

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
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        quoteMethod === 'chat' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <MessageCircle
                        className={`h-5 w-5 ${
                          quoteMethod === 'chat'
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          quoteMethod === 'chat'
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
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
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        quoteMethod === 'email' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <Mail
                        className={`h-5 w-5 ${
                          quoteMethod === 'email'
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          quoteMethod === 'email'
                            ? 'text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
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
                onChange={e => setQuoteQuantity(e.target.value)}
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
                onChange={e => setQuoteMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Yêu cầu báo giá của bạn sẽ được gửi đến
                người bán{' '}
                {quoteMethod === 'chat' ? 'qua hệ thống chat' : 'qua email'}.
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
                  alert(
                    `Vui lòng nhập số lượng tối thiểu ${minOrderQty} sản phẩm`
                  )
                  return
                }

                const quoteMsg = `Xin chào, tôi muốn xin báo giá cho sản phẩm "${product.title}" với số lượng ${quoteQuantity}${quoteMessage ? `\n\nYêu cầu: ${quoteMessage}` : ''}`

                if (quoteMethod === 'chat') {
                  // Open chat popup with quote request
                  handleChatWithSeller(quoteMsg)
                } else {
                  // Send via email
                  const emailSubject = encodeURIComponent(
                    `Yêu cầu báo giá sản phẩm: ${product.title}`
                  )
                  const emailBody = encodeURIComponent(message)
                  const sellerEmail = product.seller?.email || ''
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

      {/* Boost Product Modal */}
      {isOwnProduct && product && (
        <BoostProductModal
          isOpen={showBoostDialog}
          onClose={() => setShowBoostDialog(false)}
          productId={String(product.id)}
          productTitle={product.title}
        />
      )}
    </div>
  )
}

// Best Selling Products Component
function BestSellingProducts({
  productId,
  categoryId,
}: {
  productId: string
  categoryId: string
}) {
  const { data: productsData } = useProducts({
    limit: 20,
    ...(categoryId ? { categoryId } : {}),
    sortBy: 'reviewCount',
    sortOrder: 'desc',
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
        <p className="text-muted-foreground">
          Chưa có sản phẩm bán chạy trong danh mục này
        </p>
      </div>
    )
  }

  return <SimpleProductGrid products={bestSelling} />
}
