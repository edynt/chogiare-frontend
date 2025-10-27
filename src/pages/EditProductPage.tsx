import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productUpdateSchema, type ProductUpdateFormData } from '@/lib/schemas'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useProduct, useUpdateProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useProducts'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import { 
  Edit, 
  Upload, 
  X, 
  Package, 
  DollarSign, 
  MapPin, 
  Tag,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import type { Product, ProductCondition, ProductStatus } from '@/types'

// Using Zod schema from lib/schemas.ts

export default function EditProductPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { notify } = useNotification()
  const { data: product, isLoading: isLoadingProduct } = useProduct(id || '')
  const updateProductMutation = useUpdateProduct()
  const { data: categories } = useCategories()
  const { isLoading, execute } = useLoading({
    delay: 1000,
    onSuccess: () => {
      notify({
        type: 'success',
        title: 'Thành công',
        message: 'Sản phẩm đã được cập nhật thành công!',
      })
      navigate('/seller/products')
    },
    onError: (error: Error) => {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: error.message,
      })
    },
  })

  const [images, setImages] = useState<string[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [stockInQuantity, setStockInQuantity] = useState(1)
  const [stockInCostPrice, setStockInCostPrice] = useState(0)
  const [stockInSupplier, setStockInSupplier] = useState('')
  const [stockInLocation, setStockInLocation] = useState('Kho A')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductUpdateFormData>({
    resolver: zodResolver(productUpdateSchema),
  })

  const availableBadges = ['NEW', 'FEATURED', 'PROMO', 'HOT', 'SALE']
  const conditions: { value: ProductCondition; label: string }[] = [
    { value: 'new', label: 'Mới 100%' },
    { value: 'like_new', label: 'Như mới' },
    { value: 'good', label: 'Tốt' },
    { value: 'fair', label: 'Khá' },
    { value: 'poor', label: 'Cũ' },
  ]

  const statuses: { value: ProductStatus; label: string }[] = [
    { value: 'draft', label: 'Bản nháp' },
    { value: 'active', label: 'Đang bán' },
    { value: 'sold', label: 'Đã bán' },
    { value: 'archived', label: 'Lưu trữ' },
    { value: 'suspended', label: 'Tạm dừng' },
  ]

  // Load product data when available
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        categoryId: product.categoryId,
        condition: product.condition,
        location: product.location,
        stock: product.stock,
        tags: product.tags.join(', '),
        status: product.status,
      })
      setImages(product.images)
      setSelectedBadges(product.badges)
    }
  }, [product, reset])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    )
  }

  const onSubmit = (data: ProductUpdateFormData) => {
    if (!id) return

    execute(async () => {
      const productData: Partial<Product> = {
        ...data,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=400&h=400&fit=crop'],
        badges: selectedBadges as any[],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      }

      await new Promise((resolve, reject) => {
        updateProductMutation.mutate(
          { id, data: productData },
          {
            onSuccess: () => resolve(undefined),
            onError: (error: Error) => reject(error),
          }
        )
      })
    })
  }

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-64 bg-muted rounded" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <Button onClick={() => navigate('/seller/products')}>
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Edit className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Cập nhật thông tin sản phẩm "{product.title}"
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Tên sản phẩm *</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tên sản phẩm..."
                    {...register('title')}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Mô tả sản phẩm *</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows={4}
                    {...register('description')}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="categoryId">Danh mục *</Label>
                    <Select 
                      value={watch('categoryId')} 
                      onValueChange={(value) => setValue('categoryId', value)}
                    >
                      <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="condition">Tình trạng *</Label>
                    <Select 
                      value={watch('condition')} 
                      onValueChange={(value) => setValue('condition', value as ProductCondition)}
                    >
                      <SelectTrigger className={errors.condition ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.condition && <p className="text-sm text-destructive mt-1">{errors.condition.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="status">Trạng thái *</Label>
                    <Select 
                      value={watch('status')} 
                      onValueChange={(value) => setValue('status', value as ProductStatus)}
                    >
                      <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Giá cả
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Giá bán * (VNĐ)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      {...register('price', { valueAsNumber: true })}
                      className={errors.price ? 'border-destructive' : ''}
                    />
                    {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="0"
                      {...register('originalPrice', { valueAsNumber: true })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Để trống nếu không có giá gốc</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Số lượng *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="1"
                      {...register('stock', { valueAsNumber: true })}
                      className={errors.stock ? 'border-destructive' : ''}
                    />
                    {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="location">Địa điểm *</Label>
                    <Input
                      id="location"
                      placeholder="Ví dụ: Hà Nội, TP.HCM..."
                      {...register('location')}
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Hình ảnh sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Tải lên hình ảnh mới</Label>
                  <div className="mt-2">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tải lên tối đa 10 hình ảnh. Hình đầu tiên sẽ là ảnh đại diện.
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2">Ảnh chính</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags and Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags và Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    placeholder="Ví dụ: smartphone, android, camera"
                    {...register('tags')}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Giúp khách hàng dễ dàng tìm thấy sản phẩm của bạn
                  </p>
                </div>

                <div>
                  <Label>Badges</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableBadges.map((badge) => (
                      <div key={badge} className="flex items-center space-x-2">
                        <Checkbox
                          id={badge}
                          checked={selectedBadges.includes(badge)}
                          onCheckedChange={() => handleBadgeToggle(badge)}
                        />
                        <Label htmlFor={badge} className="text-sm">
                          <Badge variant="outline">{badge}</Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quản lý tồn kho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Stock Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tồn kho hiện tại</p>
                    <p className="text-2xl font-bold text-primary">{(product as any)?.stock || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tồn kho tối thiểu</p>
                    <p className="text-xl font-semibold">{(product as any)?.minStock || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tồn kho tối đa</p>
                    <p className="text-xl font-semibold">{(product as any)?.maxStock || 0}</p>
                  </div>
                </div>

                {/* Stock Alert */}
                {product && (product as any).stock <= ((product as any).minStock || 0) && (
                  <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-yellow-800 font-medium">
                        Cảnh báo: Sản phẩm sắp hết hàng! Cần nhập thêm kho.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Stock In */}
                <div className="space-y-4">
                  <h4 className="font-medium">Nhập kho nhanh</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stockInQuantity">Số lượng</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStockInQuantity(Math.max(1, stockInQuantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="stockInQuantity"
                          type="number"
                          min="1"
                          value={stockInQuantity}
                          onChange={(e) => setStockInQuantity(parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStockInQuantity(stockInQuantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockInCostPrice">Giá nhập (VNĐ)</Label>
                      <Input
                        id="stockInCostPrice"
                        type="number"
                        min="0"
                        value={stockInCostPrice}
                        onChange={(e) => setStockInCostPrice(parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stockInSupplier">Nhà cung cấp</Label>
                      <Input
                        id="stockInSupplier"
                        value={stockInSupplier}
                        onChange={(e) => setStockInSupplier(e.target.value)}
                        placeholder="Tên nhà cung cấp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockInLocation">Vị trí kho</Label>
                      <Select value={stockInLocation} onValueChange={setStockInLocation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kho A">Kho A</SelectItem>
                          <SelectItem value="Kho B">Kho B</SelectItem>
                          <SelectItem value="Kho C">Kho C</SelectItem>
                          <SelectItem value="Kho D">Kho D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Total Cost Display */}
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tổng giá trị nhập kho:</span>
                      <span className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(stockInQuantity * stockInCostPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Stock In Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement stock in functionality
                      notify({
                        type: 'success',
                        title: 'Nhập kho thành công',
                        message: `Đã nhập ${stockInQuantity} sản phẩm vào kho`,
                      })
                      // Reset form
                      setStockInQuantity(1)
                      setStockInCostPrice(0)
                      setStockInSupplier('')
                      setStockInLocation('Kho A')
                    }}
                    disabled={!stockInSupplier || stockInCostPrice <= 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nhập kho ({stockInQuantity} sản phẩm)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  // TODO: Implement delete functionality
                  notify({
                    type: 'warning',
                    title: 'Chức năng chưa hoàn thiện',
                    message: 'Chức năng xóa sản phẩm sẽ được thêm sau.',
                  })
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa sản phẩm
              </Button>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || updateProductMutation.isPending}
                >
                  {isLoading || updateProductMutation.isPending ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cập nhật sản phẩm
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
