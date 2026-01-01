import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  FileText,
  MessageSquare,
  Shield,
  Mail,
  ChevronLeft,
  Menu,
  Crown,
  FolderTree,
} from 'lucide-react'
import {
  useAdminUserStats,
  useModerationStats,
  useTicketStats,
} from '@/hooks/useAdmin'

interface MenuItem {
  title: string
  href: string
  icon: React.ElementType
  badgeKey?: 'pendingUsers' | 'pendingProducts' | 'openTickets'
}

const menuItems: MenuItem[] = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
    badgeKey: 'pendingUsers',
  },
  {
    title: 'Kiểm duyệt sản phẩm',
    href: '/admin/products',
    icon: Package,
    badgeKey: 'pendingProducts',
  },
  {
    title: 'Quản lý danh mục',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Đơn hàng & Thanh toán',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Gói dịch vụ',
    href: '/admin/subscriptions',
    icon: Crown,
  },
  {
    title: 'Quản lý nội dung',
    href: '/admin/cms',
    icon: FileText,
  },
  {
    title: 'Hỗ trợ & Khiếu nại',
    href: '/admin/support',
    icon: MessageSquare,
    badgeKey: 'openTickets',
  },
  {
    title: 'Email & Thông báo',
    href: '/admin/notifications',
    icon: Mail,
  },
  {
    title: 'Cài đặt hệ thống',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation()

  // Fetch badge counts from API
  const { data: userStats } = useAdminUserStats()
  const { data: moderationStats } = useModerationStats()
  const { data: ticketStats } = useTicketStats()

  // Build badge counts object
  const badgeCounts: Record<string, number> = {
    pendingUsers: userStats?.pending ?? 0,
    pendingProducts: moderationStats?.pending ?? 0,
    openTickets: (ticketStats?.open ?? 0) + (ticketStats?.inProgress ?? 0),
  }

  const getBadgeValue = (badgeKey?: string): string | null => {
    if (!badgeKey) return null
    const count = badgeCounts[badgeKey]
    if (count > 0) return count > 99 ? '99+' : String(count)
    return null
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-80'
      )}
    >
      {/* Logo / Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center justify-between p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors',
          isCollapsed && 'justify-center'
        )}
        title={isCollapsed ? 'Mở rộng sidebar' : 'Thu nhỏ sidebar'}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Chợ Giá Rẻ | Marketplace</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </>
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map(item => {
          // Check if current path matches the menu item (exact match or starts with)
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/admin' && location.pathname.startsWith(item.href))
          const Icon = item.icon
          const badge = getBadgeValue(item.badgeKey)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-gray-100 group relative',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:text-gray-900',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 group-hover:text-gray-700'
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>

                  {badge && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      {badge}
                    </span>
                  )}
                </>
              )}

              {/* Badge indicator when collapsed */}
              {isCollapsed && badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}

              {/* Active indicator when collapsed */}
              {isCollapsed && isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
