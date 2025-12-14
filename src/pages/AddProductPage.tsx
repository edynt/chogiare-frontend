import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormData } from '@/lib/schemas'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useCreateProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useProducts'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import {
  Plus,
  X,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Save,
  ArrowLeft,
} from 'lucide-react'
import type { ProductCondition, ProductStatus } from '@/types'

// Using Zod schema from lib/schemas.ts

export default function AddProductPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const createProductMutation = useCreateProduct()
  const { data: categories } = useCategories()
  const { isLoading, execute } = useLoading({
    delay: 1000,
    onSuccess: () => {
      notify({
        type: 'success',
        title: 'Thành công',
        message: 'Sản phẩm đã được thêm thành công!',
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
  const [status, setStatus] = useState<ProductStatus>('draft')
  const [inStock, setInStock] = useState(true)
  const [moq, setMoq] = useState(1)
  const [sku, setSku] = useState('')
  const [warehouseStock, setWarehouseStock] = useState('')
  const [warehouseLocation, setWarehouseLocation] = useState('')
  const [minStock, setMinStock] = useState(0)
  const [maxStock, setMaxStock] = useState(0)
  const [supplier, setSupplier] = useState('')
  const [costPrice, setCostPrice] = useState(0)
  const [material, setMaterial] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [color, setColor] = useState('')
  const [packaging, setPackaging] = useState('')
  const [suggestedRetailPrice, setSuggestedRetailPrice] = useState('')
  const [origin, setOrigin] = useState('')
  const [certificates, setCertificates] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isFactory, setIsFactory] = useState(false)
  const [isWarranty, setIsWarranty] = useState(false)
  const [isReturnable, setIsReturnable] = useState(false)
  const [shippingNationwide, setShippingNationwide] = useState(false)
  const [deliveryTime, setDeliveryTime] = useState('')
  const [returnPolicy, setReturnPolicy] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: 'new',
      stock: 1,
      badges: [],
    },
  })

  const availableBadges = ['NEW', 'FEATURED', 'PROMO', 'HOT', 'SALE']
  const conditions: { value: ProductCondition; label: string }[] = [
    { value: 'new', label: 'Mới 100%' },
    { value: 'like_new', label: 'Như mới' },
    { value: 'good', label: 'Tốt' },
    { value: 'fair', label: 'Khá' },
    { value: 'poor', label: 'Cũ' },
  ]

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
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    )
    setValue('badges', selectedBadges)
  }

  const onSubmit = (data: ProductFormData) => {
    execute(async () => {
      const productData = {
        title: data.title,
        description: data.description || undefined,
        categoryId: typeof data.categoryId === 'string' ? parseInt(data.categoryId, 10) : data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice || undefined,
        condition: data.condition,
        location: data.location || undefined,
        stock: data.stock,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : undefined,
        badges: selectedBadges.length > 0 ? selectedBadges : undefined,
        minStock: minStock > 0 ? minStock : undefined,
        maxStock: maxStock > 0 ? maxStock : undefined,
        costPrice: costPrice > 0 ? costPrice : undefined,
        sellingPrice: data.price > 0 ? data.price : undefined,
        sku: sku || undefined,
      }

      await new Promise((resolve, reject) => {
        createProductMutation.mutate(productData as Parameters<typeof createProductMutation.mutate>[0], {
          onSuccess: () => resolve(undefined),
          onError: (error: Error) => reject(error),
        })
      })
    })
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
            <div
              onClick={() => navigate('/seller/products/add')}
              className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Plus className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Tạo sản phẩm mới để bán trên Chogiare
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Status Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'draft', label: 'Bản nháp' },
                    { value: 'active', label: 'Đang bán' },
                    { value: 'sold', label: 'Đã bán' },
                    { value: 'archived', label: 'Lưu trữ' },
                  ].map((s) => (
                    <Button
                      key={s.value}
                      type="button"
                      variant={status === s.value ? 'default' : 'outline'}
                      onClick={() => setStatus(s.value as ProductStatus)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="inStock"
                    checked={inStock}
                    onCheckedChange={(checked) => setInStock(checked as boolean)}
                  />
                  <Label htmlFor="inStock">Sản phẩm còn hàng</Label>
                </div>
              </CardContent>
            </Card>

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
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.title.message}
                    </p>
                  )}
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
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryId">Danh mục *</Label>
                    <Select
                      onValueChange={value => setValue('categoryId', parseInt(value, 10))}
                    >
                      <SelectTrigger
                        className={
                          errors.categoryId ? 'border-destructive' : ''
                        }
                      >
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="condition">Tình trạng *</Label>
                    <Select
                      onValueChange={value =>
                        setValue('condition', value as ProductCondition)
                      }
                    >
                      <SelectTrigger
                        className={errors.condition ? 'border-destructive' : ''}
                      >
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem
                            key={condition.value}
                            value={condition.value}
                          >
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.condition && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.condition.message}
                      </p>
                    )}
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
                    <Label htmlFor="price">Giá sỉ * (VNĐ)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      {...register('price', { valueAsNumber: true })}
                      className={errors.price ? 'border-destructive' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="0"
                      {...register('originalPrice', { valueAsNumber: true })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Để trống nếu không có giá gốc
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moq">Mua tối thiểu (MOQ) *</Label>
                    <Input
                      id="moq"
                      type="number"
                      placeholder="1"
                      value={moq}
                      onChange={(e) => setMoq(parseInt(e.target.value) || 1)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Số lượng tối thiểu khách hàng phải mua
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Mã SKU"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="warehouseStock">Tồn kho</Label>
                    <Input
                      id="warehouseStock"
                      type="number"
                      placeholder="Số lượng"
                      value={warehouseStock}
                      onChange={(e) => setWarehouseStock(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="warehouseLocation">Vị trí kho</Label>
                    <Input
                      id="warehouseLocation"
                      placeholder="Vị trí kho hàng"
                      value={warehouseLocation}
                      onChange={(e) => setWarehouseLocation(e.target.value)}
                    />
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
                    {errors.stock && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Địa điểm *</Label>
                    <Input
                      id="location"
                      placeholder="Ví dụ: Hà Nội, TP.HCM..."
                      {...register('location')}
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="suggestedRetailPrice">Giá thực tế thị trường (VNĐ)</Label>
                  <Input
                    id="suggestedRetailPrice"
                    type="number"
                    placeholder="Giá bán lẻ trung bình trên thị trường"
                    value={suggestedRetailPrice}
                    onChange={(e) => setSuggestedRetailPrice(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Quản lý kho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Số lượng tồn kho *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      {...register('stock', { valueAsNumber: true })}
                      className={errors.stock ? 'border-destructive' : ''}
                    />
                    {errors.stock && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sku">Mã SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Mã SKU sản phẩm"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minStock">Số lượng tối thiểu</Label>
                    <Input
                      id="minStock"
                      type="number"
                      placeholder="0"
                      value={minStock}
                      onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Cảnh báo khi tồn kho dưới mức này
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="maxStock">Số lượng tối đa</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      placeholder="0"
                      value={maxStock}
                      onChange={(e) => setMaxStock(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Số lượng tối đa có thể lưu trữ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="warehouseLocation">Vị trí kho</Label>
                    <Input
                      id="warehouseLocation"
                      placeholder="Ví dụ: Kho A - Kệ 1"
                      value={warehouseLocation}
                      onChange={(e) => setWarehouseLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplier">Nhà cung cấp</Label>
                    <Input
                      id="supplier"
                      placeholder="Tên nhà cung cấp"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="costPrice">Giá nhập (VNĐ)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    placeholder="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Giá nhập hàng từ nhà cung cấp
                  </p>
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
                  <Label htmlFor="images">Tải lên hình ảnh</Label>
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
                    Tải lên tối đa 10 hình ảnh. Hình đầu tiên sẽ là ảnh đại
                    diện.
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
                          <Badge className="absolute bottom-2 left-2">
                            Ảnh chính
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Chất liệu</Label>
                    <Input
                      id="material"
                      placeholder="Chất liệu sản phẩm"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Kích thước</Label>
                    <Input
                      id="dimensions"
                      placeholder="Kích thước"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                      id="color"
                      placeholder="Mô tả màu sắc"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packaging">Đóng gói</Label>
                    <Input
                      id="packaging"
                      placeholder="Cách đóng gói"
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đảm bảo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="origin">Nguồn gốc xuất xứ</Label>
                  <Input
                    id="origin"
                    placeholder="Ví dụ: Việt Nam, Trung Quốc, ..."
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="certificates">Giấy chứng nhận</Label>
                  <Textarea
                    id="certificates"
                    placeholder="Nhập các chứng nhận, phân cách bằng dấu phẩy (VD: ISO 9001, HACCP, ...)"
                    rows={3}
                    value={certificates}
                    onChange={(e) => setCertificates(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isWarranty"
                    checked={isWarranty}
                    onCheckedChange={(checked) => setIsWarranty(checked as boolean)}
                  />
                  <Label htmlFor="isWarranty">Bảo hành</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isReturnable"
                    checked={isReturnable}
                    onCheckedChange={(checked) => setIsReturnable(checked as boolean)}
                  />
                  <Label htmlFor="isReturnable">Đổi trả</Label>
                </div>
                {isReturnable && (
                  <div>
                    <Label htmlFor="returnPolicy">Chính sách đổi trả</Label>
                    <Textarea
                      id="returnPolicy"
                      placeholder="Chính sách đổi trả chi tiết"
                      rows={3}
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video and Options */}
            <Card>
              <CardHeader>
                <CardTitle>Tùy chọn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="videoUrl">Video sản phẩm</Label>
                  <Input
                    id="videoUrl"
                    placeholder="URL video từ kho (YouTube, Vimeo, ...)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFactory"
                    checked={isFactory}
                    onCheckedChange={(checked) => setIsFactory(checked as boolean)}
                  />
                  <Label htmlFor="isFactory">Là xưởng sản xuất</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shippingNationwide"
                    checked={shippingNationwide}
                    onCheckedChange={(checked) => setShippingNationwide(checked as boolean)}
                  />
                  <Label htmlFor="shippingNationwide">Giao hàng toàn quốc</Label>
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Thời gian giao hàng dự kiến</Label>
                  <Input
                    id="deliveryTime"
                    placeholder="VD: 3-5 ngày"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
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
                    {availableBadges.map(badge => (
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

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading || createProductMutation.isPending}
              >
                {isLoading || createProductMutation.isPending ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu sản phẩm
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
