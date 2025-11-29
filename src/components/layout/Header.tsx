import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { Menu, User, MessageCircle, Settings, Bell, Clock, Package, LogOut, Droplet, Home, HelpCircle, Store, ShoppingBag, Search, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { totalItems } = useCartStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative h-9 w-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
              <Droplet className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Chogiare
            </span>
          </Link>

          {/* Navigation - Desktop - Removed products and seller links */}

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 w-full bg-background border-border focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Seller Dashboard Button */}
            <Link to="/dashboard">
              <Button 
                variant="default" 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Store className="h-4 w-4 mr-2" />
                Người bán
              </Button>
            </Link>

            {/* Home Button */}
            <Link to="/">
              <Button variant="ghost" size="icon" aria-label="Trang chủ" className="hover:scale-110 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            
            {/* Chat Icon */}
            <Link to="/chat">
              <Button variant="ghost" size="icon" aria-label="Chat" className="hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Giỏ hàng" className="relative hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
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
                  <Link to="/seller/notifications" className="text-sm text-blue-600 group-hover:text-white">
                    Xem tất cả thông báo
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Only show "Quản lý sản phẩm" for sellers */}
                {user?.roles?.includes('seller') && (
                  <Link to="/seller/products">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Quản lý sản phẩm
                    </Button>
                  </Link>
                )}
                
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
                    
                    {/* Navigation Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Home className="mr-2 h-4 w-4" />
                          <span>Trang chủ</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
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
                        <Link to="/customer-orders" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>Đơn hàng của tôi</span>
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
                        <Link to="/seller/notifications" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Thông báo</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Business Section - Only for sellers */}
                    {user?.roles?.includes('seller') && (
                      <>
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link to="/seller/products" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Quản lý sản phẩm</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/seller/support" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                              <HelpCircle className="mr-2 h-4 w-4" />
                              <span>Hỗ trợ & Khiếu nại</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    {/* Settings Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=settings" className="flex items-center hover:bg-red-500 hover:text-white transition-colors">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Cài đặt</span>
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

          {/* Mobile Search and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Store className="h-4 w-4 mr-1" />
              <span className="text-xs">Người bán</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/products')}
              aria-label="Tìm kiếm"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Mobile menu toggle can be implemented later */}}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>
    </header>
  )
}
