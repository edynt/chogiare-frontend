import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StockInModal } from '@/components/stock/StockInModal'
import { ProductDetailModal } from '@/components/stock/ProductDetailModal'
import { EditProductModal } from '@/components/stock/EditProductModal'
import { useNotification } from '@/components/notification-provider'
import { 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Bell, 
  ShoppingCart, 
  Eye, 
  Star, 
  Edit, 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Settings, 
  BarChart3, 
  DollarSign 
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reservedStock: number
  availableStock: number
  costPrice: number
  sellingPrice: number
  profit: number
  profitMargin: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  lastUpdated: string
  image: string
  description: string
  supplier: string
  location: string
  barcode?: string
  weight: number
  dimensions: string
  tags: string[]
  salesCount: number
  viewsCount: number
  rating: number
  isActive: boolean
}

interface StockAlert {
  id: string
  productId: string
  productName: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring'
  currentStock: number
  threshold: number
  severity: 'low' | 'medium' | 'high'
  message: string
  createdAt: string
  isRead: boolean
}

export default function InventoryManagementPage() {
  const { notify } = useNotification()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)

  const handleStockIn = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notify({
      type: 'success',
      title: 'Nhập kho thành công',
      message: `Đã nhập ${data.quantity} sản phẩm vào kho`,
    })
    
    setIsStockInModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenStockInModal = (product: InventoryItem | null) => {
    setSelectedProduct(product)
    setIsStockInModalOpen(true)
  }

  const handleOpenDetailModal = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsDetailModalOpen(true)
  }

  const handleOpenEditModal = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = async (updatedProduct: InventoryItem) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notify({
      type: 'success',
      title: 'Thành công',
      message: 'Đã cập nhật thông tin sản phẩm'
    })
    
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      sku: 'IPH14PM-256',
      category: 'Điện thoại',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      reservedStock: 3,
      availableStock: 12,
      costPrice: 22000000,
      sellingPrice: 25000000,
      profit: 3000000,
      profitMargin: 13.6,
      status: 'in_stock',
      lastUpdated: '2024-01-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=80&h=80&fit=crop',
      description: 'iPhone 14 Pro Max 256GB chính hãng Apple',
      supplier: 'Apple Vietnam',
      location: 'Kho A - Kệ 1',
      barcode: '1234567890123',
      weight: 0.5,
      dimensions: '20x15x8 cm',
      tags: ['apple', 'iphone', 'premium'],
      salesCount: 25,
      viewsCount: 150,
      rating: 4.8,
      isActive: true
    },
    {
      id: '2',
      name: 'AirPods Pro 2nd Gen',
      sku: 'APP2-001',
      category: 'Phụ kiện',
      currentStock: 5,
      minStock: 10,
      maxStock: 30,
      reservedStock: 1,
      availableStock: 4,
      costPrice: 4000000,
      sellingPrice: 4500000,
      profit: 500000,
      profitMargin: 12.5,
      status: 'low_stock',
      lastUpdated: '2024-01-14T15:20:00Z',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop',
      description: 'AirPods Pro 2nd Gen chính hãng Apple',
      supplier: 'Apple Vietnam',
      location: 'Kho B - Kệ 2',
      barcode: '1234567890124',
      weight: 0.2,
      dimensions: '15x10x5 cm',
      tags: ['apple', 'airpods', 'wireless'],
      salesCount: 18,
      viewsCount: 95,
      rating: 4.9,
      isActive: true
    },
    {
      id: '3',
      name: 'MacBook Air M2 13 inch',
      sku: 'MBA-M2-13',
      category: 'Laptop',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      reservedStock: 0,
      availableStock: 0,
      costPrice: 25000000,
      sellingPrice: 28000000,
      profit: 3000000,
      profitMargin: 12.0,
      status: 'out_of_stock',
      lastUpdated: '2024-01-13T09:15:00Z',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=80&h=80&fit=crop',
      description: 'MacBook Air M2 13 inch 256GB SSD',
      supplier: 'Apple Vietnam',
      location: 'Kho A - Kệ 3',
      barcode: '1234567890125',
      weight: 1.3,
      dimensions: '30x21x1.1 cm',
      tags: ['apple', 'macbook', 'laptop'],
      salesCount: 8,
      viewsCount: 120,
      rating: 4.7,
      isActive: true
    }
  ]

  const stockAlerts: StockAlert[] = [
    {
      id: '1',
      productId: '2',
      productName: 'AirPods Pro 2nd Gen',
      type: 'low_stock',
      currentStock: 5,
      threshold: 10,
      severity: 'medium',
      message: 'Sản phẩm sắp hết hàng. Cần nhập thêm.',
      createdAt: '2024-01-15T08:00:00Z',
      isRead: false
    },
    {
      id: '2',
      productId: '3',
      productName: 'MacBook Air M2 13 inch',
      type: 'out_of_stock',
      currentStock: 0,
      threshold: 5,
      severity: 'high',
      message: 'Sản phẩm đã hết hàng. Cần nhập khẩn cấp.',
      createdAt: '2024-01-14T10:30:00Z',
      isRead: false
    }
  ]

  const categories = ['all', 'Điện thoại', 'Laptop', 'Phụ kiện', 'Đồng hồ', 'Máy ảnh']

  const statusConfig = {
    in_stock: { label: 'Còn hàng', color: 'bg-green-500', icon: CheckCircle },
    low_stock: { label: 'Sắp hết', color: 'bg-yellow-500', icon: AlertTriangle },
    out_of_stock: { label: 'Hết hàng', color: 'bg-red-500', icon: AlertTriangle },
    discontinued: { label: 'Ngừng bán', color: 'bg-gray-500', icon: Package }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const getStatusIcon = (status: string) => {
    const Icon = statusConfig[status as keyof typeof statusConfig]?.icon || Package
    return <Icon className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-500'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <TrendingDown className="h-4 w-4" />
      case 'out_of_stock': return <AlertTriangle className="h-4 w-4" />
      case 'overstock': return <TrendingUp className="h-4 w-4" />
      case 'expiring': return <Clock className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const InventoryItemCard = ({ item }: { item: InventoryItem }) => {
    const statusInfo = statusConfig[item.status]
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <Badge className={`${getStatusColor(item.status)} text-white`}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{statusInfo?.label}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tồn kho hiện tại</p>
                  <p className="font-semibold text-lg">{item.currentStock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Có thể bán</p>
                  <p className="font-semibold text-lg text-primary">{item.availableStock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Đã đặt trước</p>
                  <p className="font-semibold text-lg text-orange-600">{item.reservedStock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lợi nhuận</p>
                  <p className="font-semibold text-lg text-green-600">{item.profitMargin}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Giá nhập:</span>
                  <span className="ml-2 font-medium">{formatPrice(item.costPrice)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Giá bán:</span>
                  <span className="ml-2 font-medium">{formatPrice(item.sellingPrice)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lợi nhuận:</span>
                  <span className="ml-2 font-medium text-green-600">{formatPrice(item.profit)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vị trí:</span>
                  <span className="ml-2 font-medium">{item.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Nhà cung cấp:</span>
                  <span className="ml-2 font-medium">{item.supplier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cập nhật:</span>
                  <span className="ml-2 font-medium">{formatDate(item.lastUpdated)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span>{item.salesCount} bán</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{item.viewsCount} xem</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenDetailModal(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenEditModal(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenStockInModal(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nhập
                  </Button>
                </div>
              </div>
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
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Quản lý tồn kho</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Theo dõi và quản lý tồn kho sản phẩm của bạn
          </p>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tồn kho
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Cảnh báo
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Thống kê
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm, SKU hoặc tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'Tất cả' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
              <Button variant="outline" onClick={() => handleOpenStockInModal(null)}>
                <Upload className="h-4 w-4 mr-2" />
                Nhập hàng
              </Button>
              <Button variant="outline" asChild>
                <Link to="/inventory/reports">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo
                </Link>
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
            </div>

            {/* Inventory Items */}
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-muted-foreground mb-4">
                      Không có sản phẩm nào phù hợp với tìm kiếm của bạn
                    </p>
                    <Button onClick={() => setSearchQuery('')}>
                      Xóa bộ lọc
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map((item) => (
                  <InventoryItemCard key={item.id} item={item} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockAlerts.map((alert) => (
                <Card key={alert.id} className={`${alert.isRead ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAlertColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{alert.productName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {alert.currentStock}/{alert.threshold}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(alert.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                      <p className="text-2xl font-bold">{inventoryItems.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0))}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {inventoryItems.filter(item => item.status === 'low_stock').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Hết hàng</p>
                      <p className="text-2xl font-bold text-red-600">
                        {inventoryItems.filter(item => item.status === 'out_of_stock').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Stock In Modal */}
      <StockInModal
        isOpen={isStockInModalOpen}
        onClose={() => {
          setIsStockInModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        onStockIn={handleStockIn}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        onEdit={handleOpenEditModal}
        onStockIn={handleOpenStockInModal}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
