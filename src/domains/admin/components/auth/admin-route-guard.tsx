import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useAdminProfile } from '@admin/hooks/use-admin-auth'
import { Loader2 } from 'lucide-react'
import { type User, ROLE_IDS } from '@/types'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

/**
 * Admin Route Guard
 * Protects admin routes from unauthorized access
 * Features:
 * - Uses admin-specific profile hook (no conditionals)
 * - Validates admin role via roleIds (1=admin)
 * - Redirects to /admin/login if unauthorized
 * - Cookie-based authentication support
 */
export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user: storeUser } = useAuthStore()
  const location = useLocation()

  // Use admin profile query (handles cookie-based auth)
  const { data: profile, isLoading, error } = useAdminProfile()

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Use profile from query (cookie-based) or store (token-based)
  const user: User | null = (profile as User) || storeUser

  // If auth error or no user, redirect to admin login
  if (error || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user has admin role via roleIds (1=admin) or legacy roles array
  const isAdmin =
    user?.roleIds?.includes(ROLE_IDS.ADMIN) || user?.roles?.includes('admin')

  if (!isAdmin) {
    // If regular user tries to access admin routes, redirect to home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
