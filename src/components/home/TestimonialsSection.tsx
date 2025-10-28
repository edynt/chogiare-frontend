import React from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Thị Mai',
    location: 'Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Chogiare giúp tôi tìm được những sản phẩm chất lượng với giá cả hợp lý. Giao hàng nhanh và dịch vụ khách hàng tuyệt vời!',
    purchase: 'iPhone 15 Pro Max'
  },
  {
    id: 2,
    name: 'Trần Văn Nam',
    location: 'Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Tôi đã mua nhiều sản phẩm trên Chogiare và luôn hài lòng. Sản phẩm đúng như mô tả, giá cả cạnh tranh.',
    purchase: 'MacBook Air M2'
  },
  {
    id: 3,
    name: 'Lê Thị Hoa',
    location: 'Đà Nẵng',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Giao diện dễ sử dụng, thanh toán an toàn. Tôi đã giới thiệu cho nhiều bạn bè và họ đều rất thích.',
    purchase: 'Samsung Galaxy S24'
  },
  {
    id: 4,
    name: 'Phạm Minh Tuấn',
    location: 'Cần Thơ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Chogiare có đầy đủ các sản phẩm tôi cần. Chất lượng tốt, giá cả phải chăng và giao hàng đúng hẹn.',
    purchase: 'Dell XPS 13'
  },
  {
    id: 5,
    name: 'Hoàng Thị Linh',
    location: 'Hải Phòng',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Tôi rất tin tưởng Chogiare. Sản phẩm chính hãng, bảo hành đầy đủ và hỗ trợ khách hàng nhiệt tình.',
    purchase: 'iPad Pro 12.9"'
  },
  {
    id: 6,
    name: 'Vũ Đức Anh',
    location: 'Nha Trang',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Chogiare là nơi mua sắm trực tuyến tốt nhất mà tôi từng sử dụng. Đa dạng sản phẩm, giá cả hợp lý.',
    purchase: 'Sony WH-1000XM5'
  }
]

export function TestimonialsSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hàng triệu khách hàng đã tin tưởng và hài lòng với dịch vụ của Chogiare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms` 
              }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground italic leading-relaxed pl-6">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-primary font-medium">
                  Đã mua: {testimonial.purchase}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Thống kê khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-muted-foreground">Đánh giá trung bình</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-muted-foreground">Đánh giá tích cực</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

