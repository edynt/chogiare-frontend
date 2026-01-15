import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
import { Badge } from '@shared/components/ui/badge'
import { Label } from '@shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import {
  Switch
} from '@shared/components/ui/switch'
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Package,
  Database,
  Key,
  Bell,
  AlertTriangle,
  Info,
  Edit,
  Trash2,
  Plus,
  Mail,
  Globe,
  HardDrive,
  Cloud,
  Search,
  FileText,
  Download,
  Upload,
  Image,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Activity,
  CreditCard,
  Percent,
  RotateCcw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useSystemSettings,
  useUpdateSettingsByCategory,
  useSystemHealth
} from '@/hooks/useAdmin'
import type { SystemSettings } from '@admin/api/admin'

// Default settings for fallback
const DEFAULT_SETTINGS: SystemSettings = {
    general: {
      siteName: 'Chogiare Marketplace',
      siteDescription: 'Nền tảng thương mại điện tử hàng đầu Việt Nam',
      siteUrl: 'https://chogiare.vn',
      adminEmail: 'admin@chogiare.vn',
      supportEmail: 'support@chogiare.vn',
      supportPhone: '1900 1234',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      dateFormat: 'DD/MM/YYYY',
      currency: 'VND',
      maintenanceMode: false,
      maintenanceMessage: 'Hệ thống đang bảo trì, vui lòng quay lại sau.',
      registrationEnabled: true,
      emailVerification: true,
      phoneVerification: false
    },
    payment: {
      defaultCurrency: 'VND',
      supportedCurrencies: ['VND', 'USD'],
      paymentMethods: {
        creditCard: true,
        momo: true,
        zalopay: true,
        vnpay: true,
        bankTransfer: true,
        cod: false
      },
      commissionRate: 5.0,
      commissionType: 'percentage',
      minimumWithdraw: 100000,
      maximumWithdraw: 50000000,
      withdrawFee: 0,
      paymentTimeout: 15,
      refundPeriod: 7,
      autoPayoutEnabled: false,
      payoutSchedule: 'weekly',
      holdPeriod: 7
    },
    product: {
      maxProductsPerUser: 100,
      maxProductsPerFreePlan: 10,
      maxImagesPerProduct: 10,
      maxVideoPerProduct: 1,
      maxFileSize: 5,
      allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
      autoApprove: false,
      moderationRequired: true,
      aiModeration: true,
      featuredPrice: 199000,
      promotedPrice: 299000,
      boostPrice: 99000,
      productExpiryDays: 30,
      autoRenew: false,
      lowStockThreshold: 5,
      outOfStockBehavior: 'hide',
      allowPreorder: true,
      allowDigitalProducts: true,
      requireSKU: false,
      requireBarcode: false
    },
    user: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumber: true,
      requireSpecialChar: false,
      passwordExpiry: 0,
      sessionTimeout: 24,
      rememberMeDuration: 30,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      twoFactorAuth: false,
      twoFactorMethods: ['email', 'sms', 'authenticator'],
      profileCompletion: true,
      avatarRequired: false,
      phoneRequired: true,
      addressRequired: false,
      identityVerification: false,
      sellerVerification: true
    },
    notification: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      inAppEnabled: true,
      emailFrom: 'noreply@chogiare.vn',
      emailFromName: 'Chogiare Marketplace',
      smsProvider: 'twilio',
      pushProvider: 'firebase',
      notificationQueue: true,
      batchSize: 100,
      retryAttempts: 3,
      retryDelay: 300,
      digestEnabled: true,
      digestFrequency: 'daily',
      templates: {
        welcome: true,
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        passwordReset: true,
        priceAlert: true,
        newMessage: true
      }
    },
    security: {
      sslEnabled: true,
      forceHttps: true,
      corsEnabled: true,
      corsOrigins: ['https://chogiare.vn', 'https://api.chogiare.vn'],
      rateLimiting: true,
      rateLimit: 100,
      rateLimitWindow: 60,
      apiKeyRequired: true,
      ipWhitelist: false,
      whitelistedIPs: [],
      blacklistedIPs: [],
      auditLogging: true,
      auditRetention: 90,
      dataEncryption: true,
      encryptionAlgorithm: 'AES-256',
      sessionEncryption: true,
      cookieSecure: true,
      cookieSameSite: 'strict',
      csrfProtection: true,
      xssProtection: true,
      contentSecurityPolicy: true,
      captchaEnabled: true,
      captchaProvider: 'recaptcha',
      captchaOnLogin: true,
      captchaOnRegister: true,
      captchaOnContact: true
    },
    seo: {
      metaTitle: 'Chogiare - Mua bán trực tuyến giá rẻ',
      metaDescription: 'Nền tảng thương mại điện tử hàng đầu Việt Nam với hàng triệu sản phẩm chất lượng, giá cả cạnh tranh.',
      metaKeywords: 'mua bán online, thương mại điện tử, giá rẻ, chợ giá rẻ',
      ogImage: '/og-image.jpg',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://chogiare.vn',
      robotsTxt: true,
      sitemapEnabled: true,
      sitemapFrequency: 'daily',
      googleAnalytics: '',
      googleTagManager: '',
      facebookPixel: '',
      structuredData: true,
      breadcrumbs: true
    },
    email: {
      provider: 'smtp',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: '',
      smtpPassword: '',
      sendgridApiKey: '',
      mailgunApiKey: '',
      mailgunDomain: '',
      sesRegion: 'ap-southeast-1',
      sesAccessKey: '',
      sesSecretKey: '',
      testEmail: '',
      emailFooter: 'Chogiare Marketplace - Mua sắm thông minh, giá cả hợp lý',
      unsubscribeLink: true
    },
    storage: {
      provider: 'local',
      localPath: '/uploads',
      s3Bucket: '',
      s3Region: 'ap-southeast-1',
      s3AccessKey: '',
      s3SecretKey: '',
      s3Endpoint: '',
      cloudinaryCloudName: '',
      cloudinaryApiKey: '',
      cloudinaryApiSecret: '',
      cdnEnabled: false,
      cdnUrl: '',
      imageOptimization: true,
      imageQuality: 85,
      thumbnailSizes: [150, 300, 600],
      maxUploadSize: 10,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx']
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      time: '03:00',
      retention: 30,
      includeDatabase: true,
      includeUploads: true,
      includeLogs: false,
      storageProvider: 'local',
      s3Bucket: '',
      googleDriveFolder: '',
      encryptBackup: true,
      notifyOnSuccess: false,
      notifyOnFailure: true,
      lastBackup: '2024-01-26T03:00:00Z',
      lastBackupSize: '2.5 GB',
      lastBackupStatus: 'success'
    },
    cache: {
      enabled: true,
      driver: 'redis',
      redisHost: 'localhost',
      redisPort: 6379,
      redisPassword: '',
      memcachedHost: 'localhost',
      memcachedPort: 11211,
      ttl: 3600,
      prefix: 'chogiare_',
      pageCache: true,
      pageCacheTtl: 600,
      apiCache: true,
      apiCacheTtl: 300,
      queryCache: true,
      queryCacheTtl: 600,
      staticCache: true,
      staticCacheTtl: 86400
    },
    social: {
      facebookUrl: 'https://facebook.com/chogiare',
      instagramUrl: 'https://instagram.com/chogiare',
      twitterUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
      zaloOA: '',
      facebookAppId: '',
      facebookAppSecret: '',
      googleClientId: '',
      googleClientSecret: '',
      appleClientId: '',
      appleTeamId: '',
      socialLogin: {
        facebook: true,
        google: true,
        apple: false,
        zalo: false
      },
      socialShare: {
        facebook: true,
        twitter: true,
        pinterest: true,
        whatsapp: true,
        zalo: true,
        copyLink: true
      }
    },
    legal: {
      termsOfService: '/terms',
      privacyPolicy: '/privacy',
      refundPolicy: '/refund-policy',
      cookiePolicy: '/cookies',
      gdprCompliance: true,
      cookieConsent: true,
      ageVerification: false,
      minimumAge: 18,
      taxEnabled: true,
      taxRate: 10,
      taxIncluded: true,
      invoiceEnabled: true,
      invoicePrefix: 'INV-'
    }
  }

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Fetch settings from API
  const { data: apiSettings, isLoading: isLoadingSettings, refetch: refetchSettings } = useSystemSettings()
  const { data: healthData, isLoading: isLoadingHealth } = useSystemHealth()
  const updateSettingsMutation = useUpdateSettingsByCategory()

  // Local settings state (for editing)
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)

  // Sync API data to local state
  useEffect(() => {
    if (apiSettings) {
      setSettings(apiSettings)
    }
  }, [apiSettings])

  const isSaving = updateSettingsMutation.isPending

  const apiKeys = [
    {
      id: '1',
      name: 'Payment Gateway API',
      key: 'pk_live_51HqK2LGxxxxxxxxxxxxxxxxxxx',
      type: 'payment',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-26T14:20:00Z',
      permissions: ['payment', 'refund'],
      rateLimit: 1000
    },
    {
      id: '2',
      name: 'SMS Service API',
      key: 'sk_live_51HqK2LGyyyyyyyyyyyyyyyyyyyy',
      type: 'sms',
      status: 'active',
      createdAt: '2024-01-10T14:20:00Z',
      lastUsed: '2024-01-25T09:15:00Z',
      permissions: ['sms', 'notification'],
      rateLimit: 500
    },
    {
      id: '3',
      name: 'Email Service API',
      key: 'ek_live_51HqK2LGzzzzzzzzzzzzzzzzzzzz',
      type: 'email',
      status: 'inactive',
      createdAt: '2024-01-05T09:15:00Z',
      lastUsed: '2024-01-20T16:45:00Z',
      permissions: ['email', 'notification'],
      rateLimit: 1000
    },
    {
      id: '4',
      name: 'Mobile App API',
      key: 'mk_live_51HqK2LGaaaaaaaaaaaaaaaaaa',
      type: 'mobile',
      status: 'active',
      createdAt: '2024-01-20T11:00:00Z',
      lastUsed: '2024-01-26T16:30:00Z',
      permissions: ['read', 'write', 'delete'],
      rateLimit: 2000
    }
  ]

  const systemLogs = [
    {
      id: '1',
      level: 'info',
      message: 'System backup completed successfully',
      timestamp: '2024-01-26T15:30:00Z',
      source: 'backup-service',
      details: 'Backup size: 2.5GB, Duration: 15 minutes'
    },
    {
      id: '2',
      level: 'warning',
      message: 'High memory usage detected',
      timestamp: '2024-01-26T14:45:00Z',
      source: 'monitoring',
      details: 'Memory usage: 85%, Threshold: 80%'
    },
    {
      id: '3',
      level: 'error',
      message: 'Payment gateway connection failed',
      timestamp: '2024-01-26T13:20:00Z',
      source: 'payment-service',
      details: 'Connection timeout after 30 seconds'
    },
    {
      id: '4',
      level: 'info',
      message: 'Cache cleared successfully',
      timestamp: '2024-01-26T12:15:00Z',
      source: 'cache-service',
      details: 'Cleared 1,234 cache entries'
    },
    {
      id: '5',
      level: 'info',
      message: 'SSL certificate renewed',
      timestamp: '2024-01-26T10:00:00Z',
      source: 'security-service',
      details: 'New expiry: 2025-01-26'
    }
  ]

  // Use real health data from API or fallback
  const systemHealth = {
    cpu: healthData?.server?.cpu ?? 0,
    memory: healthData?.server?.memory ?? 0,
    disk: healthData?.server?.disk ?? 0,
    uptime: healthData?.uptime ?? 'N/A',
    lastRestart: 'N/A',
    version: healthData?.version ?? '1.0.0',
    phpVersion: 'N/A',
    nodeVersion: healthData?.nodeVersion ?? 'N/A',
    databaseSize: 'N/A',
    cacheHitRate: 0,
    services: healthData?.services ?? { database: 'unknown', cache: 'unknown', storage: 'unknown', email: 'unknown' }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'debug': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return AlertTriangle
      case 'warning': return AlertTriangle
      case 'info': return Info
      case 'debug': return Info
      default: return Info
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

  const handleSave = async () => {
    try {
      // Save the current active tab's settings
      const categorySettings = settings[activeTab as keyof SystemSettings]
      await updateSettingsMutation.mutateAsync({
        category: activeTab,
        settings: categorySettings
      })
      setIsEditing(false)
      toast.success('Cài đặt đã được lưu thành công!')
      // Refetch to get latest data
      refetchSettings()
    } catch (error) {
      toast.error('Lỗi khi lưu cài đặt. Vui lòng thử lại!')
    }
  }

  const handleRefresh = () => {
    refetchSettings()
    toast.success('Đã làm mới dữ liệu!')
  }

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
    toast.success('Đã copy vào clipboard!')
  }

  const clearCache = () => {
    toast.success('Cache đã được xóa thành công!')
  }

  const runBackup = () => {
    toast.success('Backup đang được thực hiện...')
  }

  const testEmail = () => {
    toast.success('Email test đã được gửi!')
  }

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: Settings },
    { id: 'payment', label: 'Thanh toán', icon: DollarSign },
    { id: 'product', label: 'Sản phẩm', icon: Package },
    { id: 'notification', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'email', label: 'Email/SMTP', icon: Mail },
    { id: 'storage', label: 'Lưu trữ', icon: HardDrive },
    { id: 'backup', label: 'Backup', icon: Cloud },
    { id: 'legal', label: 'Pháp lý', icon: FileText },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'logs', label: 'Logs', icon: Database },
    { id: 'health', label: 'Sức khỏe', icon: Activity }
  ]

  const renderSettingField = (label: string, description: string, children: React.ReactNode) => (
    <div className="flex items-start justify-between py-4 border-b last:border-b-0">
      <div className="flex-1 pr-4">
        <Label className="text-sm font-medium text-gray-900">{label}</Label>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )

  // Loading state
  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Đang tải cài đặt...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoadingSettings}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSettings ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={() => {
              setIsEditing(false)
              // Reset to API data
              if (apiSettings) setSettings(apiSettings)
            }}>
              Hủy
            </Button>
          )}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Thông tin website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tên trang web</Label>
                <Input
                  value={settings.general.siteName}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={settings.general.siteDescription}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>URL trang web</Label>
                <Input
                  value={settings.general.siteUrl}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email quản trị</Label>
                  <Input
                    value={settings.general.adminEmail}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email hỗ trợ</Label>
                  <Input
                    value={settings.general.supportEmail}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Hotline hỗ trợ</Label>
                <Input
                  value={settings.general.supportPhone}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Chế độ bảo trì',
                'Tạm dừng truy cập từ người dùng',
                <Switch
                  checked={settings.general.maintenanceMode}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Cho phép đăng ký',
                'Người dùng có thể tạo tài khoản mới',
                <Switch
                  checked={settings.general.registrationEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Xác thực email',
                'Yêu cầu xác thực email khi đăng ký',
                <Switch
                  checked={settings.general.emailVerification}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Xác thực số điện thoại',
                'Yêu cầu xác thực SĐT khi đăng ký',
                <Switch
                  checked={settings.general.phoneVerification}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 space-y-4">
                <div>
                  <Label>Múi giờ</Label>
                  <Select disabled={!isEditing} value={settings.general.timezone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ngôn ngữ mặc định</Label>
                  <Select disabled={!isEditing} value={settings.general.language}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {settings.general.maintenanceMode && (
            <Card className="lg:col-span-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Thông báo bảo trì</h4>
                    <Textarea
                      value={settings.general.maintenanceMessage}
                      disabled={!isEditing}
                      className="mt-2 bg-white"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cài đặt thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tiền tệ mặc định</Label>
                <Select disabled={!isEditing} value={settings.payment.defaultCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tỷ lệ hoa hồng (%)</Label>
                  <Input
                    type="number"
                    value={settings.payment.commissionRate}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Loại hoa hồng</Label>
                  <Select disabled={!isEditing} value={settings.payment.commissionType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Cố định (VNĐ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rút tiền tối thiểu</Label>
                  <Input
                    type="number"
                    value={settings.payment.minimumWithdraw}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Rút tiền tối đa</Label>
                  <Input
                    type="number"
                    value={settings.payment.maximumWithdraw}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thời gian thanh toán (phút)</Label>
                  <Input
                    type="number"
                    value={settings.payment.paymentTimeout}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Thời gian hoàn tiền (ngày)</Label>
                  <Input
                    type="number"
                    value={settings.payment.refundPeriod}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Thời gian giữ tiền (ngày)</Label>
                <Input
                  type="number"
                  value={settings.payment.holdPeriod}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Số ngày giữ tiền trước khi thanh toán cho seller</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(settings.payment.paymentMethods).map(([method, enabled]) => (
                <div key={method} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium capitalize">
                      {method === 'creditCard' ? 'Thẻ tín dụng' :
                       method === 'bankTransfer' ? 'Chuyển khoản' :
                       method === 'cod' ? 'COD' :
                       method.toUpperCase()}
                    </span>
                  </div>
                  <Switch checked={enabled} disabled={!isEditing} />
                </div>
              ))}
              <div className="pt-4 space-y-4 border-t mt-4">
                {renderSettingField(
                  'Tự động thanh toán',
                  'Tự động chuyển tiền cho seller theo lịch',
                  <Switch
                    checked={settings.payment.autoPayoutEnabled}
                    disabled={!isEditing}
                  />
                )}
                {settings.payment.autoPayoutEnabled && (
                  <div>
                    <Label>Lịch thanh toán</Label>
                    <Select disabled={!isEditing} value={settings.payment.payoutSchedule}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="biweekly">2 tuần/lần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Settings */}
      {activeTab === 'product' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Giới hạn sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sản phẩm tối đa/người dùng</Label>
                  <Input
                    type="number"
                    value={settings.product.maxProductsPerUser}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>SP tối đa (gói miễn phí)</Label>
                  <Input
                    type="number"
                    value={settings.product.maxProductsPerFreePlan}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Số ảnh tối đa/sản phẩm</Label>
                  <Input
                    type="number"
                    value={settings.product.maxImagesPerProduct}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Số video tối đa/sản phẩm</Label>
                  <Input
                    type="number"
                    value={settings.product.maxVideoPerProduct}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Dung lượng file tối đa (MB)</Label>
                <Input
                  type="number"
                  value={settings.product.maxFileSize}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Thời hạn sản phẩm (ngày)</Label>
                <Input
                  type="number"
                  value={settings.product.productExpiryDays}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Ngưỡng hết hàng</Label>
                <Input
                  type="number"
                  value={settings.product.lowStockThreshold}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Kiểm duyệt & Giá dịch vụ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Tự động duyệt',
                'Sản phẩm được đăng ngay không cần kiểm duyệt',
                <Switch
                  checked={settings.product.autoApprove}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Yêu cầu kiểm duyệt',
                'Sản phẩm phải được admin duyệt',
                <Switch
                  checked={settings.product.moderationRequired}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Kiểm duyệt AI',
                'Sử dụng AI để lọc nội dung',
                <Switch
                  checked={settings.product.aiModeration}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Cho phép đặt trước',
                'Cho phép đặt hàng khi hết stock',
                <Switch
                  checked={settings.product.allowPreorder}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Sản phẩm số',
                'Cho phép bán file/tài liệu số',
                <Switch
                  checked={settings.product.allowDigitalProducts}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 space-y-4 border-t mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Giá nổi bật (VNĐ)</Label>
                    <Input
                      type="number"
                      value={settings.product.featuredPrice}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Giá quảng bá (VNĐ)</Label>
                    <Input
                      type="number"
                      value={settings.product.promotedPrice}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Giá boost (VNĐ)</Label>
                    <Input
                      type="number"
                      value={settings.product.boostPrice}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notification' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Kênh thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Email',
                'Gửi thông báo qua email',
                <Switch
                  checked={settings.notification.emailEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'SMS',
                'Gửi thông báo qua tin nhắn',
                <Switch
                  checked={settings.notification.smsEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Push Notification',
                'Thông báo đẩy trình duyệt/app',
                <Switch
                  checked={settings.notification.pushEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'In-App',
                'Thông báo trong ứng dụng',
                <Switch
                  checked={settings.notification.inAppEnabled}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 space-y-4 border-t mt-4">
                <div>
                  <Label>Email gửi đi</Label>
                  <Input
                    value={settings.notification.emailFrom}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Tên hiển thị</Label>
                  <Input
                    value={settings.notification.emailFromName}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt gửi thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Hàng đợi thông báo',
                'Sử dụng queue để gửi thông báo',
                <Switch
                  checked={settings.notification.notificationQueue}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Gửi tóm tắt',
                'Gộp thông báo thành email tóm tắt',
                <Switch
                  checked={settings.notification.digestEnabled}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 space-y-4 border-t mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Batch size</Label>
                    <Input
                      type="number"
                      value={settings.notification.batchSize}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Số lần thử lại</Label>
                    <Input
                      type="number"
                      value={settings.notification.retryAttempts}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>SMS Provider</Label>
                  <Select disabled={!isEditing} value={settings.notification.smsProvider}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="esms">eSMS</SelectItem>
                      <SelectItem value="speedsms">SpeedSMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Push Provider</Label>
                  <Select disabled={!isEditing} value={settings.notification.pushProvider}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firebase">Firebase (FCM)</SelectItem>
                      <SelectItem value="onesignal">OneSignal</SelectItem>
                      <SelectItem value="pusher">Pusher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bảo mật cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'SSL/HTTPS',
                'Bật kết nối an toàn SSL',
                <Switch
                  checked={settings.security.sslEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Force HTTPS',
                'Chuyển hướng tất cả về HTTPS',
                <Switch
                  checked={settings.security.forceHttps}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'CORS',
                'Cho phép cross-origin requests',
                <Switch
                  checked={settings.security.corsEnabled}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Rate Limiting',
                'Giới hạn số request/phút',
                <Switch
                  checked={settings.security.rateLimiting}
                  disabled={!isEditing}
                />
              )}
              {settings.security.rateLimiting && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label>Requests/phút</Label>
                    <Input
                      type="number"
                      value={settings.security.rateLimit}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Thời gian (giây)</Label>
                    <Input
                      type="number"
                      value={settings.security.rateLimitWindow}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              {renderSettingField(
                'Audit Logging',
                'Ghi log hoạt động hệ thống',
                <Switch
                  checked={settings.security.auditLogging}
                  disabled={!isEditing}
                />
              )}
              {settings.security.auditLogging && (
                <div className="pt-2">
                  <Label>Thời gian lưu log (ngày)</Label>
                  <Input
                    type="number"
                    value={settings.security.auditRetention}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bảo mật nâng cao
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Mã hóa dữ liệu',
                'Mã hóa dữ liệu nhạy cảm',
                <Switch
                  checked={settings.security.dataEncryption}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'CSRF Protection',
                'Bảo vệ chống tấn công CSRF',
                <Switch
                  checked={settings.security.csrfProtection}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'XSS Protection',
                'Bảo vệ chống tấn công XSS',
                <Switch
                  checked={settings.security.xssProtection}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Content Security Policy',
                'Bật CSP header',
                <Switch
                  checked={settings.security.contentSecurityPolicy}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'CAPTCHA',
                'Bật xác thực CAPTCHA',
                <Switch
                  checked={settings.security.captchaEnabled}
                  disabled={!isEditing}
                />
              )}
              {settings.security.captchaEnabled && (
                <div className="pt-2 space-y-4">
                  <div>
                    <Label>CAPTCHA Provider</Label>
                    <Select disabled={!isEditing} value={settings.security.captchaProvider}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recaptcha">Google reCAPTCHA</SelectItem>
                        <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                        <SelectItem value="turnstile">Cloudflare Turnstile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Áp dụng CAPTCHA cho:</Label>
                    {renderSettingField(
                      'Đăng nhập',
                      '',
                      <Switch
                        checked={settings.security.captchaOnLogin}
                        disabled={!isEditing}
                      />
                    )}
                    {renderSettingField(
                      'Đăng ký',
                      '',
                      <Switch
                        checked={settings.security.captchaOnRegister}
                        disabled={!isEditing}
                      />
                    )}
                    {renderSettingField(
                      'Liên hệ',
                      '',
                      <Switch
                        checked={settings.security.captchaOnContact}
                        disabled={!isEditing}
                      />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Settings */}
      {activeTab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Meta Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={settings.seo.metaTitle}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{settings.seo.metaTitle.length}/60 ký tự</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={settings.seo.metaDescription}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">{settings.seo.metaDescription.length}/160 ký tự</p>
              </div>
              <div>
                <Label>Meta Keywords</Label>
                <Input
                  value={settings.seo.metaKeywords}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>OG Image URL</Label>
                <Input
                  value={settings.seo.ogImage}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={settings.seo.canonicalUrl}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tracking & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Google Analytics ID</Label>
                <Input
                  placeholder="G-XXXXXXXXXX"
                  value={settings.seo.googleAnalytics}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Google Tag Manager ID</Label>
                <Input
                  placeholder="GTM-XXXXXXX"
                  value={settings.seo.googleTagManager}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Facebook Pixel ID</Label>
                <Input
                  placeholder="XXXXXXXXXXXXXXX"
                  value={settings.seo.facebookPixel}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div className="pt-4 border-t">
                {renderSettingField(
                  'Sitemap',
                  'Tự động tạo sitemap.xml',
                  <Switch
                    checked={settings.seo.sitemapEnabled}
                    disabled={!isEditing}
                  />
                )}
                {renderSettingField(
                  'Structured Data',
                  'Thêm JSON-LD schema markup',
                  <Switch
                    checked={settings.seo.structuredData}
                    disabled={!isEditing}
                  />
                )}
                {renderSettingField(
                  'Breadcrumbs',
                  'Hiển thị breadcrumb navigation',
                  <Switch
                    checked={settings.seo.breadcrumbs}
                    disabled={!isEditing}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email/SMTP Settings */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select disabled={!isEditing} value={settings.email.provider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.email.provider === 'smtp' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SMTP Host</Label>
                      <Input
                        value={settings.email.smtpHost}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={settings.email.smtpPort}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>SMTP Username</Label>
                    <Input
                      value={settings.email.smtpUser}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>SMTP Password</Label>
                    <Input
                      type="password"
                      value={settings.email.smtpPassword}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  {renderSettingField(
                    'SSL/TLS',
                    'Sử dụng kết nối bảo mật',
                    <Switch
                      checked={settings.email.smtpSecure}
                      disabled={!isEditing}
                    />
                  )}
                </>
              )}

              {settings.email.provider === 'sendgrid' && (
                <div>
                  <Label>SendGrid API Key</Label>
                  <Input
                    type="password"
                    value={settings.email.sendgridApiKey}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}

              {settings.email.provider === 'mailgun' && (
                <>
                  <div>
                    <Label>Mailgun API Key</Label>
                    <Input
                      type="password"
                      value={settings.email.mailgunApiKey}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Mailgun Domain</Label>
                    <Input
                      value={settings.email.mailgunDomain}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Footer</Label>
                <Textarea
                  value={settings.email.emailFooter}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                />
              </div>
              {renderSettingField(
                'Link hủy đăng ký',
                'Thêm link unsubscribe vào email',
                <Switch
                  checked={settings.email.unsubscribeLink}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 border-t">
                <Label>Test Email</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="test@example.com"
                    value={settings.email.testEmail}
                    disabled={!isEditing}
                  />
                  <Button variant="outline" onClick={testEmail} disabled={!isEditing}>
                    Gửi test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Storage Settings */}
      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select disabled={!isEditing} value={settings.storage.provider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="cloudinary">Cloudinary</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.storage.provider === 'local' && (
                <div>
                  <Label>Upload Path</Label>
                  <Input
                    value={settings.storage.localPath}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}

              {settings.storage.provider === 's3' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>S3 Bucket</Label>
                      <Input
                        value={settings.storage.s3Bucket}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Input
                        value={settings.storage.s3Region}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Access Key</Label>
                    <Input
                      type="password"
                      value={settings.storage.s3AccessKey}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={settings.storage.s3SecretKey}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Image Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Tối ưu hóa ảnh',
                'Tự động nén và tối ưu ảnh upload',
                <Switch
                  checked={settings.storage.imageOptimization}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'CDN',
                'Sử dụng CDN cho static files',
                <Switch
                  checked={settings.storage.cdnEnabled}
                  disabled={!isEditing}
                />
              )}
              {settings.storage.cdnEnabled && (
                <div className="pt-2">
                  <Label>CDN URL</Label>
                  <Input
                    value={settings.storage.cdnUrl}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}
              <div className="pt-4 space-y-4 border-t mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Chất lượng ảnh (%)</Label>
                    <Input
                      type="number"
                      value={settings.storage.imageQuality}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Max upload size (MB)</Label>
                    <Input
                      type="number"
                      value={settings.storage.maxUploadSize}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Cài đặt Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'Tự động backup',
                'Bật sao lưu tự động theo lịch',
                <Switch
                  checked={settings.backup.enabled}
                  disabled={!isEditing}
                />
              )}
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tần suất</Label>
                    <Select disabled={!isEditing} value={settings.backup.frequency}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Mỗi giờ</SelectItem>
                        <SelectItem value="daily">Mỗi ngày</SelectItem>
                        <SelectItem value="weekly">Mỗi tuần</SelectItem>
                        <SelectItem value="monthly">Mỗi tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Thời gian</Label>
                    <Input
                      type="time"
                      value={settings.backup.time}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Số bản backup lưu trữ</Label>
                  <Input
                    type="number"
                    value={settings.backup.retention}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="pt-4 border-t mt-4">
                {renderSettingField(
                  'Backup Database',
                  'Sao lưu cơ sở dữ liệu',
                  <Switch
                    checked={settings.backup.includeDatabase}
                    disabled={!isEditing}
                  />
                )}
                {renderSettingField(
                  'Backup Uploads',
                  'Sao lưu file upload',
                  <Switch
                    checked={settings.backup.includeUploads}
                    disabled={!isEditing}
                  />
                )}
                {renderSettingField(
                  'Mã hóa backup',
                  'Mã hóa file backup',
                  <Switch
                    checked={settings.backup.encryptBackup}
                    disabled={!isEditing}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Trạng thái Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Backup thành công</p>
                    <p className="text-sm text-green-600">
                      Lần cuối: {formatDate(settings.backup.lastBackup)}
                    </p>
                    <p className="text-sm text-green-600">
                      Kích thước: {settings.backup.lastBackupSize}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={runBackup} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Backup ngay
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Thông báo</h4>
                {renderSettingField(
                  'Khi thành công',
                  'Gửi email khi backup thành công',
                  <Switch
                    checked={settings.backup.notifyOnSuccess}
                    disabled={!isEditing}
                  />
                )}
                {renderSettingField(
                  'Khi thất bại',
                  'Gửi email khi backup thất bại',
                  <Switch
                    checked={settings.backup.notifyOnFailure}
                    disabled={!isEditing}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legal Settings */}
      {activeTab === 'legal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Trang pháp lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Điều khoản dịch vụ</Label>
                <Input
                  value={settings.legal.termsOfService}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Chính sách bảo mật</Label>
                <Input
                  value={settings.legal.privacyPolicy}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Chính sách hoàn tiền</Label>
                <Input
                  value={settings.legal.refundPolicy}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Chính sách Cookie</Label>
                <Input
                  value={settings.legal.cookiePolicy}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thuế & Hóa đơn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSettingField(
                'GDPR Compliance',
                'Tuân thủ quy định GDPR',
                <Switch
                  checked={settings.legal.gdprCompliance}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Cookie Consent',
                'Hiển thị thông báo cookie',
                <Switch
                  checked={settings.legal.cookieConsent}
                  disabled={!isEditing}
                />
              )}
              {renderSettingField(
                'Thuế',
                'Bật tính năng thuế',
                <Switch
                  checked={settings.legal.taxEnabled}
                  disabled={!isEditing}
                />
              )}
              {settings.legal.taxEnabled && (
                <div className="pt-2 space-y-4">
                  <div>
                    <Label>Thuế suất (%)</Label>
                    <Input
                      type="number"
                      value={settings.legal.taxRate}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  {renderSettingField(
                    'Giá đã bao gồm thuế',
                    'Giá hiển thị đã bao gồm thuế',
                    <Switch
                      checked={settings.legal.taxIncluded}
                      disabled={!isEditing}
                    />
                  )}
                </div>
              )}
              {renderSettingField(
                'Hóa đơn',
                'Bật xuất hóa đơn',
                <Switch
                  checked={settings.legal.invoiceEnabled}
                  disabled={!isEditing}
                />
              )}
              {settings.legal.invoiceEnabled && (
                <div className="pt-2">
                  <Label>Prefix hóa đơn</Label>
                  <Input
                    value={settings.legal.invoicePrefix}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'api' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo API Key mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Key className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apiKey.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {showApiKey === apiKey.id ? apiKey.key : apiKey.key.substring(0, 12) + '...'}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                        >
                          {showApiKey === apiKey.id ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {apiKey.type}
                        </Badge>
                        <Badge
                          className={apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {apiKey.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Rate limit: {apiKey.rateLimit}/phút
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Lần cuối sử dụng</p>
                    <p className="text-sm">{formatDate(apiKey.lastUsed)}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Logs */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Logs
              </CardTitle>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.map((log) => {
                const Icon = getLogLevelIcon(log.level)
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getLogLevelColor(log.level)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{log.source}</span>
                        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                      </div>
                      <p className="font-medium text-gray-900">{log.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">CPU</span>
                  <span className="text-sm font-medium">{systemHealth.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${systemHealth.cpu > 80 ? 'bg-red-500' : systemHealth.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealth.cpu}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="text-sm font-medium">{systemHealth.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${systemHealth.memory > 80 ? 'bg-red-500' : systemHealth.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealth.memory}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Disk</span>
                  <span className="text-sm font-medium">{systemHealth.disk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${systemHealth.disk > 80 ? 'bg-red-500' : systemHealth.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealth.disk}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Uptime & Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium text-green-600">{systemHealth.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Restart</span>
                <span className="font-medium">{formatDate(systemHealth.lastRestart)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Version</span>
                <span className="font-medium">{systemHealth.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PHP Version</span>
                <span className="font-medium">{systemHealth.phpVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Node Version</span>
                <span className="font-medium">{systemHealth.nodeVersion}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database & Cache
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Database Size</span>
                <span className="font-medium">{systemHealth.databaseSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cache Hit Rate</span>
                <span className="font-medium text-green-600">{systemHealth.cacheHitRate}%</span>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full" onClick={clearCache}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
