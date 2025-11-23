import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/sonner'
import { NotificationProvider } from '@/components/notification-provider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { PerformanceOptimizer } from '@/components/seo/PerformanceOptimizer'

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const ChatPage = React.lazy(() => import('@/pages/ChatPage'))
const InventoryManagementPage = React.lazy(() => import('@/pages/InventoryManagementPage'))
const ShopProfileSettingsPage = React.lazy(() => import('@/pages/ShopProfileSettingsPage'))
const WithdrawBalancePage = React.lazy(() => import('@/pages/WithdrawBalancePage'))
const AdminPage = React.lazy(() => import('@/pages/admin/AdminPage'))
const SellerDashboard = React.lazy(() => import('@/pages/SellerDashboard'))
const SellerProductsPage = React.lazy(() => import('@/pages/SellerProductsPage'))
const AddProductPage = React.lazy(() => import('@/pages/AddProductPage'))
const EditProductPage = React.lazy(() => import('@/pages/EditProductPage'))
const StockInPage = React.lazy(() => import('@/pages/StockInPage'))
const ProductDetailSellerPage = React.lazy(() => import('@/pages/ProductDetailSellerPage'))
const InventoryReportPage = React.lazy(() => import('@/pages/InventoryReportPage'))
const StockManagementPage = React.lazy(() => import('@/pages/StockManagementPage'))
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'))
const AuthPage = React.lazy(() => import('@/pages/AuthPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const OrderDetailPage = React.lazy(() => import('@/pages/OrderDetailPage'))
const ShippingTrackingPage = React.lazy(() => import('@/pages/ShippingTrackingPage'))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'))

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <PerformanceOptimizer>
                <Router>
                  <div className="min-h-screen bg-background">
                    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                      <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/chat/:chatId" element={<ChatPage />} />
                      <Route path="/inventory" element={<InventoryManagementPage />} />
                      <Route path="/shop-settings" element={<ShopProfileSettingsPage />} />
                      <Route path="/withdraw" element={<WithdrawBalancePage />} />
                      <Route path="/admin/*" element={<AdminPage />} />
                      <Route path="/seller/:id" element={<SellerDashboard />} />
                      <Route path="/dashboard" element={<SellerDashboard />} />
                      <Route path="/seller/products" element={<SellerProductsPage />} />
                      <Route path="/seller/products/add" element={<AddProductPage />} />
                      <Route path="/seller/products/edit/:id" element={<EditProductPage />} />
                      <Route path="/seller/products/detail/:id" element={<ProductDetailSellerPage />} />
                      <Route path="/stock-in" element={<StockInPage />} />
                      <Route path="/stock-in/:productId" element={<StockInPage />} />
                      <Route path="/inventory/reports" element={<InventoryReportPage />} />
                      <Route path="/stock-management" element={<StockManagementPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/auth/*" element={<AuthPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                      <Route path="/shipping/:orderId" element={<ShippingTrackingPage />} />
                      <Route path="/shipping/track/:trackingNumber" element={<ShippingTrackingPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    </Suspense>
                    <Toaster />
                  </div>
                </Router>
            </PerformanceOptimizer>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App