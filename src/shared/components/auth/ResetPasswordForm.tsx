import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { useResetPassword, useVerifyResetToken } from '@/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/schemas'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPasswordMutation = useResetPassword()
  const verifyTokenMutation = useVerifyResetToken()
  const token = searchParams.get('token')
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password')

  // Verify token on mount
  useEffect(() => {
    if (token && verifyTokenMutation.isIdle) {
      verifyTokenMutation.mutate(token)
    }
  }, [token, verifyTokenMutation])

  // Determine states from mutation
  const isVerifying = verifyTokenMutation.isPending
  const isTokenValid = verifyTokenMutation.isSuccess && verifyTokenMutation.data?.valid === true
  const hasVerificationError = verifyTokenMutation.isError || (verifyTokenMutation.isSuccess && !verifyTokenMutation.data?.valid)

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token || !isTokenValid) {
      return
    }

    setMessage(null) // Clear previous message
    resetPasswordMutation.mutate({ token, password: data.password }, {
      onSuccess: () => {
        setIsSuccess(true)
        setMessage({ type: 'success', text: 'Đặt lại mật khẩu thành công! Đang chuyển hướng...' })
        setTimeout(() => {
          navigate('/auth/login')
        }, 2500)
      },
      onError: (error: Error) => {
        setMessage({ type: 'error', text: error.message })
      },
    })
  }

  if (isVerifying) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Đang kiểm tra liên kết...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!token || hasVerificationError) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập hoặc yêu cầu liên kết mới.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center space-y-2">
            <Link
              to="/auth/login"
              className="text-sm text-primary hover:underline block"
            >
              Đăng nhập
            </Link>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:underline block"
            >
              Yêu cầu đặt lại mật khẩu
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Đặt lại mật khẩu thành công</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Bạn có thể đăng nhập với mật khẩu mới
            </p>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-2">Đang chuyển hướng...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu mới
            </label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1"
              placeholder="Nhập mật khẩu mới"
            />
            {password && (
              <PasswordStrengthIndicator password={password} className="mt-2" />
            )}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu mới
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="mt-1"
              placeholder="Nhập lại mật khẩu mới"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </Button>

          {message && (
            <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              message.type === 'success'
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
