import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Crown,
  Star,
  Check,
  X,
  Users,
  DollarSign,
  Settings
} from 'lucide-react'

export default function PackageManagementPage() {
  const [packages] = useState([
    {
      id: 1,
      name: 'Gói Miễn phí',
      price: 0,
      duration: 'Vĩnh viễn',
      features: ['Đăng tối đa 5 sản phẩm', 'Hỗ trợ cơ bản', 'Không có quảng cáo'],
      limitations: ['Không có ưu tiên hiển thị', 'Không có thống kê chi tiết'],
      isActive: true,
      subscribers: 1250,
      revenue: 0
    },
    {
      id: 2,
      name: 'Gói Cơ bản',
      price: 99000,
      duration: '1 tháng',
      features: ['Đăng tối đa 50 sản phẩm', 'Hỗ trợ ưu tiên', 'Thống kê cơ bản', 'Quảng cáo nhẹ'],
      limitations: ['Không có ưu tiên cao nhất'],
      isActive: true,
      subscribers: 890,
      revenue: 88110000
    },
    {
      id: 3,
      name: 'Gói Pro',
      price: 199000,
      duration: '1 tháng',
      features: ['Đăng không giới hạn', 'Hỗ trợ 24/7', 'Thống kê chi tiết', 'Không quảng cáo', 'Ưu tiên hiển thị'],
      limitations: [],
      isActive: true,
      subscribers: 456,
      revenue: 90744000
    },
    {
      id: 4,
      name: 'Gói VIP',
      price: 399000,
      duration: '1 tháng',
      features: ['Tất cả tính năng Pro', 'Hỗ trợ cá nhân', 'Tùy chỉnh giao diện', 'API access', 'Ưu tiên cao nhất'],
      limitations: [],
      isActive: true,
      subscribers: 123,
      revenue: 49077000
    },
    {
      id: 5,
      name: 'Gói Doanh nghiệp',
      price: 999000,
      duration: '1 tháng',
      features: ['Tất cả tính năng VIP', 'Quản lý nhiều shop', 'Báo cáo doanh nghiệp', 'Tích hợp hệ thống', 'Hỗ trợ chuyên dụng'],
      limitations: [],
      isActive: false,
      subscribers: 45,
      revenue: 44955000
    }
  ])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const totalSubscribers = packages.reduce((sum, pkg) => sum + pkg.subscribers, 0)
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.revenue, 0)
  const activePackages = packages.filter(pkg => pkg.isActive).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
          <p className="text-gray-600 mt-1">Quản lý các gói đăng tin và dịch vụ cho người bán</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo gói mới
        </Button>
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
                <p className="text-xs text-green-600">{activePackages} đang hoạt động</p>
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
                <p className="text-sm text-gray-600">Tổng người đăng ký</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalSubscribers)}</p>
                <p className="text-xs text-green-600">+12 tháng này</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-green-600">+8.5% so với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gói phổ biến</p>
                <p className="text-2xl font-bold text-gray-900">Gói Pro</p>
                <p className="text-xs text-blue-600">456 người đăng ký</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên gói</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Người đăng ký</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pkg.id === 1 ? 'bg-gray-100' :
                        pkg.id === 2 ? 'bg-blue-100' :
                        pkg.id === 3 ? 'bg-green-100' :
                        pkg.id === 4 ? 'bg-yellow-100' :
                        'bg-purple-100'
                      }`}>
                        {pkg.id === 1 ? <Check className="h-4 w-4 text-gray-600" /> :
                         pkg.id === 2 ? <Star className="h-4 w-4 text-blue-600" /> :
                         pkg.id === 3 ? <Crown className="h-4 w-4 text-green-600" /> :
                         pkg.id === 4 ? <Crown className="h-4 w-4 text-yellow-600" /> :
                         <Crown className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pkg.name}</p>
                        <p className="text-sm text-gray-500">{pkg.features.length} tính năng</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{formatPrice(pkg.price)}</p>
                    {pkg.price > 0 && (
                      <p className="text-sm text-gray-500">/ {pkg.duration}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900">{pkg.duration}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{formatNumber(pkg.subscribers)}</p>
                    <p className="text-sm text-gray-500">
                      {((pkg.subscribers / totalSubscribers) * 100).toFixed(1)}% tổng
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{formatPrice(pkg.revenue)}</p>
                    <p className="text-sm text-gray-500">tháng này</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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

      {/* Package Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.slice(0, 2).map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {pkg.id === 1 ? <Check className="h-5 w-5 text-gray-600" /> :
                   pkg.id === 2 ? <Star className="h-5 w-5 text-blue-600" /> :
                   <Crown className="h-5 w-5 text-green-600" />}
                  {pkg.name}
                </CardTitle>
                <Badge className={pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                  {pkg.price > 0 && (
                    <p className="text-sm text-gray-500">/ {pkg.duration}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tính năng bao gồm:</h4>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.limitations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hạn chế:</h4>
                    <ul className="space-y-1">
                      {pkg.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <X className="h-3 w-3 text-red-600 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Người đăng ký:</span>
                    <span className="font-medium">{formatNumber(pkg.subscribers)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Doanh thu tháng:</span>
                    <span className="font-medium">{formatPrice(pkg.revenue)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
