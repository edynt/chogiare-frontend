import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PasswordInput } from '@shared/components/ui/password-input'
import { useLoading } from '@/hooks/useLoading'
import { Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@shared/api/axios'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

/**
 * User Login Form Component
 * Bright, friendly marketplace-themed login for regular users
 * Features:
 * - Welcoming design with marketplace branding
 * - Email and password authentication
 * - Links to registration and password recovery
 * - Social login options (future)
 * - Redirect to home or intended page on success
 */
export function UserLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Get the page user was trying to access before login
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

  const { isLoading, execute } = useLoading({
    delay: 1000,
    onSuccess: () => {
      setErrorMessage(null)
      navigate(from, { replace: true })
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
      const response = await authApi.login(data)

      // Tokens are stored as HttpOnly cookies by the backend
      // We only store user info in the store
      login(response.user)
      queryClient.setQueryData(['auth', 'profile', 'user'], response.user)
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Chào mừng trở lại!</CardTitle>
        <p className="text-sm text-muted-foreground">
          Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="user-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="user-email"
              type="email"
              {...register('email')}
              className="mt-1"
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="user-password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <PasswordInput
              id="user-password"
              {...register('password')}
              className="mt-1"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="text-primary hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
