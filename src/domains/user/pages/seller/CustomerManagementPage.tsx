import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@shared/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MessageCircle,
  ShoppingCart,
  DollarSign,
  Star,
  ArrowLeft,
  Calendar,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  rating: number
  status: 'active' | 'inactive'
}

export default function CustomerManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - Replace with actual API call
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      totalOrders: 15,
      totalSpent: 12500000,
      lastOrderDate: '2024-01-15T10:30:00Z',
      rating: 4.5,
      status: 'active',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      totalOrders: 8,
      totalSpent: 8500000,
      lastOrderDate: '2024-01-14T14:20:00Z',
      rating: 5.0,
      status: 'active',
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      totalOrders: 3,
      totalSpent: 3200000,
      lastOrderDate: '2024-01-10T09:15:00Z',
      rating: 4.0,
      status: 'inactive',
    },
  ]

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  )

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold mb-2">Quản lý khách hàng</h1>
          <p className="text-muted-foreground">
            Xem và quản lý thông tin khách hàng của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng khách hàng
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Khách hàng hoạt động
                  </p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng doanh thu
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPrice(stats.totalSpent)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Thông tin liên hệ</TableHead>
                    <TableHead>Số đơn hàng</TableHead>
                    <TableHead>Tổng chi tiêu</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Đơn hàng gần nhất</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          Không tìm thấy khách hàng nào
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback>
                                {customer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {customer.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {customer.totalOrders}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {formatPrice(customer.totalSpent)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {customer.rating.toFixed(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.lastOrderDate ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(customer.lastOrderDate)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Chưa có
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              customer.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {customer.status === 'active'
                              ? 'Hoạt động'
                              : 'Không hoạt động'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/chat?userId=${customer.id}`)
                              }
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/orders?customerId=${customer.id}`)
                              }
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
