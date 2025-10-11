import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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
import { useCreateProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useProducts'
import { useNotification } from '@/components/notification-provider'
import { useLoading } from '@/hooks/useLoading'
import { 
  Plus, 
  Upload, 
  X, 
  Package, 
  DollarSign, 
  MapPin, 
  Tag,
  Image as ImageIcon,
  Save,
  ArrowLeft
} from 'lucide-react'
import type { Product, ProductCondition, ProductStatus } from '@/types'

const schema = yup.object({
  title: yup.string().required('Tên sản phẩm là bắt buộc').min(5, 'Tên sản phẩm phải có ít nhất 5 ký tự'),
  description: yup.string().required('Mô tả là bắt buộc').min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  price: yup.number().required('Giá là bắt buộc').min(1000, 'Giá tối thiểu là 1,000 VNĐ'),
  originalPrice: yup.number().optional(),
  categoryId: yup.string().required('Danh mục là bắt buộc'),
  condition: yup.string().required('Tình trạng là bắt buộc'),
  location: yup.string().required('Địa điểm là bắt buộc'),
  stock: yup.number().required('Số lượng là bắt buộc').min(1, 'Số lượng tối thiểu là 1'),
  tags: yup.string().optional(),
  badges: yup.array().optional(),
})

type FormData = yup.InferType<typeof schema>

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    )
    setValue('badges', selectedBadges)
  }

  const onSubmit = (data: FormData) => {
    execute(async () => {
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        ...data,
        images: images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'],
        badges: selectedBadges as any[],
        sellerId: 'current-user-id', // TODO: Get from auth context
        status: 'draft' as ProductStatus,
        rating: 0,
        reviewCount: 0,
        viewCount: 0,
        isFeatured: false,
        isPromoted: false,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      }

      await new Promise((resolve, reject) => {
        createProductMutation.mutate(productData, {
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
            <div className="flex items-center gap-2 mb-2">
              <Plus className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Tạo sản phẩm mới để bán trên Chogiare
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryId">Danh mục *</Label>
                    <Select onValueChange={(value) => setValue('categoryId', value)}>
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
                    <Select onValueChange={(value) => setValue('condition', value as ProductCondition)}>
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
