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
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Mail,
  Phone,
  Flag,
  Reply,
  Archive,
  Star,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock data
  const tickets = [
    {
      id: 'TICKET-001',
      title: 'Không thể đăng nhập vào tài khoản',
      category: 'account',
      priority: 'high',
      status: 'open',
      customer: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567'
      },
      assignedTo: 'Support Team',
      createdAt: '2024-01-26T10:30:00Z',
      updatedAt: '2024-01-26T14:20:00Z',
      lastReply: '2024-01-26T14:20:00Z',
      replies: 3,
      tags: ['login', 'account', 'urgent'],
      description: 'Tôi không thể đăng nhập vào tài khoản của mình mặc dù đã nhập đúng mật khẩu...'
    },
    {
      id: 'TICKET-002',
      title: 'Sản phẩm bị từ chối không rõ lý do',
      category: 'product',
      priority: 'medium',
      status: 'in_progress',
      customer: {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321'
      },
      assignedTo: 'Moderation Team',
      createdAt: '2024-01-25T15:45:00Z',
      updatedAt: '2024-01-26T09:15:00Z',
      lastReply: '2024-01-26T09:15:00Z',
      replies: 5,
      tags: ['product', 'moderation', 'rejection'],
      description: 'Sản phẩm iPhone 14 Pro Max của tôi bị từ chối nhưng không có lý do cụ thể...'
    },
    {
      id: 'TICKET-003',
      title: 'Yêu cầu rút tiền bị chậm',
      category: 'payment',
      priority: 'high',
      status: 'pending',
      customer: {
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0912345678'
      },
      assignedTo: 'Finance Team',
      createdAt: '2024-01-24T11:20:00Z',
      updatedAt: '2024-01-25T16:30:00Z',
      lastReply: '2024-01-25T16:30:00Z',
      replies: 2,
      tags: ['withdrawal', 'payment', 'delay'],
      description: 'Yêu cầu rút tiền 5 triệu VNĐ đã được gửi từ 3 ngày trước nhưng vẫn chưa được xử lý...'
    },
    {
      id: 'TICKET-004',
      title: 'Lỗi hiển thị hình ảnh sản phẩm',
      category: 'technical',
      priority: 'low',
      status: 'resolved',
      customer: {
        name: 'Phạm Thị D',
        email: 'phamthid@email.com',
        phone: '0923456789'
      },
      assignedTo: 'Tech Team',
      createdAt: '2024-01-23T14:15:00Z',
      updatedAt: '2024-01-24T10:45:00Z',
      lastReply: '2024-01-24T10:45:00Z',
      replies: 4,
      tags: ['technical', 'image', 'display'],
      description: 'Hình ảnh sản phẩm không hiển thị đúng trên trang chi tiết...'
    },
    {
      id: 'TICKET-005',
      title: 'Báo cáo gian lận từ người bán',
      category: 'report',
      priority: 'urgent',
      status: 'open',
      customer: {
        name: 'Hoàng Văn E',
        email: 'hoangvane@email.com',
        phone: '0934567890'
      },
      assignedTo: 'Security Team',
      createdAt: '2024-01-26T08:30:00Z',
      updatedAt: '2024-01-26T12:15:00Z',
      lastReply: '2024-01-26T12:15:00Z',
      replies: 1,
      tags: ['fraud', 'report', 'urgent'],
      description: 'Tôi phát hiện người bán "TechStore Pro" có hành vi gian lận...'
    },
    {
      id: 'TICKET-006',
      title: 'Hướng dẫn sử dụng tính năng mới',
      category: 'question',
      priority: 'low',
      status: 'resolved',
      customer: {
        name: 'Vũ Thị F',
        email: 'vuthif@email.com',
        phone: '0945678901'
      },
      assignedTo: 'Support Team',
      createdAt: '2024-01-22T16:20:00Z',
      updatedAt: '2024-01-23T11:30:00Z',
      lastReply: '2024-01-23T11:30:00Z',
      replies: 2,
      tags: ['question', 'guide', 'feature'],
      description: 'Tôi muốn biết cách sử dụng tính năng quảng cáo mới...'
    }
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp'
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Mở'
      case 'in_progress': return 'Đang xử lý'
      case 'pending': return 'Chờ phản hồi'
      case 'resolved': return 'Đã giải quyết'
      case 'closed': return 'Đã đóng'
      default: return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'account': return 'Tài khoản'
      case 'product': return 'Sản phẩm'
      case 'payment': return 'Thanh toán'
      case 'technical': return 'Kỹ thuật'
      case 'report': return 'Báo cáo'
      case 'question': return 'Câu hỏi'
      default: return category
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ngày trước`
  }

  const totalTickets = tickets.length
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ & Khiếu nại</h1>
          <p className="text-gray-600 mt-1">Quản lý các ticket hỗ trợ và khiếu nại từ người dùng</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
                <p className="text-xs text-green-600">+5 hôm nay</p>
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
                <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
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
                <p className="text-2xl font-bold text-gray-900">{inProgressTickets}</p>
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
                <p className="text-2xl font-bold text-gray-900">{resolvedTickets}</p>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="open">Mở</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="pending">Chờ phản hồi</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ticket ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phụ trách</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1">{ticket.title}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{ticket.replies} phản hồi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{getTimeAgo(ticket.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {ticket.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-32">{ticket.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{ticket.customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryLabel(ticket.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityLabel(ticket.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{ticket.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(ticket.updatedAt)}</p>
                        <p className="text-gray-500">Tạo: {formatDate(ticket.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
