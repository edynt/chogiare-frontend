import React, { useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Flag,
  Loader2,
} from 'lucide-react'
import { PLACEHOLDER_IMAGE } from '@/lib/utils'
import { toast } from 'sonner'
import {
  useModerationProducts,
  useApproveProduct,
  useRejectProduct,
  useBulkApproveProducts,
  useBulkRejectProducts,
} from '@/hooks/useAdmin'

export default function ProductModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Only fetch pending products for moderation page
  const { data: productsData, isLoading } = useModerationProducts({
    page,
    pageSize,
    search: searchQuery || undefined,
    status: 'pending', // Always filter by pending status
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  })

  const approveProductMutation = useApproveProduct()
  const rejectProductMutation = useRejectProduct()
  const bulkApproveMutation = useBulkApproveProducts()
  const bulkRejectMutation = useBulkRejectProducts()

  const products = productsData?.items || []
  const total = productsData?.total || 0
  const totalPages = productsData?.totalPages || 1

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
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

  const getViolationColor = (violation: string) => {
    switch (violation) {
      case 'potential_fake':
        return 'bg-red-100 text-red-800'
      case 'price_manipulation':
        return 'bg-orange-100 text-orange-800'
      case 'copyright_violation':
        return 'bg-purple-100 text-purple-800'
      case 'misleading_title':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getViolationLabel = (violation: string) => {
    switch (violation) {
      case 'potential_fake':
        return 'Có thể là hàng giả'
      case 'price_manipulation':
        return 'Thao túng giá'
      case 'copyright_violation':
        return 'Vi phạm bản quyền'
      case 'misleading_title':
        return 'Tiêu đề gây hiểu lầm'
      default:
        return violation
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
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

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map(product => product.id)
    )
  }

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return

    if (action === 'approve') {
      bulkApproveMutation.mutate(selectedProducts, {
        onSuccess: data => {
          toast.success(`Đã duyệt ${data.count} sản phẩm`)
          setSelectedProducts([])
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi duyệt sản phẩm')
        },
      })
    } else if (action === 'reject') {
      bulkRejectMutation.mutate(
        { productIds: selectedProducts },
        {
          onSuccess: data => {
            toast.success(`Đã từ chối ${data.count} sản phẩm`)
            setSelectedProducts([])
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi từ chối sản phẩm')
          },
        }
      )
    }
  }

  const handleApprove = (productId: string) => {
    approveProductMutation.mutate(productId, {
      onSuccess: () => {
        toast.success('Đã duyệt sản phẩm')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi duyệt sản phẩm')
      },
    })
  }

  const handleReject = (productId: string) => {
    rejectProductMutation.mutate(
      { id: productId },
      {
        onSuccess: () => {
          toast.success('Đã từ chối sản phẩm')
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi từ chối sản phẩm')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kiểm duyệt sản phẩm
          </h1>
          <p className="text-gray-600 mt-1">
            Duyệt các sản phẩm chờ kiểm duyệt trên nền tảng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            disabled={
              selectedProducts.length === 0 || bulkApproveMutation.isPending
            }
            onClick={() => handleBulkAction('approve')}
          >
            {bulkApproveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Duyệt hàng loạt
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, người bán hoặc danh mục..."
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
                  <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                  <SelectItem value="Thời trang">Thời trang</SelectItem>
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
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
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

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  disabled={bulkApproveMutation.isPending}
                >
                  {bulkApproveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  )}
                  Duyệt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                  disabled={bulkRejectMutation.isPending}
                >
                  {bulkRejectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  Từ chối
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Bỏ chọn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có sản phẩm nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === products.length &&
                          products.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Người bán</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Vi phạm</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="w-12">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : PLACEHOLDER_IMAGE
                            }
                            alt={product.title}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={e => {
                              e.currentTarget.src = PLACEHOLDER_IMAGE
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-2">
                              {product.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {product.stock} sản phẩm
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {product.seller}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(product.priority)}>
                          {getPriorityLabel(product.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.violations.length > 0 ? (
                            product.violations.map((violation, index) => (
                              <Badge
                                key={index}
                                className={`text-xs ${getViolationColor(violation)}`}
                              >
                                {getViolationLabel(violation)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              Không có
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-12 h-2 rounded-full ${
                              product.aiScore >= 80
                                ? 'bg-green-200'
                                : product.aiScore >= 60
                                  ? 'bg-yellow-200'
                                  : 'bg-red-200'
                            }`}
                          >
                            <div
                              className={`h-2 rounded-full ${
                                product.aiScore >= 80
                                  ? 'bg-green-500'
                                  : product.aiScore >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${product.aiScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {product.aiScore}%
                          </span>
                          {product.manualReview && (
                            <Shield className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {formatDate(product.submittedAt)}
                          </p>
                          {product.reviewedAt && (
                            <p className="text-gray-500">
                              Duyệt: {formatDate(product.reviewedAt)}
                            </p>
                          )}
                          {product.reviewer && (
                            <p className="text-xs text-gray-500">
                              Bởi: {product.reviewer}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(product.id)}
                            disabled={
                              approveProductMutation.isPending ||
                              product.status === 'approved'
                            }
                            className="text-green-600 hover:text-green-700"
                          >
                            {approveProductMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(product.id)}
                            disabled={
                              rejectProductMutation.isPending ||
                              product.status === 'rejected'
                            }
                            className="text-red-600"
                          >
                            {rejectProductMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
    </div>
  )
}
