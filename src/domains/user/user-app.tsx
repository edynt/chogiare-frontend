import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserAuthProvider } from '@user/components/auth/user-auth-provider'
import UserAuthPage from '@user/pages/user-auth-page'
import { ChatBubble } from '@shared/components/chat/ChatBubble'
import { ChatPopup } from '@shared/components/chat/ChatPopup'

// Lazy load pages - User Domain (Buyer)
const HomePage = React.lazy(() => import('@user/pages/buyer/HomePage'))
const ChatPage = React.lazy(() => import('@user/pages/buyer/ChatPage'))
const TopUpPage = React.lazy(() => import('@user/pages/buyer/TopUpPage'))
const PaymentQRPage = React.lazy(
  () => import('@user/pages/buyer/PaymentQRPage')
)
const NotificationsPage = React.lazy(
  () => import('@user/pages/buyer/NotificationsPage')
)
const VerifyEmailPage = React.lazy(
  () => import('@user/pages/buyer/VerifyEmailPage')
)
const ProfilePage = React.lazy(() => import('@user/pages/buyer/ProfilePage'))
const OrdersPage = React.lazy(() => import('@user/pages/buyer/OrdersPage'))
const OrderDetailPage = React.lazy(
  () => import('@user/pages/buyer/OrderDetailPage')
)
const BuyerDashboardPage = React.lazy(
  () => import('@user/pages/buyer/BuyerDashboardPage')
)
const SellerDetailPage = React.lazy(
  () => import('@user/pages/buyer/SellerDetailPage')
)
const ProductDetailPage = React.lazy(
  () => import('@user/pages/buyer/ProductDetailPage')
)
const ProductListPage = React.lazy(
  () => import('@user/pages/buyer/ProductListPage')
)
const CheckoutPage = React.lazy(() => import('@user/pages/buyer/CheckoutPage'))
const OrderConfirmationPage = React.lazy(
  () => import('@user/pages/buyer/OrderConfirmationPage')
)
const CartPage = React.lazy(() => import('@user/pages/buyer/CartPage'))
const AddressManagementPage = React.lazy(
  () => import('@user/pages/buyer/AddressManagementPage')
)

// Lazy load pages - User Domain (Seller)
const SellerNotificationsPage = React.lazy(
  () => import('@user/pages/seller/SellerNotificationsPage')
)
const SellerDashboard = React.lazy(
  () => import('@user/pages/seller/SellerDashboard')
)
const SellerProductsPage = React.lazy(
  () => import('@user/pages/seller/SellerProductsPage')
)
const AddProductPage = React.lazy(
  () => import('@user/pages/seller/AddProductPage')
)
const EditProductPage = React.lazy(
  () => import('@user/pages/seller/EditProductPage')
)
const ImportProductsPage = React.lazy(
  () => import('@user/pages/seller/ImportProductsPage')
)
const CustomerManagementPage = React.lazy(
  () => import('@user/pages/seller/CustomerManagementPage')
)
const CustomerOrdersPage = React.lazy(
  () => import('@user/pages/seller/CustomerOrdersPage')
)
const SellerCustomerOrdersPage = React.lazy(
  () => import('@user/pages/seller/SellerCustomerOrdersPage')
)
const RevenueReportsPage = React.lazy(
  () => import('@user/pages/seller/RevenueReportsPage')
)
const SellerSupportPage = React.lazy(
  () => import('@user/pages/seller/SellerSupportPage')
)
const SellerOrdersPage = React.lazy(
  () => import('@user/pages/seller/SellerOrdersPage')
)

// Shared pages
const NotFoundPage = React.lazy(() => import('@shared/pages/NotFoundPage'))

/**
 * User Application Wrapper
 * Handles all non-admin routes with user-specific authentication
 * Features:
 * - User auth provider wrapping all routes
 * - Auth pages at /auth/*
 * - All marketplace routes (buyer and seller)
 * - Bright loading indicator
 */
export function UserApp() {
  return (
    <UserAuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Auth routes */}
          <Route path="/auth/*" element={<UserAuthPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

          {/* Public buyer routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/shop/:id" element={<SellerDetailPage />} />

          {/* Seller routes - Available to all authenticated users */}
          <Route
            path="/seller/notifications"
            element={<SellerNotificationsPage />}
          />
          <Route path="/seller/:id" element={<SellerDashboard />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/add" element={<AddProductPage />} />
          <Route
            path="/seller/products/import"
            element={<ImportProductsPage />}
          />
          <Route
            path="/seller/products/edit/:id"
            element={<EditProductPage />}
          />
          <Route
            path="/seller/products/detail/:id"
            element={<ProductDetailPage />}
          />
          <Route
            path="/seller/customers"
            element={<CustomerManagementPage />}
          />
          <Route
            path="/seller/customers/:customerId/orders"
            element={<SellerCustomerOrdersPage />}
          />
          <Route path="/seller/revenue" element={<RevenueReportsPage />} />
          <Route path="/seller/support" element={<SellerSupportPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />

          {/* Buyer/User routes - Requires authentication */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/top-up" element={<TopUpPage />} />
          <Route path="/payment-qr" element={<PaymentQRPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customer-orders" element={<CustomerOrdersPage />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/addresses" element={<AddressManagementPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Chat Components */}
        <ChatBubble />
        <ChatPopup />
      </Suspense>
    </UserAuthProvider>
  )
}
