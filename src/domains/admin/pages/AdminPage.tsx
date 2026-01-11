import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@admin/components/AdminLayout'
import AdminDashboardPage from './AdminDashboardPage'
import UserManagementPage from './UserManagementPage'
import ProductModerationPage from './ProductModerationPage'
import OrderManagementPage from './OrderManagementPage'
import ReportsAnalyticsPage from './ReportsAnalyticsPage'
import ContentManagementPage from './ContentManagementPage'
import CustomerSupportPage from './CustomerSupportPage'
import SystemSettingsPage from './SystemSettingsPage'
import NotificationManagementPage from './NotificationManagementPage'
import CreateNotificationPage from './CreateNotificationPage'
import CategoryManagementPage from './CategoryManagementPage'
import CategoryProductsPage from './CategoryProductsPage'
import UserDetailPage from './UserDetailPage'
import PackagesManagementPage from './PackagesManagementPage'

export default function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/products" element={<ProductModerationPage />} />
        <Route path="/products/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/subscriptions" element={<PackagesManagementPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/cms" element={<ContentManagementPage />} />
        <Route path="/support" element={<CustomerSupportPage />} />
        <Route path="/notifications" element={<NotificationManagementPage />} />
        <Route
          path="/notifications/create"
          element={<CreateNotificationPage />}
        />
        <Route path="/settings" element={<SystemSettingsPage />} />
      </Routes>
    </AdminLayout>
  )
}
