import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
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
import { Badge } from '@shared/components/ui/badge'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import { useProduct } from '@/hooks/useProducts'
import { useNotification } from '@shared/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import {
  Package,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Save,
  RefreshCw,
} from 'lucide-react'

// Stock In Form Schema
const stockInSchema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  costPrice: z.number().min(0, 'Giá nhập không được âm'),
  supplier: z.string().min(1, 'Vui lòng nhập nhà cung cấp'),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().min(1, 'Vui lòng nhập vị trí kho'),
})

type StockInFormData = z.infer<typeof stockInSchema>

interface StockInRecord {
  id: string
  productId: string
  productName: string
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
}

export default function StockInPage() {
  const navigate = useNavigate()
  const { productId } = useParams<{ productId?: string }>()
  const { notify } = useNotification()
  const { data: product } = useProduct(productId || '')

  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    sku: string
    currentStock: number
    costPrice: number
  } | null>(null)
  const [stockInHistory, setStockInHistory] = useState<StockInRecord[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockInFormData>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      productId: productId || '',
      quantity: 1,
      costPrice: 0,
      supplier: '',
      location: 'Kho A',
    },
  })

  const watchedValues = watch()
  const totalCost = watchedValues.quantity * watchedValues.costPrice

  // Mock data for demonstration
  const mockProducts = [
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      sku: 'IPH14PM-256',
      currentStock: 15,
      costPrice: 22000000,
    },
    {
      id: '2',
      name: 'AirPods Pro 2nd Gen',
      sku: 'APP2-001',
      currentStock: 25,
      costPrice: 4500000,
    },
    {
      id: '3',
      name: 'MacBook Pro M2 13"',
      sku: 'MBP13-M2',
      currentStock: 8,
      costPrice: 35000000,
    },
  ]

  useEffect(() => {
    const mockStockInHistory: StockInRecord[] = [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 14 Pro Max 256GB',
        quantity: 10,
        costPrice: 22000000,
        totalCost: 220000000,
        supplier: 'Apple Vietnam',
        batchNumber: 'BATCH001',
        location: 'Kho A - Kệ 1',
        notes: 'Nhập hàng định kỳ',
        createdAt: '2024-01-15T10:30:00Z',
        createdBy: 'Nguyễn Văn A',
      },
      {
        id: '2',
        productId: '2',
        productName: 'AirPods Pro 2nd Gen',
        quantity: 20,
        costPrice: 4500000,
        totalCost: 90000000,
        supplier: 'Apple Vietnam',
        batchNumber: 'BATCH002',
        location: 'Kho A - Kệ 2',
        notes: 'Nhập hàng khuyến mãi',
        createdAt: '2024-01-14T14:20:00Z',
        createdBy: 'Trần Thị B',
      },
    ]

    if (productId && product) {
      setSelectedProduct({
        id: product.id,
        name: product.title,
        sku: product.sku || '',
        currentStock: product.stock,
        costPrice: product.costPrice || 0,
      })
      setValue('productId', productId)
      setValue('costPrice', product.costPrice || 0)
    }
    setStockInHistory(mockStockInHistory)
  }, [productId, product, setValue])

  const { isLoading, execute } = useLoading({
    delay: 1000,
    onSuccess: () => {
      notify({
        type: 'success',
        title: 'Thành công',
        message: 'Nhập kho thành công!',
      })
      reset()
      // Refresh stock in history
      setStockInHistory(prev => [
        {
          id: Date.now().toString(),
          productId: watchedValues.productId,
          productName: selectedProduct?.name || 'Sản phẩm',
          quantity: watchedValues.quantity,
          costPrice: watchedValues.costPrice,
          totalCost: totalCost,
          supplier: watchedValues.supplier,
          batchNumber: watchedValues.batchNumber,
          expiryDate: watchedValues.expiryDate,
          location: watchedValues.location,
          notes: watchedValues.notes,
          createdAt: new Date().toISOString(),
          createdBy: 'Người dùng hiện tại',
        },
        ...prev,
      ])
    },
    onError: (error: Error) => {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: error.message,
      })
    },
  })

  const onSubmit = async (data: StockInFormData) => {
    await execute(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Stock in data:', data)
    })
  }

  const handleProductSelect = (product: {
    id: string
    name: string
    sku: string
    currentStock: number
    costPrice: number
  }) => {
    setSelectedProduct(product)
    setValue('productId', product.id)
    setValue('costPrice', product.costPrice)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Nhập kho sản phẩm</h1>
                <p className="text-muted-foreground">
                  Quản lý nhập kho và tồn kho sản phẩm
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stock In Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin nhập kho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Product Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="productId">Sản phẩm</Label>
                      <Select
                        onValueChange={value => {
                          const product = mockProducts.find(p => p.id === value)
                          if (product) handleProductSelect(product)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{product.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {product.currentStock} tồn kho
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.productId && (
                        <p className="text-sm text-red-500">
                          {errors.productId.message}
                        </p>
                      )}
                    </div>

                    {/* Selected Product Info */}
                    {selectedProduct && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>{selectedProduct.name}</strong> (SKU:{' '}
                              {selectedProduct.sku})
                            </span>
                            <Badge variant="outline">
                              Tồn kho hiện tại: {selectedProduct.currentStock}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Quantity and Cost */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số lượng</Label>
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
                          type="number"
                          min="0"
                          {...register('costPrice', { valueAsNumber: true })}
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
                        <span className="font-medium">
                          Tổng giá trị nhập kho:
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(totalCost)}
                        </span>
                      </div>
                    </div>

                    {/* Supplier and Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Nhà cung cấp</Label>
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
                        <Label htmlFor="location">Vị trí kho</Label>
                        <Select
                          onValueChange={value => setValue('location', value)}
                        >
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
                        <Label htmlFor="expiryDate">
                          Hạn sử dụng (tùy chọn)
                        </Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          {...register('expiryDate')}
                        />
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

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Nhập kho
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                      >
                        Làm mới
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Stock In History */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Lịch sử nhập kho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockInHistory.map(record => (
                      <div
                        key={record.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {record.productName}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {record.quantity} sản phẩm
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Nhà cung cấp: {record.supplier}</div>
                          <div>Vị trí: {record.location}</div>
                          <div>Giá: {formatPrice(record.costPrice)}</div>
                          <div>Tổng: {formatPrice(record.totalCost)}</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(record.createdAt)}
                          </div>
                        </div>
                        {record.batchNumber && (
                          <Badge variant="secondary" className="text-xs">
                            Lô: {record.batchNumber}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Thống kê nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tổng sản phẩm nhập hôm nay:</span>
                    <Badge variant="outline">30</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Giá trị nhập hôm nay:</span>
                    <Badge variant="outline">{formatPrice(310000000)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Số lô nhập:</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
