import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import AdminDashboardPage from './AdminDashboardPage'
import UserManagementPage from './UserManagementPage'
import ProductModerationPage from './ProductModerationPage'
import OrderManagementPage from './OrderManagementPage'
import PackageManagementPage from './PackageManagementPage'
import ReportsAnalyticsPage from './ReportsAnalyticsPage'
import ContentManagementPage from './ContentManagementPage'
import SupportTicketsPage from './SupportTicketsPage'
import SystemSettingsPage from './SystemSettingsPage'
import NotificationManagementPage from './NotificationManagementPage'
import CustomerSupportPage from './CustomerSupportPage'

export default function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/products" element={<ProductModerationPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/subscriptions" element={<PackageManagementPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/cms" element={<ContentManagementPage />} />
                <Route path="/tickets" element={<SupportTicketsPage />} />
                <Route path="/support" element={<CustomerSupportPage />} />
                <Route path="/settings" element={<SystemSettingsPage />} />
                <Route path="/notifications" element={<NotificationManagementPage />} />
      </Routes>
    </AdminLayout>
  )
}
