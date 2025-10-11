import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
})

type FormData = yup.InferType<typeof schema>

export function ForgotPasswordForm() {
  const { notify } = useNotification()
  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        notify({
          type: 'success',
          title: 'Email đã được gửi',
          message: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
        })
      },
      onError: (error) => {
        notify({
          type: 'error',
          title: 'Gửi email thất bại',
          message: error.message,
        })
      },
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
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

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
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
