import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import { Label } from '@shared/components/ui/label'
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
} from '@shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react'
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdmin'
import { useForm, Controller } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/utils'
import type { AdminCategory } from '@admin/api/admin'

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.number().nullable().optional(),
  isActive: z.boolean(),
  displayOrder: z.number(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoryManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null
  )
  const pageSize = 100

  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize,
      isActive:
        statusFilter === 'active'
          ? true
          : statusFilter === 'inactive'
            ? false
            : undefined,
    }),
    [pageSize, statusFilter]
  )

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useAdminCategories(queryParams)
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const categories = useMemo(
    () => categoriesData?.items || [],
    [categoriesData?.items]
  )
  const totalCategories = categoriesData?.total || 0

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      isActive: true,
      displayOrder: 0,
    },
  })

  // Filter categories client-side for search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories
    return categories.filter(
      cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  const onOpenDialog = (category?: AdminCategory) => {
    if (category) {
      setEditingCategory(category)
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parentId: category.parentId || null,
        isActive: category.isActive,
        displayOrder: category.displayOrder,
      })
    } else {
      setEditingCategory(null)
      reset({
        name: '',
        slug: '',
        description: '',
        parentId: null,
        isActive: true,
        displayOrder: 0,
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit: SubmitHandler<CategoryFormValues> = async values => {
    try {
      const data = {
        ...values,
        slug: values.slug || undefined,
        description: values.description || undefined,
      }

      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data,
        })
        toast.success('Cập nhật danh mục thành công')
      } else {
        await createCategoryMutation.mutateAsync(data)
        toast.success('Thêm danh mục mới thành công')
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          editingCategory
            ? 'Không thể cập nhật danh mục'
            : 'Không thể thêm danh mục'
        )
      )
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return
    try {
      await deleteCategoryMutation.mutateAsync(id)
      toast.success('Đã xóa danh mục thành công')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể xóa danh mục'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={() => onOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Đã ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục ({totalCategories})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Không thể tải danh sách danh mục</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có danh mục nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Danh mục cha</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thứ tự</TableHead>
                    <TableHead className="w-24 text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <Badge variant="outline" className="font-normal">
                            {category.parent.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Không có
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{category.productCount}</TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border-none px-2 py-0.5">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-none px-2 py-0.5">
                            <XCircle className="h-3 w-3 mr-1" />
                            Đã ẩn
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{category.displayOrder}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {category.productCount > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/admin/products/category/${category.id}`)
                              }}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Xem sản phẩm trong danh mục"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenDialog(category)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            disabled={category.productCount > 0}
                            title={
                              category.productCount > 0
                                ? 'Không thể xóa danh mục có sản phẩm'
                                : 'Xóa danh mục'
                            }
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin danh mục dưới đây. Nhấn lưu để hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit as SubmitHandler<CategoryFormValues>)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Đồ gia dụng"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Để trống để tự động tạo)</Label>
              <Input
                id="slug"
                placeholder="vi-du-do-gia-dung"
                {...register('slug')}
              />
              {errors.slug && (
                <p className="text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                placeholder="Nhập mô tả ngắn gọn..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Danh mục cha</Label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={val =>
                      field.onChange(val === 'none' ? null : Number(val))
                    }
                    value={field.value?.toString() || 'none'}
                  >
                    <SelectTrigger id="parentId">
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Không có (Danh mục gốc)
                      </SelectItem>
                      {categories
                        .filter(
                          c => c.id !== editingCategory?.id && !c.parentId
                        )
                        .map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.parentId && (
                <p className="text-xs text-red-500">
                  {errors.parentId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-xs text-red-500">
                    {errors.displayOrder.message}
                  </p>
                )}
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-3 mt-6 shadow-sm">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Hoạt động
                </Label>
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                }
                className="w-full sm:w-auto"
              >
                {(createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
