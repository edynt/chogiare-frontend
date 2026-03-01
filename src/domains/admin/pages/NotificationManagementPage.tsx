import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Badge } from '@shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import {
  Search,
  Filter,
  Plus,
  Mail,
  Bell,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import {
  useNotifications,
  useNotificationStats,
  useNotificationTemplates,
} from '@/hooks/useAdmin'
import type { QueryNotificationsParams } from '@admin/api/admin'

export default function NotificationManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('notifications')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const params: QueryNotificationsParams = {
    page,
    pageSize,
    search: searchQuery || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  }

  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useNotifications(params)
  const { data: stats, isLoading: isLoadingStats } = useNotificationStats()
  const { data: templates = [], isLoading: isLoadingTemplates } =
    useNotificationTemplates()

  const notifications = notificationsData?.items || []
  const total = notificationsData?.total || 0
  const totalPages = notificationsData?.totalPages || 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Đã gửi'
      case 'delivered':
        return 'Đã nhận'
      case 'pending':
        return 'Chờ gửi'
      case 'failed':
        return 'Thất bại'
      case 'active':
        return 'Hoạt động'
      case 'draft':
        return 'Bản nháp'
      default:
        return status
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return Mail
      case 'sms':
        return MessageSquare
      case 'push':
        return Bell
      default:
        return Mail
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const tabs = [
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'templates', label: 'Mẫu thư', icon: Mail },
    { id: 'analytics', label: 'Phân tích', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Email & Thông báo
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông báo và mẫu email hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
          <Button onClick={() => navigate('/admin/notifications/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo thông báo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng thông báo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    (stats?.total ?? 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã gửi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    (stats?.sent ?? 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã mở</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    (stats?.opened ?? 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ mở</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `${stats && stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0}%`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo tiêu đề, người nhận..."
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value)
                        setPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select
                    value={typeFilter}
                    onValueChange={value => {
                      setTypeFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={statusFilter}
                    onValueChange={value => {
                      setStatusFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ gửi</SelectItem>
                      <SelectItem value="sent">Đã gửi</SelectItem>
                      <SelectItem value="delivered">Đã nhận</SelectItem>
                      <SelectItem value="failed">Thất bại</SelectItem>
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

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Thông báo ({total})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có thông báo nào
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map(notification => {
                    const ChannelIcon = getChannelIcon(notification.type)
                    return (
                      <div
                        key={notification.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            notification.type === 'email'
                              ? 'bg-blue-100'
                              : notification.type === 'sms'
                                ? 'bg-green-100'
                                : 'bg-purple-100'
                          }`}
                        >
                          <ChannelIcon
                            className={`h-5 w-5 ${
                              notification.type === 'email'
                                ? 'text-blue-600'
                                : notification.type === 'sms'
                                  ? 'text-green-600'
                                  : 'text-purple-600'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">
                              {notification.subject}
                            </p>
                            <Badge
                              className={getStatusColor(notification.status)}
                            >
                              {getStatusLabel(notification.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {notification.recipient}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.template}
                          </p>
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
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Trang {page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
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
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có mẫu thư nào
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <Badge className={getStatusColor(template.status)}>
                          {getStatusLabel(template.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Subject:
                        </p>
                        <p className="text-sm text-gray-900 line-clamp-1">
                          {template.subject}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Content:
                        </p>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {template.content}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Variables:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.variables.map((variable, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
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
            )}
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
                  <p className="text-gray-500">
                    Biểu đồ thống kê sẽ được hiển thị ở đây
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất gửi thông báo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Biểu đồ hiệu suất sẽ được hiển thị ở đây
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
