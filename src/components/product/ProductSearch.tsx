import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, X, MapPin } from 'lucide-react'
import { cn, debounce } from '@/lib/utils'
import type { SearchFilters, ProductCondition, ProductBadge } from '@/types'

interface ProductSearchProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
  categories?: Array<{ id: string; name: string }>
  className?: string
}

export function ProductSearch({ onSearch, initialFilters = {}, categories = [], className }: ProductSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categoryId: '',
    minPrice: 0,
    maxPrice: 10000000,
    condition: undefined,
    location: '',
    badges: [],
    rating: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
    ...initialFilters,
  })

  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  const debouncedSearch = debounce((searchFilters: SearchFilters) => {
    onSearch(searchFilters)
  }, 500)

  useEffect(() => {
    debouncedSearch(filters)
  }, [filters, debouncedSearch])

  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
      page: 1,
    }))
  }

  const handleBadgeToggle = (badge: ProductBadge) => {
    setFilters(prev => ({
      ...prev,
      badges: prev.badges?.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...(prev.badges || []), badge],
      page: 1,
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      categoryId: '',
      minPrice: 0,
      maxPrice: 10000000,
      condition: undefined,
      location: '',
      badges: [],
      rating: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
    })
  }

  const conditionOptions: { value: ProductCondition; label: string }[] = [
    { value: 'new', label: 'Mới' },
    { value: 'like_new', label: 'Như mới' },
    { value: 'good', label: 'Tốt' },
    { value: 'fair', label: 'Khá' },
    { value: 'poor', label: 'Cũ' },
  ]

  const badgeOptions: { value: ProductBadge; label: string }[] = [
    { value: 'NEW', label: 'Mới' },
    { value: 'FEATURED', label: 'Nổi bật' },
    { value: 'PROMO', label: 'Khuyến mãi' },
    { value: 'HOT', label: 'Hot' },
    { value: 'SALE', label: 'Giảm giá' },
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Mới nhất' },
    { value: 'price', label: 'Giá' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'viewCount', label: 'Lượt xem' },
  ]

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== 0 && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length - 3 // Exclude page, limit, sortBy, sortOrder

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.query || ''}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Bộ lọc
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Danh mục</label>
              <Select
                value={filters.categoryId || ''}
                onValueChange={(value) => handleFilterChange('categoryId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Khoảng giá: {filters.minPrice?.toLocaleString()} - {filters.maxPrice?.toLocaleString()} VNĐ
              </label>
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 10000000]}
                onValueChange={handlePriceRangeChange}
                max={10000000}
                min={0}
                step={100000}
                className="w-full"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tình trạng</label>
              <Select
                value={filters.condition || ''}
                onValueChange={(value) => handleFilterChange('condition', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Vị trí</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nhập địa điểm..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Badges */}
            <div>
              <label className="text-sm font-medium mb-2 block">Nhãn sản phẩm</label>
              <div className="flex flex-wrap gap-2">
                {badgeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={filters.badges?.includes(option.value) || false}
                      onCheckedChange={() => handleBadgeToggle(option.value)}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Đánh giá tối thiểu: {filters.rating} sao
              </label>
              <Slider
                value={[filters.rating || 0]}
                onValueChange={(value) => handleFilterChange('rating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Sort */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sắp xếp theo</label>
                <Select
                  value={filters.sortBy || 'createdAt'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Thứ tự</label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Tăng dần</SelectItem>
                    <SelectItem value="desc">Giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
