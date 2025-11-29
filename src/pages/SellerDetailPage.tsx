import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProducts } from '@/hooks/useProducts'
import { LoadingSpinner } from '@/components/ui/loading'
import { ProductCard } from '@/components/product/ProductCard'
import {
  Store,
  Star,
  Verified,
  Phone,
  MessageCircle,
  Share2,
  ShoppingBag,
  Receipt,
  Users,
  ChatBubble,
  Timer,
  Truck,
  Award,
  Package,
  TrendingUp
} from 'lucide-react'

interface Seller {
  id: string
  name: string
  logoUrl: string
  description?: string
  address?: string
  phone?: string
  email?: string
  isTopSeller: boolean
  isVerified: boolean
  isPremium: boolean
  totalProducts: number
  rating: number
  reviewCount: number
  totalOrders: number
  totalCustomers: number
  joinedDate?: string
  trustBadges?: string[]
  responseRate?: number
  averageResponseTime?: string
  onTimeDeliveryRate?: number
}

export default function SellerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')
  
  // Fetch seller products
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    sellerId: id,
    page: 1,
    pageSize: 20
  })
  
  // Mock seller data - in production, this would come from an API
  const seller: Seller = {
    id: id || '1',
    name: 'Cửa hàng Chogiare',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    description: 'Cửa hàng chuyên cung cấp sản phẩm chất lượng cao với giá cả hợp lý',
    address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
    phone: '0901234567',
    email: 'contact@chogiare.com',
    isTopSeller: true,
    isVerified: true,
    isPremium: true,
    totalProducts: productsData?.total || 0,
    rating: 4.8,
    reviewCount: 1245,
    totalOrders: 3420,
    totalCustomers: 2850,
    joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    trustBadges: ['Đã xác thực', 'Top Seller', 'Giao hàng nhanh'],
    responseRate: 98.5,
    averageResponseTime: '< 5 phút',
    onTimeDeliveryRate: 96
  }

  const products = productsData?.items || []
  
  const filteredProducts = selectedFilter === 'Tất cả' 
    ? products 
    : products // Add filtering logic as needed

  const filters = ['Tất cả', 'Bán chạy', 'Giá thấp', 'Giá cao', 'Mới nhất']

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Seller Header with Gradient */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Seller Logo */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={seller.logoUrl}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-primary/10"><svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`
                    }
                  }}
                />
              </div>
              {seller.isVerified && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <Verified className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{seller.name}</h1>
                    {seller.isTopSeller && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Top Seller
                      </Badge>
                    )}
                  </div>
                  {seller.description && (
                    <p className="text-white/90 mb-3 max-w-2xl">{seller.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{seller.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-white/80">({seller.reviewCount} đánh giá)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Trust & Stats Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Verified className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">Độ tin cậy</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <ShoppingBag className="h-6 w-6 text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{seller.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Sản phẩm</p>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <Receipt className="h-6 w-6 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-blue-500">{seller.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Đơn hàng</p>
              </div>
              <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                <Users className="h-6 w-6 text-purple-500 mb-2" />
                <p className="text-2xl font-bold text-purple-500">{seller.totalCustomers}</p>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
              </div>
            </div>

            {/* Trust Metrics */}
            {(seller.responseRate || seller.averageResponseTime || seller.onTimeDeliveryRate) && (
              <>
                <div className="border-t pt-6 space-y-4">
                  {seller.responseRate && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <ChatBubble className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Tỷ lệ phản hồi</p>
                        <p className="text-lg font-semibold text-blue-500">{seller.responseRate}%</p>
                      </div>
                    </div>
                  )}
                  {seller.averageResponseTime && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <Timer className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Thời gian phản hồi</p>
                        <p className="text-lg font-semibold text-yellow-500">{seller.averageResponseTime}</p>
                      </div>
                    </div>
                  )}
                  {seller.onTimeDeliveryRate && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Giao hàng đúng hẹn</p>
                        <p className="text-lg font-semibold text-green-500">{seller.onTimeDeliveryRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Trust Badges */}
            {seller.trustBadges && seller.trustBadges.length > 0 && (
              <>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-sm font-semibold mb-4">Chứng nhận</h3>
                  <div className="flex flex-wrap gap-2">
                    {seller.trustBadges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-primary/30 bg-primary/5 text-primary"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 border-primary/20 hover:bg-primary/5"
                asChild
              >
                <Link to={`/chat?sellerId=${seller.id}`}>
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Chat</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 border-green-500/20 hover:bg-green-500/5"
                onClick={() => {
                  if (seller.phone) {
                    window.location.href = `tel:${seller.phone}`
                  }
                }}
              >
                <Phone className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Gọi điện</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 border-blue-500/20 hover:bg-blue-500/5"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: seller.name,
                      text: seller.description,
                      url: window.location.href
                    })
                  }
                }}
              >
                <Share2 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Chia sẻ</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sản phẩm của {seller.name}</h2>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5">
              {filteredProducts.length} sản phẩm
            </Badge>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="whitespace-nowrap"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chưa có sản phẩm</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

