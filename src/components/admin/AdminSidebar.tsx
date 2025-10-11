import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  Shield,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

type AdminTab = 'overview' | 'users' | 'products' | 'orders' | 'settings'

interface AdminSidebarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'overview' as const,
      label: 'Tổng quan',
      icon: BarChart3,
      description: 'Thống kê tổng quan hệ thống'
    },
    {
      id: 'users' as const,
      label: 'Người dùng',
      icon: Users,
      description: 'Quản lý người dùng và quyền hạn',
      badge: '12'
    },
    {
      id: 'products' as const,
      label: 'Sản phẩm',
      icon: Package,
      description: 'Quản lý sản phẩm và danh mục',
      badge: '3'
    },
    {
      id: 'orders' as const,
      label: 'Đơn hàng',
      icon: ShoppingCart,
      description: 'Quản lý đơn hàng và giao dịch',
      badge: '5'
    },
    {
      id: 'settings' as const,
      label: 'Cài đặt',
      icon: Settings,
      description: 'Cấu hình hệ thống'
    }
  ]

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start h-auto p-4",
              activeTab === item.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <div className="flex items-center w-full">
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={activeTab === item.id ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Button>
        )
      })}

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-sm mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Thống kê nhanh
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng người dùng:</span>
            <span className="font-medium">1,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sản phẩm hoạt động:</span>
            <span className="font-medium">5,678</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Đơn hàng hôm nay:</span>
            <span className="font-medium text-success">89</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Doanh thu tháng:</span>
            <span className="font-medium text-success">2.5B VNĐ</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-4 w-4 text-warning mr-2" />
          <span className="text-sm font-medium text-warning">Cảnh báo</span>
        </div>
        <p className="text-xs text-muted-foreground">
          3 sản phẩm cần kiểm duyệt
        </p>
        <Button size="sm" variant="outline" className="mt-2 w-full">
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}
