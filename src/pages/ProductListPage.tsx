import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductFilters } from '@/components/product/ProductFilters'
import { ProductCard } from '@/components/product/ProductCard'
import { Pagination } from '@/components/ui/pagination'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { EmptyProducts } from '@/components/ui/empty-state'
import { ProductListSkeleton, ProductListFiltersSkeleton, ProductListSortBarSkeleton } from '@/components/skeleton/ProductListSkeleton'
import { ProductGridSkeleton } from '@/components/skeleton/ProductCardSkeleton'
import { LazySection } from '@/components/product/LazySection'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks'
import { SEOHead } from '@/components/seo/SEOHead'
import type { SearchFilters } from '@/types'
import { cn } from '@/lib/utils'

export default function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: categories } = useCategories()

  // Parse URL params to initial filters
  const initialFilters = useMemo<SearchFilters>(() => {
    const filters: SearchFilters = {
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('category') || searchParams.get('categoryId') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined,
      condition: (searchParams.get('condition') as any) || undefined,
      location: searchParams.get('location') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
    }

    // Handle badges
    const badgesParam = searchParams.get('badges')
    if (badgesParam) {
      filters.badges = badgesParam.split(',') as any[]
    }

    // Handle boolean flags
    if (searchParams.get('promoted') === 'true') {
      filters.promoted = true
    }
    if (searchParams.get('featured') === 'true') {
      filters.featured = true
    }

    return filters
  }, [searchParams])

  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  // Update filters when URL params change
  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const { data: productsData, isLoading, error, refetch } = useProducts(filters)

  // Update URL when filters change
  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams()

    if (newFilters.query) params.set('query', newFilters.query)
    if (newFilters.categoryId) params.set('category', newFilters.categoryId)
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString())
    if (newFilters.condition) params.set('condition', newFilters.condition)
    if (newFilters.location) params.set('location', newFilters.location)
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder)
    if (newFilters.rating) params.set('rating', newFilters.rating.toString())
    if (newFilters.badges && newFilters.badges.length > 0) {
      params.set('badges', newFilters.badges.join(','))
    }
    if (newFilters.promoted) params.set('promoted', 'true')
    if (newFilters.featured) params.set('featured', 'true')
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString())
    if (newFilters.limit && newFilters.limit !== 20) params.set('limit', newFilters.limit.toString())

    setSearchParams(params, { replace: true })
  }

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const newFilters = {
      ...filters,
      sortBy,
      sortOrder,
      page: 1, // Reset to first page when sorting changes
    }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page }
    setFilters(newFilters)
    updateURL(newFilters)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (pageSize: number) => {
    const newFilters = { ...filters, page: 1, limit: pageSize }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleRetry = () => {
    refetch()
  }

  const products = productsData?.items || []
  const totalPages = productsData?.totalPages || 0
  const totalItems = productsData?.total || 0
  const currentPage = filters.page || 1
  const pageSize = filters.limit || 20

  const sortOptions = [
    { value: 'createdAt', label: 'Mới nhất' },
    { value: 'price', label: 'Giá' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'viewCount', label: 'Lượt xem' },
    { value: 'soldCount', label: 'Bán chạy' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Danh sách sản phẩm - Chogiare"
        description="Tìm kiếm và lọc sản phẩm theo danh mục, giá, tình trạng và nhiều tiêu chí khác"
        keywords="sản phẩm, mua sỉ, bán sỉ, tìm kiếm sản phẩm"
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>

          {/* Page Title */}
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-2xl md:text-3xl font-bold">Danh sách sản phẩm</h1>
            {isLoading ? (
              <div className="h-6 w-48 bg-muted animate-pulse rounded mt-2" />
            ) : totalItems > 0 ? (
              <p className="text-muted-foreground mt-2">
                Tìm thấy {totalItems.toLocaleString()} sản phẩm
              </p>
            ) : null}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-4">
                {isLoading ? (
                  <ProductListFiltersSkeleton />
                ) : (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <ProductFilters
                      onSearch={handleFilterChange}
                      initialFilters={filters}
                      categories={categories || []}
                      showSort={false}
                    />
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Sort Bar */}
              {isLoading ? (
                <ProductListSortBarSkeleton />
              ) : (
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-lg border animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm font-medium whitespace-nowrap">Sắp xếp theo:</span>
                  <Select
                    value={filters.sortBy || 'createdAt'}
                    onValueChange={(value) => handleSortChange(value, filters.sortOrder || 'desc')}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.sortOrder || 'desc'}
                    onValueChange={(value) => handleSortChange(filters.sortBy || 'createdAt', value as 'asc' | 'desc')}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {totalItems > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                  </div>
                )}
                </div>
              )}

              {/* Error State */}
              {error && (
                <ErrorMessage
                  error={error}
                  onRetry={handleRetry}
                  className="min-h-[400px]"
                />
              )}

              {/* Loading State - Show skeleton grid */}
              {isLoading && !error && (
                <ProductGridSkeleton count={12} />
              )}

              {/* Empty State */}
              {!isLoading && !error && products.length === 0 && (
                <div className="animate-in fade-in duration-500">
                  <EmptyProducts />
                </div>
              )}

              {/* Products Grid - Load with staggered animation */}
              {!isLoading && !error && products.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination - Lazy Load when scroll near */}
                  {totalPages > 1 && (
                    <LazySection fallback={<div className="mt-8 h-12" />}>
                      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={totalItems}
                          pageSize={pageSize}
                          onPageChange={handlePageChange}
                          onPageSizeChange={handlePageSizeChange}
                          pageSizeOptions={[12, 24, 48, 96]}
                        />
                      </div>
                    </LazySection>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

