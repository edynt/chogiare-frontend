import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
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
  Calendar,
  Loader2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useSellerCustomerOrders } from '@/hooks/useSellerCustomers'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  ready: 'Sẵn sàng lấy',
  ready_for_pickup: 'Sẵn sàng lấy', // Alias for backward compatibility
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
}

const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  confirmed: 'default',
  ready: 'default',
  ready_for_pickup: 'default', // Alias for backward compatibility
  completed: 'default',
  cancelled: 'destructive',
  refunded: 'outline',
}

export default function SellerCustomerOrdersPage() {
  const navigate = useNavigate()
  const { customerId } = useParams<{ customerId: string }>()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: ordersData,
    isLoading,
    error,
  } = useSellerCustomerOrders(customerId || '', { page, pageSize })

  const orders = ordersData?.items || []
  const totalPages = ordersData?.totalPages || 1
  const total = ordersData?.total || 0

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">
              Đã xảy ra lỗi khi tải đơn hàng của khách hàng.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/seller/customers')}
            >
              Quay lại danh sách khách hàng
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
            onClick={() => navigate('/seller/customers')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách khách hàng
          </Button>
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của khách hàng</h1>
          <p className="text-muted-foreground">
            Xem lịch sử đơn hàng của khách hàng #{customerId}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lịch sử đơn hàng</span>
              {!isLoading && (
                <span className="text-sm font-normal text-muted-foreground">
                  {total} đơn hàng
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Số sản phẩm</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thanh toán</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Package className="h-12 w-12 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                Khách hàng chưa có đơn hàng nào
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <span className="font-medium">#{order.orderNo || order.id}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                <span>{order.itemCount}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-green-600">
                                {formatPrice(order.total)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  STATUS_VARIANTS[order.status] || 'secondary'
                                }
                              >
                                {STATUS_LABELS[order.status] || order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.paymentStatus === 'completed'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {order.paymentStatus === 'completed'
                                  ? 'Đã thanh toán'
                                  : order.paymentStatus === 'pending'
                                    ? 'Chờ thanh toán'
                                    : order.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
