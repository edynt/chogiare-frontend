import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import {
  CreditCard,
  Copy,
  CheckCircle,
  Info,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { walletApi } from '@user/api/wallet'
import type { SepayQrData } from '@user/api/wallet'
import { queryKeys } from '@/constants/queryKeys'

// Poll interval for checking transaction status (5 seconds)
const POLL_INTERVAL = 5000
// Stop polling after 30 minutes
const POLL_TIMEOUT = 30 * 60 * 1000

export default function PaymentQRPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isPolling, setIsPolling] = useState(true)
  const [isTimedOut, setIsTimedOut] = useState(false)

  const amount = parseFloat(searchParams.get('amount') || '0')
  const transactionId = searchParams.get('transactionId') || ''

  // Get SePay data from navigation state (passed from TopUpPage)
  const sepayData = (location.state as { sepay?: SepayQrData })?.sepay

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  // Poll transaction status to detect webhook confirmation
  const pollStatus = useCallback(async () => {
    if (!transactionId || isConfirmed) return

    try {
      const transaction = await walletApi.getTransaction(Number(transactionId))
      if (transaction.status === 'completed') {
        setIsConfirmed(true)
        setIsPolling(false)
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
        queryClient.invalidateQueries({
          queryKey: queryKeys.wallet.transactions(),
        })
        toast.success('Nạp tiền thành công! Giao dịch đã được xác nhận.')
      }
    } catch {
      // Silently ignore poll errors
    }
  }, [transactionId, isConfirmed, queryClient])

  useEffect(() => {
    if (!isPolling || isConfirmed) return

    const interval = setInterval(pollStatus, POLL_INTERVAL)

    // Stop polling after timeout
    const timeout = setTimeout(() => {
      setIsPolling(false)
      setIsTimedOut(true)
    }, POLL_TIMEOUT)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isPolling, isConfirmed, pollStatus])

  const copyToClipboard = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`Đã sao chép ${label}`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const CopyButton = ({
    text,
    field,
    label,
  }: {
    text: string
    field: string
    label: string
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field, label)}
    >
      {copiedField === field ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )

  // Success state
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-700">
                  Nạp tiền thành công!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Số tiền {formatPrice(amount)} đã được cộng vào ví của bạn.
                </p>
                <Button onClick={() => navigate('/top-up')} className="mt-4">
                  Quay lại ví
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/top-up')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          {/* Amount Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Số tiền cần thanh toán
              </p>
              <p className="text-4xl font-bold text-primary">
                {formatPrice(amount)}
              </p>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Quét mã QR để thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-primary/30">
                <div className="text-center">
                  {sepayData?.qrUrl ? (
                    <img
                      src={sepayData.qrUrl}
                      alt="QR thanh toán SePay"
                      className="w-64 h-64 rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Mã giao dịch: {transactionId}
                  </p>
                </div>
              </div>

              {/* Waiting indicator */}
              {isTimedOut ? (
                <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <Info className="h-4 w-4" />
                  <span>
                    Hết thời gian chờ. Nếu bạn đã chuyển khoản, vui lòng liên hệ
                    hỗ trợ với mã giao dịch {transactionId}.
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Đang chờ xác nhận thanh toán... Hệ thống sẽ tự động cập nhật
                    khi nhận được tiền.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin chuyển khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân hàng</p>
                    <p className="font-medium">
                      {sepayData?.bankInfo.bankName || 'Đang tải...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Số tài khoản
                    </p>
                    <p className="font-medium font-mono">
                      {sepayData?.bankInfo.accountNumber || 'Đang tải...'}
                    </p>
                  </div>
                  {sepayData?.bankInfo.accountNumber && (
                    <CopyButton
                      text={sepayData.bankInfo.accountNumber}
                      field="account"
                      label="số tài khoản"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Chủ tài khoản
                    </p>
                    <p className="font-medium">
                      {sepayData?.bankInfo.accountName || 'Đang tải...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Nội dung chuyển khoản
                    </p>
                    <p className="font-bold font-mono text-primary text-lg">
                      {sepayData?.transferContent || `CGA${transactionId}`}
                    </p>
                  </div>
                  <CopyButton
                    text={sepayData?.transferContent || `CGA${transactionId}`}
                    field="content"
                    label="nội dung chuyển khoản"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Số tiền</p>
                    <p className="font-bold text-lg">{formatPrice(amount)}</p>
                  </div>
                  <CopyButton
                    text={Math.round(amount).toString()}
                    field="amount"
                    label="số tiền"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-900">
                    Hướng dẫn thanh toán
                  </h3>
                  <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                    <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                    <li>Quét mã QR ở trên - thông tin sẽ được điền tự động</li>
                    <li>
                      Hoặc chuyển khoản thủ công với nội dung:{' '}
                      <span className="font-mono font-semibold">
                        {sepayData?.transferContent || `CGA${transactionId}`}
                      </span>
                    </li>
                    <li>
                      Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong
                      vài giây
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/top-up')}
            className="w-full"
          >
            Quay lại ví
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
