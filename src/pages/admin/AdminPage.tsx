import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard'
import AdminDashboardPage from './AdminDashboardPage'
import UserManagementPage from './UserManagementPage'
import ProductModerationPage from './ProductModerationPage'
import OrderManagementPage from './OrderManagementPage'
import PackageManagementPage from './PackageManagementPage'
import ReportsAnalyticsPage from './ReportsAnalyticsPage'
import ContentManagementPage from './ContentManagementPage'
import CustomerSupportPage from './CustomerSupportPage'
import SystemSettingsPage from './SystemSettingsPage'
import NotificationManagementPage from './NotificationManagementPage'
import AdminJobsPage from './AdminJobsPage'

export default function AdminPage() {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/admin-login" replace />} />
      <Route
        path="/*"
        element={
          <AdminAuthGuard>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/products" element={<ProductModerationPage />} />
                <Route path="/orders" element={<OrderManagementPage />} />
                <Route path="/subscriptions" element={<PackageManagementPage />} />
                <Route path="/reports" element={<ReportsAnalyticsPage />} />
                <Route path="/cms" element={<ContentManagementPage />} />
                <Route path="/support" element={<CustomerSupportPage />} />
                <Route path="/notifications" element={<NotificationManagementPage />} />
                <Route path="/settings" element={<SystemSettingsPage />} />
                <Route path="/jobs" element={<AdminJobsPage />} />
              </Routes>
            </AdminLayout>
          </AdminAuthGuard>
        }
      />
    </Routes>
  )
}
