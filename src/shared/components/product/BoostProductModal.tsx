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
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import type { BoostPackage } from '@user/api/products'

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

  const { data: packages, isLoading: packagesLoading } = useBoostPackages()
  const { data: balance, isLoading: balanceLoading } = useWalletBalance()
  const { data: boostStatus, isLoading: statusLoading } = useBoostStatus(
    productId,
    isOpen
  )
  const boostMutation = useBoostProduct()

  const currentBalance = balance?.balance ?? 0
  const isAlreadyBoosted = boostStatus?.isPromoted ?? false

  const handleBoost = async () => {
    if (!selectedPackage) {
      toast.error('Vui lòng chọn gói đẩy sản phẩm')
      return
    }

    if (currentBalance < selectedPackage.price) {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền vào ví.')
      return
    }

    try {
      await boostMutation.mutateAsync({
        productId,
        packageId: selectedPackage.id,
      })
      toast.success('Đẩy sản phẩm thành công!')
      onClose()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi đẩy sản phẩm'
      toast.error(message)
    }
  }

  const isLoading = packagesLoading || balanceLoading || statusLoading

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Current Balance */}
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Số dư ví</span>
              </div>
              <span className="font-bold text-green-600">
                {formatCurrency(currentBalance)}
              </span>
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

            {/* Package Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">Chọn gói đẩy sản phẩm</h4>

              {(Array.isArray(packages) ? packages : []).map(pkg => {
                const isSelected = selectedPackage?.id === pkg.id
                const canAfford = currentBalance >= pkg.price

                return (
                  <div
                    key={pkg.id}
                    onClick={() => canAfford && setSelectedPackage(pkg)}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : canAfford
                          ? 'border-border hover:border-orange-300'
                          : 'cursor-not-allowed border-border opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {pkg.displayName}
                          </span>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{pkg.durationDays} ngày</span>
                        </div>
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground">
                            {pkg.description}
                          </p>
                        )}
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {pkg.features.map((feature, idx) => (
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
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(pkg.price)}
                        </span>
                        {!canAfford && (
                          <p className="text-xs text-destructive">
                            Không đủ số dư
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {(!packages ||
                !Array.isArray(packages) ||
                packages.length === 0) && (
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
                  </strong>
                  .{' '}
                  <Link
                    to="/buyer/top-up"
                    className="font-medium underline hover:no-underline"
                  >
                    Nạp tiền ngay
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleBoost}
            disabled={
              !selectedPackage ||
              currentBalance < (selectedPackage?.price ?? 0) ||
              boostMutation.isPending
            }
            className="bg-orange-500 hover:bg-orange-600"
          >
            {boostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Đẩy sản phẩm
                {selectedPackage &&
                  ` - ${formatCurrency(selectedPackage.price)}`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
