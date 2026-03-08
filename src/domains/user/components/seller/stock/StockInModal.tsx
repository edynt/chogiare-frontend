import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@shared/components/ui/dialog'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import { Textarea } from '@shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import { useNotification } from '@shared/components/notification-provider'
import {
  Plus,
  Minus,
  Package,
  CheckCircle,
  AlertTriangle,
  Save,
  X,
} from 'lucide-react'

// Stock In Modal Schema
const stockInModalSchema = z.object({
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  costPrice: z
    .number({ error: 'Giá nhập phải là số hợp lệ' })
    .min(0, 'Giá nhập không được âm')
    .optional(),
  supplier: z.string().min(1, 'Vui lòng nhập nhà cung cấp'),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().min(1, 'Vui lòng chọn vị trí kho'),
})

type StockInModalFormData = z.infer<typeof stockInModalSchema>

interface Product {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  costPrice?: number
}

interface StockInModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onStockIn: (
    data: StockInModalFormData & { productId: string }
  ) => Promise<void>
}

export function StockInModal({
  isOpen,
  onClose,
  product,
  onStockIn,
}: StockInModalProps) {
  const { notify } = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockInModalFormData>({
    resolver: zodResolver(stockInModalSchema),
    defaultValues: {
      quantity: 1,
      costPrice: 0,
      supplier: '',
      location: 'Kho A',
    },
  })

  const watchedValues = watch()
  const totalCost = watchedValues.quantity * watchedValues.costPrice

  // Reset form when product changes
  React.useEffect(() => {
    if (product) {
      reset({
        quantity: 1,
        costPrice: product.costPrice || 0,
        supplier: '',
        location: 'Kho A',
      })
    }
  }, [product, reset])

  const onSubmit = async (data: StockInModalFormData) => {
    if (!product) return

    setIsLoading(true)
    try {
      await onStockIn({
        ...data,
        productId: product.id,
      })

      notify({
        type: 'success',
        title: 'Nhập kho thành công',
        message: `Đã nhập ${data.quantity} sản phẩm "${product.name}" vào kho`,
      })

      reset()
      onClose()
    } catch (error) {
      notify({
        type: 'error',
        title: 'Lỗi nhập kho',
        message:
          error instanceof Error ? error.message : 'Có lỗi xảy ra khi nhập kho',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'text-red-600' }
    if (stock <= minStock)
      return { label: 'Sắp hết hàng', color: 'text-yellow-600' }
    return { label: 'Còn hàng', color: 'text-green-600' }
  }

  if (!product) return null

  const stockStatus = getStockStatus(product.currentStock, product.minStock)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Nhập kho sản phẩm
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Tồn kho hiện tại:{' '}
                </span>
                <span className="font-medium">{product.currentStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Tồn kho tối thiểu:{' '}
                </span>
                <span className="font-medium">{product.minStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Trạng thái: </span>
                <span className={`font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Alert */}
          {product.currentStock <= product.minStock && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cảnh báo:</strong> Sản phẩm sắp hết hàng! Cần nhập thêm
                kho.
              </AlertDescription>
            </Alert>
          )}

          {/* Quantity and Cost Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng nhập</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setValue(
                      'quantity',
                      Math.max(1, watchedValues.quantity - 1)
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...register('quantity', { valueAsNumber: true })}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setValue('quantity', watchedValues.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Giá nhập (VNĐ)</Label>
              <Input
                id="costPrice"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                {...register('costPrice')}
                placeholder="0"
              />
              {errors.costPrice && (
                <p className="text-sm text-red-500">
                  {errors.costPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Total Cost Display */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Tổng giá trị nhập kho:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(totalCost)}
              </span>
            </div>
          </div>

          {/* Supplier and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Nhà cung cấp *</Label>
              <Input
                id="supplier"
                {...register('supplier')}
                placeholder="Tên nhà cung cấp"
              />
              {errors.supplier && (
                <p className="text-sm text-red-500">
                  {errors.supplier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Vị trí kho *</Label>
              <Select onValueChange={value => setValue('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kho A">Kho A</SelectItem>
                  <SelectItem value="Kho B">Kho B</SelectItem>
                  <SelectItem value="Kho C">Kho C</SelectItem>
                  <SelectItem value="Kho D">Kho D</SelectItem>
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Batch Number and Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Số lô (tùy chọn)</Label>
              <Input
                id="batchNumber"
                {...register('batchNumber')}
                placeholder="BATCH001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Hạn sử dụng (tùy chọn)</Label>
              <Input id="expiryDate" type="date" {...register('expiryDate')} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Ghi chú về lô hàng..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                Tóm tắt nhập kho
              </span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div>Sản phẩm: {product.name}</div>
              <div>Số lượng: {watchedValues.quantity} sản phẩm</div>
              <div>Giá nhập: {formatPrice(watchedValues.costPrice)}</div>
              <div>Tổng giá trị: {formatPrice(totalCost)}</div>
              <div>Nhà cung cấp: {watchedValues.supplier || 'Chưa nhập'}</div>
              <div>Vị trí kho: {watchedValues.location}</div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !watchedValues.supplier ||
                watchedValues.costPrice <= 0
              }
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Nhập kho ({watchedValues.quantity} sản phẩm)
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
