import { useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductGridWithPagination } from '@/components/product/ProductGridWithPagination'
import type { SearchFilters } from '@/types'

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
          </p>
        </div>
        
        <ProductGridWithPagination
          initialFilters={initialFilters}
          showSearch={true}
          showPagination={true}
        />
      </main>
      <Footer />
    </div>
  )
}