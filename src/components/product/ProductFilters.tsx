import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, RotateCcw } from 'lucide-react'
import type { SearchFilters, Category } from '@/types'

interface ProductFiltersProps {
  filters: SearchFilters
  onFilterChange: (filters: Partial<SearchFilters>) => void
  categories: Category[]
}

export function ProductFilters({ filters, onFilterChange, categories }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000000
  ])

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value)
    onFilterChange({
      minPrice: value[0],
      maxPrice: value[1]
    })
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ condition: condition as any })
    } else {
      onFilterChange({ condition: '' })
    }
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const currentLocations = filters.location ? filters.location.split(',') : []
    
    if (checked) {
      const newLocations = [...currentLocations, location]
      onFilterChange({ location: newLocations.join(',') })
    } else {
      const newLocations = currentLocations.filter(loc => loc !== location)
      onFilterChange({ location: newLocations.join(',') })
    }
  }

  const clearAllFilters = () => {
    onFilterChange({
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      query: ''
    })
    setPriceRange([0, 1000000])
  }

  const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'An Giang']

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Xóa tất cả
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Danh mục</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={(checked) => 
                    onFilterChange({ 
                      categoryId: checked ? category.id : '' 
                    })
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {category.productCount}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Khoảng giá: {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ
          </Label>
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={1000000}
              step={10000}
              className="w-full"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                  Từ (đ)
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="text-sm"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                  Đến (đ)
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tình trạng</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="condition-new"
                checked={filters.condition === 'new'}
                onCheckedChange={(checked) => handleConditionChange('new', checked as boolean)}
              />
              <Label htmlFor="condition-new" className="text-sm cursor-pointer">
                Mới
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="condition-used"
                checked={filters.condition === 'used'}
                onCheckedChange={(checked) => handleConditionChange('used', checked as boolean)}
              />
              <Label htmlFor="condition-used" className="text-sm cursor-pointer">
                Đã sử dụng
              </Label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Khu vực</Label>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.location?.includes(location) || false}
                  onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                />
                <Label
                  htmlFor={`location-${location}`}
                  className="text-sm cursor-pointer"
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tính năng</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured === true}
                onCheckedChange={(checked) => 
                  onFilterChange({ featured: checked as boolean })
                }
              />
              <Label htmlFor="featured" className="text-sm cursor-pointer">
                Sản phẩm nổi bật
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="promoted"
                checked={filters.promoted === true}
                onCheckedChange={(checked) => 
                  onFilterChange({ promoted: checked as boolean })
                }
              />
              <Label htmlFor="promoted" className="text-sm cursor-pointer">
                Sản phẩm quảng cáo
              </Label>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Đánh giá tối thiểu</Label>
          <Select
            value={filters.minRating?.toString() || ''}
            onValueChange={(value) => 
              onFilterChange({ minRating: value ? parseFloat(value) : undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5 sao trở lên</SelectItem>
              <SelectItem value="4.0">4.0 sao trở lên</SelectItem>
              <SelectItem value="3.5">3.5 sao trở lên</SelectItem>
              <SelectItem value="3.0">3.0 sao trở lên</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
