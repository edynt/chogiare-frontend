import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegister } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import { Loader2, CheckCircle } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/lib/schemas'
import type { UserRole } from '@/types'

export function RegisterForm() {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [isRegistered, setIsRegistered] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data
    const finalData = { ...registerData, roles: ['buyer'] as UserRole[] }
    registerMutation.mutate(finalData, {
      onSuccess: () => {
        setIsRegistered(true)
        notify({
          type: 'success',
          title: 'Đăng ký thành công',
          message: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
        })
      },
      onError: (error) => {
        notify({
          type: 'error',
          title: 'Đăng ký thất bại',
          message: error.message,
        })
      },
    })
  }

  // Show success message after registration
  if (isRegistered) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Đăng ký thành công!</h3>
              <p className="text-muted-foreground mt-2">
                Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/auth/login')} 
              className="w-full"
            >
              Đi đến trang đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Họ và tên
            </label>
            <Input
              id="name"
              {...register('name')}
              className="mt-1"
              placeholder="Nhập họ và tên"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại (tùy chọn)
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="mt-1"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="mt-1"
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          <div className="text-center text-sm">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="text-primary hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
