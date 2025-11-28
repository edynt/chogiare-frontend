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
  Search,
  Filter,
  Plus,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  CreditCard,
  Settings,
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
  BarChart3
} from 'lucide-react'

export default function CustomerSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [activeTab, setActiveTab] = useState('tickets')

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
        phone: '0901234567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Support Team',
      createdAt: '2024-01-26T10:30:00Z',
      updatedAt: '2024-01-26T14:20:00Z',
      lastReply: '2024-01-26T14:20:00Z',
      replies: 3,
      tags: ['login', 'account', 'urgent'],
      description: 'Tôi không thể đăng nhập vào tài khoản của mình mặc dù đã nhập đúng mật khẩu. Hệ thống báo lỗi "Tài khoản không tồn tại" nhưng tôi chắc chắn đã đăng ký trước đó.',
      attachments: ['screenshot1.png', 'error_log.txt']
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
        phone: '0987654321',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Moderation Team',
      createdAt: '2024-01-25T15:45:00Z',
      updatedAt: '2024-01-26T09:15:00Z',
      lastReply: '2024-01-26T09:15:00Z',
      replies: 5,
      tags: ['product', 'moderation', 'rejection'],
      description: 'Sản phẩm iPhone 14 Pro Max của tôi bị từ chối nhưng không có lý do cụ thể. Tôi đã tuân thủ đầy đủ các quy định về hình ảnh và mô tả sản phẩm.',
      attachments: ['product_images.zip']
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
        phone: '0912345678',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Finance Team',
      createdAt: '2024-01-24T11:20:00Z',
      updatedAt: '2024-01-25T16:30:00Z',
      lastReply: '2024-01-25T16:30:00Z',
      replies: 2,
      tags: ['withdrawal', 'payment', 'delay'],
      description: 'Yêu cầu rút tiền 5 triệu VNĐ đã được gửi từ 3 ngày trước nhưng vẫn chưa được xử lý. Tôi cần tiền gấp để thanh toán hóa đơn.',
      attachments: []
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
        phone: '0923456789',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Tech Team',
      createdAt: '2024-01-23T14:15:00Z',
      updatedAt: '2024-01-24T10:45:00Z',
      lastReply: '2024-01-24T10:45:00Z',
      replies: 4,
      tags: ['technical', 'image', 'display'],
      description: 'Hình ảnh sản phẩm không hiển thị đúng trên trang chi tiết. Một số hình ảnh bị méo hoặc không load được.',
      attachments: ['bug_report.pdf']
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
        phone: '0934567890',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Security Team',
      createdAt: '2024-01-26T08:30:00Z',
      updatedAt: '2024-01-26T12:15:00Z',
      lastReply: '2024-01-26T12:15:00Z',
      replies: 1,
      tags: ['fraud', 'report', 'urgent'],
      description: 'Tôi phát hiện người bán "TechStore Pro" có hành vi gian lận. Họ bán hàng giả và không giao hàng sau khi nhận tiền.',
      attachments: ['evidence1.jpg', 'evidence2.jpg', 'chat_log.pdf']
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
        phone: '0945678901',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face'
      },
      assignedTo: 'Support Team',
      createdAt: '2024-01-22T16:20:00Z',
      updatedAt: '2024-01-23T11:30:00Z',
      lastReply: '2024-01-23T11:30:00Z',
      replies: 2,
      tags: ['question', 'guide', 'feature'],
      description: 'Tôi muốn biết cách sử dụng tính năng quảng cáo mới. Có thể hướng dẫn chi tiết không?',
      attachments: []
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

  const handleReply = (ticketId: string) => {
    if (replyText.trim()) {
      // Handle reply logic here
      console.log(`Replying to ticket ${ticketId}: ${replyText}`)
      setReplyText('')
    }
  }

  const tabs = [
    { id: 'tickets', label: 'Tickets', icon: MessageSquare },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
    { id: 'faq', label: 'FAQ', icon: FileText }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý các ticket hỗ trợ và khiếu nại từ khách hàng</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách ticket ({filteredTickets.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTicket === ticket.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {getPriorityLabel(ticket.priority)}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {getStatusLabel(ticket.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{ticket.id}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
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
                            {ticket.attachments.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                <span>{ticket.attachments.length} file</span>
                              </div>
                            )}
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
                    {(() => {
                      const ticket = tickets.find(t => t.id === selectedTicket)
                      if (!ticket) return null
                      
                      return (
                        <div className="space-y-6">
                          {/* Customer Info */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <img 
                                src={ticket.customer.avatar} 
                                alt={ticket.customer.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Mail className="h-3 w-3" />
                                  <span>{ticket.customer.email}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Phone className="h-3 w-3" />
                                  <span>{ticket.customer.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ticket Info */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Thông tin ticket</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">ID:</span>
                                <span className="font-medium">{ticket.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Danh mục:</span>
                                <span className="font-medium">{getCategoryLabel(ticket.category)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Ưu tiên:</span>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {getPriorityLabel(ticket.priority)}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {getStatusLabel(ticket.status)}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Phụ trách:</span>
                                <span className="font-medium">{ticket.assignedTo}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Tạo lúc:</span>
                                <span className="font-medium">{formatDate(ticket.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Cập nhật:</span>
                                <span className="font-medium">{formatDate(ticket.updatedAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Attachments */}
                          {ticket.attachments.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">File đính kèm</h4>
                              <div className="space-y-2">
                                {ticket.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{file}</span>
                                    <Button variant="ghost" size="icon" className="ml-auto">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reply Section */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Phản hồi</h4>
                            <div className="space-y-3">
                              <div className="relative">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Nhập phản hồi..."
                                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                  rows={4}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm"
                                  onClick={() => handleReply(ticket.id)}
                                  disabled={!replyText.trim()}
                                >
                                  <Send className="h-4 w-4 mr-1" />
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
                      )
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chọn một ticket để xem chi tiết</p>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Tài khoản</span>
                  </div>
                  <span className="text-lg font-bold">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Sản phẩm</span>
                  </div>
                  <span className="text-lg font-bold">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium">Thanh toán</span>
                  </div>
                  <span className="text-lg font-bold">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Kỹ thuật</span>
                  </div>
                  <span className="text-lg font-bold">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hôm nay</span>
                  <span className="font-medium">5 tickets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tuần này</span>
                  <span className="font-medium">23 tickets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tháng này</span>
                  <span className="font-medium">89 tickets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trung bình/ngày</span>
                  <span className="font-medium">3.2 tickets</span>
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
                <h3 className="font-medium text-gray-900 mb-2">Làm thế nào để đăng ký tài khoản?</h3>
                <p className="text-sm text-gray-600">Bạn có thể đăng ký tài khoản bằng cách nhấn nút "Đăng ký" ở góc trên bên phải và điền đầy đủ thông tin.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Làm sao để đăng sản phẩm?</h3>
                <p className="text-sm text-gray-600">Sau khi đăng nhập, bạn có thể vào "Quản lý sản phẩm" và nhấn "Thêm sản phẩm mới".</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Phí giao dịch là bao nhiêu?</h3>
                <p className="text-sm text-gray-600">Chúng tôi thu phí hoa hồng 5% trên mỗi giao dịch thành công.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
