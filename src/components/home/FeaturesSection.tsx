import React from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { 
  Shield, 
  Truck, 
  Headphones, 
  Award, 
  CreditCard, 
  Smartphone,
  Globe,
  Zap,
  Lock,
  RefreshCw,
  Users,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Bảo mật tuyệt đối',
    description: 'Thông tin cá nhân và thanh toán được mã hóa SSL 256-bit, đảm bảo an toàn tuyệt đối.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Truck,
    title: 'Giao hàng siêu tốc',
    description: 'Giao hàng trong 2h tại TP.HCM, 24h tại các thành phố lớn, 2-3 ngày toàn quốc.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp, sẵn sàng hỗ trợ mọi lúc, mọi nơi.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Award,
    title: 'Chất lượng đảm bảo',
    description: 'Tất cả sản phẩm đều được kiểm tra chất lượng kỹ lưỡng trước khi giao đến tay khách hàng.',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: CreditCard,
    title: 'Thanh toán đa dạng',
    description: 'Hỗ trợ thanh toán qua thẻ, ví điện tử, chuyển khoản và trả góp 0% lãi suất.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Smartphone,
    title: 'Ứng dụng di động',
    description: 'Tải ứng dụng Chogiare để mua sắm mọi lúc mọi nơi với trải nghiệm tối ưu.',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    icon: Globe,
    title: 'Giao hàng toàn quốc',
    description: 'Mạng lưới giao hàng rộng khắp 63 tỉnh thành, đảm bảo sản phẩm đến tay bạn nhanh nhất.',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    icon: Zap,
    title: 'Tốc độ tải nhanh',
    description: 'Website được tối ưu hóa để tải nhanh nhất, mang đến trải nghiệm mua sắm mượt mà.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: Lock,
    title: 'Bảo hành chính hãng',
    description: 'Tất cả sản phẩm đều có bảo hành chính hãng từ nhà sản xuất, đảm bảo quyền lợi khách hàng.',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả dễ dàng',
    description: 'Chính sách đổi trả linh hoạt trong 30 ngày, hoàn tiền 100% nếu không hài lòng.',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    icon: Users,
    title: 'Cộng đồng lớn',
    description: 'Hơn 10 triệu thành viên tin tưởng và sử dụng dịch vụ của Chogiare mỗi tháng.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: TrendingUp,
    title: 'Giá cả cạnh tranh',
    description: 'So sánh giá từ hàng nghìn nhà bán, đảm bảo bạn luôn mua được với giá tốt nhất.',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50'
  }
]

export function FeaturesSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Tại sao chọn Chogiare?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với những tính năng vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl ${feature.bgColor} p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isIntersecting 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
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
            <h3 className="text-2xl font-bold mb-6">Cam kết của chúng tôi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">100% Chính hãng</h4>
                <p className="text-muted-foreground text-sm">
                  Tất cả sản phẩm đều được đảm bảo chính hãng từ nhà sản xuất
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Đổi trả miễn phí</h4>
                <p className="text-muted-foreground text-sm">
                  Đổi trả trong 30 ngày với chi phí vận chuyển miễn phí
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Hỗ trợ tận tình</h4>
                <p className="text-muted-foreground text-sm">
                  Đội ngũ chăm sóc khách hàng chuyên nghiệp, sẵn sàng hỗ trợ 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

