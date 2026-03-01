import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { useForgotPassword } from '@/hooks/useAuth'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/schemas'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    setMessage(null) // Clear previous message
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setMessage({
          type: 'success',
          text: 'Email đã được gửi! Vui lòng kiểm tra email để đặt lại mật khẩu',
        })
      },
      onError: error => {
        setMessage({ type: 'error', text: error.message })
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
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending
              ? 'Đang gửi...'
              : 'Gửi email đặt lại mật khẩu'}
          </Button>

          {message && (
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                message.type === 'success'
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}
            >
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
