import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { type UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    // If trying to access admin routes, redirect to admin login
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    // Otherwise redirect to user login
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Check role requirement
  if (requiredRole) {
    const hasRole = user.roles && user.roles.includes(requiredRole as UserRole)
    if (!hasRole) {
      // If user tries to access admin, redirect to home
      if (requiredRole === 'admin') {
        return <Navigate to="/" replace />
      }
      return <Navigate to={redirectTo || '/'} replace />
    }
  }

  return <>{children}</>
}
