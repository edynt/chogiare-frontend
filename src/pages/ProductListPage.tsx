import { useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductGridWithPagination } from '@/components/product/ProductGridWithPagination'
import { ProductFilters } from '@/components/product/ProductFilters'
import { useCategories } from '@/hooks'
import { SEOHead } from '@/components/seo/SEOHead'
import type { SearchFilters } from '@/types'

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const { data: categories } = useCategories()
  
  // Lấy tham số từ URL
  const query = searchParams.get('q') || ''
  const categoryId = searchParams.get('category') || ''
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
  const condition = searchParams.get('condition') as 'new' | 'like_new' | 'good' | 'fair' | 'poor' | undefined || undefined
  const location = searchParams.get('location') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
  const page = parseInt(searchParams.get('page') || '1')

  const initialFilters: SearchFilters = {
    query: query || undefined,
    categoryId: categoryId || undefined,
    minPrice,
    maxPrice,
    condition,
    location: location || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 20,
  }

  const handleFilterChange = (filters: SearchFilters) => {
    // Update URL with new filters
    const params = new URLSearchParams()
    if (filters.query) params.set('q', filters.query)
    if (filters.categoryId) params.set('category', filters.categoryId)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.condition) params.set('condition', filters.condition)
    if (filters.location) params.set('location', filters.location)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString())
    
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Danh sách sản phẩm"
        description="Khám phá hàng ngàn sản phẩm chất lượng với giá cả hợp lý tại Chogiare. Tìm kiếm và lọc sản phẩm theo danh mục, giá cả, thương hiệu và nhiều tiêu chí khác."
        keywords="danh sách sản phẩm, mua sắm online, tìm kiếm sản phẩm, lọc sản phẩm, chogiare"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProductFilters
                onSearch={handleFilterChange}
                initialFilters={initialFilters}
                categories={categories || []}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProductGridWithPagination
              initialFilters={initialFilters}
              showSearch={false}
              showPagination={true}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}