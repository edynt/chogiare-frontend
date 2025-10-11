import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useProducts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CategoryScroller() {
  const { data: categories, isLoading } = useCategories()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh mục phổ biến</h2>
          <div className="hidden md:flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="flex-shrink-0 snap-center group"
              >
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted group-hover:shadow-lg transition-shadow">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.productCount} sản phẩm
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
