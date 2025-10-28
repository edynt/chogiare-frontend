import React from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Car, 
  Gamepad2, 
  Camera, 
  BookOpen,
  Heart,
  Baby,
  Wrench,
  Music
} from 'lucide-react'

const categories = [
  { id: 1, name: 'Điện thoại', icon: Smartphone, color: 'bg-blue-500', href: '/products?category=electronics' },
  { id: 2, name: 'Laptop', icon: Laptop, color: 'bg-purple-500', href: '/products?category=laptop' },
  { id: 3, name: 'Thời trang', icon: Shirt, color: 'bg-pink-500', href: '/products?category=fashion' },
  { id: 4, name: 'Gia dụng', icon: Home, color: 'bg-green-500', href: '/products?category=home' },
  { id: 5, name: 'Ô tô', icon: Car, color: 'bg-red-500', href: '/products?category=automotive' },
  { id: 6, name: 'Gaming', icon: Gamepad2, color: 'bg-indigo-500', href: '/products?category=gaming' },
  { id: 7, name: 'Máy ảnh', icon: Camera, color: 'bg-yellow-500', href: '/products?category=camera' },
  { id: 8, name: 'Sách', icon: BookOpen, color: 'bg-orange-500', href: '/products?category=books' },
  { id: 9, name: 'Sức khỏe', icon: Heart, color: 'bg-red-400', href: '/products?category=health' },
  { id: 10, name: 'Trẻ em', icon: Baby, color: 'bg-pink-400', href: '/products?category=baby' },
  { id: 11, name: 'Công cụ', icon: Wrench, color: 'bg-gray-500', href: '/products?category=tools' },
  { id: 12, name: 'Âm nhạc', icon: Music, color: 'bg-teal-500', href: '/products?category=music' },
]

export function CategoriesSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Khám phá theo danh mục
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tìm kiếm sản phẩm yêu thích từ hàng trăm danh mục đa dạng
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                to={category.href}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isIntersecting 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            )
          })}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Link 
            to="/products" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả danh mục
          </Link>
        </div>
      </div>
    </section>
  )
}

