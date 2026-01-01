import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@shared/components/ui/sonner'
import { NotificationProvider } from '@shared/components/notification-provider'
import { AuthProvider } from '@shared/components/auth/AuthProvider'
import { AdminRoute } from '@shared/components/auth/AdminRoute'
import { PerformanceOptimizer } from '@shared/components/seo/PerformanceOptimizer'

// Lazy load pages - Admin Domain
const AdminPage = React.lazy(() => import('@admin/pages/AdminPage'))

// Lazy load pages - User Domain (Buyer)
const HomePage = React.lazy(() => import('@user/pages/buyer/HomePage'))
const ChatPage = React.lazy(() => import('@user/pages/buyer/ChatPage'))
const TopUpPage = React.lazy(() => import('@user/pages/buyer/TopUpPage'))
const PaymentQRPage = React.lazy(() => import('@user/pages/buyer/PaymentQRPage'))
const NotificationsPage = React.lazy(() => import('@user/pages/buyer/NotificationsPage'))
const VerifyEmailPage = React.lazy(() => import('@user/pages/buyer/VerifyEmailPage'))
const ProfilePage = React.lazy(() => import('@user/pages/buyer/ProfilePage'))
const OrdersPage = React.lazy(() => import('@user/pages/buyer/OrdersPage'))
const OrderDetailPage = React.lazy(() => import('@user/pages/buyer/OrderDetailPage'))
const PromotedProductDetailPage = React.lazy(() => import('@user/pages/buyer/PromotedProductDetailPage'))
const BuyerDashboardPage = React.lazy(() => import('@user/pages/buyer/BuyerDashboardPage'))
const SellerDetailPage = React.lazy(() => import('@user/pages/buyer/SellerDetailPage'))
const ProductDetailPage = React.lazy(() => import('@user/pages/buyer/ProductDetailPage'))
const ProductListPage = React.lazy(() => import('@user/pages/buyer/ProductListPage'))
const CheckoutPage = React.lazy(() => import('@user/pages/buyer/CheckoutPage'))
const OrderConfirmationPage = React.lazy(() => import('@user/pages/buyer/OrderConfirmationPage'))
const CartPage = React.lazy(() => import('@user/pages/buyer/CartPage'))
const AddressManagementPage = React.lazy(() => import('@user/pages/buyer/AddressManagementPage'))

// Lazy load pages - User Domain (Seller)
const SellerNotificationsPage = React.lazy(() => import('@user/pages/seller/SellerNotificationsPage'))
const BoostPostPage = React.lazy(() => import('@user/pages/seller/BoostPostPage'))
const SellerDashboard = React.lazy(() => import('@user/pages/seller/SellerDashboard'))
const SellerProductsPage = React.lazy(() => import('@user/pages/seller/SellerProductsPage'))
const AddProductPage = React.lazy(() => import('@user/pages/seller/AddProductPage'))
const EditProductPage = React.lazy(() => import('@user/pages/seller/EditProductPage'))
const ImportProductsPage = React.lazy(() => import('@user/pages/seller/ImportProductsPage'))
const CustomerManagementPage = React.lazy(() => import('@user/pages/seller/CustomerManagementPage'))
const CustomerOrdersPage = React.lazy(() => import('@user/pages/seller/CustomerOrdersPage'))
const RevenueReportsPage = React.lazy(() => import('@user/pages/seller/RevenueReportsPage'))
const SellerSupportPage = React.lazy(() => import('@user/pages/seller/SellerSupportPage'))

// Lazy load pages - Shared
const AuthPage = React.lazy(() => import('@shared/pages/AuthPage'))
const NotFoundPage = React.lazy(() => import('@shared/pages/NotFoundPage'))

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
      <NotificationProvider>
        <Router>
          <AuthProvider>
            <PerformanceOptimizer>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/chat/:chatId" element={<ChatPage />} />
                    <Route path="/seller/notifications" element={<SellerNotificationsPage />} />
                    <Route path="/top-up" element={<TopUpPage />} />
                    <Route path="/payment-qr" element={<PaymentQRPage />} />
                    <Route path="/boost-post" element={<BoostPostPage />} />
                    <Route path="/admin/login" element={<AuthPage />} />
                    <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    <Route path="/seller/:id" element={<SellerDashboard />} />
                    <Route path="/dashboard" element={<SellerDashboard />} />
                    <Route path="/seller/products" element={<SellerProductsPage />} />
                    <Route path="/seller/products/add" element={<AddProductPage />} />
                    <Route path="/seller/products/import" element={<ImportProductsPage />} />
                    <Route path="/seller/products/edit/:id" element={<EditProductPage />} />
                    <Route path="/seller/products/detail/:id" element={<ProductDetailPage />} />
                    <Route path="/seller/customers" element={<CustomerManagementPage />} />
                    <Route path="/seller/revenue" element={<RevenueReportsPage />} />
                    <Route path="/seller/support" element={<SellerSupportPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/customer-orders" element={<CustomerOrdersPage />} />
                    <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
                    <Route path="/auth/*" element={<AuthPage />} />
                    <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/promoted-products/:productId" element={<PromotedProductDetailPage />} />
                    <Route path="/shop/:id" element={<SellerDetailPage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/addresses" element={<AddressManagementPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </PerformanceOptimizer>
          </AuthProvider>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App