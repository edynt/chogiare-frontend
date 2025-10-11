import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSellerProducts } from '@/hooks/useProducts'
import { Plus, Package, DollarSign, Users, TrendingUp } from 'lucide-react'

export function SellerDashboardContent() {
  const { data: products, isLoading } = useSellerProducts()

  const stats = [
    { title: 'Tổng sản phẩm', value: '24', icon: Package, change: '+2' },
    { title: 'Doanh thu tháng', value: '12.5M', icon: DollarSign, change: '+15%' },
    { title: 'Đơn hàng', value: '89', icon: Users, change: '+12' },
    { title: 'Tăng trưởng', value: '23%', icon: TrendingUp, change: '+5%' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Badge variant="success" className="text-xs">
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  so với tháng trước
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products?.data.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    <span className="font-medium">{product.price.toLocaleString()}đ</span>
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
