import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductFilters } from '@/components/product/ProductFilters'
import { ProductGridSkeleton } from '@/components/skeleton/ProductCardSkeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProducts, useCategories } from '@/hooks/useProducts'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, SlidersHorizontal, Star, TrendingUp, Zap } from 'lucide-react'
import type { SearchFilters } from '@/types'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useLanguage()
  
  // Lấy tham số từ URL
  const query = searchParams.get('q') || ''
  const categoryId = searchParams.get('category') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const condition = searchParams.get('condition') || ''
  const location = searchParams.get('location') || ''
  const sortBy = searchParams.get('sortBy') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')

  const filters: SearchFilters = {
    query,
    categoryId: categoryId || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    condition: condition as any,
    location,
    sortBy: sortBy as any,
    limit: 12,
    offset: (page - 1) * 12,
  }

  const { data: productsData, isLoading, error } = useProducts(filters)
  const { data: categories } = useCategories()

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })
    
    // Reset về trang 1 khi thay đổi bộ lọc
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSearch = (searchQuery: string) => {
    handleFilterChange({ query: searchQuery })
  }

  const handleSortChange = (newSortBy: string) => {
    handleFilterChange({ sortBy: newSortBy as any })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
  }

  const totalPages = productsData ? Math.ceil(productsData.total / 12) : 0

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Sản phẩm giá tốt</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Khám phá hàng ngàn sản phẩm chất lượng với giá cả hợp lý
          </p>
          
          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.8/5 đánh giá</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span>+50% tiết kiệm</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-primary" />
              <span>Giao hàng nhanh</span>
            </div>
          </div>
        </div>

      {/* Search và Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
            </SelectContent>
          </Select>


          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Active Filters */}
        {(query || categoryId || minPrice || maxPrice || condition || location) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Bộ lọc đang áp dụng:</span>
            {query && (
              <Badge variant="secondary" className="gap-1">
                Tìm kiếm: {query}
                <button
                  onClick={() => handleFilterChange({ query: '' })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {categoryId && (
              <Badge variant="secondary" className="gap-1">
                Danh mục: {categories?.find(c => c.id === categoryId)?.name}
                <button
                  onClick={() => handleFilterChange({ categoryId: '' })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                Giá: {minPrice ? `${minPrice}đ` : '0đ'} - {maxPrice ? `${maxPrice}đ` : '∞'}
                <button
                  onClick={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {condition && (
              <Badge variant="secondary" className="gap-1">
                Tình trạng: {condition === 'new' ? 'Mới' : 'Đã sử dụng'}
                <button
                  onClick={() => handleFilterChange({ condition: undefined })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="gap-1">
                Khu vực: {location}
                <button
                  onClick={() => handleFilterChange({ location: '' })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories || []}
          />
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Bộ lọc</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  categories={categories || []}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Count */}
          {productsData && (
            <div className="mb-4 text-sm text-muted-foreground">
              Hiển thị {productsData.items?.length} trong tổng số {productsData.total} sản phẩm
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <ProductGridSkeleton count={8} />
          )}

          {/* Products Grid */}
          {!isLoading && productsData && (
            <>
              {productsData.items?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-muted-foreground mb-4">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <Button onClick={() => setSearchParams({})}>
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productsData?.items?.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page <= 1}
                        >
                          Trước
                        </Button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= totalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
