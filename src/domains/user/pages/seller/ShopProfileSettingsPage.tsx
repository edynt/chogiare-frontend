import React, { useState } from 'react'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import { Textarea } from '@shared/components/ui/textarea'
import { Badge } from '@shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select'
import { Switch } from '@shared/components/ui/switch'
import { 
  Store,
  Upload,
  Star,
  Edit,
  Save,
  X,
  CheckCircle
} from 'lucide-react'

interface ShopProfile {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  logo: string
  banner: string
  coverImages: string[]
  category: string
  subcategory: string
  establishedYear: number
  businessType: 'individual' | 'company'
  taxCode?: string
  businessLicense?: string
  address: {
    street: string
    ward: string
    district: string
    city: string
    postalCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  businessHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  policies: {
    returnPolicy: string
    warrantyPolicy: string
    privacyPolicy: string
  }
  settings: {
    isActive: boolean
    allowMessages: boolean
    showPhone: boolean
    showEmail: boolean
    showAddress: boolean
    autoAcceptOrders: boolean
    requireApproval: boolean
    notificationEmail: boolean
    notificationSMS: boolean
  }
  stats: {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    rating: number
    reviewCount: number
    followerCount: number
    viewCount: number
  }
  verification: {
    isVerified: boolean
    verifiedAt?: string
    verificationDocuments: string[]
  }
  createdAt: string
  updatedAt: string
}

export default function ShopProfileSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Mock data
  const [shopProfile, setShopProfile] = useState<ShopProfile>({
    id: '1',
    name: 'TechStore Pro',
    slug: 'techstore-pro',
    description: 'Chuyên cung cấp các sản phẩm công nghệ cao cấp, điện thoại, laptop, phụ kiện chính hãng với giá cả cạnh tranh và dịch vụ chuyên nghiệp.',
    shortDescription: 'Cửa hàng công nghệ uy tín - Giá tốt, chất lượng cao',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop',
    coverImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'
    ],
    category: 'Công nghệ',
    subcategory: 'Điện tử',
    establishedYear: 2020,
    businessType: 'company',
    taxCode: '0123456789',
    businessLicense: 'BL-2020-001',
    address: {
      street: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      postalCode: '700000',
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    contact: {
      phone: '0901234567',
      email: 'contact@techstorepro.com',
      website: 'https://techstorepro.com',
      facebook: 'https://facebook.com/techstorepro',
      instagram: 'https://instagram.com/techstorepro',
      tiktok: 'https://tiktok.com/@techstorepro'
    },
    businessHours: {
      monday: { open: '08:00', close: '22:00', isOpen: true },
      tuesday: { open: '08:00', close: '22:00', isOpen: true },
      wednesday: { open: '08:00', close: '22:00', isOpen: true },
      thursday: { open: '08:00', close: '22:00', isOpen: true },
      friday: { open: '08:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '21:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: false }
    },
    policies: {
      returnPolicy: 'Chấp nhận đổi trả trong 30 ngày với điều kiện sản phẩm còn nguyên vẹn.',
      warrantyPolicy: 'Bảo hành chính hãng theo quy định của nhà sản xuất.',
      privacyPolicy: 'Cam kết bảo mật thông tin khách hàng tuyệt đối.'
    },
    settings: {
      isActive: true,
      allowMessages: true,
      showPhone: true,
      showEmail: false,
      showAddress: true,
      autoAcceptOrders: false,
      requireApproval: true,
      notificationEmail: true,
      notificationSMS: true
    },
    stats: {
      totalProducts: 156,
      totalOrders: 1247,
      totalRevenue: 2500000000,
      rating: 4.8,
      reviewCount: 324,
      followerCount: 1250,
      viewCount: 15600
    },
    verification: {
      isVerified: true,
      verifiedAt: '2023-06-15T10:30:00Z',
      verificationDocuments: ['business_license.pdf', 'tax_certificate.pdf']
    },
    createdAt: '2020-01-15T08:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  })

  const [formData, setFormData] = useState(shopProfile)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: string | number | boolean | Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    setShopProfile(formData)
    setIsEditing(false)
    // In a real app, this would make an API call
    console.log('Saving shop profile:', formData)
  }

  const handleCancel = () => {
    setFormData(shopProfile)
    setIsEditing(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const BusinessHoursForm = () => (
    <div className="space-y-4">
      {Object.entries(formData.businessHours).map(([day, hours]) => (
        <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="w-20">
            <Label className="capitalize">{day === 'monday' ? 'Thứ 2' : 
              day === 'tuesday' ? 'Thứ 3' :
              day === 'wednesday' ? 'Thứ 4' :
              day === 'thursday' ? 'Thứ 5' :
              day === 'friday' ? 'Thứ 6' :
              day === 'saturday' ? 'Thứ 7' : 'Chủ nhật'}</Label>
          </div>
          <Switch
            checked={hours.isOpen}
            onCheckedChange={(checked) => handleNestedInputChange('businessHours', day, { ...hours, isOpen: checked })}
          />
          {hours.isOpen && (
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={hours.open}
                onChange={(e) => handleNestedInputChange('businessHours', day, { ...hours, open: e.target.value })}
                className="w-32"
              />
              <span>đến</span>
              <Input
                type="time"
                value={hours.close}
                onChange={(e) => handleNestedInputChange('businessHours', day, { ...hours, close: e.target.value })}
                className="w-32"
              />
            </div>
          )}
          {!hours.isOpen && (
            <span className="text-muted-foreground">Nghỉ</span>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Cài đặt cửa hàng</h1>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Quản lý thông tin và cài đặt cửa hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={shopProfile.logo}
                    alt={shopProfile.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg">{shopProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{shopProfile.shortDescription}</p>
                  {shopProfile.verification.isVerified && (
                    <Badge className="mt-2 bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã xác thực
                    </Badge>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sản phẩm:</span>
                    <span className="font-medium">{shopProfile.stats.totalProducts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Đơn hàng:</span>
                    <span className="font-medium">{shopProfile.stats.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Doanh thu:</span>
                    <span className="font-medium">{formatPrice(shopProfile.stats.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Đánh giá:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{shopProfile.stats.rating}</span>
                      <span className="text-muted-foreground">({shopProfile.stats.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="contact">Liên hệ</TabsTrigger>
                <TabsTrigger value="policies">Chính sách</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo and Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Logo cửa hàng</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <img
                            src={formData.logo}
                            alt="Logo"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Tải lên
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG tối đa 2MB
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Banner cửa hàng</Label>
                        <div className="mt-2">
                          <img
                            src={formData.banner}
                            alt="Banner"
                            className="w-full h-24 rounded-lg object-cover"
                          />
                          <Button variant="outline" size="sm" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Tải lên banner
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Tên cửa hàng *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL cửa hàng</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                      <Input
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Mô tả ngắn về cửa hàng"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả chi tiết</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Mô tả chi tiết về cửa hàng, sản phẩm và dịch vụ"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Danh mục</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                            <SelectItem value="Thời trang">Thời trang</SelectItem>
                            <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                            <SelectItem value="Thể thao">Thể thao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategory">Danh mục con</Label>
                        <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Điện tử">Điện tử</SelectItem>
                            <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                            <SelectItem value="Laptop">Laptop</SelectItem>
                            <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="establishedYear">Năm thành lập</Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          value={formData.establishedYear}
                          onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Address */}
                    <div>
                      <Label className="text-base font-medium">Địa chỉ</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="street">Số nhà, đường</Label>
                          <Input
                            id="street"
                            value={formData.address.street}
                            onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ward">Phường/Xã</Label>
                          <Input
                            id="ward"
                            value={formData.address.ward}
                            onChange={(e) => handleNestedInputChange('address', 'ward', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="district">Quận/Huyện</Label>
                          <Input
                            id="district"
                            value={formData.address.district}
                            onChange={(e) => handleNestedInputChange('address', 'district', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Tỉnh/Thành phố</Label>
                          <Input
                            id="city"
                            value={formData.address.city}
                            onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <Label className="text-base font-medium">Thông tin liên hệ</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            value={formData.contact.phone}
                            onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.contact.email}
                            onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.contact.website || ''}
                            onChange={(e) => handleNestedInputChange('contact', 'website', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            value={formData.contact.facebook || ''}
                            onChange={(e) => handleNestedInputChange('contact', 'facebook', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://facebook.com/yourpage"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                      <Label className="text-base font-medium">Giờ làm việc</Label>
                      <BusinessHoursForm />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chính sách cửa hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="returnPolicy">Chính sách đổi trả</Label>
                      <Textarea
                        id="returnPolicy"
                        value={formData.policies.returnPolicy}
                        onChange={(e) => handleNestedInputChange('policies', 'returnPolicy', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="warrantyPolicy">Chính sách bảo hành</Label>
                      <Textarea
                        id="warrantyPolicy"
                        value={formData.policies.warrantyPolicy}
                        onChange={(e) => handleNestedInputChange('policies', 'warrantyPolicy', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="privacyPolicy">Chính sách bảo mật</Label>
                      <Textarea
                        id="privacyPolicy"
                        value={formData.policies.privacyPolicy}
                        onChange={(e) => handleNestedInputChange('policies', 'privacyPolicy', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt cửa hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Hiển thị cửa hàng</Label>
                          <p className="text-sm text-muted-foreground">Cửa hàng có hiển thị công khai</p>
                        </div>
                        <Switch
                          checked={formData.settings.isActive}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'isActive', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Cho phép nhắn tin</Label>
                          <p className="text-sm text-muted-foreground">Khách hàng có thể nhắn tin trực tiếp</p>
                        </div>
                        <Switch
                          checked={formData.settings.allowMessages}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'allowMessages', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Hiển thị số điện thoại</Label>
                          <p className="text-sm text-muted-foreground">Hiển thị số điện thoại công khai</p>
                        </div>
                        <Switch
                          checked={formData.settings.showPhone}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'showPhone', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Hiển thị email</Label>
                          <p className="text-sm text-muted-foreground">Hiển thị email công khai</p>
                        </div>
                        <Switch
                          checked={formData.settings.showEmail}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'showEmail', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Hiển thị địa chỉ</Label>
                          <p className="text-sm text-muted-foreground">Hiển thị địa chỉ công khai</p>
                        </div>
                        <Switch
                          checked={formData.settings.showAddress}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'showAddress', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Tự động chấp nhận đơn hàng</Label>
                          <p className="text-sm text-muted-foreground">Tự động chấp nhận đơn hàng mới</p>
                        </div>
                        <Switch
                          checked={formData.settings.autoAcceptOrders}
                          onCheckedChange={(checked) => handleNestedInputChange('settings', 'autoAcceptOrders', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
