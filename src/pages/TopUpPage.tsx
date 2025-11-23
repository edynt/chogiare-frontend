import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  History,
  DollarSign,
  Plus,
  Info,
  CreditCard
} from 'lucide-react'
import { toast } from 'sonner'

interface Transaction {
  id: string
  type: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  reference: string
  createdAt: string
  completedAt?: string
  fee?: number
  netAmount?: number
  method: string
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

export default function TopUpPage() {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [depositAmount, setDepositAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [depositNote, setDepositNote] = useState('')
  const [depositMethod, setDepositMethod] = useState<string>('bank_transfer')

  // Mock data
  const balance = {
    available: 15750000,
    pending: 2500000,
    total: 18250000,
    frozen: 0,
    currency: 'VND'
  }

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      amount: 2500000,
      status: 'completed',
      description: 'Bán iPhone 14 Pro Max',
      reference: 'ORD-2024-001',
      createdAt: '2024-01-15T14:30:00Z',
      completedAt: '2024-01-15T14:35:00Z',
      fee: 125000,
      netAmount: 2375000,
      method: 'Chuyển khoản'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 5000000,
      status: 'completed',
      description: 'Nạp tiền vào ví',
      reference: 'DEP-2024-001',
      createdAt: '2024-01-14T10:00:00Z',
      completedAt: '2024-01-14T10:05:00Z',
      method: 'Chuyển khoản ngân hàng'
    },
    {
      id: '3',
      type: 'boost',
      amount: -50000,
      status: 'completed',
      description: 'Đẩy bài sản phẩm - Gói 1 ngày',
      reference: 'BOOST-2024-001',
      createdAt: '2024-01-13T09:00:00Z',
      completedAt: '2024-01-13T09:01:00Z',
      method: 'Ví nội bộ'
    },
    {
      id: '4',
      type: 'sale',
      amount: 1800000,
      status: 'pending',
      description: 'Bán AirPods Pro 2nd Gen',
      reference: 'ORD-2024-002',
      createdAt: '2024-01-15T16:45:00Z',
      fee: 90000,
      netAmount: 1710000,
      method: 'Chuyển khoản'
    },
    {
      id: '5',
      type: 'commission',
      amount: -50000,
      status: 'completed',
      description: 'Phí dịch vụ nền tảng',
      reference: 'COM-2024-001',
      createdAt: '2024-01-15T14:35:00Z',
      completedAt: '2024-01-15T14:35:00Z',
      method: 'Tự động'
    },
    {
      id: '6',
      type: 'refund',
      amount: -1200000,
      status: 'completed',
      description: 'Hoàn tiền đơn hàng bị hủy',
      reference: 'REF-2024-001',
      createdAt: '2024-01-13T11:20:00Z',
      completedAt: '2024-01-13T11:25:00Z',
      method: 'Chuyển khoản'
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4" />
      case 'sale': return <TrendingUp className="h-4 w-4" />
      case 'refund': return <TrendingDown className="h-4 w-4" />
      case 'commission': return <DollarSign className="h-4 w-4" />
      case 'bonus': return <Plus className="h-4 w-4" />
      case 'boost': return <TrendingUp className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'text-green-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'processing': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
      case 'cancelled': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Chờ xử lý'
      case 'processing': return 'Đang xử lý'
      case 'failed': return 'Thất bại'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const handlePresetSelect = (amount: number) => {
    setSelectedPreset(amount)
    setDepositAmount(amount.toString())
  }

  const handleTopUp = () => {
    const amount = selectedPreset || parseFloat(depositAmount)
    
    if (!amount || amount < 10000) {
      toast.error('Số tiền tối thiểu là 10,000 VNĐ')
      return
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}`
    
    // Navigate to payment QR screen if bank transfer
    if (depositMethod === 'bank_transfer') {
      navigate(`/payment-qr?amount=${amount}&transactionId=${transactionId}`)
      return
    }

    // For other payment methods, show success message
    toast.success(`Đã tạo yêu cầu nạp tiền ${formatPrice(amount)}. Vui lòng hoàn tất thanh toán.`)
    setDepositAmount('')
    setSelectedPreset(null)
    setDepositNote('')
  }

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">
                {transaction.reference} • {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}>
              {transaction.amount > 0 ? '+' : ''}{formatPrice(transaction.amount)}
            </p>
            <Badge className={`${getStatusColor(transaction.status)} text-white text-xs`}>
              {getStatusLabel(transaction.status)}
            </Badge>
            {transaction.fee && (
              <p className="text-xs text-muted-foreground mt-1">
                Phí: {formatPrice(transaction.fee)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Ví & Nạp tiền</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Quản lý số dư và nạp tiền vào ví để thanh toán các gói đẩy bài
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Số dư tài khoản</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {showBalance ? formatPrice(balance.available) : '••••••••'}
                  </div>
                  <p className="text-sm text-muted-foreground">Có thể sử dụng</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đang chờ:</span>
                    <span className="font-medium">{formatPrice(balance.pending)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tổng cộng:</span>
                    <span className="font-medium">{formatPrice(balance.total)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => document.getElementById('deposit-tab')?.click()}
                  >
                    <ArrowDownLeft className="h-4 w-4 mr-2" />
                    Nạp tiền ngay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Doanh thu tháng</span>
                  </div>
                  <span className="font-medium">{formatPrice(25000000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Đã chi cho đẩy bài</span>
                  </div>
                  <span className="font-medium">{formatPrice(500000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Số dư hiện tại</span>
                  </div>
                  <span className="font-medium text-green-600">{formatPrice(balance.available)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="deposit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit" id="deposit-tab">
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  Nạp tiền
                </TabsTrigger>
                <TabsTrigger value="transactions" id="transactions-tab">
                  <History className="h-4 w-4 mr-2" />
                  Lịch sử giao dịch
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nạp tiền vào ví</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Balance Display */}
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2">Số dư hiện tại</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(balance.available)}
                      </p>
                    </div>

                    {/* Preset Amounts */}
                    <div>
                      <Label className="mb-3 block">Chọn số tiền nạp nhanh</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {PRESET_AMOUNTS.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedPreset === amount ? 'default' : 'outline'}
                            onClick={() => handlePresetSelect(amount)}
                            className="h-16"
                          >
                            {formatPrice(amount)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Label htmlFor="deposit-amount">Hoặc nhập số tiền tùy chọn (VND)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => {
                          setDepositAmount(e.target.value)
                          setSelectedPreset(null)
                        }}
                        placeholder="Nhập số tiền muốn nạp"
                        className="text-lg"
                        min="10000"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Số tiền tối thiểu: 10,000 VNĐ
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label htmlFor="deposit-method">Phương thức thanh toán</Label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        <Button
                          variant={depositMethod === 'bank_transfer' ? 'default' : 'outline'}
                          onClick={() => setDepositMethod('bank_transfer')}
                          className="justify-start h-auto p-4"
                        >
                          <CreditCard className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Chuyển khoản ngân hàng</div>
                            <div className="text-sm text-muted-foreground">Thẻ ATM, Internet Banking</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Transaction Summary */}
                    {(selectedPreset || parseFloat(depositAmount) >= 10000) && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3">Thông tin giao dịch</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Số tiền nạp:</span>
                              <span className="font-medium">
                                {formatPrice(selectedPreset || parseFloat(depositAmount) || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phương thức:</span>
                              <span className="font-medium">Chuyển khoản ngân hàng</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                              <span>Số tiền sẽ nạp:</span>
                              <span className="text-primary">
                                {formatPrice(selectedPreset || parseFloat(depositAmount) || 0)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Button 
                      onClick={handleTopUp}
                      disabled={!selectedPreset && (!depositAmount || parseFloat(depositAmount) < 10000)}
                      className="w-full"
                      size="lg"
                    >
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Nạp tiền
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Thời gian xử lý: 5-10 phút sau khi chuyển khoản thành công</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm giao dịch..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Filter className="h-4 w-4 mt-2.5" />
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Xuất
                    </Button>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

