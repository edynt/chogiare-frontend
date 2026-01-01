import React, { useState } from 'react'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Label } from '@shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs'
import { Badge } from '@shared/components/ui/badge'
import { useNotification } from '@shared/components/notification-provider'
import { 
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  Calendar,
  Printer,
  Mail,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'

interface ReportData {
  id: string
  name: string
  type: 'inventory' | 'sales' | 'stock_movement' | 'low_stock'
  generatedAt: string
  fileSize: string
  status: 'ready' | 'generating' | 'error'
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  costPrice: number
  sellingPrice: number
  profit: number
  profitMargin: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  supplier: string
  location: string
}

export default function InventoryReportPage() {
  const { notify } = useNotification()
  const [activeTab, setActiveTab] = useState('generate')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState('inventory')
  const [dateRange, setDateRange] = useState('30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const mockReports: ReportData[] = [
    {
      id: '1',
      name: 'Báo cáo tồn kho tháng 1/2024',
      type: 'inventory',
      generatedAt: '2024-01-31T10:30:00Z',
      fileSize: '2.5 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Báo cáo sản phẩm sắp hết hàng',
      type: 'low_stock',
      generatedAt: '2024-01-30T14:20:00Z',
      fileSize: '1.2 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Báo cáo nhập xuất kho tuần 4',
      type: 'stock_movement',
      generatedAt: '2024-01-29T09:15:00Z',
      fileSize: '3.1 MB',
      status: 'ready'
    }
  ]

  const mockInventoryData: InventoryItem[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      sku: 'IPH14PM-256',
      category: 'Điện thoại',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      costPrice: 22000000,
      sellingPrice: 25000000,
      profit: 3000000,
      profitMargin: 13.6,
      status: 'in_stock',
      lastUpdated: '2024-01-15T10:30:00Z',
      supplier: 'Apple Vietnam',
      location: 'Kho A - Kệ 1'
    },
    {
      id: '2',
      name: 'AirPods Pro 2nd Gen',
      sku: 'APP2-001',
      category: 'Phụ kiện',
      currentStock: 5,
      minStock: 10,
      maxStock: 30,
      costPrice: 4500000,
      sellingPrice: 5000000,
      profit: 500000,
      profitMargin: 11.1,
      status: 'low_stock',
      lastUpdated: '2024-01-14T14:20:00Z',
      supplier: 'Apple Vietnam',
      location: 'Kho A - Kệ 2'
    },
    {
      id: '3',
      name: 'MacBook Pro M2 13"',
      sku: 'MBP13-M2',
      category: 'Laptop',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      costPrice: 35000000,
      sellingPrice: 38000000,
      profit: 3000000,
      profitMargin: 8.6,
      status: 'out_of_stock',
      lastUpdated: '2024-01-13T09:15:00Z',
      supplier: 'Apple Vietnam',
      location: 'Kho B - Kệ 3'
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
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng'
      case 'low_stock': return 'Sắp hết hàng'
      case 'out_of_stock': return 'Hết hàng'
      default: return status
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'inventory': return 'Báo cáo tồn kho'
      case 'sales': return 'Báo cáo bán hàng'
      case 'stock_movement': return 'Báo cáo nhập xuất'
      case 'low_stock': return 'Báo cáo sắp hết hàng'
      default: return type
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    notify({
      type: 'success',
      title: 'Tạo báo cáo thành công',
      message: 'Báo cáo đã được tạo và sẵn sàng tải xuống',
    })
    
    setIsGenerating(false)
  }

  const handleDownloadReport = () => {
    notify({
      type: 'success',
      title: 'Tải xuống thành công',
      message: 'Báo cáo đã được tải xuống',
    })
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleEmailReport = () => {
    notify({
      type: 'info',
      title: 'Gửi email',
      message: 'Báo cáo đã được gửi qua email',
    })
  }

  // Calculate statistics
  const totalProducts = mockInventoryData.length
  const lowStockProducts = mockInventoryData.filter(item => item.status === 'low_stock').length
  const outOfStockProducts = mockInventoryData.filter(item => item.status === 'out_of_stock').length
  const totalValue = mockInventoryData.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Báo cáo tồn kho</h1>
                <p className="text-muted-foreground">Tạo và quản lý các báo cáo tồn kho</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
                    <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hết hàng</p>
                    <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="text-lg font-bold text-green-600">{formatPrice(totalValue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Tạo báo cáo</TabsTrigger>
              <TabsTrigger value="history">Lịch sử báo cáo</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tạo báo cáo mới
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Report Type */}
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Loại báo cáo</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Báo cáo tồn kho</SelectItem>
                        <SelectItem value="sales">Báo cáo bán hàng</SelectItem>
                        <SelectItem value="stock_movement">Báo cáo nhập xuất kho</SelectItem>
                        <SelectItem value="low_stock">Báo cáo sắp hết hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Khoảng thời gian</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 ngày qua</SelectItem>
                        <SelectItem value="30">30 ngày qua</SelectItem>
                        <SelectItem value="90">90 ngày qua</SelectItem>
                        <SelectItem value="365">1 năm qua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryFilter">Danh mục</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="electronics">Điện tử</SelectItem>
                          <SelectItem value="accessories">Phụ kiện</SelectItem>
                          <SelectItem value="laptop">Laptop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statusFilter">Trạng thái</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="in_stock">Còn hàng</SelectItem>
                          <SelectItem value="low_stock">Sắp hết hàng</SelectItem>
                          <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Đang tạo báo cáo...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Tạo báo cáo
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      In trực tiếp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Xem trước dữ liệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInventoryData.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.currentStock} sản phẩm</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.currentStock * item.costPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Lịch sử báo cáo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getReportTypeLabel(report.type)} • {report.fileSize} • {formatDate(report.generatedAt)}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {report.status === 'ready' ? 'Sẵn sàng' : report.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDownloadReport}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handlePrintReport}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            In
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleEmailReport}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
