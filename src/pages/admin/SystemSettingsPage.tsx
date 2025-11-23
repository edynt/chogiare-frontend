import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Switch
} from '@/components/ui/switch'
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Users,
  Package,
  Mail,
  Database,
  Server,
  Key,
  Globe,
  Bell,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)

  // Mock data
  const systemSettings = {
    general: {
      siteName: 'Chogiare Marketplace',
      siteDescription: 'Nền tảng thương mại điện tử hàng đầu Việt Nam',
      siteUrl: 'https://chogiare.vn',
      adminEmail: 'admin@chogiare.vn',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerification: true
    },
    payment: {
      defaultCurrency: 'VND',
      supportedCurrencies: ['VND', 'USD'],
      paymentMethods: ['credit_card', 'momo', 'zalopay', 'bank_transfer'],
      commissionRate: 5.0,
      minimumTopUp: 10000,
      maximumTopUp: 50000000,
      paymentTimeout: 15,
      refundPeriod: 7
    },
    product: {
      maxProductsPerUser: 100,
      maxImagesPerProduct: 10,
      maxFileSize: 5,
      autoApprove: false,
      moderationRequired: true,
      featuredPrice: 199000,
      promotedPrice: 299000,
      productExpiryDays: 30,
      lowStockThreshold: 5
    },
    user: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
      sessionTimeout: 24,
      emailNotifications: true,
      smsNotifications: false,
      twoFactorAuth: false,
      profileCompletion: true
    },
    notification: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      emailFrom: 'noreply@chogiare.vn',
      smsProvider: 'twilio',
      notificationQueue: true,
      batchSize: 100,
      retryAttempts: 3,
      retryDelay: 300
    },
    security: {
      sslEnabled: true,
      corsEnabled: true,
      rateLimiting: true,
      apiKeyRequired: true,
      ipWhitelist: false,
      auditLogging: true,
      dataEncryption: true,
      backupEnabled: true,
      backupFrequency: 'daily'
    }
  }

  const apiKeys = [
    {
      id: '1',
      name: 'Payment Gateway API',
      key: 'pk_live_51H...',
      type: 'payment',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-26T14:20:00Z',
      permissions: ['payment', 'refund']
    },
    {
      id: '2',
      name: 'SMS Service API',
      key: 'sk_live_51H...',
      type: 'sms',
      status: 'active',
      createdAt: '2024-01-10T14:20:00Z',
      lastUsed: '2024-01-25T09:15:00Z',
      permissions: ['sms', 'notification']
    },
    {
      id: '3',
      name: 'Email Service API',
      key: 'ek_live_51H...',
      type: 'email',
      status: 'inactive',
      createdAt: '2024-01-05T09:15:00Z',
      lastUsed: '2024-01-20T16:45:00Z',
      permissions: ['email', 'notification']
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
      message: 'New user registration',
      timestamp: '2024-01-26T12:15:00Z',
      source: 'auth-service',
      details: 'User ID: 12345, Email: user@example.com'
    }
  ]

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

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: Settings },
    { id: 'payment', label: 'Thanh toán', icon: DollarSign },
    { id: 'product', label: 'Sản phẩm', icon: Package },
    { id: 'user', label: 'Người dùng', icon: Users },
    { id: 'notification', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'logs', label: 'System Logs', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
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
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tên trang web</label>
                <Input
                  value={systemSettings.general.siteName}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                <Input
                  value={systemSettings.general.siteDescription}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">URL trang web</label>
                <Input
                  value={systemSettings.general.siteUrl}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email quản trị</label>
                <Input
                  value={systemSettings.general.adminEmail}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Chế độ bảo trì</label>
                  <p className="text-xs text-gray-500">Tạm dừng truy cập từ người dùng</p>
                </div>
                <Switch
                  checked={systemSettings.general.maintenanceMode}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cho phép đăng ký</label>
                  <p className="text-xs text-gray-500">Người dùng có thể tạo tài khoản mới</p>
                </div>
                <Switch
                  checked={systemSettings.general.registrationEnabled}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Xác thực email</label>
                  <p className="text-xs text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                </div>
                <Switch
                  checked={systemSettings.general.emailVerification}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Múi giờ</label>
                <Select disabled={!isEditing} value={systemSettings.general.timezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tiền tệ mặc định</label>
                <Select disabled={!isEditing} value={systemSettings.payment.defaultCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tỷ lệ hoa hồng (%)</label>
                <Input
                  value={systemSettings.payment.commissionRate}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nạp tiền tối thiểu (VNĐ)</label>
                <Input
                  value={systemSettings.payment.minimumTopUp}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nạp tiền tối đa (VNĐ)</label>
                <Input
                  value={systemSettings.payment.maximumTopUp}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Các phương thức được hỗ trợ</label>
                <div className="space-y-2">
                  {systemSettings.payment.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                      <Switch checked={true} disabled={!isEditing} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'api' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>API Keys</CardTitle>
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
                      <p className="text-sm text-gray-500">{apiKey.key}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {apiKey.type}
                        </Badge>
                        <Badge 
                          className={apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <CardTitle>System Logs</CardTitle>
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
    </div>
  )
}
