import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')

  const users = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-15',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastActive: '2 giờ trước'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0901234568',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-10',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastActive: '1 ngày trước'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0901234569',
      role: 'buyer',
      status: 'suspended',
      joinDate: '2024-01-05',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastActive: '1 tuần trước'
    }
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>
      case 'seller':
        return <Badge variant="default">Người bán</Badge>
      case 'buyer':
        return <Badge variant="secondary">Người mua</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Hoạt động</Badge>
      case 'suspended':
        return <Badge variant="destructive">Bị khóa</Badge>
      case 'pending':
        return <Badge variant="warning">Chờ duyệt</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-muted-foreground">Quản lý tài khoản người dùng và quyền hạn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Tham gia: {user.joinDate}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      Hoạt động cuối: {user.lastActive}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Quyền hạn
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserX className="h-4 w-4 mr-1" />
                    Khóa
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
