import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminOverview } from '@/components/admin/AdminOverview'
import { AdminUsers } from '@/components/admin/AdminUsers'
import { AdminProducts } from '@/components/admin/AdminProducts'
import { AdminOrders } from '@/components/admin/AdminOrders'
import { AdminSettings } from '@/components/admin/AdminSettings'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Shield,
  Zap,
  Crown
} from 'lucide-react'

type AdminTab = 'overview' | 'users' | 'products' | 'orders' | 'settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />
      case 'users':
        return <AdminUsers />
      case 'products':
        return <AdminProducts />
      case 'orders':
        return <AdminOrders />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Quản trị hệ thống</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Quản lý toàn bộ hoạt động của nền tảng Chogiare - Nơi mua sắm giá tốt
              </p>
              
              {/* Performance indicators */}
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>+25% doanh thu tháng này</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>99.9% uptime</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-info" />
                  <span>Bảo mật cao</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Super Admin
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
