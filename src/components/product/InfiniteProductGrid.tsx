import React, { useEffect, useRef } from 'react'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { EmptyProducts } from '@/components/ui/empty-state'
import { useInfiniteProducts, useCategories } from '@/hooks'
import { cn } from '@/lib/utils'
import type { SearchFilters, Product } from '@/types'

interface InfiniteProductGridProps {
  filters?: Omit<SearchFilters, 'page'>
  className?: string
  onLoadMore?: () => void
}

export function InfiniteProductGrid({
  filters = {},
  className,
  onLoadMore,
}: InfiniteProductGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteProducts(filters)

  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Intersection Observer để detect khi scroll đến cuối
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
          onLoadMore?.()
        }
      },
      {
        rootMargin: '200px', // Load trước khi scroll đến cuối 200px
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, onLoadMore])

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

  // Flatten all pages into a single array
  const products: Product[] = data?.pages.flatMap((page) => page.items) || []

  if (isLoading && products.length === 0) {
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
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Sentinel element để trigger load more */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Đang tải thêm sản phẩm...</span>
          </div>
        )}
        {!hasNextPage && products.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Đã hiển thị tất cả sản phẩm
          </p>
        )}
      </div>
    </div>
  )
}

