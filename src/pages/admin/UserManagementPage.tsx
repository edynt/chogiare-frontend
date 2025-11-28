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
  MoreHorizontal,
  UserCheck,
  UserX,
  Edit,
  Eye,
  Shield,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock data
  const users = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      role: 'seller',
      status: 'active',
      verified: true,
      joinDate: '2024-01-15',
      lastActive: '2024-01-20T10:30:00Z',
      totalOrders: 45,
      totalRevenue: '12.5M VNĐ',
      rating: 4.8,
      location: 'Hà Nội',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      role: 'buyer',
      status: 'active',
      verified: true,
      joinDate: '2024-01-10',
      lastActive: '2024-01-20T14:20:00Z',
      totalOrders: 12,
      totalRevenue: '3.2M VNĐ',
      rating: 4.5,
      location: 'TP.HCM',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0912345678',
      role: 'seller',
      status: 'pending',
      verified: false,
      joinDate: '2024-01-18',
      lastActive: '2024-01-19T09:15:00Z',
      totalOrders: 0,
      totalRevenue: '0 VNĐ',
      rating: 0,
      location: 'Đà Nẵng',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '0923456789',
      role: 'seller',
      status: 'suspended',
      verified: true,
      joinDate: '2023-12-20',
      lastActive: '2024-01-15T16:45:00Z',
      totalOrders: 23,
      totalRevenue: '8.7M VNĐ',
      rating: 3.2,
      location: 'Cần Thơ',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      phone: '0934567890',
      role: 'buyer',
      status: 'active',
      verified: true,
      joinDate: '2024-01-05',
      lastActive: '2024-01-20T11:30:00Z',
      totalOrders: 8,
      totalRevenue: '2.1M VNĐ',
      rating: 4.7,
      location: 'Hải Phòng',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'pending': return 'Chờ duyệt'
      case 'suspended': return 'Tạm khóa'
      case 'inactive': return 'Không hoạt động'
      default: return status
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller': return 'Người bán'
      case 'buyer': return 'Người mua'
      case 'admin': return 'Quản trị viên'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'seller': return 'bg-blue-100 text-blue-800'
      case 'buyer': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers)
    // Implement bulk actions
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng, duyệt tài khoản mới và phân quyền</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Gửi email hàng loạt
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Duyệt tài khoản
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
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="seller">Người bán</SelectItem>
                  <SelectItem value="buyer">Người mua</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
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
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Xác thực</TableHead>
                  <TableHead>Thống kê</TableHead>
                  <TableHead>Hoạt động cuối</TableHead>
                  <TableHead className="w-12">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{user.phone}</span>
                            <MapPin className="h-3 w-3 text-gray-400 ml-2" />
                            <span className="text-xs text-gray-500">{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
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
                        <p className="font-medium">{user.totalOrders} đơn hàng</p>
                        <p className="text-gray-500">{user.totalRevenue}</p>
                        {user.rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{user.rating}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDateTime(user.lastActive)}</p>
                        <p className="text-gray-500">Tham gia: {formatDate(user.joinDate)}</p>
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
                          <MoreHorizontal className="h-4 w-4" />
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người bán</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'seller').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã xác thực</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
