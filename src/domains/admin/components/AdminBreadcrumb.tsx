import React from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeMap: Record<string, string> = {
  '/admin': 'Tổng quan',
  '/admin/users': 'Quản lý người dùng',
  '/admin/products': 'Kiểm duyệt sản phẩm',
  '/admin/orders': 'Đơn hàng & Thanh toán',
  '/admin/reports': 'Báo cáo & Thống kê',
  '/admin/cms': 'Quản lý nội dung',
  '/admin/support': 'Hỗ trợ & Khiếu nại',
  '/admin/settings': 'Cài đặt hệ thống',
  '/admin/notifications': 'Email & Thông báo',
}

// Dynamic route patterns
const getRouteLabel = (path: string, segment: string): string => {
  // Check if it matches /admin/users/:id pattern
  if (path.match(/^\/admin\/users\/[^/]+$/)) {
    return 'Chi tiết người dùng'
  }
  return routeMap[path] || segment
}

export function AdminBreadcrumb() {
  const location = useLocation()
  
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    return {
      label: getRouteLabel(path, segment),
      path: path,
      isLast: index === pathSegments.length - 1
    }
  })

  // Add home if not already present
  if (breadcrumbs.length === 0 || breadcrumbs[0].path !== '/admin') {
    breadcrumbs.unshift({
      label: 'Tổng quan',
      path: '/admin',
      isLast: breadcrumbs.length === 0
    })
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4">
      <ol className="flex items-center space-x-3 text-sm">
        <li>
          <a
            href="/admin"
            className="flex items-center text-gray-500 p-1 rounded-md hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
          </a>
        </li>
        
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.path} className="flex items-center space-x-3">
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <span 
              className={cn(
                breadcrumb.isLast
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100"
              )}
            >
              {breadcrumb.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
