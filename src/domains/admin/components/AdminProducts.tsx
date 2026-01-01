import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

export function AdminProducts() {
  const products = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max 256GB',
      seller: 'Nguyễn Văn A',
      category: 'Điện thoại',
      price: 25000000,
      status: 'approved',
      createdAt: '2024-01-15',
      views: 1234,
      sales: 12
    },
    {
      id: '2',
      title: 'MacBook Pro M2 13 inch',
      seller: 'Trần Thị B',
      category: 'Laptop',
      price: 35000000,
      status: 'pending',
      createdAt: '2024-01-14',
      views: 856,
      sales: 0
    },
    {
      id: '3',
      title: 'Samsung Galaxy S23 Ultra',
      seller: 'Lê Văn C',
      category: 'Điện thoại',
      price: 28000000,
      status: 'rejected',
      createdAt: '2024-01-13',
      views: 567,
      sales: 0
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Đã duyệt</Badge>
      case 'pending':
        return <Badge variant="warning">Chờ duyệt</Badge>
      case 'rejected':
        return <Badge variant="destructive">Từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'rejected':
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
          <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý sản phẩm</p>
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
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      {getStatusIcon(product.status)}
                      {getStatusBadge(product.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Người bán: {product.seller}</span>
                      <span>Danh mục: {product.category}</span>
                      <span>Giá: {product.price.toLocaleString()} VNĐ</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Lượt xem: {product.views}</span>
                      <span>Đã bán: {product.sales}</span>
                      <span>Tạo: {product.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  {product.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="text-success">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Duyệt
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Từ chối
                      </Button>
                    </>
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
