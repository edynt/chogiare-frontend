import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Store,
  Package,
  AlertCircle,
  UserX,
  ShoppingBag,
  TrendingUp,
  Star,
  User,
  Globe,
  Edit,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shared/components/ui/alert-dialog'
import {
  useAdminUser,
  useApproveUser,
  useSuspendUser,
  useActivateUser,
} from '@/hooks/useAdmin'
import { PLACEHOLDER_IMAGE, getApiErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'
import { EditUserDialog } from '@admin/components/user-detail/EditUserDialog'
import { UserDetailSkeleton } from '@admin/components/user-detail/UserDetailSkeleton'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: user, isLoading, error } = useAdminUser(id!)
  const _approveUserMutation = useApproveUser()
  const suspendUserMutation = useSuspendUser()
  const activateUserMutation = useActivateUser()

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+E or Cmd+E to open edit dialog
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && user) {
        e.preventDefault()
        setEditDialogOpen(true)
      }
      // ESC to go back
      if (e.key === 'Escape' && !editDialogOpen) {
        navigate('/admin/users')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, editDialogOpen, user])

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B VNĐ`
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M VNĐ`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K VNĐ`
    }
    return `${amount} VNĐ`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động'
      case 'inactive':
        return 'Không hoạt động'
      default:
        return status
    }
  }

  // Action handlers
  const handleDeactivate = async () => {
    if (!user) return
    try {
      await suspendUserMutation.mutateAsync(user.id)
      toast.success('Đã vô hiệu hóa người dùng')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể vô hiệu hóa người dùng'))
    }
  }

  const handleActivate = async () => {
    if (!user) return
    try {
      await activateUserMutation.mutateAsync(user.id)
      toast.success('Đã kích hoạt người dùng')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể kích hoạt người dùng'))
    }
  }

  // Loading state
  if (isLoading) {
    return <UserDetailSkeleton />
  }

  // Error state
  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            {error
              ? 'Không thể tải thông tin người dùng'
              : 'Người dùng không tồn tại'}
          </p>
          <Button onClick={() => navigate('/admin/users')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  const isSeller = user.role === 'seller'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || PLACEHOLDER_IMAGE}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
              onError={e => {
                e.currentTarget.src = PLACEHOLDER_IMAGE
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
                <Badge
                  className={
                    user.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {user.verified ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã xác thực
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Chưa xác thực
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {user.status === 'active' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Vô hiệu hóa
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Xác nhận vô hiệu hóa người dùng
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn vô hiệu hóa người dùng "{user.name}"?
                    Người dùng sẽ không thể đăng nhập cho đến khi được kích hoạt
                    lại.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivate}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={suspendUserMutation.isPending}
                  >
                    {suspendUserMutation.isPending
                      ? 'Đang xử lý...'
                      : 'Vô hiệu hóa'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {user.status === 'inactive' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Kích hoạt
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Xác nhận kích hoạt người dùng
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn kích hoạt lại người dùng "{user.name}
                    "?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleActivate}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={activateUserMutation.isPending}
                  >
                    {activateUserMutation.isPending
                      ? 'Đang xử lý...'
                      : 'Kích hoạt'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Họ và tên</label>
                <p className="font-medium mt-1">{user.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium mt-1">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Số điện thoại
                  </label>
                  <p className="font-medium mt-1">{user.phone}</p>
                </div>
              )}
              {user.location && (
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Địa chỉ
                  </label>
                  <p className="font-medium mt-1">{user.location}</p>
                </div>
              )}
              {user.userInfo?.gender && (
                <div>
                  <label className="text-sm text-gray-600">Giới tính</label>
                  <p className="font-medium mt-1 capitalize">
                    {user.userInfo.gender}
                  </p>
                </div>
              )}
              {user.userInfo?.dateOfBirth && (
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Ngày sinh
                  </label>
                  <p className="font-medium mt-1">
                    {formatDate(user.userInfo.dateOfBirth)}
                  </p>
                </div>
              )}
              {user.userInfo?.country && (
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Quốc gia
                  </label>
                  <p className="font-medium mt-1">{user.userInfo.country}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Ngày tham gia
                </label>
                <p className="font-medium mt-1">{formatDate(user.joinDate)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Hoạt động lần cuối
                </label>
                <p className="font-medium mt-1">
                  {formatDateTime(user.lastActive)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Thống kê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Tổng đơn hàng</span>
                </div>
                <span className="font-bold text-lg text-blue-600">
                  {user.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Tổng doanh thu</span>
                </div>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(user.totalRevenue)}
                </span>
              </div>
              {user.rating > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600 fill-current" />
                    <span className="text-sm text-gray-600">Đánh giá</span>
                  </div>
                  <span className="font-bold text-lg text-yellow-600">
                    {user.rating.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Vai trò</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seller-specific sections */}
      {isSeller &&
        (user as unknown as Record<string, unknown>).stores &&
        ((user as unknown as Record<string, unknown>).stores as unknown[])
          .length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Thông tin cửa hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(
                  (user as unknown as Record<string, unknown>).stores as Array<{
                    id: string
                    name: string
                    slug: string
                    description?: string
                    status: string
                  }>
                ).map(store => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-lg">{store.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Slug: {store.slug}
                      </p>
                      {store.description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {store.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          store.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {store.status === 'active'
                          ? 'Hoạt động'
                          : 'Không hoạt động'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Xem cửa hàng
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Products Table for Sellers */}
      {isSeller && user.products && user.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sản phẩm ({user.products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnailUrl || PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                            onError={e => {
                              e.currentTarget.src = PLACEHOLDER_IMAGE
                            }}
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(product.price)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {product.status === 'active'
                            ? 'Hoạt động'
                            : product.status === 'pending'
                              ? 'Chờ duyệt'
                              : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state for sellers with no products */}
      {isSeller && (!user.products || user.products.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Người bán chưa có sản phẩm nào</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <EditUserDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
}
