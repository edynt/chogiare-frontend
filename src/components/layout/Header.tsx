import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAppSelector, useAppDispatch } from '@/store'
import { toggleTheme, toggleMobileMenu } from '@/store/slices/uiSlice'
import { openCart } from '@/store/slices/cartSlice'
import { useCategories } from '@/hooks/useProducts'
import { Search, ShoppingCart, Menu, Sun, Moon, User, MessageCircle } from 'lucide-react'

export function Header() {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.ui)
  const { totalItems } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { data: categories } = useCategories()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold">Chogiare</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sản phẩm
            </Link>
            <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Danh mục
            </Link>
            <Link to="/sellers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Người bán
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Chat Icon */}
            <Link to="/chat">
              <Button variant="ghost" size="icon" aria-label="Messages">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(openCart())}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Scroller - Desktop */}
        {categories && categories.length > 0 && (
          <div className="hidden md:block py-4">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="flex-shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
