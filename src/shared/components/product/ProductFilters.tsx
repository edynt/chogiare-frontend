import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import { Slider } from '@shared/components/ui/slider'
import { Checkbox } from '@shared/components/ui/checkbox'
import { Search, Filter, X, MapPin } from 'lucide-react'
import { cn, debounce } from '@/lib/utils'
import type { SearchFilters, ProductCondition, ProductBadge } from '@/types'

interface ProductFiltersProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
  categories?: Array<{ id: string; name: string }>
  className?: string
  showSort?: boolean
}

export function ProductFilters({ onSearch, initialFilters = {}, categories = [], className, showSort = true }: ProductFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categoryId: undefined,
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

  const [showFilters, setShowFilters] = useState(true)
  const isUserInteraction = useRef(false)
  const isInitialMount = useRef(true)

  // Sync filters with initialFilters when they change (but preserve sort if showSort is false)
  useEffect(() => {
    if (showSort) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters,
      }))
    } else {
      // When sort is hidden, preserve sortBy and sortOrder from current state
      const { sortBy: _sortBy, sortOrder: _sortOrder, ...restInitialFilters } = initialFilters
      setFilters(prev => ({
        ...prev,
        ...restInitialFilters,
        // Keep current sort values when sort is hidden
        sortBy: prev.sortBy,
        sortOrder: prev.sortOrder,
      }))
    }
    // Reset the flag after syncing (but allow on first mount)
    if (!isInitialMount.current) {
      isUserInteraction.current = false
    }
  }, [initialFilters, showSort])

  // Debounced search
  const debouncedSearch = debounce((searchFilters: SearchFilters) => {
    onSearch(searchFilters)
  }, 500)

  useEffect(() => {
    // Call onSearch on initial mount or if this was a user interaction
    if (isInitialMount.current || isUserInteraction.current) {
      debouncedSearch(filters)
      if (isInitialMount.current) {
        isInitialMount.current = false
      }
    }
  }, [filters, debouncedSearch])

  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    isUserInteraction.current = true
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    isUserInteraction.current = true
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
      page: 1,
    }))
  }

  const handleBadgeToggle = (badge: ProductBadge) => {
    isUserInteraction.current = true
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
      categoryId: undefined,
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
      <div className="space-y-2">
        <div className="relative">
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
          className="w-full relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
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
              <CardTitle className="text-lg">Bộ lọc</CardTitle>
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
                value={String(filters.categoryId || 'all')}
                onValueChange={(value) => handleFilterChange('categoryId', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
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
                value={filters.condition || 'all'}
                onValueChange={(value) => handleFilterChange('condition', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
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
              <div className="space-y-2">
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
            {showSort && (
              <div className="space-y-4">
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}