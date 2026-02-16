import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
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
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Mail,
  Phone,
  Reply,
  Archive,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  Paperclip,
  BarChart3,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useTickets,
  useUpdateTicketStatus,
  useReplyToTicket,
} from '@/hooks/useAdmin'
import type { SupportTicket } from '@admin/api/admin'

export default function CustomerSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  )
  const [replyText, setReplyText] = useState('')
  const [activeTab, setActiveTab] = useState('tickets')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: ticketsData, isLoading } = useTickets({
    page,
    pageSize,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined, // 'active' excludes resolved/closed on backend
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  })

  const updateStatusMutation = useUpdateTicketStatus()
  const replyMutation = useReplyToTicket()

  const tickets = ticketsData?.items || []
  const total = ticketsData?.total || 0
  const totalPages = ticketsData?.totalPages || 1

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Khẩn cấp'
      case 'high':
        return 'Cao'
      case 'medium':
        return 'Trung bình'
      case 'low':
        return 'Thấp'
      default:
        return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Mở'
      case 'in_progress':
        return 'Đang xử lý'
      case 'pending':
        return 'Chờ phản hồi'
      case 'resolved':
        return 'Đã giải quyết'
      case 'closed':
        return 'Đã đóng'
      default:
        return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'account':
        return 'Tài khoản'
      case 'product':
        return 'Sản phẩm'
      case 'payment':
        return 'Thanh toán'
      case 'technical':
        return 'Kỹ thuật'
      case 'report':
        return 'Báo cáo'
      case 'question':
        return 'Câu hỏi'
      default:
        return category
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ngày trước`
  }

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim()) return

    replyMutation.mutate(
      { id: selectedTicket.id, message: replyText },
      {
        onSuccess: () => {
          toast.success('Đã gửi phản hồi')
          setReplyText('')
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi gửi phản hồi')
        },
      }
    )
  }

  const tabs = [
    { id: 'tickets', label: 'Tickets', icon: MessageSquare },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
    { id: 'faq', label: 'FAQ', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hỗ trợ khách hàng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các ticket hỗ trợ và khiếu nại từ khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Lưu trữ
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo ticket mới
          </Button>
        </div>
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

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng ticket</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đang mở</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-red-600">Cần xử lý</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đang xử lý</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-yellow-600">Trong tiến trình</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đã giải quyết</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-green-600">Tháng này</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo ID, tiêu đề, khách hàng..."
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
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="open">Mở</SelectItem>
                      <SelectItem value="in_progress">Đang xử lý</SelectItem>
                      <SelectItem value="pending">Chờ phản hồi</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={value => {
                      setPriorityFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ưu tiên</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={categoryFilter}
                    onValueChange={value => {
                      setCategoryFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      <SelectItem value="account">Tài khoản</SelectItem>
                      <SelectItem value="product">Sản phẩm</SelectItem>
                      <SelectItem value="payment">Thanh toán</SelectItem>
                      <SelectItem value="technical">Kỹ thuật</SelectItem>
                      <SelectItem value="report">Báo cáo</SelectItem>
                      <SelectItem value="question">Câu hỏi</SelectItem>
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

          {/* Tickets List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách ticket ({total})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Không có ticket nào
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900">
                                  {ticket.title}
                                </h3>
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  {getPriorityLabel(ticket.priority)}
                                </Badge>
                                <Badge
                                  className={getStatusColor(ticket.status)}
                                >
                                  {getStatusLabel(ticket.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {ticket.id}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {ticket.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{ticket.replies} phản hồi</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{getTimeAgo(ticket.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Reply className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                          onClick={() =>
                            setPage(p => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-1">
              {selectedTicket ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Thông tin khách hàng
                        </h4>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedTicket.customer.name}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{selectedTicket.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{selectedTicket.customer.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Thông tin ticket
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ID:</span>
                            <span className="font-medium">
                              {selectedTicket.id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Danh mục:</span>
                            <span className="font-medium">
                              {getCategoryLabel(selectedTicket.category)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ưu tiên:</span>
                            <Badge
                              className={getPriorityColor(
                                selectedTicket.priority
                              )}
                            >
                              {getPriorityLabel(selectedTicket.priority)}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Trạng thái:</span>
                            <Select
                              value={selectedTicket.status}
                              onValueChange={value => {
                                updateStatusMutation.mutate(
                                  { id: selectedTicket.id, status: value },
                                  {
                                    onSuccess: () => {
                                      toast.success('Đã cập nhật trạng thái')
                                      setSelectedTicket({
                                        ...selectedTicket,
                                        status: value as SupportTicket['status'],
                                      })
                                    },
                                    onError: () => {
                                      toast.error(
                                        'Có lỗi xảy ra khi cập nhật trạng thái'
                                      )
                                    },
                                  }
                                )
                              }}
                            >
                              <SelectTrigger className="w-36 h-7">
                                <Badge
                                  className={getStatusColor(
                                    selectedTicket.status
                                  )}
                                >
                                  {getStatusLabel(selectedTicket.status)}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Mở</SelectItem>
                                <SelectItem value="in_progress">
                                  Đang xử lý
                                </SelectItem>
                                <SelectItem value="pending">
                                  Chờ phản hồi
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Đã giải quyết
                                </SelectItem>
                                <SelectItem value="closed">Đã đóng</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phụ trách:</span>
                            <span className="font-medium">
                              {selectedTicket.assignedTo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tạo lúc:</span>
                            <span className="font-medium">
                              {formatDate(selectedTicket.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cập nhật:</span>
                            <span className="font-medium">
                              {formatDate(selectedTicket.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Mô tả
                        </h4>
                        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                          {selectedTicket.description}
                        </p>
                      </div>

                      {/* Reply Section */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Phản hồi
                        </h4>
                        <div className="space-y-3">
                          <Textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Nhập phản hồi..."
                            rows={4}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={handleReply}
                              disabled={
                                !replyText.trim() || replyMutation.isPending
                              }
                            >
                              {replyMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4 mr-1" />
                              )}
                              Gửi phản hồi
                            </Button>
                            <Button variant="outline" size="sm">
                              <Paperclip className="h-4 w-4 mr-1" />
                              Đính kèm
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Chỉnh sửa
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Archive className="h-4 w-4 mr-1" />
                          Lưu trữ
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Chọn một ticket để xem chi tiết
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo danh mục</CardTitle>
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
              <CardTitle>Thống kê theo thời gian</CardTitle>
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
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <Card>
          <CardHeader>
            <CardTitle>Câu hỏi thường gặp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Làm thế nào để đăng ký tài khoản?
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn có thể đăng ký tài khoản bằng cách nhấn nút "Đăng ký" ở
                  góc trên bên phải và điền đầy đủ thông tin.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Làm sao để đăng sản phẩm?
                </h3>
                <p className="text-sm text-gray-600">
                  Sau khi đăng nhập, bạn có thể vào "Quản lý sản phẩm" và nhấn
                  "Thêm sản phẩm mới".
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Phí giao dịch là bao nhiêu?
                </h3>
                <p className="text-sm text-gray-600">
                  Chúng tôi thu phí hoa hồng 5% trên mỗi giao dịch thành công.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
