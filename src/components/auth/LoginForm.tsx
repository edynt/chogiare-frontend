import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import { Loader2 } from 'lucide-react'

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
})

type FormData = yup.InferType<typeof schema>

export function LoginForm() {
  const { notify } = useNotification()
  const loginMutation = useLogin()
  const { isLoading, execute } = useLoading({
    delay: 1000, // 1 second delay
    onSuccess: () => {
      notify({
        type: 'success',
        title: 'Đăng nhập thành công',
        message: 'Chào mừng bạn đến với Chogiare!',
      })
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
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    execute(async () => {
      await new Promise((resolve, reject) => {
        loginMutation.mutate(data, {
          onSuccess: () => resolve(undefined),
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
