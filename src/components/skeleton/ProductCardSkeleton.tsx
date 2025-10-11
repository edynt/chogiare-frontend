import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list'
  className?: string
}

export function ProductCardSkeleton({ viewMode = 'grid', className }: ProductCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className={`group overflow-hidden relative hover:shadow-lg transition-shadow duration-300 flex flex-row ${className}`}>
        <div className="w-32 h-32 flex-shrink-0">
          <Skeleton className="w-full h-full" />
        </div>
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`group overflow-hidden relative hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2 mb-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 8, viewMode = 'grid' }: { count?: number, viewMode?: 'grid' | 'list' }) {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  )
}
