import React, { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResetPassword } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/schemas'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function ResetPasswordForm() {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPasswordMutation = useResetPassword()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password')

  useEffect(() => {
    if (!token) {
      notify({
        type: 'error',
        title: 'Token không hợp lệ',
        message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      })
      navigate('/auth/forgot-password')
    }
  }, [token, navigate, notify])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      notify({
        type: 'error',
        title: 'Token không hợp lệ',
        message: 'Vui lòng yêu cầu đặt lại mật khẩu mới',
      })
      navigate('/auth/forgot-password')
      return
    }

    resetPasswordMutation.mutate({ token, password: data.password }, {
      onSuccess: () => {
        notify({
          type: 'success',
          title: 'Đặt lại mật khẩu thành công',
          message: 'Bạn có thể đăng nhập với mật khẩu mới',
        })
        setTimeout(() => {
          navigate('/auth/login')
        }, 2000)
      },
      onError: (error) => {
        notify({
          type: 'error',
          title: 'Đặt lại mật khẩu thất bại',
          message: error.message || 'Token không hợp lệ hoặc đã hết hạn',
        })
      },
    })
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Yêu cầu đặt lại mật khẩu
            </Link>
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
