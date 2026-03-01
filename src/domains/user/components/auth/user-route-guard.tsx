import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { type UserRole } from '@/types'

interface UserRouteGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

/**
 * User Route Guard
 * Protects user routes from unauthorized access
 * Features:
 * - Token-based authentication validation
 * - Optional role requirement checking
 * - Redirects to /auth/login if unauthorized
 * - No admin-specific logic
 */
export function UserRouteGuard({
  children,
  requiredRole,
  redirectTo = '/',
}: UserRouteGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Check role requirement if specified
  if (requiredRole) {
    const hasRole = user.roles && user.roles.includes(requiredRole)
    if (!hasRole) {
      return <Navigate to={redirectTo} replace />
    }
  }

  return <>{children}</>
}
