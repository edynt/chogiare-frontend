import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { BOOST_PACKAGES, type BoostPackage } from '@/lib/boostPackages'

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

// Mock product data - in production, fetch from API
const MOCK_PRODUCT = {
  id: '1',
  name: 'iPhone 14 Pro Max 256GB',
  price: 25000000,
  imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=400&h=400&fit=crop'
}

export default function BoostPostPage() {
  const navigate = useNavigate()
  
  const [selectedType, setSelectedType] = useState<keyof typeof BOOST_PACKAGES>('payPerDay')
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(null)
  
  // Mock balance
  const balance = 15750000
  const product = MOCK_PRODUCT // In production, fetch by productId from searchParams

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

          {/* Product Preview */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn loại đẩy bài</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(TYPE_INFO).map(([type, info]) => {
                  const Icon = info.icon
                  const isSelected = selectedType === type
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type as keyof typeof BOOST_PACKAGES)
                        setSelectedPackage(null)
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Icon className={`h-6 w-6 mb-2 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className={`font-medium text-sm ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {info.label}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {info.description}
                        </span>
                      </div>
                    </button>
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
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${
                              isSelected ? 'text-primary' : 'text-foreground'
                            }`}>
                              {pkg.name}
                            </h3>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pkg.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className={`text-xl font-bold ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}>
                            {formatPrice(pkg.price)}
                          </p>
                        </div>
                      </div>
                    </button>
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

          {/* Summary and Action - Fixed Bottom */}
          {selectedPackage && (
            <div className="sticky bottom-0 bg-background border-t pt-4 pb-4 mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(selectedPackage.price)}
                    </span>
                  </div>
                  {hasEnoughBalance ? (
                    <Button
                      onClick={handleBoost}
                      className="w-full"
                      size="lg"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Xác nhận đẩy bài
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate(`/top-up?amount=${shortage}`)}
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Nạp tiền để tiếp tục
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        Còn thiếu {formatPrice(shortage)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

