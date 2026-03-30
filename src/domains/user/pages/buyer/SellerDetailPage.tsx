import React, { useState, useMemo } from 'react'
import type { SearchFilters } from '@/types'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Button } from '@shared/components/ui/button'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { Badge } from '@shared/components/ui/badge'
import { useBuyerProducts } from '@/hooks/useProducts'
import { InfiniteProductGrid } from '@shared/components/product/InfiniteProductGrid'
import {
  Star,
  Verified,
  Phone,
  MessageCircle,
  Package,
  Store,
} from 'lucide-react'
import { Skeleton } from '@shared/components/ui/skeleton'
import { SEOHead } from '@shared/components/seo/SEOHead'

export default function SellerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')
  const { openChatWithSeller } = useChatStore()
  const { isAuthenticated } = useAuthStore()

  // Handle opening chat with seller
  const handleChatWithSeller = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để chat với người bán')
      navigate('/auth/login', { state: { from: location } })
      return
    }
    if (!id) {
      toast.error('Không thể xác định người bán')
      return
    }
    openChatWithSeller(Number(id))
  }

  // Fetch seller products to get seller info from products
  const { data: productsData, isLoading } = useBuyerProducts({
    sellerId: id,
    page: 1,
    limit: 10,
  })

  // Extract seller info from the first product that has seller data
  const seller = useMemo(() => {
    const productWithSeller = productsData?.items?.find(p => p.seller)
    const sellerData = productWithSeller?.seller

    if (!sellerData) {
      return null
    }

    return {
      id: sellerData.id || id || '',
      name: sellerData.sellerName || sellerData.name || 'Người bán',
      logoUrl: sellerData.sellerLogo || sellerData.avatar || '',
      description: sellerData.sellerDescription || '',
      address: sellerData.sellerAddress || sellerData.address || '',
      phone: sellerData.sellerPhone || sellerData.phone || '',
      email: sellerData.sellerEmail || sellerData.email || '',
      isVerified: sellerData.isSellerVerified || sellerData.isVerified || false,
      rating: sellerData.sellerRating || 0,
      reviewCount: sellerData.sellerReviewCount || 0,
      totalProducts: productsData?.total || 0,
    }
  }, [productsData, id])

  // Build filters for InfiniteProductGrid
  const productFilters = React.useMemo(() => {
    const baseFilters: Partial<SearchFilters> = {
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

  // Loading state - only show skeleton on initial load
  if (isLoading && !productsData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48 bg-white/20" />
                <Skeleton className="h-4 w-64 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seller ? `${seller.name} - Shop trên Chợ Giá Rẻ` : 'Shop trên Chợ Giá Rẻ'}
        description={seller?.description || `Xem sản phẩm từ ${seller?.name || 'người bán'} trên Chợ Giá Rẻ`}
        keywords={`${seller?.name || ''}, shop, người bán, chợ giá rẻ`}
        image={seller?.logoUrl || undefined}
        url={`https://chogiare.com/shop/${id}`}
      />
      <Header />

      {/* Seller Header - Compact */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Seller Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {seller?.logoUrl ? (
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Store className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>
              {seller?.isVerified && (
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
                      {seller?.name || 'Người bán'}
                    </h1>
                    {seller?.isVerified && (
                      <Badge className="bg-green-500 text-white text-xs">
                        <Verified className="h-3 w-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-white/90 text-sm flex-wrap">
                    {seller?.rating !== undefined && seller.rating > 0 && (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {seller.rating.toFixed(1)}
                          </span>
                          <span className="text-white/80">
                            ({seller.reviewCount || 0})
                          </span>
                        </div>
                        <span className="text-white/80">•</span>
                      </>
                    )}
                    <span>{seller?.totalProducts || productsData?.total || 0} sản phẩm</span>
                  </div>
                  {seller?.description && (
                    <p className="text-sm text-white/80 mt-2 line-clamp-2">
                      {seller.description}
                    </p>
                  )}
                </div>

                {/* Quick Actions - Compact */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={handleChatWithSeller}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  {seller?.phone && (
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
                  Sản phẩm của {seller?.name || 'Người bán'}
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
