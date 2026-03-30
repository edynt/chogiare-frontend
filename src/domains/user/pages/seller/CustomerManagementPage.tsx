import React, { useState, useMemo } from 'react'
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
  Mail,
  Phone,
  MessageCircle,
  ShoppingCart,
  DollarSign,
  ArrowLeft,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  useSellerCustomers,
  useSellerCustomerStats,
} from '@/hooks/useSellerCustomers'
import { useDebounce } from '@/hooks/useDebounce'

export default function CustomerManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const debouncedSearch = useDebounce(searchQuery, 300)

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useSellerCustomers({
    page,
    pageSize,
    search: debouncedSearch || undefined,
  })

  const { data: statsData, isLoading: isLoadingStats } =
    useSellerCustomerStats()

  const customers = customersData?.items || []
  const totalPages = customersData?.totalPages || 1
  const total = customersData?.total || 0

  // Calculate local stats from customers data
  const stats = useMemo(() => {
    if (statsData) {
      return {
        total: statsData.totalCustomers,
        active: statsData.activeCustomers,
        totalSpent: statsData.topCustomers.reduce(
          (sum, c) => sum + c.totalSpent,
          0
        ),
        totalOrders: statsData.topCustomers.reduce(
          (sum, c) => sum + c.totalOrders,
          0
        ),
      }
    }

    const localCustomers = customersData?.items || []
    return {
      total: localCustomers.length,
      active: localCustomers.filter(c => c.status === 'active').length,
      totalSpent: localCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      totalOrders: localCustomers.reduce((sum, c) => sum + c.totalOrders, 0),
    }
  }, [customersData, statsData])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1) // Reset to first page on search
  }

  if (customersError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">
              Đã xảy ra lỗi khi tải danh sách khách hàng.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                  <p className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats.total
                    )}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats.active
                    )}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats.totalOrders
                    )}
                  </p>
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
                    {isLoadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      formatPrice(stats.totalSpent)
                    )}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách khách hàng</span>
              {!isLoadingCustomers && (
                <span className="text-sm font-normal text-muted-foreground">
                  {total} khách hàng
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCustomers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Thông tin liên hệ</TableHead>
                        <TableHead>Số đơn hàng</TableHead>
                        <TableHead>Tổng chi tiêu</TableHead>
                        <TableHead>Đơn hàng gần nhất</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">
                              {searchQuery
                                ? 'Không tìm thấy khách hàng nào'
                                : 'Chưa có khách hàng nào đặt hàng'}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        customers.map(customer => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={customer.avatar} />
                                  <AvatarFallback>
                                    {customer.name.charAt(0).toUpperCase()}
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
                              {customer.lastOrderDate ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>
                                    {formatDate(customer.lastOrderDate)}
                                  </span>
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
                                    navigate(
                                      `/seller/customers/${customer.id}/orders`
                                    )
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Trang {page} / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage(p => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
