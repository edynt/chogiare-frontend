import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useProducts'

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto mb-4" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                <div className="h-2 w-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return null
  }

  // Chia categories thành 2 hàng
  const firstRow = categories.slice(0, Math.ceil(categories.length / 2))
  const secondRow = categories.slice(Math.ceil(categories.length / 2))

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Danh mục phổ biến</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Khám phá các danh mục sản phẩm đa dạng
          </p>
        </div>

        <div className="space-y-6">
          {/* Hàng đầu tiên */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {firstRow.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 group-hover:shadow-lg transition-all duration-200">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl">📦</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-medium group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.productCount} sản phẩm
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Hàng thứ hai */}
          {secondRow.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {secondRow.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 group-hover:shadow-lg transition-all duration-200">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl">📦</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs sm:text-sm font-medium group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.productCount} sản phẩm
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nút xem tất cả categories */}
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Xem tất cả danh mục
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
