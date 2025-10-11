import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Lock,
  Truck,
  RefreshCw,
  Zap
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function PaymentPage() {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Mock cart data
  const cartItems = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      price: 25000000,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80',
      seller: 'Nguyễn Văn A'
    },
    {
      id: '2',
      name: 'MacBook Pro M2 13 inch',
      price: 35000000,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80',
      seller: 'Trần Thị B'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 50000
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: Smartphone,
      description: 'Thanh toán qua ví điện tử MoMo'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: Smartphone,
      description: 'Thanh toán qua ZaloPay'
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: CreditCard,
      description: 'Chuyển khoản trực tiếp'
    }
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsCompleted(true)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Thanh toán thành công!</h1>
            <p className="text-muted-foreground mb-6">
              Cảm ơn bạn đã mua sắm tại Chogiare. Đơn hàng của bạn đã được xác nhận.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">
                Tiếp tục mua sắm
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')} className="w-full">
                Xem đơn hàng của tôi
              </Button>
            </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Thanh toán</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Hoàn tất đơn hàng của bạn một cách an toàn và nhanh chóng
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-success" />
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                <span>Thanh toán nhanh</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-info" />
                <span>Nhiều phương thức</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentMethod === 'credit-card' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin thẻ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="card-number">Số thẻ</Label>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="123"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="card-name">Tên chủ thẻ</Label>
                      <Input 
                        id="card-name" 
                        placeholder="NGUYEN VAN A"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">Họ</Label>
                      <Input id="first-name" placeholder="Nguyễn" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Tên</Label>
                      <Input id="last-name" placeholder="Văn A" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" placeholder="123 Đường ABC, Quận 1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Thành phố</Label>
                      <Input id="city" placeholder="TP.HCM" />
                    </div>
                    <div>
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input id="district" placeholder="Quận 1" />
                    </div>
                    <div>
                      <Label htmlFor="postal">Mã bưu điện</Label>
                      <Input id="postal" placeholder="700000" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="0901234567" />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-primary underline">
                          Điều khoản sử dụng
                        </a>{' '}
                        và{' '}
                        <a href="#" className="text-primary underline">
                          Chính sách bảo mật
                        </a>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Người bán: {item.seller}</p>
                          <p className="text-xs text-muted-foreground">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tổng cộng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế (10%):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Bảo mật SSL</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Lock className="h-4 w-4" />
                      <span>Mã hóa 256-bit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Button */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Thanh toán {formatPrice(total)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
