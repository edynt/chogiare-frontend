import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProduct } from '@/hooks/useProducts'
import { useAddresses, useDefaultAddress } from '@/hooks/useAddresses'
import { useCreateOrder } from '@/hooks/useOrders'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Package, 
  ShoppingBag,
  Star,
  Verified,
  Truck,
  CreditCard,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'
import type { Address } from '@/types'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const productId = searchParams.get('productId')
  const quantity = parseInt(searchParams.get('quantity') || '1')

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId || '')
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses()
  const { data: defaultAddress } = useDefaultAddress()
  const createOrder = useCreateOrder()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?.id || null
  )
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const selectedAddress = addresses?.find(addr => addr.id === selectedAddressId) || defaultAddress

  const formatAddressString = (address: Address) => {
    const parts = [
      address.street,
      address.ward && `Phường/Xã ${address.ward}`,
      address.district && `Quận/Huyện ${address.district}`,
      address.city,
      address.state,
      address.zipCode && `Mã bưu điện: ${address.zipCode}`,
      address.country
    ].filter(Boolean)
    return parts.join(', ')
  }

  const handlePlaceOrder = async () => {
    if (!product) {
      toast.error('Không tìm thấy sản phẩm')
      return
    }

    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng')
      return
    }

    if (quantity < 1) {
      toast.error('Số lượng không hợp lệ')
      return
    }

    try {
      const order = await createOrder.mutateAsync({
        storeId: product.sellerId || product.store?.id || '',
        paymentMethod: 'bank_transfer',
        shippingAddress: formatAddressString(selectedAddress),
        billingAddress: formatAddressString(selectedAddress),
        items: [
          {
            productId: product.id,
            quantity,
          }
        ],
      })
      
      // Set order ID and show success dialog
      if (order?.id) {
        setOrderId(order.id)
        setShowSuccessDialog(true)
        toast.success('Đặt hàng thành công!')
      } else {
        toast.error('Đặt hàng thành công nhưng không nhận được mã đơn hàng')
        navigate('/customer-orders')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng')
    }
  }

  if (isLoadingProduct || isLoadingAddresses) {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalAmount = product.price * quantity

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Đặt hàng</h1>
              <p className="text-muted-foreground mt-1">Xác nhận thông tin đơn hàng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Notice */}
              <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Lưu ý:</strong> Chúng tôi không cung cấp dịch vụ vận chuyển. 
                  Bạn cần <strong>tự đến lấy hàng</strong> hoặc <strong>tự đặt dịch vụ vận chuyển</strong>.
                </AlertDescription>
              </Alert>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Thông tin người nhận
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/addresses')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Quản lý
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses && addresses.length > 0 ? (
                    <RadioGroup
                      value={selectedAddressId || ''}
                      onValueChange={setSelectedAddressId}
                    >
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <div key={address.id}>
                            <Label
                              htmlFor={address.id}
                              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedAddressId === address.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem
                                value={address.id}
                                id={address.id}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {address.isDefault && (
                                    <Badge className="bg-primary text-primary-foreground">
                                      <Star className="h-3 w-3 mr-1 fill-current" />
                                      Mặc định
                                    </Badge>
                                  )}
                                  <span className="font-semibold">
                                    {address.isDefault ? 'Địa chỉ mặc định' : 'Địa chỉ nhận hàng'}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">{address.recipientName}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{address.recipientPhone}</span>
                                  </div>
                                  <p className="font-medium mt-2">{address.street}</p>
                                  <p className="text-muted-foreground">
                                    {address.ward && `Phường/Xã ${address.ward}, `}
                                    {address.district && `Quận/Huyện ${address.district}, `}
                                    {address.city}, {address.state}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {address.zipCode && `Mã bưu điện: ${address.zipCode} - `}
                                    {address.country}
                                  </p>
                                </div>
                              </div>
                              {selectedAddressId === address.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa có địa chỉ nhận hàng
                      </p>
                      <Button onClick={() => navigate('/addresses')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa chỉ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Thông tin sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Số lượng: {quantity}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(product.price)} x {quantity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatCurrency(product.price * quantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span className="text-muted-foreground">Tự vận chuyển</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                        <strong>Lưu ý:</strong> Bạn cần tự đến lấy hàng hoặc tự đặt dịch vụ vận chuyển.
                      </AlertDescription>
                    </Alert>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Thanh toán khi nhận hàng</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      'Đang xử lý...'
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Đặt hàng
                      </>
                    )}
                  </Button>

                  {!selectedAddress && (
                    <p className="text-xs text-center text-destructive">
                      Vui lòng chọn địa chỉ giao hàng
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Đặt hàng thành công!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
            </DialogDescription>
          </DialogHeader>
          
          {orderId && (
            <div className="py-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
                <p className="text-lg font-semibold font-mono">{orderId}</p>
              </div>
            </div>
          )}

          <div className="space-y-3 py-4">
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sản phẩm:</span>
                <span className="font-medium">{product.title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Số lượng:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                <strong>Lưu ý:</strong> Bạn cần tự đến lấy hàng hoặc tự đặt dịch vụ vận chuyển.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                navigate('/')
              }}
              className="w-full sm:w-auto"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                navigate('/customer-orders')
              }}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

