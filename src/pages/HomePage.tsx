import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/home/Hero'
import { CategoryScroller } from '@/components/home/CategoryScroller'
import { ProductGrid } from '@/components/home/ProductGrid'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CategoryScroller />
        <ProductGrid />
        
        {/* Trust Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tại sao chọn Chogiare?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm mua sắm an toàn, tiện lợi và đáng tin cậy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bảo mật tuyệt đối</h3>
                <p className="text-muted-foreground">
                  Thông tin cá nhân và thanh toán được mã hóa an toàn
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
                <p className="text-muted-foreground">
                  Giao hàng trong 24h tại TP.HCM, 2-3 ngày toàn quốc
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
                <p className="text-muted-foreground">
                  Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chất lượng đảm bảo</h3>
                <p className="text-muted-foreground">
                  Tất cả sản phẩm đều được kiểm tra chất lượng kỹ lưỡng
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu mua sắm ngay hôm nay</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Khám phá hàng ngàn sản phẩm chất lượng với giá cả hợp lý
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Xem tất cả sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
