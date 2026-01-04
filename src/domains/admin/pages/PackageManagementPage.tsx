import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@shared/components/ui/dialog'
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
  Settings,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  usePackages,
  usePackageStats,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  useTogglePackageStatus,
} from '@/hooks/useAdmin'
import type { ServicePackage, CreatePackageData } from '@admin/api/admin'

export default function PackageManagementPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null)
  const [formData, setFormData] = useState<CreatePackageData>({
    name: '',
    price: 0,
    duration: '1 tháng',
    features: [],
    limitations: [],
    isActive: true,
  })
  const [featuresText, setFeaturesText] = useState('')
  const [limitationsText, setLimitationsText] = useState('')

  const { data: packages = [], isLoading } = usePackages()
  const { data: stats } = usePackageStats()
  const createPackageMutation = useCreatePackage()
  const updatePackageMutation = useUpdatePackage()
  const deletePackageMutation = useDeletePackage()
  const toggleStatusMutation = useTogglePackageStatus()

  const formatPrice = (price: number) => {
    // Defense-in-depth: Handle NaN, null, undefined at UI layer
    if (price == null || isNaN(price)) {
      return 'Liên hệ'
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    // Defense-in-depth: Handle NaN, null, undefined
    if (num == null || isNaN(num)) {
      return '0'
    }

    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const totalSubscribers = packages.reduce((sum, pkg) => sum + pkg.subscribers, 0)
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.revenue, 0)
  const activePackages = packages.filter(pkg => pkg.isActive).length

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      price: 0,
      duration: '1 tháng',
      features: [],
      limitations: [],
      isActive: true,
    })
    setFeaturesText('')
    setLimitationsText('')
    setIsCreateDialogOpen(true)
  }

  const handleOpenEdit = (pkg: ServicePackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      features: pkg.features,
      limitations: pkg.limitations,
      isActive: pkg.isActive,
    })
    setFeaturesText(pkg.features.join('\n'))
    setLimitationsText(pkg.limitations.join('\n'))
    setIsEditDialogOpen(true)
  }

  const handleCreate = () => {
    const features = featuresText.split('\n').filter(f => f.trim())
    const limitations = limitationsText.split('\n').filter(l => l.trim())

    createPackageMutation.mutate(
      { ...formData, features, limitations },
      {
        onSuccess: () => {
          toast.success('Đã tạo gói dịch vụ mới')
          setIsCreateDialogOpen(false)
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo gói dịch vụ')
        },
      }
    )
  }

  const handleUpdate = () => {
    if (!editingPackage) return

    const features = featuresText.split('\n').filter(f => f.trim())
    const limitations = limitationsText.split('\n').filter(l => l.trim())

    updatePackageMutation.mutate(
      { id: editingPackage.id, data: { ...formData, features, limitations } },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật gói dịch vụ')
          setIsEditDialogOpen(false)
          setEditingPackage(null)
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi cập nhật gói dịch vụ')
        },
      }
    )
  }

  const handleDelete = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return

    deletePackageMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Đã xóa gói dịch vụ')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa gói dịch vụ')
      },
    })
  }

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Đã cập nhật trạng thái gói dịch vụ')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
          <p className="text-gray-600 mt-1">Quản lý các gói đăng tin và dịch vụ cho người bán</p>
        </div>
        <Button onClick={handleOpenCreate}>
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
                <p className="text-2xl font-bold text-gray-900">{stats?.totalPackages ?? packages.length}</p>
                <p className="text-xs text-green-600">{stats?.activePackages ?? activePackages} đang hoạt động</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.totalSubscribers ?? totalSubscribers)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats?.monthlyRevenue ?? totalRevenue)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats?.popularPackage ?? 'N/A'}</p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có gói dịch vụ nào
            </div>
          ) : (
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
                          pkg.price === 0 ? 'bg-gray-100' :
                          pkg.price < 200000 ? 'bg-blue-100' :
                          pkg.price < 400000 ? 'bg-green-100' :
                          pkg.price < 1000000 ? 'bg-yellow-100' :
                          'bg-purple-100'
                        }`}>
                          {pkg.price === 0 ? <Check className="h-4 w-4 text-gray-600" /> :
                           pkg.price < 200000 ? <Star className="h-4 w-4 text-blue-600" /> :
                           <Crown className="h-4 w-4 text-green-600" />}
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
                        {totalSubscribers > 0 ? ((pkg.subscribers / totalSubscribers) * 100).toFixed(1) : 0}% tổng
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{formatPrice(pkg.revenue)}</p>
                      <p className="text-sm text-gray-500">tháng này</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => handleToggleStatus(pkg.id)}
                      >
                        {toggleStatusMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : null}
                        {pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deletePackageMutation.isPending}
                        >
                          {deletePackageMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Package Details */}
      {packages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.slice(0, 2).map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {pkg.price === 0 ? <Check className="h-5 w-5 text-gray-600" /> :
                     pkg.price < 200000 ? <Star className="h-5 w-5 text-blue-600" /> :
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
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOpenEdit(pkg)}
                    >
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
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo gói dịch vụ mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên gói</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Gói Pro"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Giá (VND)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="VD: 199000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thời hạn</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="VD: 1 tháng"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tính năng (mỗi dòng một tính năng)</label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="VD: Đăng không giới hạn&#10;Hỗ trợ 24/7"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hạn chế (mỗi dòng một hạn chế)</label>
              <Textarea
                value={limitationsText}
                onChange={(e) => setLimitationsText(e.target.value)}
                placeholder="VD: Không có ưu tiên cao nhất"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={createPackageMutation.isPending}>
              {createPackageMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Tạo gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa gói dịch vụ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên gói</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Giá (VND)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thời hạn</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tính năng (mỗi dòng một tính năng)</label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hạn chế (mỗi dòng một hạn chế)</label>
              <Textarea
                value={limitationsText}
                onChange={(e) => setLimitationsText(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={updatePackageMutation.isPending}>
              {updatePackageMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
