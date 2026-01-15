import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from '@shared/components/ui/alert-dialog'
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useDepositPackages,
  useCreateDepositPackage,
  useUpdateDepositPackage,
  useDeleteDepositPackage,
} from '@/hooks/useAdmin'
import type { DepositPackage, CreateDepositPackageData } from '@admin/api/admin'

export default function DepositPackagesManagementPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<DepositPackage | null>(
    null
  )
  const [deletingPackage, setDeletingPackage] = useState<DepositPackage | null>(
    null
  )
  const [formData, setFormData] = useState<CreateDepositPackageData>({
    name: '',
    amount: 0,
    displayOrder: 0,
    isActive: true,
  })

  const { data: packagesData, isLoading } = useDepositPackages({
    page,
    limit: pageSize,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy: 'displayOrder',
    sortOrder: 'asc',
  })

  const createPackageMutation = useCreateDepositPackage()
  const updatePackageMutation = useUpdateDepositPackage()
  const deletePackageMutation = useDeleteDepositPackage()

  const packages = packagesData?.items || []
  const total = packagesData?.total || 0
  const totalPages = packagesData?.totalPages || 1

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      amount: 0,
      displayOrder: 0,
      isActive: true,
    })
    setIsCreateDialogOpen(true)
  }

  const handleOpenEdit = (pkg: DepositPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      amount: pkg.amount,
      displayOrder: pkg.displayOrder,
      isActive: pkg.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const handleOpenDelete = (pkg: DepositPackage) => {
    setDeletingPackage(pkg)
    setIsDeleteDialogOpen(true)
  }

  const handleCreate = async () => {
    if (!formData.name || formData.amount <= 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ')
      return
    }

    try {
      await createPackageMutation.mutateAsync(formData)
      toast.success('Tạo gói nạp tiền thành công')
      setIsCreateDialogOpen(false)
    } catch (errory) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo gói nạp tiền'
      )
    }
  }

  const handleUpdate = async () => {
    if (!editingPackage) return
    if (!formData.name || formData.amount <= 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ')
      return
    }

    try {
      await updatePackageMutation.mutateAsync({
        id: editingPackage.id,
        data: formData,
      })
      toast.success('Cập nhật gói nạp tiền thành công')
      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật gói nạp tiền'
      )
    }
  }

  const handleDelete = async () => {
    if (!deletingPackage) return

    try {
      await deletePackageMutation.mutateAsync(deletingPackage.id)
      toast.success('Xóa gói nạp tiền thành công')
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa gói nạp tiền'
      )
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý gói nạp tiền</h1>
          <p className="text-muted-foreground">
            Quản lý các gói nạp tiền trong hệ thống
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo gói mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách gói nạp tiền
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-2" />
              <p>Chưa có gói nạp tiền nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên gói</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Thứ tự hiển thị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map(pkg => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{formatCurrency(pkg.amount)}</TableCell>
                      <TableCell>{pkg.displayOrder}</TableCell>
                      <TableCell>
                        <Badge
                          variant={pkg.isActive ? 'default' : 'secondary'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {pkg.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Ngừng
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(pkg)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages} ({total} gói)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
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
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo gói nạp tiền mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên gói *</label>
              <Input
                placeholder="VD: Gói nạp 100K"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Số tiền (VNĐ) *</label>
              <Input
                type="number"
                placeholder="100000"
                value={formData.amount || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thứ tự hiển thị</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.displayOrder || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-active"
                checked={formData.isActive}
                onChange={e =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <label htmlFor="create-active" className="text-sm font-medium">
                Kích hoạt ngay
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createPackageMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createPackageMutation.isPending}
            >
              {createPackageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tạo gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa gói nạp tiền</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên gói *</label>
              <Input
                placeholder="VD: Gói nạp 100K"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Số tiền (VNĐ) *</label>
              <Input
                type="number"
                placeholder="100000"
                value={formData.amount || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thứ tự hiển thị</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.displayOrder || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.isActive}
                onChange={e =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <label htmlFor="edit-active" className="text-sm font-medium">
                Đang hoạt động
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updatePackageMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updatePackageMutation.isPending}
            >
              {updatePackageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa gói nạp tiền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói "{deletingPackage?.name}" không?
              Hành động này sẽ vô hiệu hóa gói này và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePackageMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePackageMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePackageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa gói
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
