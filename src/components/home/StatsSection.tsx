import React, { useState, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Star,
  Globe,
  Award,
  Heart
} from 'lucide-react'

interface StatItem {
  icon: React.ComponentType<any>
  value: number
  suffix: string
  label: string
  color: string
  bgColor: string
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Người bán đang hoạt động',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Package,
    value: 500000,
    suffix: '+',
    label: 'Sản phẩm bán sỉ',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: ShoppingCart,
    value: 100000,
    suffix: '+',
    label: 'Đơn hàng đã xử lý',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: TrendingUp,
    value: 500,
    suffix: '+',
    label: 'Tỷ VNĐ doanh thu',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Star,
    value: 4.8,
    suffix: '/5',
    label: 'Đánh giá trung bình',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    icon: Globe,
    value: 63,
    suffix: '',
    label: 'Tỉnh thành phục vụ',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Award,
    value: 150,
    suffix: '+',
    label: 'Nhãn hiệu hợp tác',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    icon: Heart,
    value: 97,
    suffix: '%',
    label: 'Tỷ lệ hài lòng',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50'
  }
]

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isAnimating) {
      const startTime = Date.now()
      const startValue = 0
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = startValue + (end - startValue) * easeOutQuart
        
        setCount(Math.floor(currentValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [end, duration, isAnimating])

  const triggerAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true)
    }
  }

  return (
    <div onMouseEnter={triggerAnimation}>
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export function StatsSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hệ thống bán sỉ trong con số
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Những con số ấn tượng thể hiện sự phát triển và tin cậy của nền tảng bán sỉ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl ${stat.bgColor} p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isIntersecting 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {isIntersecting ? (
                      <AnimatedCounter 
                        end={stat.value} 
                        duration={2000 + index * 200}
                        suffix={stat.suffix}
                      />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    {stat.label}
                  </h3>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )
          })}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Lợi ích khi sử dụng hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-semibold text-xl mb-2">Tăng hiệu quả kinh doanh</h4>
                <p className="text-muted-foreground">
                  Quản lý đơn hàng, sản phẩm và khách hàng tự động hóa, tiết kiệm 70% thời gian
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-semibold text-xl mb-2">Nhập hàng nhanh chóng</h4>
                <p className="text-muted-foreground">
                  Import hàng loạt sản phẩm từ Excel/CSV, giảm 90% thời gian nhập liệu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

