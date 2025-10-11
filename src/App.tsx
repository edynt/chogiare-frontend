import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from '@/components/ui/toaster'
import { NotificationProvider } from '@/components/notification-provider'

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const ProductListPage = React.lazy(() => import('@/pages/ProductListPage'))
const ProductPage = React.lazy(() => import('@/pages/ProductPage'))
const CategoriesPage = React.lazy(() => import('@/pages/CategoriesPage'))
const CartPage = React.lazy(() => import('@/pages/CartPage'))
const ChatPage = React.lazy(() => import('@/pages/ChatPage'))
const PaymentPage = React.lazy(() => import('@/pages/PaymentPage'))
const PromotionPage = React.lazy(() => import('@/pages/PromotionPage'))
const AboutPage = React.lazy(() => import('@/pages/AboutPage'))
const ContactPage = React.lazy(() => import('@/pages/ContactPage'))
const FAQPage = React.lazy(() => import('@/pages/FAQPage'))
const ShipmentPage = React.lazy(() => import('@/pages/ShipmentPage'))
const InventoryManagementPage = React.lazy(() => import('@/pages/InventoryManagementPage'))
const ShopProfileSettingsPage = React.lazy(() => import('@/pages/ShopProfileSettingsPage'))
const WithdrawBalancePage = React.lazy(() => import('@/pages/WithdrawBalancePage'))
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'))
const SellerDashboard = React.lazy(() => import('@/pages/SellerDashboard'))
const SellerProductsPage = React.lazy(() => import('@/pages/SellerProductsPage'))
const AddProductPage = React.lazy(() => import('@/pages/AddProductPage'))
const EditProductPage = React.lazy(() => import('@/pages/EditProductPage'))
const AuthPage = React.lazy(() => import('@/pages/AuthPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
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
  useEffect(() => {
    // Initialize MSW in development
    if (import.meta.env.DEV) {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start()
      })
    }
  }, [])

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <Router>
                <div className="min-h-screen bg-background">
                          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/products" element={<ProductListPage />} />
                              <Route path="/product/:id" element={<ProductPage />} />
                              <Route path="/categories" element={<CategoriesPage />} />
                              <Route path="/cart" element={<CartPage />} />
                              <Route path="/chat" element={<ChatPage />} />
                              <Route path="/chat/:chatId" element={<ChatPage />} />
                              <Route path="/payment" element={<PaymentPage />} />
                              <Route path="/promotions" element={<PromotionPage />} />
                              <Route path="/about" element={<AboutPage />} />
                              <Route path="/contact" element={<ContactPage />} />
                              <Route path="/faq" element={<FAQPage />} />
                              <Route path="/shipment" element={<ShipmentPage />} />
                              <Route path="/shipment/:shipmentId" element={<ShipmentPage />} />
                              <Route path="/inventory" element={<InventoryManagementPage />} />
                              <Route path="/shop-settings" element={<ShopProfileSettingsPage />} />
                              <Route path="/withdraw" element={<WithdrawBalancePage />} />
                              <Route path="/admin" element={<AdminDashboard />} />
                              <Route path="/seller/:id" element={<SellerDashboard />} />
                              <Route path="/dashboard" element={<SellerDashboard />} />
                              <Route path="/seller/products" element={<SellerProductsPage />} />
                              <Route path="/seller/products/add" element={<AddProductPage />} />
                              <Route path="/seller/products/edit/:id" element={<EditProductPage />} />
                              <Route path="/auth/*" element={<AuthPage />} />
                              <Route path="/profile" element={<ProfilePage />} />
                              <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                          </Suspense>
                  <Toaster />
                </div>
              </Router>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App