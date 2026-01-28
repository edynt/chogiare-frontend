import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { SEOHead } from '@shared/components/seo/SEOHead'
import { APP_NAME } from '@/constants/app.constants'
import { Card, CardContent } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { useBuyerProducts, useCategories } from '@/hooks'
import { InfiniteProductGrid } from '@shared/components/product/InfiniteProductGrid'
import { LazySection } from '@shared/components/product/LazySection'
import {
  HomePageSkeleton,
  HomePageSectionSkeleton,
} from '@shared/components/skeleton/HomePageSkeleton'
import { Skeleton } from '@shared/components/ui/skeleton'
import {
  ShoppingBag,
  Store,
  TrendingUp,
  ArrowRight,
  Layers,
  Flame,
  MapPin,
  Sparkles,
  Trophy,
  Package,
  Video,
  Shield,
  DollarSign,
  Megaphone,
  Factory,
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: allProductsData, isLoading: isLoadingProducts } = useBuyerProducts({
    limit: 100,
  })

  const { data: categories } = useCategories()

  const allProducts = allProductsData?.items || []

  const categoriesList = Array.isArray(categories) ? categories : []

  // 1. Bán chạy nhất (Best sellers) - sort by viewCount
  const bestSellers = allProducts
    .filter(p => p.stock > 0)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8)

  // 2. Hàng mới về (New arrivals) - sort by createdAt desc
  const newArrivals = allProducts
    .filter(p => p.stock > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)

  // 3. Giảm giá hot (Hot discounts) - highest discount percentage
  const hotDiscounts = allProducts
    .filter(p => p.stock > 0 && p.originalPrice && p.originalPrice > p.price)
    .map(p => ({
      ...p,
      discountPercent: ((p.originalPrice! - p.price) / p.originalPrice!) * 100,
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
      const aEngagement = (a.viewCount || 0) + a.reviewCount * 10
      const bEngagement = (b.viewCount || 0) + b.reviewCount * 10
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

  const displayCategories = categoriesList.slice(0, 8)

  // Show skeleton while loading initial data
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title={`${APP_NAME} - Nền tảng mua sỉ hàng đầu Việt Nam`}
          description="Tìm kiếm và mua sỉ hàng ngàn sản phẩm với giá tốt nhất"
          keywords="mua sỉ, bán sỉ, chogiare"
        />
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <HomePageSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Chợ Giá Rẻ - Nền tảng mua sỉ hàng đầu Việt Nam"
        description="Tìm kiếm và mua sỉ hàng ngàn sản phẩm với giá tốt nhất. Quản lý đơn hàng, theo dõi giao hàng và kết nối với nhà cung cấp uy tín."
        keywords="mua sỉ, bán sỉ, chogiare, đặt hàng sỉ, tìm nhà cung cấp, quản lý đơn hàng"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: APP_NAME,
          url: 'https://chogiare.com',
          description: 'Nền tảng mua sắm trực tuyến hàng đầu Việt Nam',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://chogiare.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 1. Quick Stats Section - Modern SAAS Design */}
          <Card className="bg-gradient-to-br from-primary via-primary to-purple-600 border-0 text-white shadow-xl shadow-primary/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
          </Card>

          {/* 3. Hero Banner - Modern & Attractive - Load immediately */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-purple-600 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Flame className="h-3 w-3 mr-1" />
                  Nền tảng mua sỉ hàng đầu
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Kết nối người mua và người bán
                  <span className="block text-white/90 mt-2">
                    Một cách an toàn và tiện lợi
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  Hàng ngàn sản phẩm sỉ với giá tốt nhất thị trường. Giao hàng
                  nhanh, thanh toán an toàn, hỗ trợ 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate('/products')}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Khám phá sản phẩm
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Store className="h-5 w-5 mr-2" />
                    Trở thành người bán
                  </Button>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* 5. Categories Section - Lazy Load */}
          <LazySection
            fallback={
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 text-center">
                        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            }
          >
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
                  {displayCategories.map(category => (
                    <Card
                      key={category.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/products?category=${category.id}`)
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Layers className="h-6 w-6 text-gray-600" />
                        </div>
                        <p className="text-xs font-medium line-clamp-2">
                          {category.name}
                        </p>
                        {category.productCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {category.productCount} sản phẩm
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </LazySection>

          {/* 1. Bán chạy nhất (Best sellers) - Lazy Load */}
          <LazySection fallback={<HomePageSectionSkeleton />}>
            {bestSellers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Trophy className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Bán chạy nhất</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sản phẩm được mua nhiều nhất
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Link
                      to="/products?sortBy=viewCount&sortOrder=desc"
                      className="flex items-center"
                    >
                      Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <InfiniteProductGrid
                  filters={{
                    sortBy: 'viewCount',
                    sortOrder: 'desc',
                    limit: 20,
                  }}
                />
              </div>
            )}
          </LazySection>

          {/* 2. Hàng mới về (New arrivals) - Lazy Load */}
          <LazySection fallback={<HomePageSectionSkeleton />}>
            {newArrivals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Hàng mới về</h2>
                      <p className="text-sm text-muted-foreground">
                        Sản phẩm mới nhất trên thị trường
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/products?sortBy=createdAt&sortOrder=desc">
                      Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <InfiniteProductGrid
                  filters={{
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    limit: 20,
                  }}
                />
              </div>
            )}
          </LazySection>

          {/* 3. Giảm giá hot (Hot discounts) - Lazy Load */}
          <LazySection fallback={<HomePageSectionSkeleton />}>
            {hotDiscounts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Flame className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Giảm giá hot</h2>
                      <p className="text-sm text-muted-foreground">
                        Ưu đãi giảm giá lớn nhất
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/products?discount=true">
                      Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <InfiniteProductGrid filters={{ limit: 20 }} />
              </div>
            )}
          </LazySection>

          {/* 4. Gợi ý dành cho bạn (Personalized recommendations) - Lazy Load */}
          <LazySection fallback={<HomePageSectionSkeleton />}>
            {personalizedProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Gợi ý dành cho bạn</h2>
                      <p className="text-sm text-muted-foreground">
                        Dựa trên sở thích và lịch sử mua hàng
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/products">
                      Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <InfiniteProductGrid filters={{ limit: 20 }} />
              </div>
            )}
          </LazySection>
        </div>
      </main>
      <Footer />
    </div>
  )
}
