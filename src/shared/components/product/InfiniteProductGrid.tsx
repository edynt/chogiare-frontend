import React, { useEffect, useRef } from 'react'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '@shared/components/ui/loading'
import { ErrorMessage } from '@shared/components/ui/error-boundary'
import { EmptyProducts } from '@shared/components/ui/empty-state'
import { ProductGridSkeleton } from '@shared/components/skeleton/ProductCardSkeleton'
import { useInfiniteProducts, useInfiniteBuyerProducts } from '@/hooks'
import { cn } from '@/lib/utils'
import type { SearchFilters, Product } from '@/types'

interface InfiniteProductGridProps {
  filters?: Omit<SearchFilters, 'page'>
  className?: string
  onLoadMore?: () => void
  /**
   * When true, only shows products with status='active'
   * Use this for buyer-facing pages (home, product list, etc.)
   * @default true
   */
  buyerMode?: boolean
  /**
   * Maximum number of products to display in this grid.
   * When reached, infinite scroll will stop loading more.
   * @default undefined (no limit)
   */
  maxProducts?: number
}

export function InfiniteProductGrid({
  filters = {},
  className,
  onLoadMore,
  buyerMode = true,
  maxProducts,
}: InfiniteProductGridProps) {
  // Use buyer hook by default to only show active products
  const buyerQuery = useInfiniteBuyerProducts(filters)
  const allQuery = useInfiniteProducts(filters)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = buyerMode ? buyerQuery : allQuery

  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Calculate total products loaded so far
  const allProducts: Product[] = data?.pages.flatMap(page => page.items) || []
  const totalLoaded = allProducts.length
  const reachedMaxProducts = maxProducts !== undefined && totalLoaded >= maxProducts

  // Intersection Observer để detect khi scroll đến cuối
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        // Only load more if we haven't reached maxProducts limit
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage && !reachedMaxProducts) {
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, onLoadMore, reachedMaxProducts])

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

  // Use already calculated allProducts, limit to maxProducts if specified
  const products: Product[] = maxProducts !== undefined
    ? allProducts.slice(0, maxProducts)
    : allProducts

  if (isLoading && products.length === 0) {
    return <ProductGridSkeleton count={8} />
  }

  if (products.length === 0) {
    return <EmptyProducts />
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product, index: number) => (
          <div
            key={product.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
          >
            <ProductCard product={product} />
          </div>
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
        {(reachedMaxProducts || !hasNextPage) && products.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Đã hiển thị tất cả sản phẩm
          </p>
        )}
      </div>
    </div>
  )
}
