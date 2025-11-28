import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  Phone,
  Calendar,
  Timer,
  Route,
  Building2,
  Home,
  User,
  Mail
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export interface ShippingStep {
  id: string
  status: 'completed' | 'current' | 'pending'
  title: string
  description: string
  timestamp: string
  location?: string
  icon: React.ReactNode
  estimatedTime?: string
}

export interface ShippingInfo {
  orderId: string
  trackingNumber: string
  carrier: string
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed'
  currentLocation: string
  estimatedDelivery: string
  actualDelivery?: string
  steps: ShippingStep[]
  deliveryAddress: {
    recipient: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
  }
  carrierInfo: {
    name: string
    phone: string
    website: string
  }
}

interface ShippingTrackingProps {
  shippingInfo: ShippingInfo
  className?: string
}

export function ShippingTracking({ shippingInfo, className }: ShippingTrackingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'current': return <Clock className="h-5 w-5 text-blue-600" />
      case 'pending': return <Clock className="h-5 w-5 text-gray-400" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800'
      case 'in_transit': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'processing': return 'bg-orange-100 text-orange-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOverallStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao hàng'
      case 'out_for_delivery': return 'Đang giao hàng'
      case 'in_transit': return 'Đang vận chuyển'
      case 'shipped': return 'Đã xuất kho'
      case 'processing': return 'Đang xử lý'
      case 'delayed': return 'Bị trễ'
      default: return status
    }
  }

  const calculateDeliveryProgress = () => {
    const completedSteps = shippingInfo.steps.filter(step => step.status === 'completed').length
    const totalSteps = shippingInfo.steps.length
    return Math.round((completedSteps / totalSteps) * 100)
  }

  const getEstimatedDeliveryTime = () => {
    const now = new Date()
    const deliveryDate = new Date(shippingInfo.estimatedDelivery)
    const diffTime = deliveryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) {
      return 'Hôm nay'
    } else if (diffDays === 1) {
      return 'Ngày mai'
    } else {
      return `${diffDays} ngày nữa`
    }
  }

  const progress = calculateDeliveryProgress()

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with tracking info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Theo dõi đơn hàng #{shippingInfo.orderId}
            </CardTitle>
            <Badge className={getOverallStatusColor(shippingInfo.status)}>
              {getOverallStatusLabel(shippingInfo.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vertical layout for tracking info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{shippingInfo.carrier}</p>
                <p className="text-xs text-muted-foreground">Nhà vận chuyển</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Navigation className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{shippingInfo.trackingNumber}</p>
                <p className="text-xs text-muted-foreground">Mã theo dõi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{shippingInfo.currentLocation}</p>
                <p className="text-xs text-muted-foreground">Vị trí hiện tại</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ giao hàng</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Delivery estimation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Dự kiến giao hàng</span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {getEstimatedDeliveryTime()} - {shippingInfo.estimatedDelivery ? formatDate(shippingInfo.estimatedDelivery) : 'Chưa có thông tin'}
            </p>
            {shippingInfo.status === 'delayed' && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Đơn hàng có thể bị trễ do điều kiện thời tiết
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Lộ trình vận chuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingInfo.steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center",
                    getStatusColor(step.status)
                  )}>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      {step.status === 'current' && (
                        <Badge variant="outline" className="text-xs">Hiện tại</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{step.timestamp ? formatDate(step.timestamp) : 'Chưa có thông tin'}</span>
                      </div>
                      {step.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{step.location}</span>
                        </div>
                      )}
                      {step.estimatedTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Connecting line */}
                {index < shippingInfo.steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Địa chỉ giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{shippingInfo.deliveryAddress.recipient}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{shippingInfo.deliveryAddress.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{shippingInfo.deliveryAddress.address}</p>
                <p className="text-sm text-muted-foreground">
                  {shippingInfo.deliveryAddress.ward}, {shippingInfo.deliveryAddress.district}, {shippingInfo.deliveryAddress.city}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carrier contact info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Thông tin nhà vận chuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{shippingInfo.carrierInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{shippingInfo.carrierInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={shippingInfo.carrierInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {shippingInfo.carrierInfo.website}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons - Vertical layout */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          <Phone className="h-4 w-4 mr-2" />
          Liên hệ nhà vận chuyển
        </Button>
        <Button variant="outline" className="w-full">
          <Navigation className="h-4 w-4 mr-2" />
          Theo dõi trên website
        </Button>
      </div>
    </div>
  )
}
