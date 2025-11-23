import React from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Button } from '@/components/ui/button'
import { 
  Store, 
  Upload, 
  Package, 
  ShoppingCart, 
  Wallet, 
  MessageCircle, 
  TrendingUp,
  BarChart3,
  ArrowRight,
  FileSpreadsheet,
  DollarSign,
  Users
} from 'lucide-react'

export function SystemsSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  const sellerFeatures = [
    {
      icon: Upload,
      title: 'Import sản phẩm Excel/CSV',
      description: 'Nhập hàng loạt sản phẩm từ file Excel hoặc CSV, tiết kiệm thời gian và công sức'
    },
    {
      icon: Package,
      title: 'Quản lý sản phẩm',
      description: 'Tạo, chỉnh sửa, xóa sản phẩm. Quản lý tồn kho, giá cả và hình ảnh sản phẩm'
    },
    {
      icon: ShoppingCart,
      title: 'Quản lý đơn hàng',
      description: 'Theo dõi đơn hàng với các trạng thái: Chờ xác nhận, Đã xác nhận, Sẵn sàng lấy, Hoàn thành'
    },
    {
      icon: Wallet,
      title: 'Ví điện tử',
      description: 'Nạp tiền, rút tiền và theo dõi số dư. Quản lý tài chính cửa hàng dễ dàng'
    },
    {
      icon: MessageCircle,
      title: 'Tin nhắn khách hàng',
      description: 'Giao tiếp trực tiếp với khách hàng, tư vấn và hỗ trợ đặt hàng'
    },
    {
      icon: TrendingUp,
      title: 'Quản lý doanh thu',
      description: 'Theo dõi doanh thu theo thời gian, phân tích xu hướng và hiệu quả kinh doanh'
    },
    {
      icon: Users,
      title: 'Quản lý khách hàng',
      description: 'Lưu trữ thông tin khách hàng, lịch sử mua hàng và tương tác'
    },
    {
      icon: BarChart3,
      title: 'Báo cáo & Thống kê',
      description: 'Xem báo cáo chi tiết về doanh số, sản phẩm bán chạy và hiệu suất kinh doanh'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hệ thống quản lý bán sỉ chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nền tảng quản lý bán hàng toàn diện với đầy đủ công cụ cần thiết cho người bán
          </p>
        </div>

        {/* Seller System */}
        <div className={`transition-all duration-1000 delay-200 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="hidden md:block order-2">
                <div className="bg-white rounded-xl p-8 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-semibold">Import Excel/CSV</div>
                        <div className="text-sm text-muted-foreground">Nhập 100+ sản phẩm trong vài phút</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-semibold">Quản lý đơn hàng</div>
                        <div className="text-sm text-muted-foreground">23 đơn hàng đang chờ xử lý</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                      <div>
                        <div className="font-semibold">Doanh thu tháng này</div>
                        <div className="text-sm text-muted-foreground">25.7 triệu VNĐ</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-pink-600" />
                      <div>
                        <div className="font-semibold">Tin nhắn chưa đọc</div>
                        <div className="text-sm text-muted-foreground">8 tin nhắn mới từ khách hàng</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Hệ thống Seller</h3>
                    <p className="text-muted-foreground">Quản lý cửa hàng bán sỉ</p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Hệ thống quản lý bán hàng toàn diện với đầy đủ công cụ cần thiết: 
                  từ import sản phẩm, quản lý đơn hàng, ví điện tử đến thống kê doanh thu.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {sellerFeatures.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div key={index} className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Link to="/dashboard">
                    Vào Dashboard Seller
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

