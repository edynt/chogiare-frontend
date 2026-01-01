import React, { useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@shared/components/ui/dialog'
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
  Link,
  Loader2,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useContents,
  useContentStats,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
  usePublishContent,
} from '@/hooks/useAdmin'
import type { ContentItem, CreateContentData } from '@admin/api/admin'

export default function ContentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [formData, setFormData] = useState<CreateContentData>({
    title: '',
    type: 'policy',
    status: 'draft',
    content: '',
    slug: '',
    tags: [],
    isPublic: false,
  })
  const [tagsText, setTagsText] = useState('')

  const { data: contentsData, isLoading } = useContents({
    page,
    pageSize,
    search: searchQuery || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const { data: stats } = useContentStats()
  const createContentMutation = useCreateContent()
  const updateContentMutation = useUpdateContent()
  const deleteContentMutation = useDeleteContent()
  const publishContentMutation = usePublishContent()

  const contentItems = contentsData?.items || []
  const total = contentsData?.total || 0
  const totalPages = contentsData?.totalPages || 1

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

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      type: 'policy',
      status: 'draft',
      content: '',
      slug: '',
      tags: [],
      isPublic: false,
    })
    setTagsText('')
    setIsCreateDialogOpen(true)
  }

  const handleOpenEdit = (item: ContentItem) => {
    setEditingContent(item)
    setFormData({
      title: item.title,
      type: item.type,
      status: item.status,
      content: item.content,
      slug: item.slug,
      tags: item.tags,
      isPublic: item.isPublic,
    })
    setTagsText(item.tags.join(', '))
    setIsEditDialogOpen(true)
  }

  const handleCreate = () => {
    const tags = tagsText.split(',').map(t => t.trim()).filter(t => t)

    createContentMutation.mutate(
      { ...formData, tags },
      {
        onSuccess: () => {
          toast.success('Đã tạo nội dung mới')
          setIsCreateDialogOpen(false)
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo nội dung')
        },
      }
    )
  }

  const handleUpdate = () => {
    if (!editingContent) return

    const tags = tagsText.split(',').map(t => t.trim()).filter(t => t)

    updateContentMutation.mutate(
      { id: editingContent.id, data: { ...formData, tags } },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật nội dung')
          setIsEditDialogOpen(false)
          setEditingContent(null)
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi cập nhật nội dung')
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nội dung này?')) return

    deleteContentMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Đã xóa nội dung')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa nội dung')
      },
    })
  }

  const handlePublish = (id: string) => {
    publishContentMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Đã xuất bản nội dung')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xuất bản nội dung')
      },
    })
  }

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
          <Button onClick={handleOpenCreate}>
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
                <p className="text-2xl font-bold text-gray-900">{stats?.total ?? 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats?.published ?? 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats?.draft ?? 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{(stats?.totalViews ?? 0).toLocaleString()}</p>
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setPage(1) }}>
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
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}>
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
          <CardTitle>Danh sách nội dung ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có nội dung nào
            </div>
          ) : (
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
                  {contentItems.map((item) => (
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {item.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePublish(item.id)}
                              disabled={publishContentMutation.isPending}
                              className="text-green-600"
                            >
                              {publishContentMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteContentMutation.isPending}
                            className="text-red-600"
                          >
                            {deleteContentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo nội dung mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Loại nội dung</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'policy' | 'guide' | 'faq' | 'blog') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy">Chính sách</SelectItem>
                    <SelectItem value="guide">Hướng dẫn</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'published' | 'draft' | 'archived') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="vd: privacy-policy"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nội dung</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung..."
                rows={8}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (phân cách bằng dấu phẩy)</label>
              <Input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="vd: policy, legal, terms"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">Công khai</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={createContentMutation.isPending}>
              {createContentMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Tạo nội dung
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Loại nội dung</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'policy' | 'guide' | 'faq' | 'blog') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy">Chính sách</SelectItem>
                    <SelectItem value="guide">Hướng dẫn</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'published' | 'draft' | 'archived') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nội dung</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (phân cách bằng dấu phẩy)</label>
              <Input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublicEdit"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isPublicEdit" className="text-sm font-medium">Công khai</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={updateContentMutation.isPending}>
              {updateContentMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
