import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

export function AdminOrders() {
  const orders = [
    {
      id: '12345',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 14 Pro Max',
      amount: 25000000,
      status: 'delivered',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-17'
    },
    {
      id: '12346',
      customer: 'Trần Thị B',
      product: 'MacBook Pro M2',
      amount: 35000000,
      status: 'shipping',
      orderDate: '2024-01-16',
      deliveryDate: null
    },
    {
      id: '12347',
      customer: 'Lê Văn C',
      product: 'Samsung Galaxy S23',
      amount: 28000000,
      status: 'cancelled',
      orderDate: '2024-01-14',
      deliveryDate: null
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Đã giao</Badge>
      case 'shipping':
        return <Badge variant="secondary">Đang giao</Badge>
      case 'pending':
        return <Badge variant="warning">Chờ xử lý</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'shipping':
        return <Truck className="h-4 w-4 text-info" />
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">#{order.id}</h3>
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Khách hàng: {order.customer}</span>
                      <span>Sản phẩm: {order.product}</span>
                      <span>Giá: {order.amount.toLocaleString()} VNĐ</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Ngày đặt: {order.orderDate}</span>
                      {order.deliveryDate && (
                        <span>Ngày giao: {order.deliveryDate}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  {order.status === 'pending' && (
                    <Button variant="outline" size="sm" className="text-success">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Xác nhận
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
