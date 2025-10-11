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
  Plus,
  Edit,
  Trash2,
  Eye,
  Crown,
  Star,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react'

export default function PackageManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data
  const packages = [
    {
      id: '1',
      name: 'Gói Miễn phí',
      type: 'free',
      price: 0,
      duration: 30,
      features: [
        'Đăng tối đa 5 sản phẩm',
        'Hỗ trợ cơ bản',
        'Thống kê cơ bản',
        'Không có ưu tiên hiển thị'
      ],
      limits: {
        products: 5,
        storage: '100MB',
        support: 'Email',
        analytics: 'Basic'
      },
      status: 'active',
      subscribers: 1250,
      revenue: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      color: 'gray',
      icon: Shield
    },
    {
      id: '2',
      name: 'Gói Cơ bản',
      type: 'basic',
      price: 299000,
      duration: 30,
      features: [
        'Đăng tối đa 50 sản phẩm',
        'Hỗ trợ ưu tiên',
        'Thống kê chi tiết',
        'Ưu tiên hiển thị vừa',
        'Quảng cáo cơ bản'
      ],
      limits: {
        products: 50,
        storage: '1GB',
        support: 'Priority',
        analytics: 'Advanced'
      },
      status: 'active',
      subscribers: 890,
      revenue: 266110000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T14:20:00Z',
      color: 'blue',
      icon: Star
    },
    {
      id: '3',
      name: 'Gói Pro',
      type: 'pro',
      price: 599000,
      duration: 30,
      features: [
        'Đăng không giới hạn sản phẩm',
        'Hỗ trợ 24/7',
        'Thống kê nâng cao',
        'Ưu tiên hiển thị cao',
        'Quảng cáo nâng cao',
        'Tích hợp API'
      ],
      limits: {
        products: 'Unlimited',
        storage: '10GB',
        support: '24/7',
        analytics: 'Premium'
      },
      status: 'active',
      subscribers: 456,
      revenue: 273144000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      color: 'purple',
      icon: Zap
    },
    {
      id: '4',
      name: 'Gói VIP',
      type: 'vip',
      price: 999000,
      duration: 30,
      features: [
        'Đăng không giới hạn sản phẩm',
        'Hỗ trợ VIP 24/7',
        'Thống kê chuyên sâu',
        'Ưu tiên hiển thị tối đa',
        'Quảng cáo premium',
        'Tích hợp API nâng cao',
        'Tư vấn chuyên gia',
        'Báo cáo tùy chỉnh'
      ],
      limits: {
        products: 'Unlimited',
        storage: '50GB',
        support: 'VIP 24/7',
        analytics: 'Enterprise'
      },
      status: 'active',
      subscribers: 123,
      revenue: 122877000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-22T16:45:00Z',
      color: 'gold',
      icon: Crown
    },
    {
      id: '5',
      name: 'Gói Featured',
      type: 'featured',
      price: 199000,
      duration: 7,
      features: [
        'Sản phẩm nổi bật 7 ngày',
        'Hiển thị đầu trang',
        'Tăng lượt xem',
        'Hỗ trợ cơ bản'
      ],
      limits: {
        products: 1,
        storage: '500MB',
        support: 'Email',
        analytics: 'Basic'
      },
      status: 'active',
      subscribers: 2340,
      revenue: 465660000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-25T11:30:00Z',
      color: 'orange',
      icon: Star
    }
  ]

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter
    const matchesType = typeFilter === 'all' || pkg.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-purple-100 text-purple-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      case 'featured': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'free': return 'Miễn phí'
      case 'basic': return 'Cơ bản'
      case 'pro': return 'Pro'
      case 'vip': return 'VIP'
      case 'featured': return 'Nổi bật'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Tạm dừng'
      case 'draft': return 'Bản nháp'
      default: return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.revenue, 0)
  const totalSubscribers = packages.reduce((sum, pkg) => sum + pkg.subscribers, 0)
  const activePackages = packages.filter(pkg => pkg.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
          <p className="text-gray-600 mt-1">Quản lý các gói đăng tin và dịch vụ cho người bán</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Báo cáo doanh thu
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo gói mới
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng gói</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                <p className="text-xs text-green-600">+2 tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người đăng ký</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubscribers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-green-600">+18% tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{activePackages}</p>
                <p className="text-xs text-gray-500">/{packages.length} gói</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên gói hoặc loại..."
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
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Loại gói" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="free">Miễn phí</SelectItem>
                  <SelectItem value="basic">Cơ bản</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="featured">Nổi bật</SelectItem>
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          const Icon = pkg.icon
          return (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      pkg.color === 'gray' ? 'bg-gray-100' :
                      pkg.color === 'blue' ? 'bg-blue-100' :
                      pkg.color === 'purple' ? 'bg-purple-100' :
                      pkg.color === 'gold' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        pkg.color === 'gray' ? 'text-gray-600' :
                        pkg.color === 'blue' ? 'text-blue-600' :
                        pkg.color === 'purple' ? 'text-purple-600' :
                        pkg.color === 'gold' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <Badge className={getTypeColor(pkg.type)}>
                        {getTypeLabel(pkg.type)}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(pkg.status)}>
                    {getStatusLabel(pkg.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(pkg.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      / {pkg.duration} ngày
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {pkg.subscribers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">người đăng ký</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Tính năng:</h4>
                  <ul className="space-y-1">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{pkg.features.length - 3} tính năng khác
                      </li>
                    )}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Sản phẩm</p>
                    <p className="text-sm font-medium">{pkg.limits.products}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lưu trữ</p>
                    <p className="text-sm font-medium">{pkg.limits.storage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hỗ trợ</p>
                    <p className="text-sm font-medium">{pkg.limits.support}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Thống kê</p>
                    <p className="text-sm font-medium">{pkg.limits.analytics}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Doanh thu theo gói dịch vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
