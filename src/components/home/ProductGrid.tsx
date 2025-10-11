import React from 'react'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'

export function ProductGrid() {
  const { data: products, isLoading } = useFeaturedProducts(12)

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
          <Button variant="outline" asChild>
            <Link to="/products">Xem tất cả</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link to="/products">Xem thêm sản phẩm</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
