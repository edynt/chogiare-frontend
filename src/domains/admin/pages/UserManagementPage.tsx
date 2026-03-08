import React, { useState, useMemo } from 'react'
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
  UserCheck,
  UserX,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Trash2,
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
  useAdminUsers,
  useApproveUser,
  useSuspendUser,
  useActivateUser,
  useBulkApproveUsers,
  useBulkSuspendUsers,
  useDeleteUser,
} from '@/hooks/useAdmin'
import { useNavigate } from 'react-router-dom'
import { PLACEHOLDER_IMAGE, getApiErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'

export default function UserManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      search: searchQuery || undefined,
      role: 'user',
    }),
    [page, pageSize, searchQuery]
  )

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers(queryParams)
  const approveUserMutation = useApproveUser()
  const suspendUserMutation = useSuspendUser()
  const activateUserMutation = useActivateUser()
  const bulkApproveMutation = useBulkApproveUsers()
  const bulkSuspendMutation = useBulkSuspendUsers()
  const deleteUserMutation = useDeleteUser()

  const users = usersData?.items || []
  console.log('users', users)
  const totalUsers = usersData?.total || 0
  const totalPages = usersData?.totalPages || 0

  // Debug: Log user status distribution
  React.useEffect(() => {
    if (users.length) {
      const statusCounts = users.reduce(
        (acc, u) => {
          acc[u.status] = (acc[u.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    }
  }, [users])

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

  const handleApprove = async (userId: string) => {
    try {
      await approveUserMutation.mutateAsync(userId)
      toast.success('Đã duyệt người dùng thành công')
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể duyệt người dùng'))
    }
  }

  const handleSuspend = async (userId: string) => {
    try {
      await suspendUserMutation.mutateAsync(userId)
      toast.success('Đã tạm khóa người dùng')
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể tạm khóa người dùng'))
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      await activateUserMutation.mutateAsync(userId)
      toast.success('Đã kích hoạt người dùng')
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể kích hoạt người dùng'))
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId)
      toast.success('Đã xóa người dùng thành công')
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể xóa người dùng'))
    }
  }

  const handleViewDetails = (userId: string) => {
    navigate(`/admin/users/${userId}`)
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

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map(user => user.id)
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return

    try {
      if (action === 'activate') {
        await bulkApproveMutation.mutateAsync(selectedUsers)
        toast.success(`Đã kích hoạt ${selectedUsers.length} người dùng`)
        setSelectedUsers([])
      } else if (action === 'deactivate') {
        await bulkSuspendMutation.mutateAsync(selectedUsers)
        toast.success(`Đã vô hiệu hóa ${selectedUsers.length} người dùng`)
        setSelectedUsers([])
      } else if (action === 'email') {
        toast.info('Tính năng gửi email hàng loạt đang được phát triển')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể thực hiện thao tác'))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tài khoản người dùng, duyệt tài khoản mới và phân quyền
          </p>
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
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Đã chọn {selectedUsers.length} người dùng
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Duyệt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('suspend')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Tạm khóa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('email')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Gửi email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({totalUsers})</CardTitle>
        </CardHeader>
        <CardContent>
          {usersError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">
                  Không thể tải danh sách người dùng
                </p>
              </div>
            </div>
          ) : usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có người dùng nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === users.length &&
                            users.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Xác thực</TableHead>
                      <TableHead>Thống kê</TableHead>
                      <TableHead className="w-32">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || PLACEHOLDER_IMAGE}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={e => {
                                e.currentTarget.src = PLACEHOLDER_IMAGE
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                              {user.phone && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {user.phone}
                                  </span>
                                  {user.location && (
                                    <>
                                      <MapPin className="h-3 w-3 text-gray-400 ml-2" />
                                      <span className="text-xs text-gray-500">
                                        {user.location}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {user.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm">
                              {user.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {user.totalOrders} đơn hàng
                            </p>
                            <p className="text-gray-500">
                              {formatCurrency(user.totalRevenue)}
                            </p>
                            {user.rating > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">
                                  {user.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {user.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    title="Vô hiệu hóa"
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Xác nhận vô hiệu hóa người dùng
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn vô hiệu hóa người
                                      dùng "{user.name}"? Người dùng sẽ không
                                      thể đăng nhập cho đến khi được kích hoạt
                                      lại.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleSuspend(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Vô hiệu hóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            {user.status === 'inactive' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600 hover:text-green-700"
                                    title="Kích hoạt"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Xác nhận kích hoạt người dùng
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn kích hoạt lại người
                                      dùng "{user.name}"?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleActivate(user.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Kích hoạt
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xem chi tiết"
                              onClick={() => handleViewDetails(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  title="Xóa người dùng"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xóa người dùng
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa người dùng "
                                    {user.name}"? Hành động này không thể hoàn
                                    tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || usersLoading}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || usersLoading}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
