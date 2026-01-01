import React, { useState } from 'react'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
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
  Plus,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  FileText,
  HelpCircle
} from 'lucide-react'

export default function SellerSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: ''
  })

  // Mock data - tickets của seller
  const tickets = [
    {
      id: 'TICKET-001',
      title: 'Sản phẩm bị từ chối không rõ lý do',
      category: 'product',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-26T10:30:00Z',
      updatedAt: '2024-01-26T14:20:00Z',
      lastReply: '2024-01-26T14:20:00Z',
      replies: 2,
      description: 'Sản phẩm iPhone 14 Pro Max của tôi bị từ chối nhưng không có lý do cụ thể. Tôi đã tuân thủ đầy đủ các quy định về hình ảnh và mô tả sản phẩm.',
    },
    {
      id: 'TICKET-002',
      title: 'Yêu cầu rút tiền bị chậm',
      category: 'payment',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2024-01-24T11:20:00Z',
      updatedAt: '2024-01-25T16:30:00Z',
      lastReply: '2024-01-25T16:30:00Z',
      replies: 3,
      description: 'Yêu cầu rút tiền 5 triệu VNĐ đã được gửi từ 3 ngày trước nhưng vẫn chưa được xử lý.',
    },
    {
      id: 'TICKET-003',
      title: 'Hướng dẫn sử dụng tính năng quảng cáo',
      category: 'question',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-22T16:20:00Z',
      updatedAt: '2024-01-23T11:30:00Z',
      lastReply: '2024-01-23T11:30:00Z',
      replies: 2,
      description: 'Tôi muốn biết cách sử dụng tính năng quảng cáo mới. Có thể hướng dẫn chi tiết không?',
    },
    {
      id: 'TICKET-004',
      title: 'Lỗi hiển thị hình ảnh sản phẩm',
      category: 'technical',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-01-23T14:15:00Z',
      updatedAt: '2024-01-24T10:45:00Z',
      lastReply: '2024-01-24T10:45:00Z',
      replies: 4,
      description: 'Hình ảnh sản phẩm không hiển thị đúng trên trang chi tiết. Một số hình ảnh bị méo hoặc không load được.',
    }
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
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
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Mở'
      case 'in_progress': return 'Đang xử lý'
      case 'resolved': return 'Đã giải quyết'
      case 'closed': return 'Đã đóng'
      default: return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'product': return 'Sản phẩm'
      case 'payment': return 'Thanh toán'
      case 'technical': return 'Kỹ thuật'
      case 'question': return 'Câu hỏi'
      case 'account': return 'Tài khoản'
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

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.category && newTicket.description) {
      // Handle create ticket logic here
      console.log('Creating ticket:', newTicket)
      setShowCreateForm(false)
      setNewTicket({ title: '', category: '', priority: 'medium', description: '' })
    }
  }

  const totalTickets = tickets.length
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ & Khiếu nại</h1>
              <p className="text-gray-600 mt-1">Gửi yêu cầu hỗ trợ hoặc khiếu nại đến đội ngũ quản trị</p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo ticket mới
            </Button>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Ticket Form */}
          {showCreateForm && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Tạo ticket mới</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tiêu đề</label>
                  <Input
                    placeholder="Nhập tiêu đề ticket..."
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Danh mục</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Sản phẩm</SelectItem>
                        <SelectItem value="payment">Thanh toán</SelectItem>
                        <SelectItem value="technical">Kỹ thuật</SelectItem>
                        <SelectItem value="question">Câu hỏi</SelectItem>
                        <SelectItem value="account">Tài khoản</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Ưu tiên</label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mô tả chi tiết</label>
                  <Textarea
                    placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    rows={5}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateTicket}>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo ID, tiêu đề..."
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
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      <SelectItem value="product">Sản phẩm</SelectItem>
                      <SelectItem value="payment">Thanh toán</SelectItem>
                      <SelectItem value="technical">Kỹ thuật</SelectItem>
                      <SelectItem value="question">Câu hỏi</SelectItem>
                      <SelectItem value="account">Tài khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách ticket của tôi ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy ticket nào</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
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
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(ticket.createdAt)}</span>
                          </div>
                          <Badge variant="outline">
                            {getCategoryLabel(ticket.category)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

