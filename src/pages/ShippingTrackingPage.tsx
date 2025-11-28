import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShippingTracking } from '@/components/shipping/ShippingTracking'
import { useShippingTracking } from '@/hooks/useShipping'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { ArrowLeft, Search, Package, MapPin, Clock, RefreshCw } from 'lucide-react'

export default function ShippingTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [activeTab, setActiveTab] = useState('tracking')

  const { data: shippingInfo, isLoading, error, refetch } = useShippingTracking(orderId || '')

  const handleRetry = () => {
    refetch()
  }

  const handleTrackByNumber = () => {
    if (trackingNumber.trim()) {
      navigate(`/shipping/track/${trackingNumber.trim()}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Đang tải thông tin vận chuyển...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ErrorMessage
              error={error}
              onRetry={handleRetry}
              className="min-h-[400px]"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!shippingInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin vận chuyển</h2>
                <p className="text-muted-foreground mb-6">
                  Đơn hàng bạn đang tìm kiếm không tồn tại hoặc chưa được gửi đi.
                </p>
                <Button onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold">Theo dõi vận chuyển</h1>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>

          {/* Quick tracking by number */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Theo dõi bằng mã vận đơn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã vận đơn..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackByNumber()}
                />
                <Button onClick={handleTrackByNumber} disabled={!trackingNumber.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Theo dõi
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracking">Theo dõi vận chuyển</TabsTrigger>
              <TabsTrigger value="details">Chi tiết đơn hàng</TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <ShippingTracking shippingInfo={shippingInfo} />
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Thông tin đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                        <p className="font-medium">{shippingInfo.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mã vận đơn</p>
                        <p className="font-medium">{shippingInfo.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nhà vận chuyển</p>
                        <p className="font-medium">{shippingInfo.carrier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                        <Badge className="bg-blue-100 text-blue-800">
                          {shippingInfo.status === 'in_transit' ? 'Đang vận chuyển' : shippingInfo.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{shippingInfo.deliveryAddress.recipient}</p>
                      <p className="text-muted-foreground">{shippingInfo.deliveryAddress.phone}</p>
                      <p className="text-muted-foreground">
                        {shippingInfo.deliveryAddress.address}, {shippingInfo.deliveryAddress.ward}, {shippingInfo.deliveryAddress.district}, {shippingInfo.deliveryAddress.city}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimated Delivery */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Thời gian dự kiến
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600 mb-1">Dự kiến giao hàng</p>
                      <p className="text-xl font-bold text-blue-900">
                        {new Date(shippingInfo.estimatedDelivery).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
