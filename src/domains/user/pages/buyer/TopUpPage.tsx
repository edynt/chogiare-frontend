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
import { Label } from '@shared/components/ui/label'
import { Badge } from '@shared/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components/ui/tabs'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  History,
  DollarSign,
  Plus,
  Info,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useWalletBalance,
  useTransactions,
  useDeposit,
  useDepositPackages,
} from '@/hooks/useWallet'
import type { Transaction } from '@user/api/wallet'

export default function TopUpPage() {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [depositAmount, setDepositAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [depositMethod, setDepositMethod] = useState<string>('bank_transfer')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance()
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions({
      page: 1,
      pageSize: 50,
    })
  const { data: depositPackages, isLoading: packagesLoading } =
    useDepositPackages()
  const depositMutation = useDeposit()

  const balance = balanceData
    ? {
        available: balanceData.balance,
        pending: 0,
        total: balanceData.balance,
        frozen: 0,
        currency: balanceData.currency || 'VND',
      }
    : {
        available: 0,
        pending: 0,
        total: 0,
        frozen: 0,
        currency: 'VND',
      }

  const transactions: Transaction[] = transactionsData?.items || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    // Backend returns BigInt timestamps as strings (e.g. "1707900000000")
    const timestamp = Number(dateString)
    const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4" />
      case 'sale':
        return <TrendingUp className="h-4 w-4" />
      case 'refund':
        return <TrendingDown className="h-4 w-4" />
      case 'commission':
        return <DollarSign className="h-4 w-4" />
      case 'bonus':
        return <Plus className="h-4 w-4" />
      case 'boost':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'text-green-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'processing':
        return 'bg-blue-500'
      case 'failed':
        return 'bg-red-500'
      case 'cancelled':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'pending':
        return 'Chờ xử lý'
      case 'processing':
        return 'Đang xử lý'
      case 'failed':
        return 'Thất bại'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const handlePresetSelect = (amount: number) => {
    setSelectedPreset(amount)
    setDepositAmount(amount.toString())
  }

  const handleTopUp = async () => {
    const amount = selectedPreset || parseFloat(depositAmount)

    if (!amount || amount < 2000) {
      toast.error('Số tiền tối thiểu là 2,000 VNĐ')
      return
    }

    try {
      const result = await depositMutation.mutateAsync({
        amount,
        paymentMethod: depositMethod,
        description: `Nạp tiền vào ví - ${formatPrice(amount)}`,
      })

      if (depositMethod === 'bank_transfer') {
        const depositData = result.data.data
        navigate(
          `/payment-qr?amount=${amount}&transactionId=${depositData.transaction.id}`,
          { state: { sepay: depositData.sepay } }
        )
        return
      }

      toast.success(
        `Đã tạo yêu cầu nạp tiền ${formatPrice(amount)}. Vui lòng hoàn tất thanh toán.`
      )
      setDepositAmount('')
      setSelectedPreset(null)
    } catch {
      toast.error('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.')
    }
  }

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const displayAmount =
      transaction.type === 'boost' ||
      transaction.type === 'commission' ||
      transaction.type === 'refund'
        ? -Math.abs(transaction.amount)
        : transaction.amount

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  displayAmount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <h3 className="font-medium">
                  {transaction.description || 'Giao dịch'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {transaction.reference || `TXN-${transaction.id}`} •{' '}
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${getTransactionColor(transaction.type, displayAmount)}`}
              >
                {displayAmount > 0 ? '+' : ''}
                {formatPrice(Math.abs(displayAmount))}
              </p>
              <Badge
                className={`${getStatusColor(transaction.status)} text-white text-xs`}
              >
                {getStatusLabel(transaction.status)}
              </Badge>
              {transaction.paymentMethod && (
                <p className="text-xs text-muted-foreground mt-1">
                  {transaction.paymentMethod}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
                    {showBalance ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {balanceLoading ? (
                  <div className="space-y-4">
                    <div className="h-12 bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {showBalance
                          ? formatPrice(balance.available)
                          : '••••••••'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Có thể sử dụng
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đang chờ:</span>
                        <span className="font-medium">
                          {formatPrice(balance.pending)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Tổng cộng:
                        </span>
                        <span className="font-medium">
                          {formatPrice(balance.total)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() =>
                      document.getElementById('deposit-tab')?.click()
                    }
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
                  <span className="font-medium text-green-600">
                    {formatPrice(balance.available)}
                  </span>
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
                      <p className="text-sm text-muted-foreground mb-2">
                        Số dư hiện tại
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(balance.available)}
                      </p>
                    </div>

                    {/* Preset Amounts */}
                    <div>
                      <Label className="mb-3 block">
                        Chọn số tiền nạp nhanh
                      </Label>
                      {packagesLoading ? (
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-16 bg-muted rounded animate-pulse"
                            />
                          ))}
                        </div>
                      ) : depositPackages && depositPackages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {depositPackages.map(pkg => (
                            <Button
                              key={pkg.id}
                              variant={
                                selectedPreset === pkg.amount
                                  ? 'default'
                                  : 'outline'
                              }
                              onClick={() => handlePresetSelect(pkg.amount)}
                              className="h-16"
                            >
                              {formatPrice(pkg.amount)}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Không có gói nạp tiền nào
                        </p>
                      )}
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Label htmlFor="deposit-amount">
                        Hoặc nhập số tiền tùy chọn (VND)
                      </Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={e => {
                          setDepositAmount(e.target.value)
                          setSelectedPreset(null)
                        }}
                        placeholder="Nhập số tiền muốn nạp"
                        className="text-lg"
                        min="2000"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Số tiền tối thiểu: 2,000 VNĐ
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label htmlFor="deposit-method">
                        Phương thức thanh toán
                      </Label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        <Button
                          variant={
                            depositMethod === 'bank_transfer'
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => setDepositMethod('bank_transfer')}
                          className="justify-start h-auto p-4"
                        >
                          <CreditCard className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">
                              Chuyển khoản ngân hàng
                            </div>
                            <div className="text-sm">
                              Thẻ ATM, Internet Banking
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Transaction Summary */}
                    {(selectedPreset || parseFloat(depositAmount) >= 2000) && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3">
                            Thông tin giao dịch
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Số tiền nạp:</span>
                              <span className="font-medium">
                                {formatPrice(
                                  selectedPreset ||
                                    parseFloat(depositAmount) ||
                                    0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phương thức:</span>
                              <span className="font-medium">
                                Chuyển khoản ngân hàng
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                              <span>Số tiền sẽ nạp:</span>
                              <span className="text-primary">
                                {formatPrice(
                                  selectedPreset ||
                                    parseFloat(depositAmount) ||
                                    0
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Button
                      onClick={handleTopUp}
                      disabled={
                        depositMutation.isPending ||
                        (!selectedPreset &&
                          (!depositAmount || parseFloat(depositAmount) < 2000))
                      }
                      className="w-full"
                      size="lg"
                    >
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      {depositMutation.isPending ? 'Đang xử lý...' : 'Nạp tiền'}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>
                        Thời gian xử lý: 5-10 phút sau khi chuyển khoản thành
                        công
                      </span>
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
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
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
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full" />
                              <div className="space-y-2">
                                <div className="h-4 w-48 bg-muted rounded" />
                                <div className="h-3 w-32 bg-muted rounded" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-5 w-16 bg-muted rounded" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : transactions.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Chưa có giao dịch nào
                      </h3>
                      <p className="text-muted-foreground">
                        Các giao dịch của bạn sẽ hiển thị ở đây
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {transactions
                      .filter(transaction => {
                        if (!searchQuery) return true
                        const query = searchQuery.toLowerCase()
                        return (
                          transaction.description
                            ?.toLowerCase()
                            .includes(query) ||
                          transaction.reference
                            ?.toLowerCase()
                            .includes(query) ||
                          transaction.id.toString().includes(query)
                        )
                      })
                      .map(transaction => (
                        <TransactionCard
                          key={transaction.id}
                          transaction={transaction}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
