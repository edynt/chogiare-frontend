import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from '@admin/components/auth/admin-auth-provider'
import { AdminRouteGuard } from '@admin/components/auth/admin-route-guard'
import AdminAuthPage from '@admin/pages/admin-auth-page'

// Lazy load admin page
const AdminPage = React.lazy(() => import('@admin/pages/AdminPage'))

/**
 * Admin Application Wrapper
 * Handles all /admin/* routes with admin-specific authentication
 * Features:
 * - Admin auth provider wrapping all routes
 * - Separate admin login page at /admin/login
 * - Protected admin dashboard and sub-routes
 * - White blur loading overlay
 */
export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Admin login route - unprotected */}
          <Route path="/login" element={<AdminAuthPage />} />

          {/* All other admin routes - protected */}
          <Route
            path="/*"
            element={
              <AdminRouteGuard>
                <AdminPage />
              </AdminRouteGuard>
            }
          />
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  )
}
