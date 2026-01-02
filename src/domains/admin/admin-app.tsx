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
 * - Dark loading indicator
 */
export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading...</p>
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
