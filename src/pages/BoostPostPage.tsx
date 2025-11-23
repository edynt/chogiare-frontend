import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

interface BoostPackage {
  id: string
  name: string
  type: 'payPerView' | 'payPerDay' | 'featuredSlot' | 'boostToCategory'
  price: number
  description: string
  config?: {
    views?: number
    days?: number
    showInBanner?: boolean
    showInTopList?: boolean
  }
}

const BOOST_PACKAGES: Record<string, BoostPackage[]> = {
  payPerView: [
    {
      id: 'ppv_1k',
      name: '1,000 lượt xem',
      type: 'payPerView',
      price: 50000,
      description: 'Trả phí theo số lượt xem thực tế',
      config: { views: 1000, pricePer1000Views: 50000 }
    },
    {
      id: 'ppv_5k',
      name: '5,000 lượt xem',
      type: 'payPerView',
      price: 200000,
      description: 'Trả phí theo số lượt xem thực tế',
      config: { views: 5000, pricePer1000Views: 40000 }
    }
  ],
  payPerDay: [
    {
      id: 'ppd_1',
      name: '1 ngày',
      type: 'payPerDay',
      price: 50000,
      description: 'Đẩy bài trong 1 ngày',
      config: { days: 1 }
    },
    {
      id: 'ppd_3',
      name: '3 ngày',
      type: 'payPerDay',
      price: 120000,
      description: 'Đẩy bài trong 3 ngày',
      config: { days: 3 }
    },
    {
      id: 'ppd_7',
      name: '7 ngày',
      type: 'payPerDay',
      price: 250000,
      description: 'Đẩy bài trong 7 ngày',
      config: { days: 7 }
    }
  ],
  featuredSlot: [
    {
      id: 'featured_1',
      name: 'Vị trí nổi bật - 1 ngày',
      type: 'featuredSlot',
      price: 100000,
      description: 'Hiển thị ở banner và top danh sách',
      config: { days: 1, showInBanner: true, showInTopList: true }
    },
    {
      id: 'featured_7',
      name: 'Vị trí nổi bật - 7 ngày',
      type: 'featuredSlot',
      price: 600000,
      description: 'Hiển thị ở banner và top danh sách',
      config: { days: 7, showInBanner: true, showInTopList: true }
    }
  ],
  boostToCategory: [
    {
      id: 'category_3',
      name: 'Đẩy lên danh mục - 3 ngày',
      type: 'boostToCategory',
      price: 80000,
      description: 'Đẩy sản phẩm lên đầu danh mục',
      config: { days: 3 }
    },
    {
      id: 'category_7',
      name: 'Đẩy lên danh mục - 7 ngày',
      type: 'boostToCategory',
      price: 180000,
      description: 'Đẩy sản phẩm lên đầu danh mục',
      config: { days: 7 }
    }
  ]
}

const TYPE_INFO = {
  payPerView: {
    label: 'Trả theo lượt xem',
    description: 'Trả phí theo số lượt xem thực tế (mỗi 1000 view)',
    icon: Eye
  },
  payPerDay: {
    label: 'Trả theo ngày',
    description: 'Đẩy bài trong N ngày với giá cố định',
    icon: Calendar
  },
  featuredSlot: {
    label: 'Vị trí nổi bật',
    description: 'Hiển thị ở banner và top danh sách',
    icon: Star
  },
  boostToCategory: {
    label: 'Đẩy lên danh mục',
    description: 'Đẩy sản phẩm lên đầu danh mục',
    icon: TrendingUp
  }
}

export default function BoostPostPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId') || ''
  
  const [selectedType, setSelectedType] = useState<keyof typeof BOOST_PACKAGES>('payPerDay')
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(null)
  
  // Mock balance
  const balance = 15750000

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const packages = BOOST_PACKAGES[selectedType] || []
  const hasEnoughBalance = selectedPackage ? balance >= selectedPackage.price : false
  const shortage = selectedPackage ? selectedPackage.price - balance : 0

  const handleBoost = () => {
    if (!selectedPackage) {
      toast.error('Vui lòng chọn gói đẩy bài')
      return
    }

    if (!hasEnoughBalance) {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền.')
      navigate(`/top-up?amount=${shortage}`)
      return
    }

    // Process boost
    toast.success(`Đã đẩy bài thành công với gói ${selectedPackage.name}`)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Đẩy bài sản phẩm</h1>
            <p className="text-muted-foreground">
              Chọn gói đẩy bài phù hợp để tăng lượt xem và bán hàng
            </p>
          </div>

          {/* Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn loại đẩy bài</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(TYPE_INFO).map(([type, info]) => {
                  const Icon = info.icon
                  const isSelected = selectedType === type
                  return (
                    <Button
                      key={type}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedType(type as keyof typeof BOOST_PACKAGES)
                        setSelectedPackage(null)
                      }}
                      className="h-auto p-4 flex flex-col items-start"
                    >
                      <Icon className="h-5 w-5 mb-2" />
                      <span className="font-medium">{info.label}</span>
                      <span className="text-xs text-muted-foreground mt-1 text-left">
                        {info.description}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Package Options */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn gói</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id
                  return (
                    <Card
                      key={pkg.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'border-primary border-2 bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{pkg.name}</h3>
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              {formatPrice(pkg.price)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card className={hasEnoughBalance ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {hasEnoughBalance ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Số dư ví</span>
                    <span className={`text-lg font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatPrice(balance)}
                    </span>
                  </div>
                  {selectedPackage && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Chi phí</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(selectedPackage.price)}
                        </span>
                      </div>
                      {!hasEnoughBalance && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-600">Còn thiếu</span>
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(shortage)}
                            </span>
                          </div>
                          <Button
                            className="w-full mt-3"
                            onClick={() => navigate(`/top-up?amount=${shortage}`)}
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Nạp tiền ngay
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary and Action */}
          {selectedPackage && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(selectedPackage.price)}
                  </span>
                </div>
                <Button
                  onClick={handleBoost}
                  disabled={!hasEnoughBalance}
                  className="w-full"
                  size="lg"
                >
                  {hasEnoughBalance ? (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Xác nhận đẩy bài
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Nạp tiền để tiếp tục
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

