import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  RefreshCw,
  Shield,
  Banknote,
  DollarSign,
  History,
  Settings,
  Bell,
  Info
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'sale' | 'refund' | 'commission' | 'bonus'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  reference: string
  createdAt: string
  completedAt?: string
  fee?: number
  netAmount?: number
  method: string
  bankAccount?: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
}

interface WithdrawalRequest {
  id: string
  amount: number
  bankAccount: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requestedAt: string
  processedAt?: string
  reason?: string
  fee: number
  netAmount: number
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  isDefault: boolean
  isVerified: boolean
  addedAt: string
}

export default function WithdrawBalancePage() {
  const [showBalance, setShowBalance] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedBankAccount, setSelectedBankAccount] = useState('')
  const [withdrawNote, setWithdrawNote] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)

  // Mock data
  const balance = {
    available: 15750000,
    pending: 2500000,
    total: 18250000,
    frozen: 0,
    currency: 'VND'
  }

  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountHolder: 'NGUYEN VAN A',
      isDefault: true,
      isVerified: true,
      addedAt: '2023-01-15T10:30:00Z'
    },
    {
      id: '2',
      bankName: 'Techcombank',
      accountNumber: '0987654321',
      accountHolder: 'NGUYEN VAN A',
      isDefault: false,
      isVerified: true,
      addedAt: '2023-06-20T14:20:00Z'
    },
    {
      id: '3',
      bankName: 'BIDV',
      accountNumber: '1122334455',
      accountHolder: 'NGUYEN VAN A',
      isDefault: false,
      isVerified: false,
      addedAt: '2024-01-10T09:15:00Z'
    }
  ]

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
      type: 'withdrawal',
      amount: 5000000,
      status: 'completed',
      description: 'Rút tiền về tài khoản Vietcombank',
      reference: 'WD-2024-001',
      createdAt: '2024-01-14T10:00:00Z',
      completedAt: '2024-01-14T15:30:00Z',
      fee: 25000,
      netAmount: 4975000,
      method: 'Chuyển khoản',
      bankAccount: {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'NGUYEN VAN A'
      }
    },
    {
      id: '3',
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
      id: '4',
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
      id: '5',
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

  const withdrawalRequests: WithdrawalRequest[] = [
    {
      id: '1',
      amount: 5000000,
      bankAccount: {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'NGUYEN VAN A'
      },
      status: 'completed',
      requestedAt: '2024-01-14T10:00:00Z',
      processedAt: '2024-01-14T15:30:00Z',
      fee: 25000,
      netAmount: 4975000
    },
    {
      id: '2',
      amount: 3000000,
      bankAccount: {
        bankName: 'Techcombank',
        accountNumber: '0987654321',
        accountHolder: 'NGUYEN VAN A'
      },
      status: 'processing',
      requestedAt: '2024-01-16T09:30:00Z',
      fee: 15000,
      netAmount: 2985000
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
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4" />
      case 'sale': return <TrendingUp className="h-4 w-4" />
      case 'refund': return <TrendingDown className="h-4 w-4" />
      case 'commission': return <Minus className="h-4 w-4" />
      case 'bonus': return <Plus className="h-4 w-4" />
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

  const handleWithdraw = () => {
    if (!withdrawAmount || !selectedBankAccount) return
    
    const amount = parseFloat(withdrawAmount)
    const fee = Math.max(25000, amount * 0.005) // 0.5% fee, minimum 25k
    const netAmount = amount - fee
    
    console.log('Withdraw request:', {
      amount,
      bankAccount: selectedBankAccount,
      note: withdrawNote,
      fee,
      netAmount
    })
    
    // Reset form
    setWithdrawAmount('')
    setWithdrawNote('')
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
              {transaction.bankAccount && (
                <p className="text-xs text-muted-foreground">
                  {transaction.bankAccount.bankName} - {transaction.bankAccount.accountNumber}
                </p>
              )}
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
            <h1 className="text-3xl font-bold">Ví & Rút tiền</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Quản lý số dư và rút tiền từ tài khoản của bạn
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
                  <p className="text-sm text-muted-foreground">Có thể rút</p>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bị khóa:</span>
                    <span className="font-medium">{formatPrice(balance.frozen)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" onClick={() => document.getElementById('withdraw-tab')?.click()}>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Rút tiền ngay
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
                    <Minus className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Phí dịch vụ</span>
                  </div>
                  <span className="font-medium">{formatPrice(1250000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Lợi nhuận</span>
                  </div>
                  <span className="font-medium text-green-600">{formatPrice(23750000)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transactions" id="transactions-tab">
                  <History className="h-4 w-4 mr-2" />
                  Giao dịch
                </TabsTrigger>
                <TabsTrigger value="withdraw" id="withdraw-tab">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Rút tiền
                </TabsTrigger>
                <TabsTrigger value="settings" id="settings-tab">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>

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
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Loại giao dịch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="sale">Bán hàng</SelectItem>
                        <SelectItem value="withdrawal">Rút tiền</SelectItem>
                        <SelectItem value="refund">Hoàn tiền</SelectItem>
                        <SelectItem value="commission">Phí dịch vụ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
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

              <TabsContent value="withdraw" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rút tiền</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="amount">Số tiền rút (VND)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Nhập số tiền muốn rút"
                        className="text-lg"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Số dư khả dụng: {formatPrice(balance.available)}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="bankAccount">Tài khoản ngân hàng</Label>
                      <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tài khoản ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex items-center gap-2">
                                <span>{account.bankName}</span>
                                <span>•</span>
                                <span>{account.accountNumber}</span>
                                {account.isDefault && (
                                  <Badge variant="outline" className="text-xs">Mặc định</Badge>
                                )}
                                {!account.isVerified && (
                                  <Badge variant="destructive" className="text-xs">Chưa xác thực</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                      <Input
                        id="note"
                        value={withdrawNote}
                        onChange={(e) => setWithdrawNote(e.target.value)}
                        placeholder="Ghi chú cho giao dịch rút tiền"
                      />
                    </div>

                    {/* Withdrawal Summary */}
                    {withdrawAmount && selectedBankAccount && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3">Tóm tắt giao dịch</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Số tiền rút:</span>
                              <span className="font-medium">{formatPrice(parseFloat(withdrawAmount) || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí giao dịch:</span>
                              <span className="font-medium">{formatPrice(Math.max(25000, (parseFloat(withdrawAmount) || 0) * 0.005))}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                              <span>Số tiền thực nhận:</span>
                              <span className="text-primary">{formatPrice((parseFloat(withdrawAmount) || 0) - Math.max(25000, (parseFloat(withdrawAmount) || 0) * 0.005))}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        onClick={handleWithdraw}
                        disabled={!withdrawAmount || !selectedBankAccount || parseFloat(withdrawAmount) > balance.available}
                        className="flex-1"
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Xác nhận rút tiền
                      </Button>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm tài khoản
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Thời gian xử lý: 1-3 ngày làm việc</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Withdrawals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử rút tiền</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {withdrawalRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{formatPrice(request.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.bankAccount.bankName} - {request.bankAccount.accountNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(request.requestedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {getStatusLabel(request.status)}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Thực nhận: {formatPrice(request.netAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tài khoản ngân hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{account.bankName}</p>
                            <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                            <p className="text-xs text-muted-foreground">{account.accountHolder}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.isDefault && (
                            <Badge variant="outline">Mặc định</Badge>
                          )}
                          {account.isVerified ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Đã xác thực
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Chưa xác thực
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tài khoản ngân hàng
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">Thông báo email</Label>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua email khi có giao dịch</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="font-medium">Thông báo SMS</Label>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua SMS khi có giao dịch</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
