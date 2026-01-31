import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@shared/components/ui/radio-group'
import { Label } from '@shared/components/ui/label'
import { Separator } from '@shared/components/ui/separator'
import { useProduct } from '@/hooks/useProducts'
import { useAddresses, useDefaultAddress } from '@/hooks/useAddresses'
import { useCreateOrder } from '@/hooks/useOrders'
import { useCartStore } from '@/stores/cartStore'
import { LoadingSpinner } from '@shared/components/ui/loading'
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
  Store,
  Shield,
  Sparkles,
  Lock,
} from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@shared/components/ui/alert'
import { formatCurrency, PLACEHOLDER_IMAGE } from '@/lib/utils'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const productId = searchParams.get('productId')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const {
    items: cartItems,
    totalValue: cartTotalValue,
    clearCart,
  } = useCartStore()

  const { data: product, isLoading: isLoadingProduct } = useProduct(
    productId || ''
  )
  // Fetch first product from cart to get storeId
  const firstCartProductId =
    !productId && cartItems.length > 0 ? cartItems[0].productId : null
  const { data: firstCartProduct } = useProduct(firstCartProductId || '')
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses()
  const { data: defaultAddress } = useDefaultAddress()
  const createOrder = useCreateOrder()

  // Determine if we're checking out from cart or single product
  const isFromCart = !productId && cartItems.length > 0
  const orderItems = isFromCart
    ? cartItems.map(item => ({
        productId:
          typeof item.productId === 'string'
            ? parseInt(item.productId, 10)
            : item.productId,
        quantity: item.quantity,
      }))
    : product
      ? [
          {
            productId:
              typeof product.id === 'string'
                ? parseInt(product.id, 10)
                : product.id,
            quantity,
          },
        ]
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

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Auto-select address when addresses are loaded
  useEffect(() => {
    if (!selectedAddressId && addresses && addresses.length > 0) {
      // Priority: default address > first address
      const addressToSelect = defaultAddress?.id || addresses[0]?.id
      if (addressToSelect) {
        setSelectedAddressId(addressToSelect)
      }
    }
  }, [addresses, defaultAddress, selectedAddressId])

  const selectedAddress =
    addresses?.find(addr => addr.id === selectedAddressId) || defaultAddress

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
    let storeId: number | null = null
    if (isFromCart && firstCartProduct) {
      // Use storeId directly, not sellerId (sellerId is user ID, not store ID)
      const storeIdValue =
        firstCartProduct.storeId || firstCartProduct.store?.id
      storeId = storeIdValue
        ? typeof storeIdValue === 'string'
          ? parseInt(storeIdValue, 10)
          : storeIdValue
        : null
    } else if (product) {
      // Use storeId directly, not sellerId (sellerId is user ID, not store ID)
      const storeIdValue = product.storeId || product.store?.id
      storeId = storeIdValue
        ? typeof storeIdValue === 'string'
          ? parseInt(storeIdValue, 10)
          : storeIdValue
        : null
    }

    if (!storeId || isNaN(storeId)) {
      toast.error('Không tìm thấy thông tin người bán')
      return
    }

    const addressId = parseInt(selectedAddress.id, 10)
    if (isNaN(addressId)) {
      toast.error('Địa chỉ không hợp lệ')
      return
    }

    try {
      const orderData = {
        storeId,
        shippingAddressId: addressId,
        billingAddressId: addressId,
        items: orderItems.map(item => ({
          productId:
            typeof item.productId === 'string'
              ? parseInt(item.productId, 10)
              : item.productId,
          quantity: item.quantity,
        })),
      }

      const order = await createOrder.mutateAsync(orderData)

      // Clear cart if order was from cart
      if (isFromCart) {
        clearCart()
      }

      // Navigate to order confirmation page
      if (order?.id && order?.orderNo) {
        toast.success('Đặt hàng thành công!')
        navigate(`/order-confirmation?orderId=${order.id}&orderNo=${order.orderNo}`)
      } else if (order?.id) {
        toast.success('Đặt hàng thành công!')
        navigate(`/order-confirmation?orderId=${order.id}`)
      } else {
        toast.error('Đặt hàng thành công nhưng không nhận được mã đơn hàng')
        navigate('/customer-orders')
      }
    } catch {
      toast.error('Có lỗi xảy ra khi đặt hàng')
    }
  }

  if (
    (productId && isLoadingProduct) ||
    (isFromCart && !firstCartProduct && firstCartProductId) ||
    isLoadingAddresses
  ) {
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
            <p className="text-muted-foreground mb-4">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng
            </p>
            <Button onClick={() => navigate('/cart')}>Xem giỏ hàng</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalAmount = isFromCart
    ? cartTotalValue
    : product
      ? product.price * quantity
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header with gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Xác nhận đặt hàng
                  </h1>
                </div>
                <p className="text-muted-foreground ml-14">
                  Kiểm tra và xác nhận thông tin đơn hàng của bạn
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Notice */}
              <Alert className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-300 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-800 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <AlertDescription className="text-amber-900 dark:text-amber-100 font-medium">
                    <strong className="text-amber-700 dark:text-amber-300">
                      Lưu ý quan trọng:
                    </strong>{' '}
                    Chúng tôi không cung cấp dịch vụ vận chuyển. Bạn cần{' '}
                    <strong>tự đến lấy hàng</strong> hoặc{' '}
                    <strong>tự đặt dịch vụ vận chuyển</strong>.
                  </AlertDescription>
                </div>
              </Alert>

              {/* Buyer Warning - Protect Seller */}
              <Alert className="border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold mb-1">
                  ⚠️ Lưu ý quan trọng cho người mua
                </AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
                  <p className="font-medium">
                    Vui lòng chỉ đặt hàng khi bạn thực sự có nhu cầu mua sản
                    phẩm.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Không spam tin nhắn hoặc đặt hàng giả để tội người bán
                    </li>
                    <li>Hãy tôn trọng thời gian và công sức của người bán</li>
                    <li>
                      Đặt hàng nghiêm túc giúp tạo môi trường mua bán lành mạnh
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Shipping Address */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      Thông tin người nhận
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/addresses')}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Quản lý
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {addresses && addresses.length > 0 ? (
                    <RadioGroup
                      value={selectedAddressId || ''}
                      onValueChange={setSelectedAddressId}
                    >
                      <div className="space-y-4">
                        {addresses.map(address => (
                          <div key={address.id}>
                            <Label
                              htmlFor={address.id}
                              className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedAddressId === address.id
                                  ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg scale-[1.02]'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md'
                              }`}
                            >
                              <RadioGroupItem
                                value={address.id}
                                id={address.id}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  {address.isDefault && (
                                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md">
                                      <Star className="h-3 w-3 mr-1 fill-current" />
                                      Mặc định
                                    </Badge>
                                  )}
                                  <span className="font-bold text-base">
                                    {address.isDefault
                                      ? 'Địa chỉ mặc định'
                                      : 'Địa chỉ nhận hàng'}
                                  </span>
                                </div>
                                <div className="space-y-2.5 text-sm">
                                  <div className="flex items-center gap-2.5 p-2 bg-muted/50 rounded-lg">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">
                                      {address.recipientName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2.5 p-2 bg-muted/50 rounded-lg">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span className="font-medium">
                                      {address.recipientPhone}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-muted/50 rounded-lg">
                                    <p className="font-semibold mb-1">
                                      {address.street}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {address.ward &&
                                        `Phường/Xã ${address.ward}, `}
                                      {address.district &&
                                        `Quận/Huyện ${address.district}, `}
                                      {address.city}, {address.state}
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                      {address.zipCode &&
                                        `Mã bưu điện: ${address.zipCode} - `}
                                      {address.country}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {selectedAddressId === address.id && (
                                <div className="flex-shrink-0">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                  </div>
                                </div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 bg-muted/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-6 font-medium">
                        Bạn chưa có địa chỉ nhận hàng
                      </p>
                      <Button
                        onClick={() => navigate('/addresses')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa chỉ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    {isFromCart
                      ? `Thông tin sản phẩm (${cartItems.length})`
                      : 'Thông tin sản phẩm'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isFromCart ? (
                    <div className="space-y-6">
                      {Object.entries(groupedCartItems).map(
                        ([sellerKey, sellerItems]) => {
                          const firstItem = sellerItems[0]
                          const sellerName =
                            firstItem.sellerName ||
                            firstItem.storeName ||
                            'Nhà cung cấp'
                          const groupTotal = sellerItems.reduce(
                            (sum, item) =>
                              sum + item.productPrice * item.quantity,
                            0
                          )
                          const groupQuantity = sellerItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )

                          return (
                            <div key={sellerKey} className="space-y-3">
                              {/* Seller Header */}
                              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                  <Store className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-bold text-base">
                                  {sellerName}
                                </span>
                                <Verified className="h-4 w-4 text-primary" />
                                <Badge
                                  variant="outline"
                                  className="bg-primary/5 border-primary/20"
                                >
                                  {groupQuantity} sản phẩm
                                </Badge>
                                <span className="text-sm text-primary ml-auto font-bold">
                                  {formatCurrency(groupTotal)}
                                </span>
                              </div>
                              {/* Products in this group */}
                              <div className="space-y-3 pl-4">
                                {sellerItems.map(item => (
                                  <div
                                    key={item.id}
                                    className="flex gap-4 p-4 border-2 rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-muted/30"
                                  >
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-20 h-20 object-cover rounded-lg border-2 border-border shadow-sm"
                                    />
                                    <div className="flex-1">
                                      <h3 className="font-bold text-base mb-2">
                                        {item.productName}
                                      </h3>
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                          Số lượng:{' '}
                                          <span className="font-semibold text-foreground">
                                            {item.quantity}
                                          </span>
                                        </p>
                                        <p className="text-base font-bold text-primary">
                                          {formatCurrency(item.productPrice)} ×{' '}
                                          {item.quantity} ={' '}
                                          {formatCurrency(
                                            item.productPrice * item.quantity
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  ) : product ? (
                    <div className="flex gap-6 p-4 border-2 rounded-xl bg-muted/30 hover:border-primary/50 hover:shadow-md transition-all">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : PLACEHOLDER_IMAGE
                        }
                        alt={product.title}
                        className="w-28 h-28 object-cover rounded-xl border-2 border-border shadow-lg"
                        onError={e => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE
                        }}
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-lg mb-2">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Số lượng:{' '}
                          <span className="font-semibold text-foreground">
                            {quantity}
                          </span>
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(product.price)} × {quantity} ={' '}
                          {formatCurrency(product.price * quantity)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-2 shadow-2xl bg-gradient-to-b from-card to-card/95">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        Tạm tính{' '}
                        {isFromCart
                          ? `(${cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)`
                          : ''}
                      </span>
                      <span className="font-bold text-base">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Phí vận chuyển
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        Tự vận chuyển
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                      <span className="font-bold text-lg">Tổng cộng</span>
                      <span className="text-2xl font-extrabold text-primary">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {/* Buyer Warning - Protect Seller */}
                    <Alert className="border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs space-y-1">
                        <p className="font-semibold mb-1">
                          ⚠️ Chỉ đặt hàng khi thực sự cần
                        </p>
                        <p className="text-xs">
                          Không spam hoặc đặt hàng giả. Hãy tôn trọng người bán.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <Alert className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-300 dark:from-blue-950/30 dark:to-blue-900/20 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <AlertDescription className="text-blue-900 dark:text-blue-100 text-xs font-medium">
                          <strong>Lưu ý:</strong> Bạn cần tự đến lấy hàng hoặc
                          tự đặt dịch vụ vận chuyển.
                        </AlertDescription>
                      </div>
                    </Alert>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Thỏa thuận thanh toán trực tiếp với người bán
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Bảo mật thông tin đơn hàng
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 text-base font-bold py-6"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={
                      !selectedAddress ||
                      createOrder.isPending ||
                      orderItems.length === 0
                    }
                  >
                    {createOrder.isPending ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Xác nhận đặt hàng{' '}
                        {isFromCart ? `(${cartItems.length} sản phẩm)` : ''}
                      </>
                    )}
                  </Button>

                  {!selectedAddress && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-xs text-center text-destructive font-medium flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Vui lòng chọn địa chỉ giao hàng
                      </p>
                    </div>
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
