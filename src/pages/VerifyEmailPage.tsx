import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useVerifyEmail, useResendVerification } from '@/hooks/useAuth'
import { useNotification } from '@/components/notification-provider'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import { apiClient } from '@/api/axios'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { notify } = useNotification()
  const verifyMutation = useVerifyEmail()
  const resendMutation = useResendVerification()
  
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      navigate('/auth/register')
    }
  }, [email, navigate])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
      setOtp(newOtp)
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length !== 6) {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ 6 số OTP',
      })
      return
    }

    verifyMutation.mutate(code, {
      onSuccess: (response) => {
        apiClient.setAuthTokens(response.tokens)
        notify({
          type: 'success',
          title: 'Xác minh thành công',
          message: 'Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng...',
        })
        setTimeout(() => {
          navigate('/')
        }, 1500)
      },
      onError: (error: Error) => {
        notify({
          type: 'error',
          title: 'Xác minh thất bại',
          message: error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn',
        })
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      },
    })
  }

  const handleResend = async () => {
    if (!email) return

    setIsResending(true)
    try {
      await resendMutation.mutateAsync(email)
      notify({
        type: 'success',
        title: 'Đã gửi lại mã OTP',
        message: 'Vui lòng kiểm tra email của bạn',
      })
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error) {
      notify({
        type: 'error',
        title: 'Gửi lại mã thất bại',
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Xác minh email</CardTitle>
            <CardDescription className="mt-2">
              Chúng tôi đã gửi mã OTP 6 số đến email <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhập mã OTP</label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={otp.join('').length !== 6 || verifyMutation.isPending}
              className="w-full"
              size="lg"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác minh...
                </>
              ) : (
                'Xác minh'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Không nhận được mã?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isResending || resendMutation.isPending}
                className="w-full"
              >
                {isResending || resendMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : (
                  'Gửi lại mã OTP'
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/auth/register')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng ký
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

