import { Header } from '@/components/layout/Header'
import { SellerDashboardContent } from '@/components/seller/SellerDashboardContent'
import { Footer } from '@/components/layout/Footer'

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SellerDashboardContent />
      </main>
      <Footer />
    </div>
  )
}
