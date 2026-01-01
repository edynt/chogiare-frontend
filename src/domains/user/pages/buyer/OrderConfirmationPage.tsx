import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import { useOrder } from '@/hooks/useOrders'
import type { Order as ApiOrder } from '@user/api/orders'
import { LoadingSpinner } from '@shared/components/ui/loading'
import { ErrorMessage } from '@shared/components/ui/error-boundary'
import { APP_NAME } from '@/constants/app.constants'
import { 
  CheckCircle2, 
  Package,
  AlertCircle,
  ExternalLink,
  Home,
  ArrowLeft
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')

  const orderQuery = useOrder(orderId || '')
  const order = orderQuery.data as ApiOrder | undefined
  const isLoading = orderQuery.isLoading
  const isError = orderQuery.isError
  const error = orderQuery.error as Error | null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorMessage
              error={error || new Error('Không tìm thấy đơn hàng')}
              onRetry={() => window.location.reload()}
              className="min-h-[400px]"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalAmount = order.total

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-4 py-8">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
              <p className="text-muted-foreground text-lg">
                Cảm ơn bạn đã đặt hàng tại Chogiare
              </p>
            </div>
            {order.id && (
              <div className="inline-block">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
                    <p className="text-2xl font-bold font-mono text-primary">{order.id}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Chi tiết đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatCurrency(item.subtotal)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.price)} / sản phẩm
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Không có sản phẩm trong đơn hàng
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="text-muted-foreground">Tự vận chuyển</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-lg">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Notice */}
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Lưu ý quan trọng:</strong> Bạn cần <strong>tự đến lấy hàng</strong> hoặc <strong>tự đặt dịch vụ vận chuyển</strong>. 
              Chúng tôi không cung cấp dịch vụ vận chuyển.
            </AlertDescription>
          </Alert>

          {/* Payment Notice */}
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Thanh toán:</strong> Bạn cần thỏa thuận phương thức thanh toán trực tiếp với người bán 
              (COD, chuyển khoản, ví điện tử...).
            </AlertDescription>
          </Alert>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                <div>
                  <p className="font-semibold">Đang chờ người bán xác nhận</p>
                  <p className="text-sm text-muted-foreground">
                    Đơn hàng của bạn đã được ghi nhận và đang chờ người bán xác nhận
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
            <Button
              onClick={() => navigate('/customer-orders')}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem đơn hàng của tôi
            </Button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

