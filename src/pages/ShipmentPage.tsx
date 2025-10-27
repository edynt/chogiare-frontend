import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Phone,
  MessageCircle,
  Calendar,
  User,
  Store,
  CreditCard,
  Shield,
  ArrowRight,
  Navigation,
  Timer,
  Star
} from 'lucide-react'

interface ShipmentStatus {
  id: string
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned'
  timestamp: string
  location?: string
  description: string
  updatedBy: string
}

interface Shipment {
  id: string
  orderId: string
  trackingNumber: string
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned'
  currentStatus: string
  progress: number
  estimatedDelivery: string
  actualDelivery?: string
  carrier: string
  carrierLogo: string
  origin: {
    name: string
    address: string
    phone: string
  }
  destination: {
    name: string
    address: string
    phone: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    image: string
    price: number
  }>
  timeline: ShipmentStatus[]
  totalValue: number
  shippingFee: number
  isInsured: boolean
  weight: number
  dimensions: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

export default function ShipmentPage() {
  const { shipmentId } = useParams<{ shipmentId?: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isSellerView, setIsSellerView] = useState(false)
  const [autoNotifications, setAutoNotifications] = useState(false)

  // Mock data
  const shipments: Shipment[] = [
    {
      id: 'ship001',
      orderId: 'ORD-2024-001',
      trackingNumber: 'VN123456789',
      status: 'in_transit',
      currentStatus: 'Đang vận chuyển',
      progress: 75,
      estimatedDelivery: '2024-01-20T10:00:00Z',
      carrier: 'Viettel Post',
      carrierLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      origin: {
        name: 'TechStore Pro',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0901234567'
      },
      destination: {
        name: 'Nguyễn Văn A',
        address: '456 Đường XYZ, Quận Cầu Giấy, Hà Nội',
        phone: '0987654321'
      },
      items: [
        {
          id: 'item1',
          name: 'iPhone 14 Pro Max 256GB',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=80&h=80&fit=crop',
          price: 25000000
        }
      ],
      timeline: [
        {
          id: '1',
          status: 'confirmed',
          timestamp: '2024-01-15T09:00:00Z',
          location: 'Kho TP.HCM',
          description: 'Đơn hàng đã được xác nhận',
          updatedBy: 'Hệ thống'
        },
        {
          id: '2',
          status: 'packed',
          timestamp: '2024-01-15T14:30:00Z',
          location: 'Kho TP.HCM',
          description: 'Hàng đã được đóng gói',
          updatedBy: 'Nguyễn Văn B'
        },
        {
          id: '3',
          status: 'shipped',
          timestamp: '2024-01-16T08:00:00Z',
          location: 'Trung tâm phân phối TP.HCM',
          description: 'Hàng đã được giao cho đơn vị vận chuyển',
          updatedBy: 'Viettel Post'
        },
        {
          id: '4',
          status: 'in_transit',
          timestamp: '2024-01-17T10:15:00Z',
          location: 'Trung tâm phân phối Hà Nội',
          description: 'Hàng đang trong quá trình vận chuyển',
          updatedBy: 'Viettel Post'
        }
      ],
      totalValue: 25000000,
      shippingFee: 30000,
      isInsured: true,
      weight: 0.5,
      dimensions: '20x15x8 cm',
      specialInstructions: 'Giao hàng trong giờ hành chính',
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-17T10:15:00Z'
    },
    {
      id: 'ship002',
      orderId: 'ORD-2024-002',
      trackingNumber: 'VN987654321',
      status: 'delivered',
      currentStatus: 'Đã giao hàng',
      progress: 100,
      estimatedDelivery: '2024-01-18T15:00:00Z',
      actualDelivery: '2024-01-18T14:30:00Z',
      carrier: 'Giao Hàng Nhanh',
      carrierLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      origin: {
        name: 'Audio World',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        phone: '0909876543'
      },
      destination: {
        name: 'Trần Thị C',
        address: '321 Đường GHI, Quận Đống Đa, Hà Nội',
        phone: '0912345678'
      },
      items: [
        {
          id: 'item2',
          name: 'AirPods Pro 2nd Gen',
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop',
          price: 4500000
        }
      ],
      timeline: [
        {
          id: '1',
          status: 'confirmed',
          timestamp: '2024-01-16T10:00:00Z',
          location: 'Kho TP.HCM',
          description: 'Đơn hàng đã được xác nhận',
          updatedBy: 'Hệ thống'
        },
        {
          id: '2',
          status: 'packed',
          timestamp: '2024-01-16T15:00:00Z',
          location: 'Kho TP.HCM',
          description: 'Hàng đã được đóng gói',
          updatedBy: 'Lê Văn D'
        },
        {
          id: '3',
          status: 'shipped',
          timestamp: '2024-01-17T09:00:00Z',
          location: 'Trung tâm phân phối TP.HCM',
          description: 'Hàng đã được giao cho đơn vị vận chuyển',
          updatedBy: 'Giao Hàng Nhanh'
        },
        {
          id: '4',
          status: 'in_transit',
          timestamp: '2024-01-17T20:00:00Z',
          location: 'Trung tâm phân phối Hà Nội',
          description: 'Hàng đang trong quá trình vận chuyển',
          updatedBy: 'Giao Hàng Nhanh'
        },
        {
          id: '5',
          status: 'delivered',
          timestamp: '2024-01-18T14:30:00Z',
          location: 'Hà Nội',
          description: 'Hàng đã được giao thành công',
          updatedBy: 'Giao Hàng Nhanh'
        }
      ],
      totalValue: 9000000,
      shippingFee: 25000,
      isInsured: false,
      weight: 0.3,
      dimensions: '15x10x5 cm',
      createdAt: '2024-01-16T09:30:00Z',
      updatedAt: '2024-01-18T14:30:00Z'
    }
  ]

  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-500', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
    packed: { label: 'Đã đóng gói', color: 'bg-purple-500', icon: Package },
    shipped: { label: 'Đã giao vận', color: 'bg-indigo-500', icon: Truck },
    in_transit: { label: 'Đang vận chuyển', color: 'bg-orange-500', icon: Navigation },
    delivered: { label: 'Đã giao hàng', color: 'bg-green-500', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: AlertCircle },
    returned: { label: 'Đã trả hàng', color: 'bg-gray-500', icon: RefreshCw }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.destination.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    const Icon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock
    return <Icon className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-500'
  }

  const ShipmentCard = ({ shipment }: { shipment: Shipment }) => {
    const statusInfo = statusConfig[shipment.status]
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={shipment.carrierLogo}
                alt={shipment.carrier}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{shipment.carrier}</h3>
                <p className="text-sm text-muted-foreground">
                  Mã vận đơn: {shipment.trackingNumber}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(shipment.status)} text-white`}>
              {getStatusIcon(shipment.status)}
              <span className="ml-1">{statusInfo?.label}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Từ:</span>
                  <span>{shipment.origin.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-muted-foreground">{shipment.origin.address}</span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{shipment.origin.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Thông tin nhận hàng</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Đến:</span>
                  <span>{shipment.destination.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-muted-foreground">{shipment.destination.address}</span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{shipment.destination.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ giao hàng</span>
              <span className="text-sm text-muted-foreground">{shipment.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getStatusColor(shipment.status)}`}
                style={{ width: `${shipment.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Sản phẩm</h4>
            <div className="space-y-2">
              {shipment.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Số lượng: {item.quantity} • {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Lịch sử vận chuyển</h4>
            <div className="space-y-2">
              {shipment.timeline.slice(-3).map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{event.description}</p>
                    <p className="text-muted-foreground">
                      {formatDate(event.timestamp)} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Đơn hàng: {shipment.orderId}</span>
                <span>Giá trị: {formatPrice(shipment.totalValue)}</span>
                {shipment.isInsured && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Bảo hiểm
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Chi tiết
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Theo dõi vận chuyển</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Theo dõi trạng thái đơn hàng và vận chuyển của bạn
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo mã vận đơn, đơn hàng hoặc tên người nhận..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isSellerView ? 'default' : 'outline'}
              onClick={() => setIsSellerView(!isSellerView)}
            >
              {isSellerView ? <Store className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              {isSellerView ? 'Chế độ người bán' : 'Chế độ người mua'}
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            Tất cả ({shipments.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = shipments.filter(s => s.status === status).length
            return (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                {getStatusIcon(status)}
                <span className="ml-1">{config.label} ({count})</span>
              </Button>
            )
          })}
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy vận đơn</h3>
                <p className="text-muted-foreground mb-4">
                  Không có vận đơn nào phù hợp với tìm kiếm của bạn
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredShipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Hỗ trợ vận chuyển</h3>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  Liên hệ trực tiếp với đơn vị vận chuyển
                </p>
                <Button variant="secondary" size="sm">
                  Gọi hotline
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Chat hỗ trợ</h3>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  Nhận hỗ trợ trực tiếp từ đội ngũ chúng tôi
                </p>
                <Button variant="secondary" size="sm">
                  Bắt đầu chat
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Cập nhật tự động</h3>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  Nhận thông báo khi có cập nhật mới
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    id="auto-notifications"
                    checked={autoNotifications}
                    onCheckedChange={setAutoNotifications}
                  />
                  <Label htmlFor="auto-notifications" className="text-sm">
                    {autoNotifications ? 'Đã bật' : 'Chưa bật'}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
