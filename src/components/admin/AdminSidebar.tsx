import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  CreditCard,
  Tag,
  Shield,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    badge: '12'
  },
  {
    title: 'Kiểm duyệt sản phẩm',
    href: '/admin/products',
    icon: Package,
    badge: '5'
  },
  {
    title: 'Đơn hàng & Thanh toán',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: null
  },
  {
    title: 'Báo cáo & Thống kê',
    href: '/admin/reports',
    icon: BarChart3,
    badge: null
  },
  {
    title: 'Quản lý nội dung',
    href: '/admin/cms',
    icon: FileText,
    badge: null
  },
  {
    title: 'Hỗ trợ & Khiếu nại',
    href: '/admin/support',
    icon: MessageSquare,
    badge: '3'
  },
  {
    title: 'Cài đặt hệ thống',
    href: '/admin/settings',
    icon: Settings,
    badge: null
  },
  {
    title: 'Email & Thông báo',
    href: '/admin/notifications',
    icon: Mail,
    badge: null
  }
]

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation()

  return (
    <div className={cn(
      "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-80"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className={cn(
          "flex items-center gap-4 transition-opacity duration-300",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Chogiare Marketplace</p>
          </div>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? "Mở rộng sidebar" : "Thu nhỏ sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                "hover:bg-gray-100 group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "text-gray-700 hover:text-gray-900"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
              )} />
              
              <span className={cn(
                "flex-1 transition-opacity duration-300",
                isCollapsed ? "opacity-0" : "opacity-100"
              )}>
                {item.title}
              </span>
              
              {item.badge && !isCollapsed && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-200">
        <div className={cn(
          "flex items-center gap-4 transition-opacity duration-300",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}