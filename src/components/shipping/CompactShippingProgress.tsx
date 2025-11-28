import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin,
  Navigation,
  Timer
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShippingProgressData } from './ShippingProgressBar'

interface CompactShippingProgressProps {
  shippingData: ShippingProgressData
  className?: string
  onTrackClick?: () => void
}

export function CompactShippingProgress({ 
  shippingData, 
  className, 
  onTrackClick 
}: CompactShippingProgressProps) {
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
    <div className={cn("space-y-2", className)}>
      {/* Status and Progress */}
      <div className="flex items-center justify-between">
        <Badge className={getStatusColor(shippingData.status)} variant="outline">
          {getStatusLabel(shippingData.status)}
        </Badge>
        {shippingData.estimatedDelivery && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{getEstimatedTime()}</span>
          </div>
        )}
      </div>

      {/* Compact Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tiến độ</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              shippingData.status === 'delayed' ? 'bg-red-500' : 'bg-primary'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Location */}
      {shippingData.currentLocation && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{shippingData.currentLocation}</span>
        </div>
      )}

      {/* Track Button */}
      {onTrackClick && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onTrackClick}
          className="w-full h-7 text-xs"
        >
          <Navigation className="h-3 w-3 mr-1" />
          Theo dõi
        </Button>
      )}
    </div>
  )
}

