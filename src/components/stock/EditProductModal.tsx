import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Save, 
  X, 
  Package, 
  DollarSign, 
  Weight, 
  Tag
} from 'lucide-react'
import { useNotification } from '@/components/notification-provider'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reservedStock: number
  availableStock: number
  costPrice: number
  sellingPrice: number
  profit: number
  profitMargin: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  lastUpdated: string
  image: string
  description: string
  supplier: string
  location: string
  barcode?: string
  weight: number
  dimensions: string
  tags: string[]
  salesCount: number
  viewsCount: number
  rating: number
  isActive: boolean
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: InventoryItem | null
  onSave: (updatedProduct: InventoryItem) => void
}

const categories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Đồng hồ', 'Máy ảnh', 'Khác']
const statusOptions = [
  { value: 'in_stock', label: 'Còn hàng' },
  { value: 'low_stock', label: 'Sắp hết' },
  { value: 'out_of_stock', label: 'Hết hàng' },
  { value: 'discontinued', label: 'Ngừng bán' }
]

export function EditProductModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave 
}: EditProductModalProps) {
  const { notify } = useNotification()
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        tags: [...product.tags]
      })
    }
  }, [product])

  const handleInputChange = (field: keyof InventoryItem, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const calculateProfit = () => {
    const costPrice = Number(formData.costPrice) || 0
    const sellingPrice = Number(formData.sellingPrice) || 0
    const profit = sellingPrice - costPrice
    const profitMargin = costPrice > 0 ? (profit / costPrice) * 100 : 0
    
    return { profit, profitMargin }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.sku || !formData.category) {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      })
      return
    }

    setIsLoading(true)
    
    try {
      const { profit, profitMargin } = calculateProfit()
      const updatedProduct: InventoryItem = {
        ...product!,
        ...formData,
        profit,
        profitMargin,
        lastUpdated: new Date().toISOString()
      } as InventoryItem

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      onSave(updatedProduct)
      
      notify({
        type: 'success',
        title: 'Thành công',
        message: 'Đã cập nhật thông tin sản phẩm'
      })
      
      onClose()
    } catch (error) {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi cập nhật sản phẩm'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Sửa thông tin sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ''}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Nhập mã SKU"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select 
                    value={formData.category || ''} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={formData.status || 'in_stock'} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thông tin giá cả
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Giá nhập (VND)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={formData.costPrice || ''}
                    onChange={(e) => handleInputChange('costPrice', Number(e.target.value))}
                    placeholder="Nhập giá nhập"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Giá bán (VND)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={formData.sellingPrice || ''}
                    onChange={(e) => handleInputChange('sellingPrice', Number(e.target.value))}
                    placeholder="Nhập giá bán"
                  />
                </div>
              </div>
              
              {formData.costPrice && formData.sellingPrice && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Lợi nhuận</p>
                      <p className="text-lg font-semibold text-green-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(calculateProfit().profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tỷ lệ lợi nhuận</p>
                      <p className="text-lg font-semibold text-green-600">
                        {calculateProfit().profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin tồn kho
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Tồn kho hiện tại</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock || ''}
                    onChange={(e) => handleInputChange('currentStock', Number(e.target.value))}
                    placeholder="Nhập số lượng tồn kho"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minStock">Tồn kho tối thiểu</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock || ''}
                    onChange={(e) => handleInputChange('minStock', Number(e.target.value))}
                    placeholder="Nhập tồn kho tối thiểu"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Tồn kho tối đa</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock || ''}
                    onChange={(e) => handleInputChange('maxStock', Number(e.target.value))}
                    placeholder="Nhập tồn kho tối đa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Thông tin vật lý
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Trọng lượng (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                    placeholder="Nhập trọng lượng"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Kích thước</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions || ''}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="VD: 20x15x8 cm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode">Mã vạch</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ''}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Nhập mã vạch"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Vị trí kho</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="VD: Kho A - Kệ 1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supplier">Nhà cung cấp</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ''}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    placeholder="Nhập tên nhà cung cấp"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">URL hình ảnh</Label>
                  <Input
                    id="image"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Nhập URL hình ảnh"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập tag mới"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Thêm
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
