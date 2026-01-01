import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { useRegister } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/lib/schemas'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { RegisterData } from '@/types'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')

  const onSubmit = (data: RegisterFormData) => {
    setMessage(null) // Clear previous message
    const { confirmPassword: _confirmPassword, ...registerData } = data
    const finalData: RegisterData = {
      fullName: registerData.name,
      email: registerData.email,
      password: registerData.password,
    }
    registerMutation.mutate(finalData, {
      onSuccess: (response) => {
        setMessage({ type: 'success', text: 'Đăng ký thành công! Mã OTP đã được gửi đến email của bạn' })
        setTimeout(() => {
          navigate('/auth/verify-email', { state: { email: response.email } })
        }, 1500)
      },
      onError: error => {
        setMessage({ type: 'error', text: error.message })
      },
    })
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
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
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
            {password && (
              <PasswordStrengthIndicator password={password} className="mt-2" />
            )}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
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
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
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
