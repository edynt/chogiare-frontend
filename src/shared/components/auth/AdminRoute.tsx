import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user: storeUser } = useAuthStore()
  const location = useLocation()

  // Use profile query to validate admin auth (handles httpOnly cookie-based auth)
  const { data: profile, isLoading, error } = useProfile()

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Use profile from query (cookie-based auth) or store (localStorage auth)
  const user = profile || storeUser

  // If auth error or no user, redirect to admin login
  if (error || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user has admin role
  const isAdmin = user.roles && user.roles.includes('admin')

  if (!isAdmin) {
    // If regular user tries to access admin routes, redirect to home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
