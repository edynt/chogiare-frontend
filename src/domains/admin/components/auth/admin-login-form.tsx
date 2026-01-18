import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PasswordInput } from '@shared/components/ui/password-input'
import { useLoading } from '@/hooks/useLoading'
import { Loader2, AlertCircle, ShieldCheck, Mail, Lock } from 'lucide-react'
import { apiClient } from '@shared/api/axios'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Admin Login Form Component
 * Professional dark-themed login form specifically for administrators
 * Features:
 * - Dark slate theme with blue accents
 * - Security-focused design with shield iconography
 * - Email and password authentication only
 * - Direct redirect to /admin dashboard on success
 * - No registration or password recovery links (admins are provisioned)
 */
export function AdminLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { isLoading, execute } = useLoading({
    delay: 1000,
    onSuccess: () => {
      setErrorMessage(null)
      navigate('/admin')
    },
    onError: (error: Error) => {
      setErrorMessage(error.message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null)
    execute(async () => {
      const response = await authApi.adminLogin(data)

      // Tokens are stored as HttpOnly cookies by the backend
      // We only store user info in the store
      login(response.user)
      queryClient.setQueryData(['auth', 'profile', 'admin'], response.user)
    })
  }

  return (
    <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-blue-600/20 rounded-full">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-center text-slate-100">
          Administrator Access
        </CardTitle>
        <p className="text-center text-sm text-slate-400">
          Secure system login
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"
            >
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <Input
              id="admin-email"
              type="email"
              {...register('email')}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"
            >
              <Lock className="h-4 w-4" />
              Password
            </label>
            <PasswordInput
              id="admin-password"
              {...register('password')}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-400 mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-600 bg-red-950/50 p-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-700">
            Access restricted to authorized personnel
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
