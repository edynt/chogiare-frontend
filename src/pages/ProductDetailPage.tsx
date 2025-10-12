import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProduct } from '@/hooks/useProducts'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cartSlice'
import { formatPrice } from '@/lib/utils'
import { 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Minus, 
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageSquare,
  Phone,
  Package,
  Clock,
  MapPin,
  Tag,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Award,
  CreditCard
} from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id!)
  const dispatch = useAppDispatch()
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [selectedCoupon, setSelectedCoupon] = useState<string>('')

  // Mock data for variants, coupons, and shipping
  const variants = {
    color: ['Đỏ', 'Xanh', 'Đen', 'Trắng'],
    size: ['S', 'M', 'L', 'XL'],
    material: ['Cotton', 'Polyester', 'Linen']
  }

  const availableCoupons = [
    { id: 'SAVE10', code: 'SAVE10', discount: 10, type: 'percent', minOrder: 200000, description: 'Giảm 10% cho đơn hàng từ 200k' },
    { id: 'FREESHIP', code: 'FREESHIP', discount: 0, type: 'shipping', minOrder: 300000, description: 'Miễn phí vận chuyển cho đơn hàng từ 300k' },
    { id: 'SAVE50K', code: 'SAVE50K', discount: 50000, type: 'fixed', minOrder: 500000, description: 'Giảm 50k cho đơn hàng từ 500k' }
  ]

  const shippingOptions = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 30000, duration: '3-5 ngày', icon: Truck },
    { id: 'express', name: 'Giao hàng nhanh', price: 50000, duration: '1-2 ngày', icon: Zap },
    { id: 'pickup', name: 'Nhận tại cửa hàng', price: 0, duration: 'Ngay lập tức', icon: MapPin }
  ]

  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id)

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ 
        product: product as any, 
        quantity 
      }))
    }
  }

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ 
        product: product as any, 
        quantity 
      }))
      // Redirect to checkout
      window.location.href = '/payment'
    }
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stock || 1)))
  }

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: value
    }))
  }

  const calculateTotalPrice = () => {
    if (!product) return 0
    
    let total = product.price * quantity
    const shipping = shippingOptions.find(s => s.id === selectedShipping)?.price || 0
    
    // Apply coupon discount
    if (selectedCoupon && selectedCoupon !== 'none') {
      const coupon = availableCoupons.find(c => c.id === selectedCoupon)
      if (coupon && total >= coupon.minOrder) {
        if (coupon.type === 'percent') {
          total = total * (1 - coupon.discount / 100)
        } else if (coupon.type === 'fixed') {
          total = Math.max(0, total - coupon.discount)
        } else if (coupon.type === 'shipping') {
          // Free shipping
        }
      }
    }
    
    return total + (selectedCoupon === 'FREESHIP' ? 0 : shipping)
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handlePreviousImage = () => {
    if (product) {
      setSelectedImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  const handleNextImage = () => {
    if (product) {
      setSelectedImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h1>
            <Link to="/products">
              <Button>Quay lại danh sách sản phẩm</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title || (product as any).name || 'Product'}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.title || (product as any).name || 'Product'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop'
              }}
            />
              
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors">
                <ZoomIn className="h-5 w-5" />
              </div>

              {/* Discount badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="text-sm">
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title || (product as any).name || 'Product'} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title || (product as any).name || 'Product'}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-600">({product.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Còn {product.stock} sản phẩm</Badge>
                </div>
              </div>
              
              {/* Sales and View Stats */}
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Đã bán: {Math.floor(Math.random() * 1000) + 100}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Lượt xem: {product.viewCount || Math.floor(Math.random() * 5000) + 500}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Top bán chạy</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-sm text-green-600">
                  Tiết kiệm {formatPrice(product.originalPrice! - product.price)} ({discountPercentage}%)
                </p>
              )}
            </div>

            {/* Product Variants */}
            <div className="space-y-4">
              {Object.entries(variants).map(([variantType, options]) => (
                <div key={variantType} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {variantType === 'color' ? 'Màu sắc' : 
                     variantType === 'size' ? 'Kích thước' : 
                     variantType === 'material' ? 'Chất liệu' : variantType}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleVariantChange(variantType, option)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedVariants[variantType] === option
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller?.avatar} />
                    <AvatarFallback>
                      {product.seller?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{product.seller?.name}</h3>
                    <p className="text-sm text-gray-600">Người bán uy tín</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Gọi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Coupon Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mã giảm giá:</label>
                <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mã giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không sử dụng</SelectItem>
                    {availableCoupons.map((coupon) => (
                      <SelectItem key={coupon.id} value={coupon.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{coupon.code}</span>
                          <span className="text-xs text-gray-500">{coupon.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shipping Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phương thức vận chuyển:</label>
                <div className="space-y-2">
                  {shippingOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShipping(option.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedShipping === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-gray-600">{option.duration}</p>
                            </div>
                          </div>
                          <span className="font-medium">
                            {option.price === 0 ? 'Miễn phí' : formatPrice(option.price)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(product.price * quantity)}</span>
                    </div>
                    {selectedCoupon && selectedCoupon !== 'none' && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(product.price * quantity - calculateTotalPrice())}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {selectedCoupon === 'FREESHIP' ? 'Miễn phí' : 
                         formatPrice(shippingOptions.find(s => s.id === selectedShipping)?.price || 0)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Mua ngay
                </Button>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-sm text-gray-600">Đơn hàng từ 300k</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Bảo hành chính hãng</p>
                  <p className="text-sm text-gray-600">12 tháng</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Đổi trả trong 7 ngày</p>
                  <p className="text-sm text-gray-600">Nếu không hài lòng</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Giao hàng nhanh</p>
                  <p className="text-sm text-gray-600">1-2 ngày làm việc</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Hàng chính hãng 100%</p>
                  <p className="text-sm text-gray-600">Cam kết chất lượng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
              <Separator className="mb-6" />
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping & Return Info */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Thông tin vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Giao hàng toàn quốc</p>
                    <p className="text-sm text-gray-600">Hỗ trợ giao hàng đến 63 tỉnh thành</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Thời gian giao hàng</p>
                    <p className="text-sm text-gray-600">1-5 ngày làm việc tùy khu vực</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Đóng gói cẩn thận</p>
                    <p className="text-sm text-gray-600">Bảo vệ sản phẩm trong quá trình vận chuyển</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Chính sách đổi trả
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Đổi trả miễn phí</p>
                    <p className="text-sm text-gray-600">Trong vòng 7 ngày kể từ khi nhận hàng</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Bảo hành chính hãng</p>
                    <p className="text-sm text-gray-600">12 tháng từ nhà sản xuất</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Hỗ trợ 24/7</p>
                    <p className="text-sm text-gray-600">Hotline: 1900-xxxx</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specifications */}
        {(product as any).specifications && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries((product as any).specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
