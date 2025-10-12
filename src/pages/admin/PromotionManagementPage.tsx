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
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  Users,
  DollarSign,
  Percent,
  Gift,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Star,
  Zap,
  Crown,
  Tag,
  ShoppingCart,
  CreditCard,
  Mail,
  Share2,
  Download,
  Upload
} from 'lucide-react'

export default function PromotionManagementPage() {
  const [activeTab, setActiveTab] = useState('coupons')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data for coupons
  const coupons = [
    {
      id: 'COUPON-001',
      code: 'WELCOME10',
      name: 'Giảm 10% cho khách hàng mới',
      type: 'percentage',
      value: 10,
      minOrder: 200000,
      maxDiscount: 50000,
      usageLimit: 1000,
      usedCount: 234,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      applicableProducts: 'all',
      applicableUsers: 'new_users',
      description: 'Áp dụng cho khách hàng đăng ký lần đầu'
    },
    {
      id: 'COUPON-002',
      code: 'FLASH50',
      name: 'Giảm 50k cho đơn từ 500k',
      type: 'fixed',
      value: 50000,
      minOrder: 500000,
      maxDiscount: 50000,
      usageLimit: 500,
      usedCount: 89,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      applicableProducts: 'electronics',
      applicableUsers: 'all',
      description: 'Áp dụng cho sản phẩm điện tử'
    },
    {
      id: 'COUPON-003',
      code: 'VIP20',
      name: 'Giảm 20% cho VIP',
      type: 'percentage',
      value: 20,
      minOrder: 1000000,
      maxDiscount: 200000,
      usageLimit: 100,
      usedCount: 45,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      applicableProducts: 'all',
      applicableUsers: 'vip',
      description: 'Dành riêng cho khách hàng VIP'
    },
    {
      id: 'COUPON-004',
      code: 'EXPIRED30',
      name: 'Giảm 30% (Đã hết hạn)',
      type: 'percentage',
      value: 30,
      minOrder: 300000,
      maxDiscount: 100000,
      usageLimit: 200,
      usedCount: 156,
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      status: 'expired',
      applicableProducts: 'all',
      applicableUsers: 'all',
      description: 'Coupon đã hết hạn'
    }
  ]

  // Mock data for campaigns
  const campaigns = [
    {
      id: 'CAMP-001',
      name: 'Black Friday 2024',
      type: 'flash_sale',
      status: 'active',
      startDate: '2024-11-24',
      endDate: '2024-11-30',
      budget: 100000000,
      spent: 45600000,
      targetAudience: 'all_users',
      products: 150,
      orders: 2340,
      revenue: 2340000000,
      conversionRate: 12.5,
      description: 'Chương trình Black Friday với giảm giá lên đến 70%'
    },
    {
      id: 'CAMP-002',
      name: 'Tết Nguyên Đán 2024',
      type: 'seasonal',
      status: 'completed',
      startDate: '2024-01-20',
      endDate: '2024-02-10',
      budget: 50000000,
      spent: 48750000,
      targetAudience: 'all_users',
      products: 89,
      orders: 1567,
      revenue: 1567000000,
      conversionRate: 8.9,
      description: 'Chương trình Tết với nhiều ưu đãi đặc biệt'
    },
    {
      id: 'CAMP-003',
      name: 'Back to School',
      type: 'targeted',
      status: 'scheduled',
      startDate: '2024-08-15',
      endDate: '2024-09-15',
      budget: 30000000,
      spent: 0,
      targetAudience: 'students',
      products: 67,
      orders: 0,
      revenue: 0,
      conversionRate: 0,
      description: 'Chương trình dành cho học sinh, sinh viên'
    }
  ]

  // Mock data for promotions
  const promotions = [
    {
      id: 'PROMO-001',
      name: 'Mua 2 tặng 1',
      type: 'buy_x_get_y',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      applicableProducts: 'cosmetics',
      conditions: 'Mua 2 sản phẩm bất kỳ, tặng 1 sản phẩm có giá trị thấp nhất',
      usageCount: 456,
      revenue: 456000000,
      description: 'Áp dụng cho tất cả sản phẩm mỹ phẩm'
    },
    {
      id: 'PROMO-002',
      name: 'Miễn phí vận chuyển',
      type: 'free_shipping',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      applicableProducts: 'all',
      conditions: 'Đơn hàng từ 300k được miễn phí vận chuyển',
      usageCount: 1234,
      revenue: 1234000000,
      description: 'Miễn phí vận chuyển cho đơn hàng từ 300k'
    },
    {
      id: 'PROMO-003',
      name: 'Giảm giá theo số lượng',
      type: 'bulk_discount',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      applicableProducts: 'electronics',
      conditions: 'Mua 3 sản phẩm giảm 10%, 5 sản phẩm giảm 15%',
      usageCount: 234,
      revenue: 234000000,
      description: 'Giảm giá theo số lượng sản phẩm mua'
    }
  ]

  const tabs = [
    { id: 'coupons', label: 'Coupon Codes', icon: Tag },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'promotions', label: 'Promotions', icon: Gift }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'expired': return 'Hết hạn'
      case 'scheduled': return 'Đã lên lịch'
      case 'completed': return 'Hoàn thành'
      case 'paused': return 'Tạm dừng'
      default: return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-gray-600 mt-1">Quản lý coupon codes, campaigns và promotions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng coupon</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                <p className="text-xs text-green-600">{coupons.filter(c => c.status === 'active').length} đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng campaign</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                <p className="text-xs text-blue-600">{campaigns.filter(c => c.status === 'active').length} đang chạy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng promotion</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
                <p className="text-xs text-purple-600">{promotions.filter(p => p.status === 'active').length} đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Doanh thu tháng</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(2340000000)}</p>
                <p className="text-xs text-green-600">+15.2% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm theo tên, mã code..."
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
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="paused">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Thống kê
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Coupon Codes ({filteredCoupons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã code</TableHead>
                  <TableHead>Tên coupon</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Đã sử dụng</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{coupon.name}</p>
                        <p className="text-sm text-gray-500">{coupon.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Đơn tối thiểu: {formatPrice(coupon.minOrder)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(coupon.startDate)}</p>
                        <p className="text-sm text-gray-500">đến {formatDate(coupon.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coupon.status)}>
                        {getStatusLabel(coupon.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Campaigns ({filteredCampaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên campaign</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngân sách</TableHead>
                  <TableHead>Đã chi</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Tỷ lệ chuyển đổi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {campaign.type === 'flash_sale' ? 'Flash Sale' :
                         campaign.type === 'seasonal' ? 'Theo mùa' : 'Targeted'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatPrice(campaign.budget)}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{formatPrice(campaign.spent)}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatNumber(campaign.orders)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatPrice(campaign.revenue)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-900">{campaign.conversionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Promotions ({filteredPromotions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên promotion</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Sản phẩm áp dụng</TableHead>
                  <TableHead>Điều kiện</TableHead>
                  <TableHead>Lượt sử dụng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{promotion.name}</p>
                        <p className="text-sm text-gray-500">{promotion.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {promotion.type === 'buy_x_get_y' ? 'Mua X tặng Y' :
                         promotion.type === 'free_shipping' ? 'Miễn phí ship' : 'Giảm theo SL'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {promotion.applicableProducts === 'all' ? 'Tất cả' : promotion.applicableProducts}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {promotion.conditions}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatNumber(promotion.usageCount)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatPrice(promotion.revenue)}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(promotion.startDate)}</p>
                        <p className="text-sm text-gray-500">đến {formatDate(promotion.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(promotion.status)}>
                        {getStatusLabel(promotion.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
