import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { ShoppingCart, Package, ShoppingBag, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {Icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface EmptyCartProps {
  onContinueShopping?: () => void
}

export function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Giỏ hàng trống"
      description="Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm"
      action={onContinueShopping ? {
        label: 'Tiếp tục mua sắm',
        onClick: onContinueShopping,
      } : undefined}
    />
  )
}

interface EmptyProductsProps {
  onAddProduct?: () => void
}

export function EmptyProducts({ onAddProduct }: EmptyProductsProps) {
  return (
    <EmptyState
      icon={Package}
      title="Chưa có sản phẩm"
      description="Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn"
      action={onAddProduct ? {
        label: 'Thêm sản phẩm',
        onClick: onAddProduct,
      } : undefined}
    />
  )
}

interface EmptyOrdersProps {
  onBrowseProducts?: () => void
}

export function EmptyOrders({ onBrowseProducts }: EmptyOrdersProps) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Chưa có đơn hàng"
      description="Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời"
      action={onBrowseProducts ? {
        label: 'Khám phá sản phẩm',
        onClick: onBrowseProducts,
      } : undefined}
    />
  )
}

interface EmptyReviewsProps {
  onWriteReview?: () => void
}

export function EmptyReviews({ onWriteReview }: EmptyReviewsProps) {
  return (
    <EmptyState
      icon={Star}
      title="Chưa có đánh giá"
      description="Hãy là người đầu tiên đánh giá sản phẩm này"
      action={onWriteReview ? {
        label: 'Viết đánh giá',
        onClick: onWriteReview,
      } : undefined}
    />
  )
}
