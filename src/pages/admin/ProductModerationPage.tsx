import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  Bot,
  Flag
} from 'lucide-react'
import { PLACEHOLDER_IMAGE } from '@/lib/utils'

export default function ProductModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Mock data
  const products = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max 256GB - Chính hãng VN/A',
      seller: 'TechStore Pro',
      category: 'Điện thoại',
      price: 25000000,
      originalPrice: 30000000,
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-01-20T10:30:00Z',
      reviewedAt: null,
      reviewer: null,
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      ],
      description: 'iPhone 14 Pro Max 256GB chính hãng Apple, bảo hành 12 tháng',
      violations: ['potential_fake', 'price_manipulation'],
      aiScore: 85,
      manualReview: false,
      tags: ['apple', 'iphone', 'premium'],
      stock: 15,
      views: 234,
      sales: 0
    },
    {
      id: '2',
      title: 'AirPods Pro 2nd Gen - Hàng chính hãng Apple',
      seller: 'Audio World',
      category: 'Phụ kiện',
      price: 4500000,
      originalPrice: 5500000,
      status: 'approved',
      priority: 'medium',
      submittedAt: '2024-01-19T14:20:00Z',
      reviewedAt: '2024-01-19T16:45:00Z',
      reviewer: 'Admin User',
      images: [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop'
      ],
      description: 'AirPods Pro 2nd Gen chính hãng Apple với công nghệ Active Noise Cancellation',
      violations: [],
      aiScore: 92,
      manualReview: false,
      tags: ['apple', 'airpods', 'wireless'],
      stock: 25,
      views: 156,
      sales: 8
    },
    {
      id: '3',
      title: 'MacBook Air M2 13 inch - 256GB SSD',
      seller: 'Laptop Center',
      category: 'Laptop',
      price: 28000000,
      originalPrice: 32000000,
      status: 'rejected',
      priority: 'high',
      submittedAt: '2024-01-18T09:15:00Z',
      reviewedAt: '2024-01-18T11:30:00Z',
      reviewer: 'Admin User',
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop'
      ],
      description: 'MacBook Air M2 13 inch 256GB SSD, hiệu năng mạnh mẽ',
      violations: ['copyright_violation', 'misleading_title'],
      aiScore: 45,
      manualReview: true,
      tags: ['apple', 'macbook', 'laptop'],
      stock: 0,
      views: 89,
      sales: 0
    },
    {
      id: '4',
      title: 'Samsung Galaxy S23 Ultra 512GB',
      seller: 'Mobile Store',
      category: 'Điện thoại',
      price: 22000000,
      originalPrice: 25000000,
      status: 'pending',
      priority: 'low',
      submittedAt: '2024-01-20T08:45:00Z',
      reviewedAt: null,
      reviewer: null,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
      ],
      description: 'Samsung Galaxy S23 Ultra 512GB với camera 200MP',
      violations: [],
      aiScore: 78,
      manualReview: false,
      tags: ['samsung', 'galaxy', 'android'],
      stock: 8,
      views: 67,
      sales: 0
    },
    {
      id: '5',
      title: 'Nike Air Max 270 - Size 42',
      seller: 'Sneaker Shop',
      category: 'Thời trang',
      price: 2500000,
      originalPrice: 3000000,
      status: 'approved',
      priority: 'low',
      submittedAt: '2024-01-17T16:30:00Z',
      reviewedAt: '2024-01-17T18:20:00Z',
      reviewer: 'Admin User',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
      ],
      description: 'Nike Air Max 270 chính hãng, size 42, màu đen trắng',
      violations: [],
      aiScore: 88,
      manualReview: false,
      tags: ['nike', 'sneakers', 'sports'],
      stock: 12,
      views: 198,
      sales: 3
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || product.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Từ chối'
      case 'pending': return 'Chờ duyệt'
      case 'draft': return 'Bản nháp'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return priority
    }
  }

  const getViolationColor = (violation: string) => {
    switch (violation) {
      case 'potential_fake': return 'bg-red-100 text-red-800'
      case 'price_manipulation': return 'bg-orange-100 text-orange-800'
      case 'copyright_violation': return 'bg-purple-100 text-purple-800'
      case 'misleading_title': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getViolationLabel = (violation: string) => {
    switch (violation) {
      case 'potential_fake': return 'Có thể là hàng giả'
      case 'price_manipulation': return 'Thao túng giá'
      case 'copyright_violation': return 'Vi phạm bản quyền'
      case 'misleading_title': return 'Tiêu đề gây hiểu lầm'
      default: return violation
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? [] 
        : filteredProducts.map(product => product.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for products:`, selectedProducts)
    // Implement bulk actions
  }

  const handleApprove = (productId: string) => {
    console.log(`Approve product: ${productId}`)
    // Implement approve logic
  }

  const handleReject = (productId: string) => {
    console.log(`Reject product: ${productId}`)
    // Implement reject logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt sản phẩm</h1>
          <p className="text-gray-600 mt-1">Duyệt và quản lý sản phẩm đăng bán trên nền tảng</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Bot className="h-4 w-4 mr-2" />
            Cài đặt AI
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Duyệt hàng loạt
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, người bán hoặc danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                  <SelectItem value="Thời trang">Thời trang</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ưu tiên</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Duyệt
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Từ chối
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('flag')}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Đánh dấu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Người bán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Vi phạm</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-12">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER_IMAGE}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMAGE
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-2">{product.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-green-600">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {product.stock} sản phẩm
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{product.seller}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(product.priority)}>
                        {getPriorityLabel(product.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.violations.length > 0 ? (
                          product.violations.map((violation, index) => (
                            <Badge 
                              key={index} 
                              className={`text-xs ${getViolationColor(violation)}`}
                            >
                              {getViolationLabel(violation)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">Không có</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-2 rounded-full ${
                          product.aiScore >= 80 ? 'bg-green-200' :
                          product.aiScore >= 60 ? 'bg-yellow-200' :
                          'bg-red-200'
                        }`}>
                          <div 
                            className={`h-2 rounded-full ${
                              product.aiScore >= 80 ? 'bg-green-500' :
                              product.aiScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${product.aiScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{product.aiScore}%</span>
                        {product.manualReview && (
                          <Shield className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(product.submittedAt)}</p>
                        {product.reviewedAt && (
                          <p className="text-gray-500">
                            Duyệt: {formatDate(product.reviewedAt)}
                          </p>
                        )}
                        {product.reviewer && (
                          <p className="text-xs text-gray-500">
                            Bởi: {product.reviewer}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleApprove(product.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleReject(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã duyệt</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Từ chối</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Score TB</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(products.reduce((sum, p) => sum + p.aiScore, 0) / products.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
