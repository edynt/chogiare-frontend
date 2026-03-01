import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminBreadcrumb } from './AdminBreadcrumb'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children?: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  if (!isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'ml-20' : 'ml-80'
        )}
      >
        {/* Header */}
        <AdminHeader />

        {/* Breadcrumb */}
        <AdminBreadcrumb />

        {/* Page Content */}
        <main className="p-8">{children || <Outlet />}</main>
      </div>
    </div>
  )
}
