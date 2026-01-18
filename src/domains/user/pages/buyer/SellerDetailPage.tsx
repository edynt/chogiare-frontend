import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { useProducts } from '@/hooks/useProducts'
import { InfiniteProductGrid } from '@shared/components/product/InfiniteProductGrid'
import {
  Star,
  Verified,
  Phone,
  MessageCircle,
  Timer,
  Truck,
  Package,
  TrendingUp,
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
  cancellationRate?: number // Tỉ lệ hủy đơn
  trustScore?: number // Độ tin cậy (0-100)
}

export default function SellerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')

  // Fetch seller products for count
  const { data: productsData } = useProducts({
    sellerId: id,
    page: 1,
    limit: 1,
  })

  // Mock seller data - in production, this would come from an API
  const seller: Seller = {
    id: id || '1',
    name: 'Cửa hàng Chogiare',
    logoUrl:
      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    description:
      'Cửa hàng chuyên cung cấp sản phẩm chất lượng cao với giá cả hợp lý',
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
    onTimeDeliveryRate: 96,
    cancellationRate: 2.5, // 2.5% tỉ lệ hủy đơn
    trustScore: 95, // Độ tin cậy 95/100
  }

  // Build filters for InfiniteProductGrid
  const productFilters = React.useMemo(() => {
    const baseFilters: any = {
      sellerId: id,
    }

    // Apply sorting based on selected filter
    switch (selectedFilter) {
      case 'Bán chạy':
        baseFilters.sortBy = 'soldCount'
        baseFilters.sortOrder = 'desc'
        break
      case 'Giá thấp':
        baseFilters.sortBy = 'price'
        baseFilters.sortOrder = 'asc'
        break
      case 'Giá cao':
        baseFilters.sortBy = 'price'
        baseFilters.sortOrder = 'desc'
        break
      case 'Mới nhất':
        baseFilters.sortBy = 'createdAt'
        baseFilters.sortOrder = 'desc'
        break
      default:
        baseFilters.sortBy = 'createdAt'
        baseFilters.sortOrder = 'desc'
    }

    return baseFilters
  }, [id, selectedFilter])

  const filters = ['Tất cả', 'Bán chạy', 'Giá thấp', 'Giá cao', 'Mới nhất']

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Seller Header - Compact */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Seller Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={seller.logoUrl}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-primary/10"><svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`
                    }
                  }}
                />
              </div>
              {seller.isVerified && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Verified className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Seller Info - Compact */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-xl md:text-2xl font-bold truncate">
                      {seller.name}
                    </h1>
                    {seller.isTopSeller && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Top Seller
                      </Badge>
                    )}
                    {seller.isVerified && (
                      <Badge className="bg-green-500 text-white text-xs">
                        <Verified className="h-3 w-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-white/90 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {seller.rating.toFixed(1)}
                      </span>
                      <span className="text-white/80">
                        ({seller.reviewCount})
                      </span>
                    </div>
                    <span className="text-white/80">•</span>
                    <span>{seller.totalProducts} sản phẩm</span>
                    <span className="text-white/80">•</span>
                    <span>{seller.totalOrders} đơn hàng</span>
                    {seller.trustScore !== undefined && (
                      <>
                        <span className="text-white/80">•</span>
                        <span>Độ tin cậy: {seller.trustScore}/100</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Actions - Compact */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    asChild
                  >
                    <Link to={`/chat?sellerId=${seller.id}`}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Link>
                  </Button>
                  {seller.phone && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={() =>
                        (window.location.href = `tel:${seller.phone}`)
                      }
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Gọi
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Metrics - Compact Row */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {seller.responseRate !== undefined && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/70">Tỷ lệ phản hồi</p>
                    <p className="text-sm font-semibold">
                      {seller.responseRate}%
                    </p>
                  </div>
                </div>
              )}
              {seller.averageResponseTime && (
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/70">Thời gian phản hồi</p>
                    <p className="text-sm font-semibold">
                      {seller.averageResponseTime}
                    </p>
                  </div>
                </div>
              )}
              {seller.cancellationRate !== undefined && (
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      seller.cancellationRate <= 3
                        ? 'text-green-300'
                        : seller.cancellationRate <= 5
                          ? 'text-yellow-300'
                          : 'text-red-300'
                    }`}
                  />
                  <div>
                    <p className="text-xs text-white/70">Tỉ lệ hủy đơn</p>
                    <p
                      className={`text-sm font-semibold ${
                        seller.cancellationRate <= 3
                          ? 'text-green-300'
                          : seller.cancellationRate <= 5
                            ? 'text-yellow-300'
                            : 'text-red-300'
                      }`}
                    >
                      {seller.cancellationRate}%
                    </p>
                  </div>
                </div>
              )}
              {seller.onTimeDeliveryRate !== undefined && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/70">Giao hàng đúng hẹn</p>
                    <p className="text-sm font-semibold">
                      {seller.onTimeDeliveryRate}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Sản phẩm của {seller.name}
                </h2>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5">
              {productsData?.total || 0} sản phẩm
            </Badge>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map(filter => (
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

          {/* Products Grid with Infinite Scroll */}
          <InfiniteProductGrid filters={productFilters} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
