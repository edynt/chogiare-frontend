import React from 'react'
import type { ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export function LazySection({
  children,
  fallback,
  className,
  threshold = 0.1,
  rootMargin = '100px', // Load 100px before visible
}: LazySectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  })

  return (
    <div ref={ref} className={cn(className)}>
      {isIntersecting ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      ) : (
        fallback || <div className="min-h-[200px]" />
      )}
    </div>
  )
}
