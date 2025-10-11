import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminOverview } from '@/components/admin/AdminOverview'
import { AdminUsers } from '@/components/admin/AdminUsers'
import { AdminProducts } from '@/components/admin/AdminProducts'
import { AdminOrders } from '@/components/admin/AdminOrders'
import { AdminSettings } from '@/components/admin/AdminSettings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  BarChart3
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
              <h1 className="text-3xl font-bold mb-2">Quản trị hệ thống</h1>
              <p className="text-muted-foreground">
                Quản lý toàn bộ hoạt động của nền tảng Chogiare
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin
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
