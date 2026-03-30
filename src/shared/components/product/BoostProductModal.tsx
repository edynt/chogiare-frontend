import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@shared/components/ui/dialog'
import { Button } from '@shared/components/ui/button'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import { Badge } from '@shared/components/ui/badge'
import { Separator } from '@shared/components/ui/separator'
import { Skeleton } from '@shared/components/ui/skeleton'
import {
  useBoostPackages,
  useBoostProduct,
  useBoostStatus,
} from '@/hooks/useProducts'
import { useWalletBalance } from '@/hooks/useWallet'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import type { BoostPackage } from '@user/api/products'
import { cn } from '@/lib/utils'

interface BoostProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productTitle: string
}

export function BoostProductModal({
  isOpen,
  onClose,
  productId,
  productTitle,
}: BoostProductModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(
    null
  )
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    data: packages,
    isLoading: packagesLoading,
    error: packagesError,
  } = useBoostPackages(isOpen)
  const { data: balance, isLoading: balanceLoading } = useWalletBalance()
  const { data: boostStatus, isLoading: statusLoading } = useBoostStatus(
    productId,
    isOpen
  )
  const boostMutation = useBoostProduct()

  const currentBalance = balance?.balance ?? 0
  const isAlreadyBoosted = boostStatus?.isPromoted ?? false

  // Show confirmation dialog before boosting
  const handleRequestBoost = () => {
    if (!selectedPackage) {
      toast.error('Vui lòng chọn gói đẩy sản phẩm')
      return
    }
    if (currentBalance < selectedPackage.price) {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền vào ví.')
      return
    }
    setShowConfirm(true)
  }

  // Execute boost after user confirms
  const handleConfirmBoost = async () => {
    if (!selectedPackage) return
    try {
      await boostMutation.mutateAsync({
        productId,
        packageId: selectedPackage.id,
      })
      toast.success('Đẩy sản phẩm thành công!')
      setShowConfirm(false)
      onClose()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi đẩy sản phẩm'
      toast.error(message)
      setShowConfirm(false)
    }
  }

  const isLoading = packagesLoading || balanceLoading || statusLoading
  const packageList = Array.isArray(packages) ? packages : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Đẩy sản phẩm
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {productTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 flex-1" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Current Balance */}
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Số dư ví</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600">
                  {formatCurrency(currentBalance)}
                </span>
                {packageList.length > 0 &&
                  currentBalance <
                    Math.min(...packageList.map(p => p.price)) && (
                    <Button
                      size="sm"
                      asChild
                      className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                    >
                      <Link to="/buyer/top-up">
                        <Wallet className="mr-1 h-3 w-3" />
                        Nạp tiền
                      </Link>
                    </Button>
                  )}
              </div>
            </div>

            {/* Already Boosted Warning */}
            {isAlreadyBoosted && boostStatus?.boost && (
              <Alert className="border-orange-200 bg-orange-50">
                <Sparkles className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Sản phẩm đang được đẩy với gói{' '}
                  <strong>{boostStatus.boost.packageName}</strong>. Còn{' '}
                  <strong>{boostStatus.boost.remainingDays} ngày</strong>.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Package Selection - Horizontal Layout */}
            <div className="space-y-3">
              <h4 className="font-medium">Chọn gói đẩy sản phẩm</h4>

              {packageList.length > 0 ? (
                <>
                  {/* Horizontal Package Cards */}
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                    {packageList.map(pkg => {
                      const isSelected = selectedPackage?.id === pkg.id
                      const canAfford = currentBalance >= pkg.price

                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={cn(
                            'relative flex-shrink-0 w-[140px] cursor-pointer rounded-lg border-2 p-3 transition-all text-center',
                            isSelected
                              ? 'border-orange-500 bg-orange-50'
                              : canAfford
                                ? 'border-border hover:border-orange-300 hover:bg-orange-50/50'
                                : 'border-border hover:border-orange-300/50 opacity-60 hover:opacity-80'
                          )}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -right-2">
                              <CheckCircle className="h-5 w-5 text-orange-500 bg-white rounded-full" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="font-semibold text-sm truncate">
                              {pkg.displayName}
                            </p>
                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{pkg.durationDays} ngày</span>
                            </div>
                            <p className="text-base font-bold text-orange-600">
                              {formatCurrency(pkg.price)}
                            </p>
                            {!canAfford && (
                              <p className="text-xs text-destructive">
                                Không đủ
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Package Details */}
                  {selectedPackage && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-orange-800">
                          {selectedPackage.displayName}
                        </h5>
                        <Badge className="bg-orange-500">
                          {formatCurrency(selectedPackage.price)}
                        </Badge>
                      </div>

                      {selectedPackage.description && (
                        <p className="text-sm text-muted-foreground">
                          {selectedPackage.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Thời hạn:{' '}
                            <strong className="text-foreground">
                              {selectedPackage.durationDays} ngày
                            </strong>
                          </span>
                        </div>
                        {selectedPackage.viewBoost && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>
                              Tăng{' '}
                              <strong className="text-foreground">
                                {selectedPackage.viewBoost}x
                              </strong>{' '}
                              lượt xem
                            </span>
                          </div>
                        )}
                      </div>

                      {selectedPackage.features &&
                        selectedPackage.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedPackage.features.map((feature, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Prompt to select if not selected */}
                  {!selectedPackage && (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center text-sm text-muted-foreground">
                      <Sparkles className="h-5 w-5 mx-auto mb-2 text-orange-400" />
                      Chọn một gói ở trên để xem chi tiết
                    </div>
                  )}
                </>
              ) : null}

              {packagesError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Không thể tải danh sách gói đẩy sản phẩm. Vui lòng thử lại
                    sau.
                  </AlertDescription>
                </Alert>
              )}

              {!packagesError && packageList.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Chưa có gói đẩy sản phẩm nào. Vui lòng liên hệ quản trị
                    viên.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Insufficient Balance Warning */}
            {selectedPackage && currentBalance < selectedPackage.price && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Số dư không đủ. Bạn cần thêm{' '}
                  <strong>
                    {formatCurrency(selectedPackage.price - currentBalance)}
                  </strong>{' '}
                  để sử dụng gói này.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          {selectedPackage && currentBalance < selectedPackage.price ? (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/buyer/top-up">
                <Wallet className="mr-2 h-4 w-4" />
                Nạp tiền ngay
              </Link>
            </Button>
          ) : (
            <Button
              onClick={handleRequestBoost}
              disabled={!selectedPackage || boostMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Đẩy sản phẩm
              {selectedPackage && ` - ${formatCurrency(selectedPackage.price)}`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Xác nhận đẩy sản phẩm
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đẩy sản phẩm này?
            </DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-3 py-2">
              <div className="rounded-lg border p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sản phẩm</span>
                  <span className="font-medium text-right max-w-[200px] truncate">
                    {productTitle}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gói đẩy</span>
                  <span className="font-medium">
                    {selectedPackage.displayName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời hạn</span>
                  <span className="font-medium">
                    {selectedPackage.durationDays} ngày
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chi phí</span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số dư sau</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(currentBalance - selectedPackage.price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={boostMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmBoost}
              disabled={boostMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {boostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Xác nhận đẩy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
