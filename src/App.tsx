import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { NotificationProvider } from '@/components/notification-provider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { PerformanceOptimizer } from '@/components/seo/PerformanceOptimizer'

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const ChatPage = React.lazy(() => import('@/pages/ChatPage'))
const SellerNotificationsPage = React.lazy(() => import('@/pages/SellerNotificationsPage'))
const TopUpPage = React.lazy(() => import('@/pages/TopUpPage'))
const PaymentQRPage = React.lazy(() => import('@/pages/PaymentQRPage'))
const BoostPostPage = React.lazy(() => import('@/pages/BoostPostPage'))
const AdminPage = React.lazy(() => import('@/pages/admin/AdminPage'))
const SellerDashboard = React.lazy(() => import('@/pages/SellerDashboard'))
const SellerProductsPage = React.lazy(() => import('@/pages/SellerProductsPage'))
const AddProductPage = React.lazy(() => import('@/pages/AddProductPage'))
const EditProductPage = React.lazy(() => import('@/pages/EditProductPage'))
const ImportProductsPage = React.lazy(() => import('@/pages/ImportProductsPage'))
const CustomerManagementPage = React.lazy(() => import('@/pages/CustomerManagementPage'))
const RevenueReportsPage = React.lazy(() => import('@/pages/RevenueReportsPage'))
const SellerSupportPage = React.lazy(() => import('@/pages/SellerSupportPage'))
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'))
const AuthPage = React.lazy(() => import('@/pages/AuthPage'))
const VerifyEmailPage = React.lazy(() => import('@/pages/VerifyEmailPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const OrdersPage = React.lazy(() => import('@/pages/OrdersPage'))
const OrderDetailPage = React.lazy(() => import('@/pages/OrderDetailPage'))
const ShippingTrackingPage = React.lazy(() => import('@/pages/ShippingTrackingPage'))
const PromotedProductDetailPage = React.lazy(() => import('@/pages/PromotedProductDetailPage'))
const BuyerDashboardPage = React.lazy(() => import('@/pages/BuyerDashboardPage'))
const CustomerOrdersPage = React.lazy(() => import('@/pages/CustomerOrdersPage'))
const SellerDetailPage = React.lazy(() => import('@/pages/SellerDetailPage'))
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'))
const ProductListPage = React.lazy(() => import('@/pages/ProductListPage'))
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = React.lazy(() => import('@/pages/OrderConfirmationPage'))
const CartPage = React.lazy(() => import('@/pages/CartPage'))
const AddressManagementPage = React.lazy(() => import('@/pages/AddressManagementPage'))
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
                    <Route path="/seller/notifications" element={<SellerNotificationsPage />} />
                    <Route path="/top-up" element={<TopUpPage />} />
                    <Route path="/payment-qr" element={<PaymentQRPage />} />
                    <Route path="/boost-post" element={<BoostPostPage />} />
                    <Route path="/admin/*" element={<AdminPage />} />
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
                    <Route path="/shipping/:orderId" element={<ShippingTrackingPage />} />
                    <Route path="/shipping/track/:trackingNumber" element={<ShippingTrackingPage />} />
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
              </Router>
          </PerformanceOptimizer>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App