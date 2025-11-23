import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/home/Hero'
import { ProductGridWithPagination } from '@/components/product/ProductGridWithPagination'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react'
import { SEOHead } from '@/components/seo/SEOHead'
import { LazySection } from '@/components/home/LazySection'

// Lazy load components for better performance
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })))
const FeaturesSection = lazy(() => import('@/components/home/FeaturesSection').then(module => ({ default: module.FeaturesSection })))
const StatsSection = lazy(() => import('@/components/home/StatsSection').then(module => ({ default: module.StatsSection })))
const SystemsSection = lazy(() => import('@/components/home/SystemsSection').then(module => ({ default: module.SystemsSection })))

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Chogiare - Hệ thống quản lý bán sỉ chuyên nghiệp"
        description="Hệ thống quản lý bán sỉ với 2 phân hệ Admin và Seller. Quản lý đơn hàng, sản phẩm, khách hàng, doanh thu và ví điện tử một cách hiệu quả."
        keywords="hệ thống bán sỉ, quản lý bán hàng, admin seller, import excel, quản lý đơn hàng, ví điện tử, chogiare"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Chogiare",
          "url": "https://chogiare.com",
          "description": "Nền tảng mua sắm trực tuyến hàng đầu Việt Nam",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://chogiare.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Header />
      <main>
        <Hero />
        
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
              <h2 className="text-3xl font-bold mb-4">Sản phẩm bán sỉ nổi bật</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Khám phá những sản phẩm bán sỉ được yêu thích và có giá tốt nhất
              </p>
            </div>
            <ProductGridWithPagination
              initialFilters={{ limit: 12 }}
              showSearch={false}
              showPagination={false}
            />
          </div>
        </section>

        {/* Stats Section */}
        <LazySection>
          <StatsSection />
        </LazySection>
        
        {/* Systems Section - Admin & Seller */}
        <LazySection>
          <SystemsSection />
        </LazySection>

        {/* Features Section */}
        <LazySection>
          <FeaturesSection />
        </LazySection>

        {/* Testimonials Section */}
        <LazySection>
          <TestimonialsSection />
        </LazySection>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bắt đầu kinh doanh bán sỉ ngay hôm nay
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Tham gia hệ thống bán sỉ với đầy đủ công cụ quản lý chuyên nghiệp. 
                Import sản phẩm hàng loạt, quản lý đơn hàng tự động và theo dõi doanh thu chi tiết. 
                Đăng ký ngay để trải nghiệm miễn phí!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link to="/auth/register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-4 text-lg hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-primary to-secondary"
                  >
                    Đăng ký làm Seller
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-4 text-lg hover:scale-105 transition-all duration-300 hover:shadow-xl border-2"
                  >
                    Vào Dashboard
                  </Button>
                </Link>
              </div>

              {/* Additional benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Dễ sử dụng</h3>
                  <p className="text-sm text-muted-foreground">Giao diện trực quan, dễ thao tác</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Bảo mật cao</h3>
                  <p className="text-sm text-muted-foreground">An toàn dữ liệu</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Headphones className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Hỗ trợ 24/7</h3>
                  <p className="text-sm text-muted-foreground">Luôn sẵn sàng</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
