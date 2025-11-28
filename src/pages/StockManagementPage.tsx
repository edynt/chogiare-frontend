import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { StockInModal } from '@/components/stock/StockInModal'
import { useNotification } from '@/components/notification-provider'
import { 
  Package,
  Plus,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  Download,
  Upload,
  MapPin,
  Building2
} from 'lucide-react'

interface StockInRecord {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  costPrice: number
  totalCost: number
  supplier: string
  batchNumber?: string
  expiryDate?: string
  location: string
  notes?: string
  createdAt: string
  createdBy: string
  status: 'completed' | 'pending' | 'cancelled'
}

interface Product {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  costPrice?: number
  category: string
  supplier: string
}

export default function StockManagementPage() {
  const { notify } = useNotification()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Mock data
  const mockStockInRecords: StockInRecord[] = [
    {
      id: '1',
      productId: '1',
      productName: 'iPhone 14 Pro Max 256GB',
      productSku: 'IPH14PM-256',
      quantity: 10,
      costPrice: 22000000,
      totalCost: 220000000,
      supplier: 'Apple Vietnam',
      batchNumber: 'BATCH001',
      location: 'Kho A - Kệ 1',
      notes: 'Nhập hàng định kỳ',
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'Nguyễn Văn A',
      status: 'completed'
    },
    {
      id: '2',
      productId: '2',
      productName: 'AirPods Pro 2nd Gen',
      productSku: 'APP2-001',
      quantity: 20,
      costPrice: 4500000,
      totalCost: 90000000,
      supplier: 'Apple Vietnam',
      batchNumber: 'BATCH002',
      location: 'Kho A - Kệ 2',
      notes: 'Nhập hàng khuyến mãi',
      createdAt: '2024-01-14T14:20:00Z',
      createdBy: 'Trần Thị B',
      status: 'completed'
    },
    {
      id: '3',
      productId: '3',
      productName: 'MacBook Pro M2 13"',
      productSku: 'MBP13-M2',
      quantity: 5,
      costPrice: 35000000,
      totalCost: 175000000,
      supplier: 'Apple Vietnam',
      batchNumber: 'BATCH003',
      location: 'Kho B - Kệ 3',
      notes: 'Nhập hàng bổ sung',
      createdAt: '2024-01-13T09:15:00Z',
      createdBy: 'Lê Văn C',
      status: 'pending'
    }
  ]

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      sku: 'IPH14PM-256',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      costPrice: 22000000,
      category: 'Điện thoại',
      supplier: 'Apple Vietnam'
    },
    {
      id: '2',
      name: 'AirPods Pro 2nd Gen',
      sku: 'APP2-001',
      currentStock: 25,
      minStock: 10,
      maxStock: 30,
      costPrice: 4500000,
      category: 'Phụ kiện',
      supplier: 'Apple Vietnam'
    },
    {
      id: '3',
      name: 'MacBook Pro M2 13"',
      sku: 'MBP13-M2',
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      costPrice: 35000000,
      category: 'Laptop',
      supplier: 'Apple Vietnam'
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const handleStockIn = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notify({
      type: 'success',
      title: 'Nhập kho thành công',
      message: `Đã nhập ${data.quantity} sản phẩm "${data.productId}" vào kho`,
    })
    
    // Close modal
    setIsStockInModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenStockInModal = (product: Product) => {
    setSelectedProduct(product)
    setIsStockInModalOpen(true)
  }

  const handleBulkStockIn = () => {
    notify({
      type: 'info',
      title: 'Chức năng đang phát triển',
      message: 'Nhập hàng hàng loạt sẽ được thêm sau',
    })
  }

  const handleExportData = () => {
    notify({
      type: 'success',
      title: 'Xuất dữ liệu thành công',
      message: 'Dữ liệu đã được xuất ra file Excel',
    })
  }

  // Calculate statistics
  const totalStockIns = mockStockInRecords.length
  const completedStockIns = mockStockInRecords.filter(record => record.status === 'completed').length
  const pendingStockIns = mockStockInRecords.filter(record => record.status === 'pending').length
  const totalValue = mockStockInRecords.reduce((sum, record) => sum + record.totalCost, 0)

  // Filter records
  const filteredRecords = mockStockInRecords.filter(record => {
    const matchesSearch = record.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesSupplier = supplierFilter === 'all' || record.supplier === supplierFilter
    
    return matchesSearch && matchesStatus && matchesSupplier
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý nhập hàng</h1>
                <p className="text-muted-foreground">Theo dõi và quản lý các đợt nhập hàng</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBulkStockIn}>
                <Upload className="h-4 w-4 mr-2" />
                Nhập hàng loạt
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng đợt nhập</p>
                    <p className="text-2xl font-bold">{totalStockIns}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                    <p className="text-2xl font-bold text-green-600">{completedStockIns}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingStockIns}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(totalValue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="records">Lịch sử nhập</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Stock Ins */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Đợt nhập hàng gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStockInRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{record.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {record.productSku} • {record.supplier} • {formatDate(record.createdAt)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{record.quantity} sản phẩm</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(record.totalCost)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Cảnh báo sắp hết hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.filter(product => product.currentStock <= product.minStock).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.sku} • Tồn kho: {product.currentStock} / Tối thiểu: {product.minStock}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Sắp hết hàng
                          </Badge>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleOpenStockInModal(product)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nhập hàng
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Nhà cung cấp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="Apple Vietnam">Apple Vietnam</SelectItem>
                        <SelectItem value="Samsung Vietnam">Samsung Vietnam</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Tồn kho:</span>
                            <span className="font-medium">{product.currentStock}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tối thiểu:</span>
                            <span className="font-medium">{product.minStock}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tối đa:</span>
                            <span className="font-medium">{product.maxStock}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge 
                            className={
                              product.currentStock <= product.minStock 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {product.currentStock <= product.minStock ? 'Sắp hết hàng' : 'Còn hàng'}
                          </Badge>
                          <Button 
                            size="sm"
                            onClick={() => handleOpenStockInModal(product)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Nhập
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Tìm kiếm đợt nhập hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Lọc
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Records List */}
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{record.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: {record.productSku} • {record.supplier} • {formatDate(record.createdAt)}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {record.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {record.createdBy}
                              </span>
                              {record.batchNumber && (
                                <span>Lô: {record.batchNumber}</span>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{record.quantity} sản phẩm</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(record.totalCost)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
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
    </div>
  )
}
