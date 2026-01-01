import { Skeleton } from '@shared/components/ui/skeleton'
import { Card, CardContent } from '@shared/components/ui/card'
import { ProductGridSkeleton } from './ProductCardSkeleton'

export function HomePageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 h-64 md:h-80">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Categories Skeleton */}
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

      {/* Product Section Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}

export function HomePageSectionSkeleton() {
  return (
    <div className="space-y-4">
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      {/* Products Grid Skeleton */}
      <ProductGridSkeleton count={8} />
    </div>
  )
}

export function HomePageShopSectionSkeleton() {
  return (
    <div className="space-y-4">
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      {/* Shop Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

