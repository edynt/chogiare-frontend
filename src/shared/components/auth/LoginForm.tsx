import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PasswordInput } from '@shared/components/ui/password-input'
import { useLogin } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'
import { Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@shared/api/axios'
import { loginSchema, type LoginFormData } from '@/lib/schemas'

export function LoginForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const navigate = useNavigate()
  const loginMutation = useLogin(isAdmin)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const redirectPath = React.useRef(isAdmin ? '/admin' : '/')

  const { isLoading, execute } = useLoading({
    delay: 1000, // 1 second delay
    onSuccess: () => {
      setErrorMessage(null)
      // Redirect based on user role
      navigate(redirectPath.current)
    },
    onError: (error: Error) => {
      setErrorMessage(error.message)
    },
  })

  // ... (useForm hook remains the same)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null) // Clear previous error
    execute(async () => {
      await new Promise((resolve, reject) => {
        loginMutation.mutate(data, {
          onSuccess: (response) => {
            // Tokens are stored as HttpOnly cookies by the backend

            // Check for admin role
            if (response.user.roles && response.user.roles.includes('admin')) {
              redirectPath.current = '/admin'
            } else {
              redirectPath.current = '/'
            }

            resolve(undefined)
          },
          onError: (error: unknown) => {
              reject(error)
          },
        })
      })
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isAdmin ? 'Đăng nhập Admin' : 'Đăng nhập'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1"
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <PasswordInput
              id="password"
              {...register('password')}
              className="mt-1"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || loginMutation.isPending}
          >
            {isLoading || loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {!isAdmin && (
            <div className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/auth/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
