import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  Gift,
  Tag,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  maxQuantity: number
  seller: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  isInStock: boolean
  shippingFee: number
  estimatedDelivery: string
}

export default function CartPage() {
  const { t } = useLanguage()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'prod1',
      title: 'iPhone 14 Pro Max 256GB - Chính hãng VN/A',
      price: 25000000,
      originalPrice: 30000000,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=300&h=300&fit=crop',
      quantity: 1,
      maxQuantity: 5,
      seller: {
        id: 'seller1',
        name: 'TechStore Pro',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 4.8
      },
      isInStock: true,
      shippingFee: 30000,
      estimatedDelivery: '2-3 ngày'
    },
    {
      id: '2',
      productId: 'prod2',
      title: 'AirPods Pro 2nd Gen - Hàng chính hãng Apple',
      price: 4500000,
      originalPrice: 5500000,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
      quantity: 2,
      maxQuantity: 10,
      seller: {
        id: 'seller2',
        name: 'Audio World',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4.9
      },
      isInStock: true,
      shippingFee: 25000,
      estimatedDelivery: '1-2 ngày'
    },
    {
      id: '3',
      productId: 'prod3',
      title: 'MacBook Air M2 13 inch - 256GB SSD',
      price: 28000000,
      originalPrice: 32000000,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
      quantity: 1,
      maxQuantity: 3,
      seller: {
        id: 'seller3',
        name: 'Laptop Center',
        avatar: 'https://i.pravatar.cc/150?img=3',
        rating: 4.7
      },
      isInStock: false,
      shippingFee: 50000,
      estimatedDelivery: '3-5 ngày'
    }
  ])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const moveToWishlist = (itemId: string) => {
    // Implement move to wishlist logic
    console.log('Move to wishlist:', itemId)
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) return
    
    // Mock coupon validation
    const validCoupons = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'VIP30': 30
    }
    
    const discount = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]
    if (discount) {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponDiscount(discount)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = cartItems.reduce((sum, item) => sum + item.shippingFee, 0)
  const discount = appliedCoupon ? (subtotal * couponDiscount / 100) : 0
  const total = subtotal + shippingFee - discount

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">{t('common.cart')}</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            {cartItems.length} {t('common.items')} trong giỏ hàng của bạn
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button asChild size="lg">
              <Link to="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {!item.isInStock && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <Badge variant="destructive" className="text-xs">
                              Hết hàng
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={item.seller.avatar}
                                alt={item.seller.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.seller.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 text-yellow-500">★</div>
                                <span className="text-sm">{item.seller.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveToWishlist(item.id)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                          {item.originalPrice && (
                            <Badge variant="destructive" className="text-xs">
                              -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxQuantity}
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Tối đa: {item.maxQuantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>Phí ship: {formatPrice(item.shippingFee)}</span>
                          </div>
                          <span>Giao hàng: {item.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mã giảm giá</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={applyCoupon} variant="outline">
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center gap-2 text-sm text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span>Đã áp dụng mã {appliedCoupon} (-{couponDiscount}%)</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(shippingFee)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Giảm giá ({appliedCoupon})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/payment">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán ngay
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/products">
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Miễn phí đổi trả trong 30 ngày</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Bảo hành chính hãng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
