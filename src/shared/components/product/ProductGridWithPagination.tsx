import React, { useState } from 'react'
import { ProductCard } from './ProductCard'
import { ProductSearch } from './ProductSearch'
import { Pagination } from '@shared/components/ui/pagination'
import { LoadingSpinner } from '@shared/components/ui/loading'
import { ErrorMessage } from '@shared/components/ui/error-boundary'
import { EmptyProducts } from '@shared/components/ui/empty-state'
import { useProducts, useCategories } from '@/hooks'
import { InfiniteProductGrid } from './InfiniteProductGrid'
import { cn } from '@/lib/utils'
import type { SearchFilters, Product } from '@/types'

interface ProductGridWithPaginationProps {
  initialFilters?: SearchFilters
  showSearch?: boolean
  showPagination?: boolean
  showSidebar?: boolean
  infiniteScroll?: boolean
  className?: string
}

export function ProductGridWithPagination({
  initialFilters = {},
  showSearch = true,
  showPagination = true,
  showSidebar = false,
  infiniteScroll = false,
  className,
}: ProductGridWithPaginationProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  })

  const { data: productsData, isLoading, error, refetch } = useProducts(filters)
  const { data: categories } = useCategories()

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters(prev => ({ ...prev, page: 1, limit: pageSize }))
  }

  const handleRetry = () => {
    refetch()
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={handleRetry}
        className="min-h-[400px]"
      />
    )
  }

  const products = productsData?.items || []
  const totalPages = productsData?.totalPages || 0
  const totalItems = productsData?.total || 0
  const currentPage = filters.page || 1
  const pageSize = filters.limit || 20

  // If showing sidebar, only render the search component
  if (showSidebar) {
    return (
      <div className={cn('space-y-4', className)}>
        <ProductSearch
          onSearch={handleSearch}
          initialFilters={filters}
          categories={categories || []}
          compact={true}
        />
      </div>
    )
  }

  // Use infinite scroll if enabled
  if (infiniteScroll) {
    const { page: _page, limit: _limit, ...infiniteFilters } = filters
    return (
      <div className={cn('space-y-6', className)}>
        {/* Search and Filters */}
        {showSearch && (
          <ProductSearch
            onSearch={handleSearch}
            initialFilters={filters}
            categories={categories || []}
          />
        )}
        <InfiniteProductGrid filters={infiniteFilters} />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filters */}
      {showSearch && (
        <ProductSearch
          onSearch={handleSearch}
          initialFilters={filters}
          categories={categories || []}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && <EmptyProducts />}

      {/* Products Grid */}
      {!isLoading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[12, 24, 48, 96]}
            />
          )}
        </>
      )}
    </div>
  )
}

interface SimpleProductGridProps {
  products: Product[]
  isLoading?: boolean
  error?: Error
  onRetry?: () => void
  className?: string
}

export function SimpleProductGrid({
  products,
  isLoading = false,
  error,
  onRetry,
  className,
}: SimpleProductGridProps) {
  if (error) {
    return (
      <ErrorMessage error={error} onRetry={onRetry} className="min-h-[400px]" />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (products.length === 0) {
    return <EmptyProducts />
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
