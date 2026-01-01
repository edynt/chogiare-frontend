import { Skeleton } from '@shared/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@shared/components/ui/card'
import { ProductGridSkeleton } from './ProductCardSkeleton'

export function ProductListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar Skeleton */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Badges */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Sort Bar Skeleton */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[140px]" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Products Grid Skeleton */}
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  )
}

export function ProductListFiltersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ProductListSortBarSkeleton() {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-lg border">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

