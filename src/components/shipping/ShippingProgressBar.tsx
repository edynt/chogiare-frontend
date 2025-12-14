import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  Navigation,
  Timer
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export interface ShippingProgressData {
  orderId: string
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed'
  currentStep: number
  totalSteps: number
  estimatedDelivery?: string
  currentLocation?: string
  trackingNumber?: string
}

interface ShippingProgressBarProps {
  shippingData: ShippingProgressData
  className?: string
  showDetails?: boolean
  onTrackClick?: () => void
}

export function ShippingProgressBar({ 
  shippingData, 
  className, 
  showDetails = false,
  onTrackClick 
}: ShippingProgressBarProps) {
  const steps = [
    { id: 1, label: 'Xác nhận', icon: CheckCircle, color: 'bg-green-500' },
    { id: 2, label: 'Xuất kho', icon: Package, color: 'bg-blue-500' },
    { id: 3, label: 'Vận chuyển', icon: Truck, color: 'bg-yellow-500' },
    { id: 4, label: 'Giao hàng', icon: MapPin, color: 'bg-purple-500' },
    { id: 5, label: 'Hoàn thành', icon: CheckCircle, color: 'bg-green-600' }
  ]

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  const getEstimatedTime = () => {
    if (!shippingData.estimatedDelivery) return null
    
    const now = new Date()
    const deliveryDate = new Date(shippingData.estimatedDelivery)
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

  const progressPercentage = (shippingData.currentStep / shippingData.totalSteps) * 100

  return (
    <div className={cn("space-y-3", className)}>
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <Badge className={getStatusColor(shippingData.status)}>
          {getStatusLabel(shippingData.status)}
        </Badge>
        {shippingData.estimatedDelivery && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{getEstimatedTime()}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tiến độ giao hàng</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              shippingData.status === 'delayed' ? 'bg-red-500' : 'bg-primary'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id <= shippingData.currentStep
          const isCurrent = step.id === shippingData.currentStep
          
          return (
            <div key={step.id} className="flex flex-col items-center relative">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-300",
                isCompleted ? step.color : 
                isCurrent ? 'bg-primary animate-pulse' : 
                'bg-gray-300'
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <step.icon className="h-3 w-3" />
                )}
              </div>
              <span className={cn(
                "text-xs mt-1 text-center",
                isCompleted ? 'text-primary font-medium' : 
                isCurrent ? 'text-primary font-medium' : 
                'text-muted-foreground'
              )}>
                {step.label}
              </span>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute top-3 left-6 w-full h-0.5 -z-10",
                  isCompleted ? 'bg-primary' : 'bg-gray-300'
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Additional Info */}
      {showDetails && (
        <div className="space-y-2 pt-2 border-t">
          {shippingData.currentLocation && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{shippingData.currentLocation}</span>
            </div>
          )}
          {shippingData.estimatedDelivery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Dự kiến: {formatDate(shippingData.estimatedDelivery)}</span>
            </div>
          )}
        </div>
      )}

      {/* Track Button */}
      {onTrackClick && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onTrackClick}
          className="w-full"
        >
          <Navigation className="h-3 w-3 mr-2" />
          Theo dõi chi tiết
        </Button>
      )}
    </div>
  )
}

