import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGoogleLogin } from '@react-oauth/google'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PasswordInput } from '@shared/components/ui/password-input'
import { Separator } from '@shared/components/ui/separator'
import { useLoading } from '@/hooks/useLoading'
import { Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@shared/api/axios'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { authApi } from '@shared/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

export function UserLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

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
      apiClient.clearRefreshFailureFlags()
      login(response.user)
      queryClient.setQueryData(['auth', 'profile', 'user'], response.user)
    })
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true)
      setErrorMessage(null)
      try {
        const response = await authApi.googleAuth(tokenResponse.access_token)
        apiClient.clearRefreshFailureFlags()
        login(response.user)
        queryClient.setQueryData(['auth', 'profile', 'user'], response.user)
        navigate(from, { replace: true })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Đăng nhập Google thất bại. Vui lòng thử lại.'
        setErrorMessage(message)
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: () => {
      setErrorMessage('Đăng nhập Google thất bại. Vui lòng thử lại.')
    },
  })

  const anyLoading = isLoading || isGoogleLoading

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Chào mừng trở lại!</CardTitle>
        <p className="text-sm text-muted-foreground">
          Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={anyLoading}
            onClick={() => googleLogin()}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Đăng nhập với Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">hoặc</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={anyLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

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
            <Link
              to="/auth/register"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
