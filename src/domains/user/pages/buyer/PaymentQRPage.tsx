import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { APP_NAME } from '@/constants/app.constants'
import { 
  CreditCard,
  Copy,
  CheckCircle,
  Info,
  ArrowLeft,
  QrCode
} from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentQRPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  
  const amount = parseFloat(searchParams.get('amount') || '0')
  const transactionId = searchParams.get('transactionId') || `TXN${Date.now()}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const bankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'CONG TY TNHH CHO GIA RE',
    branch: 'Chi nhánh Hà Nội'
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(`Đã sao chép ${label}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateQRData = () => {
    // Generate QR data with payment information
    return `970422|${bankInfo.accountNumber}|${amount.toFixed(0)}|${transactionId}|Nạp tiền ${APP_NAME}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          {/* Amount Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Số tiền cần thanh toán</p>
              <p className="text-4xl font-bold text-primary">
                {formatPrice(amount)}
              </p>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Quét mã QR để thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-primary/30">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Mã QR sẽ được hiển thị ở đây
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mã giao dịch: {transactionId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân hàng</p>
                    <p className="font-medium">{bankInfo.bankName}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Số tài khoản</p>
                    <p className="font-medium">{bankInfo.accountNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bankInfo.accountNumber, 'số tài khoản')}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
                    <p className="font-medium">{bankInfo.accountHolder}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
                    <p className="font-medium font-mono">{transactionId}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transactionId, 'nội dung chuyển khoản')}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  const fullInfo = `${bankInfo.bankName}\nSố TK: ${bankInfo.accountNumber}\nChủ TK: ${bankInfo.accountHolder}\nNội dung: ${transactionId}`
                  copyToClipboard(fullInfo, 'thông tin tài khoản')
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Sao chép toàn bộ thông tin
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-900">Hướng dẫn thanh toán</h3>
                  <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                    <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                    <li>Quét mã QR hoặc chuyển khoản theo thông tin trên</li>
                    <li>Nhập đúng nội dung chuyển khoản: <span className="font-mono font-semibold">{transactionId}</span></li>
                    <li>Sau khi chuyển khoản thành công, tiền sẽ được cộng vào tài khoản trong vòng 5-10 phút</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/top-up')}
              className="flex-1"
            >
              Quay lại
            </Button>
            <Button
              onClick={() => navigate('/top-up')}
              className="flex-1"
            >
              Đã thanh toán
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

