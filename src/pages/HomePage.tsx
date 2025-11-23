import React, {  lazy } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SEOHead } from '@/components/seo/SEOHead'
import { LazySection } from '@/components/home/LazySection'

// Lazy load components for better performance
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
        
        {/* Systems Section - Admin & Seller */}
        <LazySection>
          <SystemsSection />
        </LazySection>
      </main>
      <Footer />
    </div>
  )
}
