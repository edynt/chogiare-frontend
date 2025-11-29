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
import { useProduct } from '@/hooks/useProducts'
import { useAddresses, useDefaultAddress } from '@/hooks/useAddresses'
import { useCreateOrder } from '@/hooks/useOrders'
import { useCartStore } from '@/stores/cartStore'
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
  Store
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'
import type { Address } from '@/types'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const productId = searchParams.get('productId')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const { items: cartItems, totalValue: cartTotalValue, clearCart } = useCartStore()

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId || '')
  // Fetch first product from cart to get storeId
  const firstCartProductId = !productId && cartItems.length > 0 ? cartItems[0].productId : null
  const { data: firstCartProduct } = useProduct(firstCartProductId || '')
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses()
  const { data: defaultAddress } = useDefaultAddress()
  const createOrder = useCreateOrder()

  // Determine if we're checking out from cart or single product
  const isFromCart = !productId && cartItems.length > 0
  const orderItems = isFromCart 
    ? cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
    : product 
      ? [{ productId: product.id, quantity }]
      : []

  // Group cart items by seller/store
  const groupedCartItems = React.useMemo(() => {
    if (!isFromCart) return {}
    const groups: Record<string, typeof cartItems> = {}
    cartItems.forEach(item => {
      const key = item.sellerId || item.storeId || 'unknown'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    return groups
  }, [cartItems, isFromCart])

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?.id || null
  )
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false)

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
    if (orderItems.length === 0) {
      toast.error('Không có sản phẩm để đặt hàng')
      return
    }

    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng')
      return
    }

    // Get storeId from first product (assuming all items are from same store)
    let storeId = ''
    if (isFromCart && firstCartProduct) {
      // For cart, get storeId from the first product
      // Note: In a real app, you might want to validate all items are from the same store
      storeId = firstCartProduct.sellerId || firstCartProduct.store?.id || ''
    } else if (product) {
      storeId = product.sellerId || product.store?.id || ''
    }

    if (!storeId) {
      toast.error('Không tìm thấy thông tin người bán')
      return
    }

    try {
      const order = await createOrder.mutateAsync({
        storeId,
        paymentMethod: 'bank_transfer',
        shippingAddress: formatAddressString(selectedAddress),
        billingAddress: formatAddressString(selectedAddress),
        items: orderItems,
      })
      
      // Clear cart if order was from cart
      if (isFromCart) {
        clearCart()
      }
      
      // Navigate to order confirmation page
      if (order?.id) {
        toast.success('Đặt hàng thành công!')
        navigate(`/order-confirmation?orderId=${order.id}`)
      } else {
        toast.error('Đặt hàng thành công nhưng không nhận được mã đơn hàng')
        navigate('/customer-orders')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng')
    }
  }

  if ((productId && isLoadingProduct) || (isFromCart && !firstCartProduct && firstCartProductId) || isLoadingAddresses) {
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

  if (productId && !product) {
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

  if (!isFromCart && !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-4">Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng</p>
            <Button onClick={() => navigate('/cart')}>Xem giỏ hàng</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalAmount = isFromCart ? cartTotalValue : (product ? product.price * quantity : 0)

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
              <h1 className="text-3xl font-bold">Xác nhận đặt hàng</h1>
              <p className="text-muted-foreground mt-1">Kiểm tra và xác nhận thông tin đơn hàng của bạn</p>
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
                    {isFromCart ? `Thông tin sản phẩm (${cartItems.length})` : 'Thông tin sản phẩm'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isFromCart ? (
                    <div className="space-y-4">
                      {Object.entries(groupedCartItems).map(([sellerKey, sellerItems]) => {
                        const firstItem = sellerItems[0]
                        const sellerName = firstItem.sellerName || firstItem.storeName || 'Nhà cung cấp'
                        const groupTotal = sellerItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0)
                        const groupQuantity = sellerItems.reduce((sum, item) => sum + item.quantity, 0)

                        return (
                          <div key={sellerKey} className="space-y-2">
                            {/* Seller Header */}
                            <div className="flex items-center gap-2 pb-2 border-b">
                              <Store className="h-4 w-4 text-primary" />
                              <span className="font-bold text-sm">{sellerName}</span>
                              <Verified className="h-3 w-3 text-primary" />
                              <Badge variant="outline" className="text-xs">
                                {groupQuantity} sản phẩm
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-auto font-semibold">
                                {formatCurrency(groupTotal)}
                              </span>
                            </div>
                            {/* Products in this group */}
                            <div className="space-y-2 pl-6">
                              {sellerItems.map((item) => (
                                <div key={item.id} className="flex gap-3 p-2 border rounded-lg">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-sm mb-1">{item.productName}</h3>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Số lượng: {item.quantity}
                                    </p>
                                    <p className="text-sm font-bold text-primary">
                                      {formatCurrency(item.productPrice)} × {item.quantity} = {formatCurrency(item.productPrice * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : product ? (
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
                  ) : null}
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
                      <span className="text-muted-foreground">
                        Tạm tính {isFromCart ? `(${cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)` : ''}
                      </span>
                      <span>{formatCurrency(totalAmount)}</span>
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
                      <span>Thỏa thuận thanh toán trực tiếp với người bán</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || createOrder.isPending || orderItems.length === 0}
                  >
                    {createOrder.isPending ? (
                      'Đang xử lý...'
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Xác nhận đặt hàng {isFromCart ? `(${cartItems.length} sản phẩm)` : ''}
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
    </div>
  )
}

