import { Header } from '@shared/components/layout/Header'
import { SellerDashboardContent } from '@user/components/seller/seller/SellerDashboardContent'
import { Footer } from '@shared/components/layout/Footer'

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
