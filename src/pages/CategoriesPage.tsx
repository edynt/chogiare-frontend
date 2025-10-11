import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Grid3X3,
  List,
  Filter,
  Star,
  TrendingUp,
  Package,
  Eye,
  ShoppingBag,
  Tag,
  ArrowRight,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  isActive: boolean
  isFeatured: boolean
  subcategories?: Category[]
  trending?: boolean
  discount?: number
}

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Mock data - trong thực tế sẽ fetch từ API
  const categories: Category[] = [
    {
      id: '1',
      name: 'Điện thoại & Phụ kiện',
      slug: 'dien-thoai-phu-kien',
      description: 'Điện thoại thông minh và các phụ kiện liên quan',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      productCount: 1250,
      isActive: true,
      isFeatured: true,
      trending: true,
      discount: 20,
      subcategories: [
        { id: '1-1', name: 'iPhone', slug: 'iphone', description: 'Điện thoại iPhone', image: '', productCount: 450, isActive: true, isFeatured: false },
        { id: '1-2', name: 'Samsung', slug: 'samsung', description: 'Điện thoại Samsung', image: '', productCount: 380, isActive: true, isFeatured: false },
        { id: '1-3', name: 'Xiaomi', slug: 'xiaomi', description: 'Điện thoại Xiaomi', image: '', productCount: 320, isActive: true, isFeatured: false },
        { id: '1-4', name: 'Phụ kiện', slug: 'phu-kien', description: 'Phụ kiện điện thoại', image: '', productCount: 100, isActive: true, isFeatured: false }
      ]
    },
    {
      id: '2',
      name: 'Laptop & Máy tính',
      slug: 'laptop-may-tinh',
      description: 'Laptop, máy tính để bàn và phụ kiện',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      productCount: 890,
      isActive: true,
      isFeatured: true,
      trending: false,
      discount: 15,
      subcategories: [
        { id: '2-1', name: 'Laptop Gaming', slug: 'laptop-gaming', description: 'Laptop chơi game', image: '', productCount: 200, isActive: true, isFeatured: false },
        { id: '2-2', name: 'Laptop Văn phòng', slug: 'laptop-van-phong', description: 'Laptop văn phòng', image: '', productCount: 350, isActive: true, isFeatured: false },
        { id: '2-3', name: 'Máy tính để bàn', slug: 'may-tinh-de-ban', description: 'PC Desktop', image: '', productCount: 180, isActive: true, isFeatured: false },
        { id: '2-4', name: 'Phụ kiện', slug: 'phu-kien-pc', description: 'Phụ kiện máy tính', image: '', productCount: 160, isActive: true, isFeatured: false }
      ]
    },
    {
      id: '3',
      name: 'Thời trang',
      slug: 'thoi-trang',
      description: 'Quần áo, giày dép và phụ kiện thời trang',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      productCount: 2100,
      isActive: true,
      isFeatured: false,
      trending: true,
      discount: 30,
      subcategories: [
        { id: '3-1', name: 'Quần áo Nam', slug: 'quan-ao-nam', description: 'Thời trang nam', image: '', productCount: 800, isActive: true, isFeatured: false },
        { id: '3-2', name: 'Quần áo Nữ', slug: 'quan-ao-nu', description: 'Thời trang nữ', image: '', productCount: 900, isActive: true, isFeatured: false },
        { id: '3-3', name: 'Giày dép', slug: 'giay-dep', description: 'Giày dép nam nữ', image: '', productCount: 250, isActive: true, isFeatured: false },
        { id: '3-4', name: 'Phụ kiện', slug: 'phu-kien-thoi-trang', description: 'Phụ kiện thời trang', image: '', productCount: 150, isActive: true, isFeatured: false }
      ]
    },
    {
      id: '4',
      name: 'Đồ gia dụng',
      slug: 'do-gia-dung',
      description: 'Đồ dùng trong nhà, nội thất và trang trí',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      productCount: 1560,
      isActive: true,
      isFeatured: false,
      trending: false,
      discount: 25,
      subcategories: [
        { id: '4-1', name: 'Nội thất', slug: 'noi-that', description: 'Đồ nội thất', image: '', productCount: 400, isActive: true, isFeatured: false },
        { id: '4-2', name: 'Đồ dùng nhà bếp', slug: 'do-dung-nha-bep', description: 'Đồ dùng bếp', image: '', productCount: 350, isActive: true, isFeatured: false },
        { id: '4-3', name: 'Trang trí', slug: 'trang-tri', description: 'Đồ trang trí', image: '', productCount: 300, isActive: true, isFeatured: false },
        { id: '4-4', name: 'Đồ điện gia dụng', slug: 'do-dien-gia-dung', description: 'Đồ điện', image: '', productCount: 510, isActive: true, isFeatured: false }
      ]
    },
    {
      id: '5',
      name: 'Sách & Văn phòng phẩm',
      slug: 'sach-van-phong-pham',
      description: 'Sách, tài liệu và dụng cụ văn phòng',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      productCount: 750,
      isActive: true,
      isFeatured: false,
      trending: false,
      discount: 10,
      subcategories: [
        { id: '5-1', name: 'Sách', slug: 'sach', description: 'Sách các loại', image: '', productCount: 400, isActive: true, isFeatured: false },
        { id: '5-2', name: 'Văn phòng phẩm', slug: 'van-phong-pham', description: 'Dụng cụ văn phòng', image: '', productCount: 200, isActive: true, isFeatured: false },
        { id: '5-3', name: 'Đồ chơi', slug: 'do-choi', description: 'Đồ chơi trẻ em', image: '', productCount: 150, isActive: true, isFeatured: false }
      ]
    },
    {
      id: '6',
      name: 'Thể thao & Du lịch',
      slug: 'the-thao-du-lich',
      description: 'Đồ thể thao, du lịch và ngoài trời',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      productCount: 680,
      isActive: true,
      isFeatured: false,
      trending: true,
      discount: 20,
      subcategories: [
        { id: '6-1', name: 'Thể thao', slug: 'the-thao', description: 'Đồ thể thao', image: '', productCount: 300, isActive: true, isFeatured: false },
        { id: '6-2', name: 'Du lịch', slug: 'du-lich', description: 'Đồ du lịch', image: '', productCount: 200, isActive: true, isFeatured: false },
        { id: '6-3', name: 'Ngoài trời', slug: 'ngoai-troi', description: 'Đồ ngoài trời', image: '', productCount: 180, isActive: true, isFeatured: false }
      ]
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredCategories = categories.filter(cat => cat.isFeatured)
  const trendingCategories = categories.filter(cat => cat.trending)

  const CategoryCard = ({ category, isSubcategory = false }: { category: Category, isSubcategory?: boolean }) => (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${isSubcategory ? 'h-32' : 'h-64'} relative`}>
      {category.discount && (
        <Badge className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground">
          -{category.discount}%
        </Badge>
      )}
      
      <div className="relative h-32 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {category.trending && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-warning text-warning-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
        
        {category.isFeatured && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              <Crown className="h-3 w-3 mr-1" />
              Nổi bật
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{category.productCount.toLocaleString()} sản phẩm</span>
          </div>
          
          <Link to={`/products?category=${category.slug}`}>
            <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const CategoryListItem = ({ category }: { category: Category }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            {category.discount && (
              <Badge className="absolute -top-1 -right-1 text-xs bg-destructive text-destructive-foreground">
                -{category.discount}%
              </Badge>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {category.trending && (
                <Badge variant="secondary" className="bg-warning text-warning-foreground text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {category.isFeatured && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {category.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{category.productCount.toLocaleString()} sản phẩm</span>
              </div>
              {category.subcategories && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>{category.subcategories.length} danh mục con</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to={`/products?category=${category.slug}`}>
              <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                Xem sản phẩm
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <ArrowRight className={`h-4 w-4 transition-transform ${selectedCategory === category.id ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>
        
        {selectedCategory === category.id && category.subcategories && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.subcategories.map((subcategory) => (
                <Link key={subcategory.id} to={`/products?category=${subcategory.slug}`}>
                  <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm mb-1">{subcategory.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{subcategory.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      <span>{subcategory.productCount} sản phẩm</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            Khám phá hàng nghìn sản phẩm được phân loại rõ ràng, dễ dàng tìm kiếm
          </p>
          
          {/* Trust indicators */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Hàng nghìn sản phẩm</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-warning" />
              <span>Giá tốt nhất</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-success" />
              <span>Chất lượng đảm bảo</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Danh mục nổi bật</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Categories */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-warning" />
              <h2 className="text-xl font-semibold">Danh mục đang hot</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tất cả danh mục'}
            </h2>
            <Badge variant="secondary">
              {filteredCategories.length} danh mục
            </Badge>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy danh mục</h3>
            <p className="text-muted-foreground mb-4">
              Không có danh mục nào phù hợp với từ khóa "{searchQuery}"
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Xem tất cả danh mục
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
