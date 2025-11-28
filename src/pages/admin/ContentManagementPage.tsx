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
  Edit,
  Trash2,
  Eye,
  FileText,
  Globe,
  Lock,
  User,
  Eye as EyeIcon,
  Edit3,
  Link
} from 'lucide-react'

export default function ContentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingContent, setEditingContent] = useState<string | null>(null)

  // Mock data
  const contentItems = [
    {
      id: '1',
      title: 'Chính sách bảo mật',
      type: 'policy',
      status: 'published',
      author: 'Admin User',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:20:00Z',
      views: 1250,
      slug: 'privacy-policy',
      content: 'Chính sách bảo mật thông tin cá nhân của người dùng...',
      tags: ['privacy', 'policy', 'legal'],
      isPublic: true
    },
    {
      id: '2',
      title: 'Điều khoản sử dụng',
      type: 'policy',
      status: 'published',
      author: 'Admin User',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      views: 890,
      slug: 'terms-of-service',
      content: 'Điều khoản và điều kiện sử dụng dịch vụ...',
      tags: ['terms', 'policy', 'legal'],
      isPublic: true
    },
    {
      id: '3',
      title: 'Hướng dẫn sử dụng cho người bán',
      type: 'guide',
      status: 'published',
      author: 'Support Team',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-22T16:45:00Z',
      views: 2340,
      slug: 'seller-guide',
      content: 'Hướng dẫn chi tiết cách sử dụng nền tảng cho người bán...',
      tags: ['guide', 'seller', 'tutorial'],
      isPublic: true
    },
    {
      id: '4',
      title: 'FAQ - Câu hỏi thường gặp',
      type: 'faq',
      status: 'published',
      author: 'Support Team',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-25T11:30:00Z',
      views: 4560,
      slug: 'faq',
      content: 'Danh sách các câu hỏi thường gặp và câu trả lời...',
      tags: ['faq', 'help', 'support'],
      isPublic: true
    },
    {
      id: '5',
      title: 'Blog: Xu hướng thương mại điện tử 2024',
      type: 'blog',
      status: 'draft',
      author: 'Marketing Team',
      createdAt: '2024-01-20T08:45:00Z',
      updatedAt: '2024-01-26T10:20:00Z',
      views: 0,
      slug: 'ecommerce-trends-2024',
      content: 'Phân tích các xu hướng thương mại điện tử nổi bật trong năm 2024...',
      tags: ['blog', 'trends', 'ecommerce', '2024'],
      isPublic: false
    },
    {
      id: '6',
      title: 'Chính sách hoàn tiền',
      type: 'policy',
      status: 'published',
      author: 'Admin User',
      createdAt: '2024-01-12T11:30:00Z',
      updatedAt: '2024-01-19T15:45:00Z',
      views: 780,
      slug: 'refund-policy',
      content: 'Chính sách hoàn tiền và đổi trả sản phẩm...',
      tags: ['refund', 'policy', 'return'],
      isPublic: true
    },
    {
      id: '7',
      title: 'Hướng dẫn thanh toán',
      type: 'guide',
      status: 'published',
      author: 'Support Team',
      createdAt: '2024-01-08T13:20:00Z',
      updatedAt: '2024-01-23T12:15:00Z',
      views: 1890,
      slug: 'payment-guide',
      content: 'Hướng dẫn các phương thức thanh toán được hỗ trợ...',
      tags: ['payment', 'guide', 'tutorial'],
      isPublic: true
    },
    {
      id: '8',
      title: 'Blog: Cách tối ưu hóa sản phẩm',
      type: 'blog',
      status: 'published',
      author: 'Marketing Team',
      createdAt: '2024-01-18T16:30:00Z',
      updatedAt: '2024-01-24T09:45:00Z',
      views: 1230,
      slug: 'product-optimization',
      content: 'Mẹo và thủ thuật để tối ưu hóa sản phẩm bán hàng...',
      tags: ['blog', 'optimization', 'tips', 'marketing'],
      isPublic: true
    }
  ]

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'policy': return 'bg-red-100 text-red-800'
      case 'guide': return 'bg-blue-100 text-blue-800'
      case 'faq': return 'bg-green-100 text-green-800'
      case 'blog': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'policy': return 'Chính sách'
      case 'guide': return 'Hướng dẫn'
      case 'faq': return 'FAQ'
      case 'blog': return 'Blog'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản'
      case 'draft': return 'Bản nháp'
      case 'archived': return 'Đã lưu trữ'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalContent = contentItems.length
  const publishedContent = contentItems.filter(item => item.status === 'published').length
  const draftContent = contentItems.filter(item => item.status === 'draft').length
  const totalViews = contentItems.reduce((sum, item) => sum + item.views, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nội dung</h1>
          <p className="text-gray-600 mt-1">Quản lý các trang chính sách, hướng dẫn và blog</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Xuất nội dung
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo nội dung mới
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng nội dung</p>
                <p className="text-2xl font-bold text-gray-900">{totalContent}</p>
                <p className="text-xs text-green-600">+3 tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">{publishedContent}</p>
                <p className="text-xs text-gray-500">/{totalContent} nội dung</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bản nháp</p>
                <p className="text-2xl font-bold text-gray-900">{draftContent}</p>
                <p className="text-xs text-gray-500">Chờ xuất bản</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% tháng này</p>
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
                  placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Loại nội dung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="policy">Chính sách</SelectItem>
                  <SelectItem value="guide">Hướng dẫn</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="archived">Đã lưu trữ</SelectItem>
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

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nội dung ({filteredContent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {item.isPublic ? (
                                <Globe className="h-3 w-3 text-green-500" />
                              ) : (
                                <Lock className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500">
                                {item.isPublic ? 'Công khai' : 'Riêng tư'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Link className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">/{item.slug}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeLabel(item.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{item.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{item.views.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(item.updatedAt)}</p>
                        <p className="text-gray-500">Tạo: {formatDate(item.createdAt)}</p>
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
                          <Trash2 className="h-4 w-4" />
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
