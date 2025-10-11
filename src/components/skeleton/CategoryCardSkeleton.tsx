import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryCardSkeletonProps {
  viewMode?: 'grid' | 'list'
  className?: string
}

export function CategoryCardSkeleton({ viewMode = 'grid', className }: CategoryCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className={`group hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Skeleton className="w-full h-full" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              
              <Skeleton className="h-4 w-3/4 mb-2" />
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-64 relative ${className}`}>
      <div className="relative h-32 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-4" />
        </div>
        
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryGridSkeleton({ count = 6, viewMode = 'grid' }: { count?: number, viewMode?: 'grid' | 'list' }) {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  )
}
