import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks'
import { Loader2 } from 'lucide-react'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate()
  const { tokens } = useAuthStore()
  const { data: profile, isLoading, error } = useProfile()

  useEffect(() => {
    if (!tokens) {
      navigate('/admin-login', { replace: true })
      return
    }

    if (!isLoading && error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        navigate('/admin-login', { replace: true })
        return
      }
    }

    if (profile && !isLoading) {
      const userRoles = profile.roles || []
      const isAdmin = userRoles.includes('admin')
      
      if (!isAdmin) {
        navigate('/admin-login', { replace: true })
        return
      }
    }
  }, [tokens, profile, isLoading, error, navigate])

  if (!tokens) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 401) {
      return null
    }
  }

  if (profile) {
    const userRoles = profile.roles || []
    const isAdmin = userRoles.includes('admin')
    
    if (!isAdmin) {
      return null
    }

    return <>{children}</>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

