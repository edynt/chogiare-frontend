import { Navigate } from 'react-router-dom'
import { AdminLoginForm } from '@admin/components/auth/admin-login-form'
import { SEOHead } from '@shared/components/seo/SEOHead'
import { APP_NAME } from '@/constants/app.constants'
import { useAuthStore } from '@/stores/authStore'
import { Shield } from 'lucide-react'

/**
 * Admin Authentication Page
 * Full-page dark-themed login interface for system administrators
 * Features:
 * - Professional dark slate background
 * - Centered login card with security branding
 * - Automatic redirect if already authenticated as admin
 * - Minimalist design focused on security
 */
export default function AdminAuthPage() {
  const { isAuthenticated, user } = useAuthStore()

  // Redirect authenticated admin to dashboard
  if (isAuthenticated && user?.roles?.includes('admin')) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <SEOHead
        title="Admin Login"
        description={`Administrator access portal for ${APP_NAME}`}
        keywords="admin, administrator, login, secure access"
      />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        {/* Header with Shield Icon */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-slate-800 border-2 border-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield className="w-9 h-9 text-blue-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2 animate-in fade-in duration-1000 delay-200">
            {APP_NAME}
          </h1>
          <p className="text-slate-400 text-sm animate-in fade-in duration-1000 delay-300">
            System Administration Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
          <AdminLoginForm />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 animate-in fade-in duration-1000 delay-500">
          <p>Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  )
}
