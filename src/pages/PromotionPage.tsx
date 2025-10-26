import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Gift,
  Tag,
  Percent,
  Clock,
  Star,
  Users,
  TrendingUp,
  Zap,
  Crown,
  Calendar,
  MapPin,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Copy,
  Share2,
  Truck
} from 'lucide-react'

interface Promotion {
  id: string
  title: string
  description: string
  type: 'discount' | 'cashback' | 'free_shipping' | 'bogo' | 'flash_sale'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  isActive: boolean
  usageCount: number
  maxUsage?: number
  image: string
  products?: string[]
  categories?: string[]
  isExclusive: boolean
  isFlashSale: boolean
  remainingTime?: string
}

interface Coupon {
  id: string
  code: string
  title: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  isActive: boolean
  usageCount: number
  maxUsage?: number
  isUsed: boolean
}

export default function PromotionPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Mock data
  const promotions: Promotion[] = [
    {
      id: '1',
      title: 'Flash Sale 24h - Giảm đến 50%',
      description: 'Cơ hội mua sắm với giá siêu ưu đãi trong 24 giờ duy nhất',
      type: 'flash_sale',
      value: 50,
      minOrderAmount: 500000,
      maxDiscount: 2000000,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-16T00:00:00Z',
      isActive: true,
      usageCount: 1250,
      maxUsage: 5000,
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=400&fit=crop',
      isExclusive: true,
      isFlashSale: true,
      remainingTime: '18:45:32'
    },
    {
      id: '2',
      title: 'Mua 2 Tặng 1 - Điện thoại & Phụ kiện',
      description: 'Mua 2 sản phẩm bất kỳ, tặng 1 sản phẩm có giá trị thấp nhất',
      type: 'bogo',
      value: 100,
      minOrderAmount: 1000000,
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      isActive: true,
      usageCount: 890,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop',
      isExclusive: false,
      isFlashSale: false
    },
    {
      id: '3',
      title: 'Miễn phí vận chuyển toàn quốc',
      description: 'Miễn phí ship cho đơn hàng từ 300.000đ',
      type: 'free_shipping',
      value: 0,
      minOrderAmount: 300000,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      usageCount: 15600,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      isExclusive: false,
      isFlashSale: false
    }
  ]

  const coupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME20',
      title: 'Chào mừng khách hàng mới',
      description: 'Giảm 20% cho đơn hàng đầu tiên',
      type: 'percentage',
      value: 20,
      minOrderAmount: 500000,
      maxDiscount: 1000000,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      usageCount: 2500,
      maxUsage: 10000,
      isUsed: false
    },
    {
      id: '2',
      code: 'SAVE50K',
      title: 'Tiết kiệm 50k',
      description: 'Giảm 50.000đ cho đơn hàng từ 1.000.000đ',
      type: 'fixed',
      value: 50000,
      minOrderAmount: 1000000,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      usageCount: 1800,
      maxUsage: 5000,
      isUsed: true
    },
    {
      id: '3',
      code: 'VIP30',
      title: 'Dành cho khách VIP',
      description: 'Giảm 30% cho khách hàng VIP',
      type: 'percentage',
      value: 30,
      minOrderAmount: 2000000,
      maxDiscount: 5000000,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      usageCount: 450,
      maxUsage: 1000,
      isUsed: false
    }
  ]

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent className="h-5 w-5" />
      case 'cashback': return <TrendingUp className="h-5 w-5" />
      case 'free_shipping': return <Truck className="h-5 w-5" />
      case 'bogo': return <Gift className="h-5 w-5" />
      case 'flash_sale': return <Zap className="h-5 w-5" />
      default: return <Tag className="h-5 w-5" />
    }
  }

  const getPromotionBadge = (promotion: Promotion) => {
    if (promotion.isFlashSale) {
      return <Badge variant="destructive" className="animate-pulse">Flash Sale</Badge>
    }
    if (promotion.isExclusive) {
      return <Badge variant="secondary" className="bg-primary text-primary-foreground">Exclusive</Badge>
    }
    return <Badge variant="outline">Active</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Khuyến mãi & Ưu đãi</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            Khám phá các chương trình khuyến mãi hấp dẫn và mã giảm giá độc quyền
          </p>
          
          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khuyến mãi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="promotions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Chương trình khuyến mãi
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Mã giảm giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="promotions" className="space-y-6">
            {/* Featured Promotions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-warning" />
                <h2 className="text-xl font-semibold">Khuyến mãi nổi bật</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promotion) => (
                  <Card key={promotion.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                        {getPromotionBadge(promotion)}
                        <div className="flex items-center gap-1 text-white text-sm">
                          <Users className="h-4 w-4" />
                          <span>{promotion.usageCount.toLocaleString()}</span>
                        </div>
                      </div>

                      {promotion.isFlashSale && promotion.remainingTime && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-mono">{formatTime(promotion.remainingTime)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {promotion.title}
                        </h3>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {promotion.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Giá trị:</span>
                          <span className="font-semibold text-primary">
                            {promotion.type === 'free_shipping' ? 'Miễn phí' : 
                             promotion.type === 'bogo' ? 'Mua 2 tặng 1' :
                             `-${promotion.value}%`}
                          </span>
                        </div>
                        
                        {promotion.minOrderAmount && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Đơn tối thiểu:</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(promotion.minOrderAmount)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Thời gian:</span>
                          <span className="font-medium">
                            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Xem chi tiết
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Mã giảm giá của bạn</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <Card key={coupon.id} className={`group hover:shadow-md transition-all duration-300 ${
                    coupon.isUsed ? 'opacity-60' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Tag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{coupon.title}</h3>
                            <p className="text-sm text-muted-foreground">{coupon.description}</p>
                          </div>
                        </div>
                        {coupon.isUsed && (
                          <Badge variant="secondary" className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã sử dụng
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Giá trị:</span>
                          <span className="font-semibold text-primary">
                            {coupon.type === 'percentage' ? `-${coupon.value}%` : 
                             `-${new Intl.NumberFormat('vi-VN', {
                               style: 'currency',
                               currency: 'VND'
                             }).format(coupon.value)}`}
                          </span>
                        </div>
                        
                        {coupon.minOrderAmount && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Đơn tối thiểu:</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(coupon.minOrderAmount)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Hạn sử dụng:</span>
                          <span className="font-medium">{formatDate(coupon.endDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyCouponCode(coupon.code)}
                          disabled={coupon.isUsed}
                        >
                          {copiedCode === coupon.code ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedCode === coupon.code ? 'Đã copy' : 'Copy mã'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Mã: <code className="font-mono bg-muted px-1 rounded">{coupon.code}</code></span>
                          <span>Đã dùng: {coupon.usageCount}/{coupon.maxUsage || '∞'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
