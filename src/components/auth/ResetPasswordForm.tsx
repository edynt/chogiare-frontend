import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResetPassword } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'

const schema = yup.object({
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp').required('Xác nhận mật khẩu là bắt buộc'),
})

type FormData = yup.InferType<typeof schema>

export function ResetPasswordForm() {
  const { notify } = useNotification()
  const resetPasswordMutation = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // In a real app, you'd get the token from URL params
    const token = 'mock-reset-token'
    resetPasswordMutation.mutate({ token, password: data.password }, {
      onSuccess: () => {
        notify({
          type: 'success',
          title: 'Đặt lại mật khẩu thành công',
          message: 'Bạn có thể đăng nhập với mật khẩu mới',
        })
      },
      onError: (error) => {
        notify({
          type: 'error',
          title: 'Đặt lại mật khẩu thất bại',
          message: error.message,
        })
      },
    })
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
