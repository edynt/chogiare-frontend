import React, { useState } from 'react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
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
  HelpCircle,
  Loader2,
  Eye,
  User,
} from 'lucide-react'
import {
  supportTicketApi,
  type SupportTicket,
  type SupportTicketDetail,
} from '@/domains/user/api/support-tickets'

// Enum mappings matching backend constants
const CATEGORY_MAP: Record<number, string> = {
  0: 'Tài khoản',
  1: 'Sản phẩm',
  2: 'Thanh toán',
  3: 'Kỹ thuật',
  4: 'Báo cáo',
  5: 'Câu hỏi',
  6: 'Khác',
}

const PRIORITY_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'Thấp', color: 'bg-green-100 text-green-800' },
  1: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  2: { label: 'Cao', color: 'bg-red-100 text-red-800' },
  3: { label: 'Khẩn cấp', color: 'bg-red-200 text-red-900' },
}

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'Mở', color: 'bg-red-100 text-red-800' },
  1: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  2: { label: 'Chờ phản hồi', color: 'bg-yellow-100 text-yellow-800' },
  3: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
  4: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-800' },
}

function getTimeAgo(timestamp: string) {
  const ms = Date.now() - Number(timestamp)
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(ms / 3600000)
  const days = Math.floor(ms / 86400000)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

export default function SellerSupportPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: '',
    priority: '1',
    description: '',
  })

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const [replyMessage, setReplyMessage] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-support-tickets'],
    queryFn: () => supportTicketApi.getMyTickets({ pageSize: 50 }),
  })

  const { data: ticketDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['support-ticket-detail', selectedTicketId],
    queryFn: () => supportTicketApi.getById(selectedTicketId!),
    enabled: selectedTicketId !== null,
  })

  const replyMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: number; message: string }) =>
      supportTicketApi.reply(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket-detail', selectedTicketId] })
      queryClient.invalidateQueries({ queryKey: ['my-support-tickets'] })
      setReplyMessage('')
      toast.success('Phản hồi đã được gửi')
    },
    onError: () => {
      toast.error('Gửi phản hồi thất bại')
    },
  })

  const createMutation = useMutation({
    mutationFn: supportTicketApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-support-tickets'] })
      setShowCreateForm(false)
      setNewTicket({ title: '', category: '', priority: '1', description: '' })
      setFormErrors({})
      setIsSubmitting(false)
      toast.success('Ticket đã được gửi thành công!', {
        description: 'Xin lỗi bạn vì sự bất tiện này. Đội ngũ hỗ trợ sẽ phản hồi trong thời gian sớm nhất.',
      })
    },
    onError: () => {
      setIsSubmitting(false)
      toast.error('Gửi ticket thất bại', {
        description: 'Vui lòng thử lại sau.',
      })
    },
  })

  const tickets = data?.items || []

  const filteredTickets = tickets.filter((ticket: SupportTicket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || ticket.status === Number(statusFilter)
    const matchesCategory =
      categoryFilter === 'all' || ticket.category === Number(categoryFilter)
    return matchesSearch && matchesStatus && matchesCategory
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!newTicket.title || newTicket.title.trim().length < 2) {
      errors.title = 'Tiêu đề phải có ít nhất 2 ký tự'
    }
    if (!newTicket.category) {
      errors.category = 'Vui lòng chọn danh mục'
    }
    if (!newTicket.description || newTicket.description.trim().length < 2) {
      errors.description = 'Mô tả phải có ít nhất 2 ký tự'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateTicket = () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    createMutation.mutate({
      title: newTicket.title.trim(),
      description: newTicket.description.trim(),
      category: Number(newTicket.category),
      priority: Number(newTicket.priority),
    })
  }

  const totalTickets = tickets.length
  const openTickets = tickets.filter((t: SupportTicket) => t.status === 0).length
  const inProgressTickets = tickets.filter(
    (t: SupportTicket) => t.status === 1
  ).length
  const resolvedTickets = tickets.filter(
    (t: SupportTicket) => t.status === 3
  ).length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hỗ trợ & Khiếu nại
              </h1>
              <p className="text-gray-600 mt-1">
                Gửi yêu cầu hỗ trợ hoặc khiếu nại đến đội ngũ quản trị
              </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {totalTickets}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {openTickets}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {inProgressTickets}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {resolvedTickets}
                    </p>
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tiêu đề
                  </label>
                  <Input
                    placeholder="Nhập tiêu đề ticket..."
                    value={newTicket.title}
                    onChange={e => {
                      setNewTicket({ ...newTicket, title: e.target.value })
                      if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }))
                    }}
                    className={formErrors.title ? 'border-red-500' : ''}
                  />
                  {formErrors.title && <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Danh mục
                    </label>
                    <Select
                      value={newTicket.category}
                      onValueChange={value =>
                        setNewTicket({ ...newTicket, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Tài khoản</SelectItem>
                        <SelectItem value="1">Sản phẩm</SelectItem>
                        <SelectItem value="2">Thanh toán</SelectItem>
                        <SelectItem value="3">Kỹ thuật</SelectItem>
                        <SelectItem value="5">Câu hỏi</SelectItem>
                        <SelectItem value="6">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Ưu tiên
                    </label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={value =>
                        setNewTicket({ ...newTicket, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Thấp</SelectItem>
                        <SelectItem value="1">Trung bình</SelectItem>
                        <SelectItem value="2">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Mô tả chi tiết
                  </label>
                  <Textarea
                    placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..."
                    value={newTicket.description}
                    onChange={e => {
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                      if (formErrors.description) setFormErrors(prev => ({ ...prev, description: '' }))
                    }}
                    rows={5}
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleCreateTicket}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
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
                      placeholder="Tìm kiếm theo tiêu đề..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
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
                      <SelectItem value="0">Mở</SelectItem>
                      <SelectItem value="1">Đang xử lý</SelectItem>
                      <SelectItem value="3">Đã giải quyết</SelectItem>
                      <SelectItem value="4">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      <SelectItem value="0">Tài khoản</SelectItem>
                      <SelectItem value="1">Sản phẩm</SelectItem>
                      <SelectItem value="2">Thanh toán</SelectItem>
                      <SelectItem value="3">Kỹ thuật</SelectItem>
                      <SelectItem value="5">Câu hỏi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách ticket của tôi ({filteredTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Không tìm thấy ticket nào
                      </p>
                    </div>
                  ) : (
                    filteredTickets.map((ticket: SupportTicket) => (
                      <div
                        key={ticket.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {ticket.title}
                              </h3>
                              <Badge
                                className={
                                  PRIORITY_MAP[ticket.priority]?.color ||
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {PRIORITY_MAP[ticket.priority]?.label ||
                                  'N/A'}
                              </Badge>
                              <Badge
                                className={
                                  STATUS_MAP[ticket.status]?.color ||
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {STATUS_MAP[ticket.status]?.label || 'N/A'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              #{ticket.id}
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
                              <Clock className="h-3 w-3" />
                              <span>{getTimeAgo(ticket.createdAt)}</span>
                            </div>
                            <Badge variant="outline">
                              {CATEGORY_MAP[ticket.category] || 'Khác'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail Dialog */}
        <Dialog open={selectedTicketId !== null} onOpenChange={(open) => { if (!open) setSelectedTicketId(null) }}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết ticket</DialogTitle>
            </DialogHeader>
            {isLoadingDetail ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : ticketDetail ? (
              <div className="space-y-4">
                {/* Ticket info */}
                <div>
                  <h3 className="text-lg font-semibold">{ticketDetail.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={PRIORITY_MAP[ticketDetail.priority]?.color || 'bg-gray-100 text-gray-800'}>
                      {PRIORITY_MAP[ticketDetail.priority]?.label || 'N/A'}
                    </Badge>
                    <Badge className={STATUS_MAP[ticketDetail.status]?.color || 'bg-gray-100 text-gray-800'}>
                      {STATUS_MAP[ticketDetail.status]?.label || 'N/A'}
                    </Badge>
                    <Badge variant="outline">{CATEGORY_MAP[ticketDetail.category] || 'Khác'}</Badge>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticketDetail.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Gửi lúc: {new Date(Number(ticketDetail.createdAt)).toLocaleString('vi-VN')}
                  </p>
                </div>

                {/* Replies */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Phản hồi ({Array.isArray(ticketDetail.replies) ? ticketDetail.replies.length : 0})
                  </h4>
                  {Array.isArray(ticketDetail.replies) && ticketDetail.replies.length > 0 ? (
                    <div className="space-y-3">
                      {ticketDetail.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-lg ${reply.isInternal ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50 border-l-4 border-gray-300'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-500" />
                              <span className="text-sm font-medium">
                                {reply.isInternal ? 'Quản trị viên' : (reply.user?.fullName || reply.user?.email || 'Bạn')}
                              </span>
                              {reply.isInternal && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">Admin</Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(Number(reply.createdAt)).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Chưa có phản hồi nào</p>
                  )}
                </div>

                {/* Reply input */}
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Gửi phản hồi
                  </label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Nhập nội dung phản hồi..."
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        if (!replyMessage.trim() || !selectedTicketId) return
                        replyMutation.mutate({ ticketId: selectedTicketId, message: replyMessage.trim() })
                      }}
                      disabled={replyMutation.isPending || !replyMessage.trim()}
                      size="icon"
                      className="self-end h-10 w-10"
                    >
                      {replyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}
