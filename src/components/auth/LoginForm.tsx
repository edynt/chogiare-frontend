import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import { Loader2 } from 'lucide-react'
import { apiClient } from '@/api/axios'
import { loginSchema, type LoginFormData } from '@/lib/schemas'

export function LoginForm() {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const { isLoading, execute } = useLoading({
    delay: 1000, // 1 second delay
    onSuccess: () => {
      // Redirect to home page after successful login without notification
      navigate('/')
    },
    onError: (error: Error) => {
      notify({
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: error.message,
      })
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
    execute(async () => {
      await new Promise((resolve, reject) => {
        loginMutation.mutate(data, {
          onSuccess: (response) => {
            // Store tokens in localStorage
            apiClient.setAuthTokens(response.tokens)
            resolve(undefined)
          },
          onError: (error: Error) => reject(error),
        })
      })
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
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

          <div className="text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
