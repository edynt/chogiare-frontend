import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { APP_NAME } from '@/constants/app.constants'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search,
  Filter,
  Plus,
  Mail,
  Bell,
  Send,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Settings,
  MessageSquare
} from 'lucide-react'

export default function NotificationManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('campaigns')

  // Mock data
  const campaigns = [
    {
      id: '1',
      name: 'Chào mừng người dùng mới',
      type: 'welcome',
      status: 'active',
      recipients: 1250,
      sent: 1180,
      delivered: 1150,
      opened: 890,
      clicked: 234,
      createdAt: '2024-01-20T10:30:00Z',
      scheduledAt: '2024-01-20T10:30:00Z',
      template: 'welcome_email',
      channel: 'email',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Khuyến mãi Black Friday',
      type: 'promotion',
      status: 'completed',
      recipients: 5000,
      sent: 5000,
      delivered: 4850,
      opened: 3200,
      clicked: 890,
      createdAt: '2024-01-15T14:20:00Z',
      scheduledAt: '2024-01-15T14:20:00Z',
      template: 'black_friday_promo',
      channel: 'email',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Thông báo bảo trì hệ thống',
      type: 'system',
      status: 'scheduled',
      recipients: 10000,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdAt: '2024-01-25T09:15:00Z',
      scheduledAt: '2024-01-28T02:00:00Z',
      template: 'maintenance_notice',
      channel: 'push',
      priority: 'urgent'
    },
    {
      id: '4',
      name: 'Nhắc nhở thanh toán',
      type: 'payment',
      status: 'active',
      recipients: 450,
      sent: 420,
      delivered: 410,
      opened: 380,
      clicked: 120,
      createdAt: '2024-01-22T16:45:00Z',
      scheduledAt: '2024-01-22T16:45:00Z',
      template: 'payment_reminder',
      channel: 'sms',
      priority: 'medium'
    }
  ]

  const templates = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Chào mừng bạn đến với Chogiare!',
      content: 'Xin chào {{name}}, cảm ơn bạn đã đăng ký tài khoản...',
      variables: ['name', 'email', 'verification_link'],
      status: 'active',
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-20T14:20:00Z',
      usage: 1250
    },
    {
      id: '2',
      name: 'Order Confirmation',
      type: 'email',
      subject: 'Xác nhận đơn hàng #{{order_id}}',
      content: 'Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xác nhận...',
      variables: ['name', 'order_id', 'total_amount', 'delivery_date'],
      status: 'active',
      createdAt: '2024-01-08T14:20:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      usage: 2340
    },
    {
      id: '3',
      name: 'Payment Reminder',
      type: 'sms',
      subject: 'Nhắc nhở thanh toán',
      content: 'Xin chào {{name}}, đơn hàng #{{order_id}} của bạn chưa được thanh toán...',
      variables: ['name', 'order_id', 'amount', 'due_date'],
      status: 'active',
      createdAt: '2024-01-12T11:30:00Z',
      updatedAt: '2024-01-22T16:45:00Z',
      usage: 890
    },
    {
      id: '4',
      name: 'System Maintenance',
      type: 'push',
      subject: 'Thông báo bảo trì hệ thống',
      content: 'Hệ thống sẽ được bảo trì từ {{start_time}} đến {{end_time}}...',
      variables: ['start_time', 'end_time', 'affected_services'],
      status: 'draft',
      createdAt: '2024-01-20T08:45:00Z',
      updatedAt: '2024-01-25T10:20:00Z',
      usage: 0
    }
  ]

  const notifications = [
    {
      id: '1',
      type: 'email',
      recipient: 'user@example.com',
      subject: 'Chào mừng bạn đến với Chogiare!',
      status: 'delivered',
      sentAt: '2024-01-26T10:30:00Z',
      deliveredAt: '2024-01-26T10:30:15Z',
      openedAt: '2024-01-26T11:15:00Z',
      clickedAt: '2024-01-26T11:20:00Z',
      campaign: 'Chào mừng người dùng mới',
      template: 'welcome_email'
    },
    {
      id: '2',
      type: 'sms',
      recipient: '+84901234567',
      subject: 'Nhắc nhở thanh toán',
      status: 'delivered',
      sentAt: '2024-01-26T09:15:00Z',
      deliveredAt: '2024-01-26T09:15:05Z',
      openedAt: null,
      clickedAt: '2024-01-26T09:25:00Z',
      campaign: 'Nhắc nhở thanh toán',
      template: 'payment_reminder'
    },
    {
      id: '3',
      type: 'push',
      recipient: 'user_device_123',
      subject: 'Đơn hàng đã được giao',
      status: 'sent',
      sentAt: '2024-01-26T08:45:00Z',
      deliveredAt: null,
      openedAt: null,
      clickedAt: null,
      campaign: 'Order Updates',
      template: 'delivery_confirmation'
    },
    {
      id: '4',
      type: 'email',
      recipient: 'seller@example.com',
      subject: 'Sản phẩm mới cần duyệt',
      status: 'failed',
      sentAt: '2024-01-26T07:30:00Z',
      deliveredAt: null,
      openedAt: null,
      clickedAt: null,
      campaign: 'Product Moderation',
      template: 'product_approval'
    }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'completed': return 'Hoàn thành'
      case 'scheduled': return 'Đã lên lịch'
      case 'paused': return 'Tạm dừng'
      case 'draft': return 'Bản nháp'
      default: return status
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-blue-100 text-blue-800'
      case 'promotion': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-red-100 text-red-800'
      case 'payment': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'welcome': return 'Chào mừng'
      case 'promotion': return 'Khuyến mãi'
      case 'system': return 'Hệ thống'
      case 'payment': return 'Thanh toán'
      default: return type
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail
      case 'sms': return MessageSquare
      case 'push': return Bell
      default: return Mail
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

  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0

  const tabs = [
    { id: 'campaigns', label: 'Chiến dịch', icon: Send },
    { id: 'templates', label: 'Mẫu thư', icon: Mail },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'analytics', label: 'Phân tích', icon: BarChart3 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email & Thông báo</h1>
          <p className="text-gray-600 mt-1">Quản lý chiến dịch email và thông báo hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo chiến dịch
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng chiến dịch</p>
                <p className="text-2xl font-bold text-gray-900">{totalCampaigns}</p>
                <p className="text-xs text-green-600">+2 tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
                <p className="text-xs text-gray-500">/{totalCampaigns} chiến dịch</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã gửi</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ mở</p>
                <p className="text-2xl font-bold text-gray-900">{openRate}%</p>
                <p className="text-xs text-green-600">+2.5% tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo tên chiến dịch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="welcome">Chào mừng</SelectItem>
                      <SelectItem value="promotion">Khuyến mãi</SelectItem>
                      <SelectItem value="system">Hệ thống</SelectItem>
                      <SelectItem value="payment">Thanh toán</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                      <SelectItem value="paused">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách chiến dịch ({filteredCampaigns.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chiến dịch</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Kênh</TableHead>
                      <TableHead>Người nhận</TableHead>
                      <TableHead>Hiệu suất</TableHead>
                      <TableHead>Lên lịch</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => {
                      const ChannelIcon = getChannelIcon(campaign.channel)
                      return (
                        <TableRow key={campaign.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{campaign.name}</p>
                              <p className="text-sm text-gray-500">{campaign.template}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(campaign.type)}>
                              {getTypeLabel(campaign.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ChannelIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm capitalize">{campaign.channel}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                              <p className="text-gray-500">Đã gửi: {campaign.sent.toLocaleString()}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">
                                {campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0}% mở
                              </p>
                              <p className="text-gray-500">
                                {campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : 0}% click
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="text-gray-900">{formatDate(campaign.scheduledAt)}</p>
                              <p className="text-gray-500">Tạo: {formatDate(campaign.createdAt)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                {campaign.status === 'active' ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mẫu thư ({templates.length})</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo mẫu mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getStatusColor(template.status)}>
                        {getStatusLabel(template.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Subject:</p>
                      <p className="text-sm text-gray-900 line-clamp-1">{template.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Content:</p>
                      <p className="text-sm text-gray-900 line-clamp-2">{template.content}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Variables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map((variable, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Sử dụng: {template.usage} lần
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Thông báo gần đây ({notifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const ChannelIcon = getChannelIcon(notification.type)
                return (
                  <div key={notification.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ChannelIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{notification.subject}</p>
                        <Badge className={getStatusColor(notification.status)}>
                          {getStatusLabel(notification.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{notification.recipient}</p>
                      <p className="text-sm text-gray-500">{notification.campaign}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(notification.sentAt)}</p>
                      {notification.openedAt && (
                        <p className="text-green-600">Đã mở</p>
                      )}
                      {notification.clickedAt && (
                        <p className="text-blue-600">Đã click</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo kênh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất chiến dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
