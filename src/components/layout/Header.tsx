import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { Search, ShoppingCart, Menu, User, MessageCircle, Settings, Bell, Clock, Package, Heart, LogOut, Store, CreditCard, HelpCircle, Shield } from 'lucide-react'

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { totalItems } = useCartStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      title: 'Đơn hàng mới',
      message: 'Bạn có đơn hàng mới từ khách hàng Nguyễn Văn A',
      time: '2 phút trước',
      unread: true,
      type: 'order'
    },
    {
      id: '2',
      title: 'Tin nhắn mới',
      message: 'Khách hàng đang hỏi về sản phẩm iPhone 14',
      time: '15 phút trước',
      unread: true,
      type: 'message'
    },
    {
      id: '3',
      title: 'Sản phẩm được duyệt',
      message: 'Sản phẩm "MacBook Pro M2" đã được duyệt và hiển thị',
      time: '1 giờ trước',
      unread: false,
      type: 'product'
    },
    {
      id: '4',
      title: 'Thanh toán thành công',
      message: 'Đơn hàng #ORD-2024-001 đã thanh toán thành công',
      time: '2 giờ trước',
      unread: false,
      type: 'payment'
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top duration-500">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center hover:rotate-12 transition-transform duration-300">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold">Chogiare</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200">
              Sản phẩm
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200">
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
              <Button variant="ghost" size="icon" aria-label="Chat" className="hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>

            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Thông báo" className="relative hover:scale-110 hover:bg-orange-100 dark:hover:bg-orange-900 transition-all duration-200">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-sm">Thông báo</h3>
                  <p className="text-xs text-muted-foreground">{unreadCount} thông báo chưa đọc</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer hover:bg-red-500 group transition-colors">
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-medium group-hover:text-white ${
                                notification.unread ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground group-hover:text-white flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground group-hover:text-white line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 text-center hover:bg-red-500 group transition-colors">
                  <Link to="/notifications" className="text-sm text-blue-600 group-hover:text-white">
                    Xem tất cả thông báo
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200"
            >
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/seller/products">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Quản lý sản phẩm
                  </Button>
                </Link>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Personal Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <User className="mr-2 h-4 w-4" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=orders" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Lịch sử đơn hàng</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=favorites" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Sản phẩm yêu thích</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Communication Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/chat" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          <span>Tin nhắn</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/notifications" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Thông báo</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Business Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/shop-settings" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Store className="mr-2 h-4 w-4" />
                          <span>Quản lý cửa hàng</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/products" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Quản lý sản phẩm</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Settings & Support Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=settings" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Cài đặt</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/payment" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Thanh toán</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/help" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>Trợ giúp</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-500 hover:text-white transition-colors">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            onClick={() => {/* Mobile menu toggle can be implemented later */}}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </header>
  )
}
