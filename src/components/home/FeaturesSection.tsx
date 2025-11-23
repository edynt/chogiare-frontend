import React from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { 
  Upload, 
  FileSpreadsheet,
  ShoppingCart, 
  Wallet, 
  MessageCircle, 
  TrendingUp,
  Users,
  Package,
  Edit,
  Trash2,
  BarChart3,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  Truck,
  Shield,
  Settings
} from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Import sản phẩm Excel/CSV',
    description: 'Nhập hàng loạt sản phẩm từ file Excel hoặc CSV một cách nhanh chóng và tiện lợi, tiết kiệm thời gian quản lý.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Package,
    title: 'Quản lý sản phẩm đầy đủ',
    description: 'Tạo, chỉnh sửa và xóa sản phẩm dễ dàng. Quản lý tồn kho, giá cả và thông tin chi tiết sản phẩm.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: ShoppingCart,
    title: 'Quản lý đơn hàng thông minh',
    description: 'Theo dõi đơn hàng với các trạng thái: Chờ xác nhận, Đã xác nhận, Sẵn sàng lấy, Hoàn thành. Cập nhật trạng thái đơn hàng chỉ với một click.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Wallet,
    title: 'Ví điện tử tích hợp',
    description: 'Nạp tiền vào ví, theo dõi số dư và lịch sử giao dịch. Rút tiền dễ dàng với nhiều phương thức thanh toán.',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: MessageCircle,
    title: 'Hệ thống tin nhắn',
    description: 'Giao tiếp trực tiếp với khách hàng qua hệ thống tin nhắn tích hợp, hỗ trợ tư vấn và giải đáp thắc mắc nhanh chóng.',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    icon: TrendingUp,
    title: 'Quản lý doanh thu',
    description: 'Theo dõi doanh thu theo ngày, tuần, tháng. Phân tích xu hướng bán hàng và hiệu quả kinh doanh với biểu đồ trực quan.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Users,
    title: 'Quản lý khách hàng',
    description: 'Lưu trữ thông tin khách hàng, lịch sử mua hàng và tương tác. Xây dựng mối quan hệ lâu dài với khách hàng.',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    icon: FileSpreadsheet,
    title: 'Xuất báo cáo Excel',
    description: 'Xuất báo cáo doanh thu, đơn hàng, sản phẩm ra file Excel để phân tích chi tiết và lưu trữ.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: BarChart3,
    title: 'Thống kê & Báo cáo',
    description: 'Dashboard với các chỉ số KPI quan trọng: số lượng đơn hàng, doanh thu, sản phẩm bán chạy và hiệu suất kinh doanh.',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Clock,
    title: 'Trạng thái đơn hàng chi tiết',
    description: 'Quản lý trạng thái đơn hàng từ Chờ xác nhận → Đã xác nhận → Sẵn sàng lấy → Hoàn thành với thời gian thực.',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    icon: Shield,
    title: 'Bảo mật & An toàn',
    description: 'Hệ thống được mã hóa SSL, bảo vệ thông tin tài chính và dữ liệu kinh doanh của bạn một cách an toàn tuyệt đối.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: Settings,
    title: 'Quản lý hệ thống Admin',
    description: 'Quản lý người dùng, xử lý khiếu nại, và điều hành toàn bộ hệ thống một cách chuyên nghiệp và hiệu quả.',
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
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hệ thống quản lý bán sỉ với đầy đủ công cụ cần thiết để vận hành kinh doanh hiệu quả
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
            <h3 className="text-2xl font-bold mb-6">Quy trình quản lý đơn hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Chờ xác nhận</h4>
                <p className="text-muted-foreground text-sm">
                  Đơn hàng mới được đặt, đang chờ người bán xác nhận
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Đã xác nhận</h4>
                <p className="text-muted-foreground text-sm">
                  Người bán đã xác nhận và chuẩn bị hàng
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Sẵn sàng lấy</h4>
                <p className="text-muted-foreground text-sm">
                  Hàng đã sẵn sàng để khách hàng đến lấy hoặc giao hàng
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Hoàn thành</h4>
                <p className="text-muted-foreground text-sm">
                  Đơn hàng đã được giao thành công và hoàn tất
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

