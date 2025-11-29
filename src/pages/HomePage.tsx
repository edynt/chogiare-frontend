import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SEOHead } from '@/components/seo/SEOHead'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserOrders } from '@/hooks/useOrders'
import { useProducts, useCategories } from '@/hooks'
import { SimpleProductGrid } from '@/components/product/ProductGridWithPagination'
import { 
  ShoppingBag, 
  Heart, 
  Store, 
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Search,
  Users,
  Zap,
  Layers,
  Flame,
  MapPin,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Package,
  Video,
  Shield,
  DollarSign,
  Megaphone,
  Factory,
  Download
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: ordersData } = useUserOrders({ page: 1, pageSize: 5 })
  const { data: allProductsData, isLoading: isLoadingProducts } = useProducts({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
  const { data: categories } = useCategories()
  
  const orders = ordersData?.items || []
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const allProducts = allProductsData?.items || []
  
  // 1. Bán chạy nhất (Best sellers) - sort by viewCount
  const bestSellers = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8)
  
  // 2. Hàng mới về (New arrivals) - sort by createdAt desc
  const newArrivals = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
  
  // 3. Giảm giá hot (Hot discounts) - highest discount percentage
  const hotDiscounts = allProducts
    .filter(p => p.stock > 0 && p.originalPrice && p.originalPrice > p.price)
    .map(p => ({
      ...p,
      discountPercent: ((p.originalPrice! - p.price) / p.originalPrice!) * 100
    }))
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 8)
  
  // 4. Gợi ý dành cho bạn (Personalized recommendations)
  const personalizedProducts = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => {
      const aHasDiscount = a.originalPrice && a.originalPrice > a.price
      const bHasDiscount = b.originalPrice && b.originalPrice > b.price
      if (aHasDiscount && !bHasDiscount) return -1
      if (!aHasDiscount && bHasDiscount) return 1
      const ratingCompare = b.rating - a.rating
      if (ratingCompare !== 0) return ratingCompare
      return b.reviewCount - a.reviewCount
    })
    .slice(0, 8)
  
  // 7. Deal sốc từ xưởng (Factory deals) - products with factory badge or wholesale pricing
  const factoryDeals = allProducts
    .filter(p => p.stock > 0 && (p.badges?.includes('HOT') || p.price < 100000))
    .sort((a, b) => a.price - b.price)
    .slice(0, 8)
  
  // 8. Hàng có video (Products with video) - simulate with high engagement products
  const productsWithVideo = allProducts
    .filter(p => p.stock > 0 && (p.viewCount || 0) > 50)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8)
  
  // 9. Ưu đãi theo khu vực (Regional offers) - filter by location (simulate with first location)
  const regionalOffers = allProducts
    .filter(p => p.stock > 0 && p.location)
    .slice(0, 8)
  
  // 10. Sản phẩm có bảo hành (Products with warranty) - simulate with high rating products
  const productsWithWarranty = allProducts
    .filter(p => p.stock > 0 && p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
  
  // 11. Trend nổi bật trên TikTok (Trending on TikTok) - high engagement
  const tiktokTrending = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => {
      const aEngagement = (a.viewCount || 0) + (a.reviewCount * 10)
      const bEngagement = (b.viewCount || 0) + (b.reviewCount * 10)
      return bEngagement - aEngagement
    })
    .slice(0, 8)
  
  // 12. Giá sỉ rẻ nhất thị trường (Cheapest wholesale prices)
  const cheapestWholesale = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 8)
  
  // 13. Sản phẩm chạy quảng cáo nhiều nhất (Products with most ads) - use isPromoted or viewCount
  const mostAdvertised = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1
      return (b.viewCount || 0) - (a.viewCount || 0)
    })
    .slice(0, 8)

  const displayCategories = categories?.slice(0, 8) || []

  // Promotional banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Promotional banners data (similar to mobile)
  const promotionalBanners = [
    {
      title: 'KHO HÀNG SIÊU LỚN',
      subtitle: '10,000+ SẢN PHẨM SỈ',
      description: 'Giá tốt nhất thị trường - Giao hàng nhanh toàn quốc',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      badge: 'HOT'
    },
    {
      title: 'DEAL SIÊU KHỦNG',
      subtitle: 'GIẢM ĐẾN 80%',
      description: 'Flash Sale cuối tuần - Số lượng có hạn',
      gradient: 'from-red-500 via-red-600 to-orange-600',
      badge: 'FLASH'
    },
    {
      title: 'NHÀ CUNG CẤP UY TÍN',
      subtitle: '1000+ ĐỐI TÁC',
      description: 'Hàng chính hãng - Bảo hành đầy đủ',
      gradient: 'from-green-500 via-green-600 to-blue-600',
      badge: 'TRUSTED'
    }
  ]

  // Auto-scroll promotional banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % promotionalBanners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [promotionalBanners.length])

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % promotionalBanners.length)
  }

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Chogiare - Nền tảng mua sỉ hàng đầu Việt Nam"
        description="Tìm kiếm và mua sỉ hàng ngàn sản phẩm với giá tốt nhất. Quản lý đơn hàng, theo dõi giao hàng và kết nối với nhà cung cấp uy tín."
        keywords="mua sỉ, bán sỉ, chogiare, đặt hàng sỉ, tìm nhà cung cấp, quản lý đơn hàng"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Chogiare",
          "url": "https://chogiare.com",
          "description": "Nền tảng mua sắm trực tuyến hàng đầu Việt Nam",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://chogiare.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 1. Quick Stats Section */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-blue-100 text-sm">Đơn hàng</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:border-l md:border-white/30 md:pl-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{allProducts.length}+</p>
                    <p className="text-blue-100 text-sm">Sản phẩm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:border-l md:border-white/30 md:pl-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">100+</p>
                    <p className="text-blue-100 text-sm">Nhà cung cấp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Announcement Banner */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-900">Thông báo mới</p>
                  <p className="text-xs text-orange-700">
                    Đơn hàng đã được xác nhận và đang chuẩn bị
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-900">
                  <span className="sr-only">Đóng</span>
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 3. Promotional Banner (Carousel) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
              >
                {promotionalBanners.map((banner, index) => (
                  <div key={index} className="min-w-full flex-shrink-0">
                    <Card className={`bg-gradient-to-r ${banner.gradient} border-0 text-white`}>
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {banner.badge && (
                              <Badge className="mb-3 bg-white/30 text-white border-white/50">
                                {banner.badge === 'FLASH' && <Flame className="h-3 w-3 mr-1" />}
                                {banner.badge}
                              </Badge>
                            )}
                            <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                            <p className="text-lg font-semibold mb-2">{banner.subtitle}</p>
                            <p className="text-white/90 text-sm">{banner.description}</p>
                          </div>
                          <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100 ml-4">
                            Xem ngay
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
              
              {/* Navigation arrows */}
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                aria-label="Banner trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                aria-label="Banner tiếp"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Page indicators */}
            <div className="flex justify-center w-full py-2 gap-2">
              {promotionalBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Banner ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 4. Quick Actions Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Tìm sản phẩm</h3>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer-orders')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Đơn hàng</h3>
                  {pendingOrders.length > 0 && (
                    <Badge className="mt-1 bg-red-500 text-white text-xs">
                      {pendingOrders.length}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/chat')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Tin nhắn</h3>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/profile?tab=favorites')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Yêu thích</h3>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 5. Categories Section */}
          {displayCategories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Danh mục</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {displayCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/products?category=${category.id}`)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Layers className="h-6 w-6 text-gray-600" />
                      </div>
                      <p className="text-xs font-medium line-clamp-2">{category.name}</p>
                      {category.productCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">{category.productCount} sản phẩm</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 1. Bán chạy nhất (Best sellers) */}
          {bestSellers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Bán chạy nhất</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm được mua nhiều nhất</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?sortBy=viewCount&sortOrder=desc">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={bestSellers} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 2. Hàng mới về (New arrivals) */}
          {newArrivals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Hàng mới về</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm mới nhất trên thị trường</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?sortBy=createdAt&sortOrder=desc">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={newArrivals} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 3. Giảm giá hot (Hot discounts) */}
          {hotDiscounts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Giảm giá hot</h2>
                    <p className="text-sm text-muted-foreground">Ưu đãi giảm giá lớn nhất</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?discount=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={hotDiscounts} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 4. Gợi ý dành cho bạn (Personalized recommendations) */}
          {personalizedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Gợi ý dành cho bạn</h2>
                    <p className="text-sm text-muted-foreground">Dựa trên sở thích và lịch sử mua hàng</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={personalizedProducts} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 5. Danh sách shop đang nhập nhiều nhất */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Danh sách shop đang nhập nhiều nhất</h2>
                  <p className="text-sm text-muted-foreground">Các shop có lượng nhập hàng cao nhất</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sellers?sortBy=imports">
                  Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Shop {idx}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">⭐</span>
                          <span className="text-xs">4.{idx + 5}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-green-600">+{500 + idx * 100} sản phẩm</p>
                      <p className="text-muted-foreground">Nhập hàng tuần này</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 6. Nhà cung cấp nhận nhiều đơn nhất */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Nhà cung cấp nhận nhiều đơn nhất</h2>
                  <p className="text-sm text-muted-foreground">Đối tác uy tín với nhiều đơn hàng nhất</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/suppliers?sortBy=orders">
                  Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Store className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Nhà cung cấp {idx}</p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-xs">⭐</span>
                      <span className="text-xs font-medium">4.{idx + 7}</span>
                    </div>
                    <Badge variant="outline" className="text-xs mb-2">Uy tín</Badge>
                    <p className="text-xs text-muted-foreground">{1000 + idx * 200}+ đơn</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 7. Deal sốc từ xưởng (Factory deals) */}
          {factoryDeals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Factory className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Deal sốc từ xưởng</h2>
                    <p className="text-sm text-muted-foreground">Giá xưởng tốt nhất thị trường</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?factory=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={factoryDeals} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 8. Hàng có video (Products with video) */}
          {productsWithVideo.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Hàng có video</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm có video giới thiệu chi tiết</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?hasVideo=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={productsWithVideo} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 9. Ưu đãi theo khu vực (Regional offers) */}
          {regionalOffers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Ưu đãi theo khu vực</h2>
                    <p className="text-sm text-muted-foreground">Deal đặc biệt cho khu vực của bạn</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?regional=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={regionalOffers} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 10. Sản phẩm có bảo hành (Products with warranty) */}
          {productsWithWarranty.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Sản phẩm có bảo hành</h2>
                    <p className="text-sm text-muted-foreground">Đảm bảo chất lượng với chế độ bảo hành</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?warranty=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={productsWithWarranty} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 11. Trend nổi bật trên TikTok (Trending on TikTok) */}
          {tiktokTrending.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Trend nổi bật trên TikTok</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm đang hot trên mạng xã hội</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?trending=tiktok">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={tiktokTrending} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 12. Giá sỉ rẻ nhất thị trường (Cheapest wholesale prices) */}
          {cheapestWholesale.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Giá sỉ rẻ nhất thị trường</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm có giá tốt nhất</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?sortBy=price&sortOrder=asc">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={cheapestWholesale} isLoading={isLoadingProducts} />
            </div>
          )}

          {/* 13. Sản phẩm chạy quảng cáo nhiều nhất (Products with most ads) */}
          {mostAdvertised.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Sản phẩm chạy quảng cáo nhiều nhất</h2>
                    <p className="text-sm text-muted-foreground">Sản phẩm được quảng bá rộng rãi</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/products?promoted=true">
                    Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <SimpleProductGrid products={mostAdvertised} isLoading={isLoadingProducts} />
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
