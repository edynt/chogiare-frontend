import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import { Badge } from '@shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shared/components/ui/alert-dialog'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  useAdminPackages,
  useAdminPackageStats,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
} from '@/hooks/useAdmin'
import { getApiErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'
import type { AdminPackage, CreatePackageData } from '@admin/api/admin'

interface PackageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formData: PackageFormData
  setFormData: React.Dispatch<React.SetStateAction<PackageFormData>>
  handleCloseDialogs: () => void
  handleSubmit: () => void
  createPending: boolean
  updatePending: boolean
}

const PackageFormDialog: React.FC<PackageFormDialogProps> = ({
  open,
  onOpenChange,
  title,
  formData,
  setFormData,
  handleCloseDialogs,
  handleSubmit,
  createPending,
  updatePending,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Điền thông tin gói dịch vụ premium
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">
              Tên hiển thị <span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayName"
              placeholder="Gói 1 Ngày"
              value={formData.displayName}
              onChange={e =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên gói <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="goi_1_ngay"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input
            id="description"
            placeholder="Gói dùng thử cho người mới"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="durationDays">
              Thời hạn (ngày) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="durationDays"
              type="number"
              min="1"
              value={formData.durationDays}
              onChange={e =>
                setFormData({
                  ...formData,
                  durationDays: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={formData.price}
              onChange={e => {
                const value = e.target.value
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({
                    ...formData,
                    price: parseFloat(value) || 0,
                  })
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
            <Input
              id="displayOrder"
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={e =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Tính năng (mỗi dòng một tính năng)</Label>
          <textarea
            id="features"
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Đăng sản phẩm không giới hạn&#10;Hiển thị nổi bật&#10;Hỗ trợ ưu tiên"
            value={formData.featuresText}
            onChange={e =>
              setFormData({ ...formData, featuresText: e.target.value })
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={e =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Kích hoạt gói dịch vụ
          </Label>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={handleCloseDialogs}
          disabled={createPending || updatePending} // Thêm disable cho nút Hủy
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createPending || updatePending}
        >
          {createPending || updatePending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {formData.id ? 'Đang cập nhật...' : 'Đang tạo...'}
            </>
          ) : formData.id ? (
            'Cập nhật'
          ) : (
            'Tạo mới'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

interface PackageFormData extends CreatePackageData {
  id?: number
  featuresText: string
}

const emptyFormData: PackageFormData = {
  displayName: '',
  name: '',
  description: '',
  durationDays: 1,
  price: 0,
  displayOrder: 0,
  isActive: true,
  features: [],
  featuresText: '',
}

export default function PackagesManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<PackageFormData>(emptyFormData)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      pageSize,
      sortBy: 'displayOrder' as const,
      sortOrder: 'asc' as const,
    }
    if (activeFilter !== 'all') {
      params.isActive = activeFilter === 'active'
    }
    return params
  }, [page, pageSize, activeFilter])

  const {
    data: packagesData,
    isLoading: packagesLoading,
    error: packagesError,
  } = useAdminPackages(queryParams)
  const { data: packageStats, isLoading: statsLoading } = useAdminPackageStats()
  const createPackageMutation = useCreatePackage()
  const updatePackageMutation = useUpdatePackage()
  const deletePackageMutation = useDeletePackage()

  const packages = packagesData?.items || []
  const totalPackages = packagesData?.total || 0
  const totalPages = packagesData?.totalPages || 0

  const filteredPackages = useMemo(() => {
    if (!searchQuery) return packages
    return packages.filter(
      pkg =>
        pkg.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [packages, searchQuery])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleOpenCreateDialog = () => {
    setFormData(emptyFormData)
    setIsCreateDialogOpen(true)
  }

  const handleOpenEditDialog = (pkg: AdminPackage) => {
    setFormData({
      id: pkg.id,
      displayName: pkg.displayName,
      name: pkg.name,
      description: pkg.description || '',
      durationDays: pkg.durationDays,
      price: pkg.price,
      displayOrder: pkg.displayOrder,
      isActive: pkg.isActive,
      features: pkg.features,
      featuresText: pkg.features.join('\n'),
    })
    setIsEditDialogOpen(true)
  }

  const handleCloseDialogs = () => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setFormData(emptyFormData)
  }

  const validateForm = (): boolean => {
    if (!formData.displayName.trim()) {
      toast.error('Vui lòng nhập tên hiển thị')
      return false
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên gói')
      return false
    }
    if (formData.durationDays < 1) {
      toast.error('Thời hạn phải lớn hơn 0')
      return false
    }
    if (formData.price < 0) {
      toast.error('Giá không thể âm')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const features = formData.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const submitData: CreatePackageData = {
        displayName: formData.displayName,
        name: formData.name,
        description: formData.description || undefined,
        durationDays: formData.durationDays,
        price: formData.price,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        features,
      }

      if (formData.id) {
        await updatePackageMutation.mutateAsync({
          id: formData.id,
          data: submitData,
        })
        toast.success('Đã cập nhật gói dịch vụ thành công')
      } else {
        await createPackageMutation.mutateAsync(submitData)
        toast.success('Đã tạo gói dịch vụ thành công')
      }
      handleCloseDialogs()
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          formData.id
            ? 'Không thể cập nhật gói dịch vụ'
            : 'Không thể tạo gói dịch vụ'
        )
      )
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePackageMutation.mutateAsync(id)
      toast.success('Đã xóa gói dịch vụ thành công')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể xóa gói dịch vụ'))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý gói dịch vụ
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các gói premium membership cho người dùng
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo gói mới
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng gói</p>
                  <p className="text-xl font-bold text-gray-900">
                    {packageStats?.totalPackages || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gói đang hoạt động</p>
                  <p className="text-xl font-bold text-gray-900">
                    {packageStats?.activePackages || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lượt mua</p>
                  <p className="text-xl font-bold text-gray-900">
                    {packageStats?.totalPurchases || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {statsLoading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(packageStats?.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            )}
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
                  placeholder="Tìm kiếm theo tên gói..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói dịch vụ ({totalPackages})</CardTitle>
        </CardHeader>
        <CardContent>
          {packagesError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">
                  Không thể tải danh sách gói dịch vụ
                </p>
              </div>
            </div>
          ) : packagesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? 'Không tìm thấy gói dịch vụ nào'
                : 'Chưa có gói dịch vụ nào'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên gói</TableHead>
                      <TableHead>Thời hạn</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lượt mua</TableHead>
                      <TableHead>Thứ tự</TableHead>
                      <TableHead className="w-32">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.map(pkg => (
                      <TableRow key={pkg.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {pkg.displayName}
                            </p>
                            <p className="text-sm text-gray-500">{pkg.name}</p>
                            {pkg.description && (
                              <p className="text-xs text-gray-400 mt-1">
                                {pkg.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {pkg.durationDays}{' '}
                              {pkg.durationDays === 1 ? 'ngày' : 'ngày'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-gray-900">
                            {formatPrice(pkg.price)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pkg.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {pkg.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Tạm dừng
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {pkg.purchaseCount || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {pkg.displayOrder}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Chỉnh sửa"
                              onClick={() => handleOpenEditDialog(pkg)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  title="Xóa gói"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xóa gói dịch vụ
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa gói "
                                    {pkg.displayName}"? Hành động này sẽ vô hiệu
                                    hóa gói dịch vụ.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(pkg.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || packagesLoading}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || packagesLoading}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <PackageFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Tạo gói dịch vụ mới"
        formData={formData}
        setFormData={setFormData}
        handleCloseDialogs={handleCloseDialogs}
        handleSubmit={handleSubmit}
        createPending={createPackageMutation.isPending}
        updatePending={updatePackageMutation.isPending}
      />

      {/* Edit Dialog */}
      <PackageFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Chỉnh sửa gói dịch vụ"
        formData={formData}
        setFormData={setFormData}
        handleCloseDialogs={handleCloseDialogs}
        handleSubmit={handleSubmit}
        createPending={createPackageMutation.isPending}
        updatePending={updatePackageMutation.isPending}
      />
    </div>
  )
}
