import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PasswordInput } from '@shared/components/ui/password-input'
import { Badge } from '@shared/components/ui/badge'
import { Switch } from '@shared/components/ui/switch'
import { Label } from '@shared/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar'
import { Separator } from '@shared/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import { useUserProfile, useUserUpdateProfile, useUserChangePassword } from '@user/hooks/use-user-auth'
import { toast } from 'sonner'
import { useUserOrders } from '@/hooks/useOrders'
import { 
  User, Mail, Phone, MapPin, Package, Eye, Calendar, 
  Star, ShoppingBag, Award, TrendingUp,
  Settings, Edit, Camera, Globe, Store, Save, X, CheckCircle2
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function ProfileContent() {
  const { data: profile, isLoading } = useUserProfile()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const tabFromUrl = searchParams.get('tab') as 'profile' | 'orders' | 'settings' | 'addresses' | null
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'addresses'>(tabFromUrl || 'profile')
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    privacyMode: false,
    showEmail: false,
    showPhone: false
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileFormData, setProfileFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    country: 'Vietnam',
    language: 'vi',
  })
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const { data: ordersData, isLoading: isLoadingOrders } = useUserOrders({ page: 1, pageSize: 10 })
  const updateProfileMutation = useUserUpdateProfile()
  const changePasswordMutation = useUserChangePassword()

  useEffect(() => {
    if (tabFromUrl && ['profile', 'orders', 'settings', 'addresses'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  useEffect(() => {
    if (profile && !isEditingProfile) {
      setProfileFormData({
        fullName: profile.name || '',
        phoneNumber: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        country: profile.country || 'Vietnam',
        language: profile.language || 'vi',
      })
    }
  }, [profile, isEditingProfile])

  useEffect(() => {
    if (profile) {
      setSettings(prev => ({
        ...prev,
        showEmail: profile.showEmail ?? false,
        showPhone: profile.showPhone ?? false,
      }))
    }
  }, [profile])

  const handleTabChange = (tab: 'profile' | 'orders' | 'settings' | 'addresses') => {
    if (tab === 'addresses') {
      navigate('/addresses')
      return
    }
    setActiveTab(tab)
    setSearchParams({ tab })
  }


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'shipped': return 'Đã giao hàng'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      case 'processing': return 'Đang xử lý'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStartEditProfile = () => {
    setIsEditingProfile(true)
  }

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false)
    if (profile) {
      setProfileFormData({
        fullName: profile.name || '',
        phoneNumber: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        country: profile.country || 'Vietnam',
        language: profile.language || 'vi',
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: profileFormData.fullName,
        phoneNumber: profileFormData.phoneNumber,
        gender: profileFormData.gender || undefined,
        dateOfBirth: profileFormData.dateOfBirth || undefined,
        address: profileFormData.address || undefined,
        country: profileFormData.country || undefined,
        language: profileFormData.language || undefined,
      })
      setIsEditingProfile(false)
      toast.success('Đã cập nhật thông tin cá nhân thành công')
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleChangePassword = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      })
      setIsChangingPassword(false)
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Đã đổi mật khẩu thành công')
    } catch {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange('profile')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="h-4 w-4 mr-2 inline" />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-4 w-4 mr-2 inline" />
              Lịch sử đơn hàng
            </button>
            <button
              onClick={() => handleTabChange('addresses')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'addresses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="h-4 w-4 mr-2 inline" />
              Địa chỉ
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Cài đặt
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Thành viên VIP
                </Badge>
                {profile.isVerified && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thông tin tài khoản</CardTitle>
              {!isEditingProfile && (
                <Button variant="outline" size="sm" onClick={handleStartEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Họ và tên</label>
              <Input 
                value={isEditingProfile ? profileFormData.fullName : profile.name} 
                disabled={!isEditingProfile}
                onChange={(e) => setProfileFormData(prev => ({ ...prev, fullName: e.target.value }))}
                maxLength={255}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Email</label>
                {profile.isVerified && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
              <Input value={profile.email} disabled />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Số điện thoại</label>
                {profile.isVerified && profile.phone && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
              <Input 
                value={isEditingProfile ? profileFormData.phoneNumber : (profile.phone || '')} 
                disabled={!isEditingProfile}
                onChange={(e) => setProfileFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                maxLength={20}
              />
            </div>
            {isEditingProfile && (
              <div>
                <Label>Giới tính</Label>
                <Select
                  value={profileFormData.gender}
                  onValueChange={(value) => setProfileFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Chọn giới tính</SelectItem>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isEditingProfile && (
              <div>
                <label className="text-sm font-medium">Ngày sinh</label>
                <Input 
                  type="date"
                  value={profileFormData.dateOfBirth} 
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            )}
            {isEditingProfile && (
              <div>
                <label className="text-sm font-medium">Địa chỉ</label>
                <Input 
                  value={profileFormData.address} 
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, address: e.target.value }))}
                  maxLength={500}
                />
              </div>
            )}
            {isEditingProfile && (
              <div>
                <label className="text-sm font-medium">Quốc gia</label>
                <Input 
                  value={profileFormData.country} 
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, country: e.target.value }))}
                  maxLength={100}
                />
              </div>
            )}
            {isEditingProfile && (
              <div>
                <Label>Ngôn ngữ</Label>
                <Select
                  value={profileFormData.language}
                  onValueChange={(value) => setProfileFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isEditingProfile ? (
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button variant="outline" onClick={handleCancelEditProfile}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê hoạt động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{profile.postCount}</p>
                <p className="text-sm text-muted-foreground">Sản phẩm đã bán</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">98%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ hài lòng</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Vai trò:</span>
                <span className="font-medium">{profile.roles.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày tham gia:</span>
                <span className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lần đăng nhập cuối:</span>
                <span className="font-medium">2 giờ trước</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {profile.storeInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên cửa hàng</label>
                <Input value={profile.storeInfo.name} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input value={profile.storeInfo.description || ''} disabled />
              </div>
              <div className="flex justify-between">
                <span>Đánh giá:</span>
                <span className="font-medium">
                  ⭐ {profile.storeInfo.rating} ({profile.storeInfo.reviewCount} đánh giá)
                </span>
              </div>
              <Button>Chỉnh sửa cửa hàng</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seller Dashboard Access Card */}
      <Card className="border-2 border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Bạn là người bán?</h3>
                <p className="text-sm text-muted-foreground">
                  Truy cập dashboard dành cho người bán để quản lý sản phẩm và đơn hàng
                </p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/dashboard">
                <Store className="h-4 w-4 mr-2" />
                Vào Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lịch sử đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Đang tải đơn hàng...</p>
              </div>
            ) : ordersData && ordersData.items && ordersData.items.length > 0 ? (
              <div className="space-y-4">
                {ordersData.items.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity} • {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Đặt hàng: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {ordersData.total > ordersData.items.length && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      Xem thêm đơn hàng
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                </p>
                <Button asChild>
                  <Link to="/dashboard">Vào Dashboard</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Thông báo email</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo về đơn hàng và khuyến mãi</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">Thông báo push</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo trực tiếp trên thiết bị</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="privacy-mode" className="font-medium">Chế độ riêng tư</Label>
                  <p className="text-sm text-muted-foreground">Ẩn thông tin cá nhân khỏi người khác</p>
                </div>
                <Switch
                  id="privacy-mode"
                  checked={settings.privacyMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, privacyMode: checked }))}
                />
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="font-medium">Đổi mật khẩu</Label>
                    <p className="text-sm text-muted-foreground">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                  </div>
                  {!isChangingPassword && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  )}
                </div>
                {isChangingPassword && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                      <PasswordInput
                        id="current-password"
                        value={passwordFormData.currentPassword}
                        onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Mật khẩu mới</Label>
                      <PasswordInput
                        id="new-password"
                        value={passwordFormData.newPassword}
                        onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                      <PasswordInput
                        id="confirm-password"
                        value={passwordFormData.confirmPassword}
                        onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={changePasswordMutation.isPending}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {changePasswordMutation.isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordFormData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          })
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Quyền riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-email" className="font-medium">Hiển thị email công khai</Label>
                  <p className="text-sm text-muted-foreground">Cho phép người khác xem email của bạn</p>
                </div>
                <Switch
                  id="show-email"
                  checked={settings.showEmail}
                  onCheckedChange={async (checked) => {
                    setSettings(prev => ({ ...prev, showEmail: checked }))
                    try {
                      await updateProfileMutation.mutateAsync({ showEmail: checked })
                      toast.success('Đã cập nhật cài đặt quyền riêng tư')
                    } catch {
                      toast.error('Có lỗi xảy ra khi cập nhật cài đặt')
                      setSettings(prev => ({ ...prev, showEmail: !checked }))
                    }
                  }}
                  disabled={updateProfileMutation.isPending}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-phone" className="font-medium">Hiển thị số điện thoại</Label>
                  <p className="text-sm text-muted-foreground">Cho phép người khác xem số điện thoại</p>
                </div>
                <Switch
                  id="show-phone"
                  checked={settings.showPhone}
                  onCheckedChange={async (checked) => {
                    setSettings(prev => ({ ...prev, showPhone: checked }))
                    try {
                      await updateProfileMutation.mutateAsync({ showPhone: checked })
                      toast.success('Đã cập nhật cài đặt quyền riêng tư')
                    } catch {
                      toast.error('Có lỗi xảy ra khi cập nhật cài đặt')
                      setSettings(prev => ({ ...prev, showPhone: !checked }))
                    }
                  }}
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
