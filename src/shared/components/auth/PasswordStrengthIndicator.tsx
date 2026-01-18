import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PASSWORD_REQUIREMENTS } from '@/constants/password.constants'

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null
  }

  const metRequirements = PASSWORD_REQUIREMENTS.filter(req =>
    req.test(password)
  )
  const allMet = metRequirements.length === PASSWORD_REQUIREMENTS.length

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1.5">
        {PASSWORD_REQUIREMENTS.map((requirement, index) => {
          const isMet = requirement.test(password)
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              {isMet ? (
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <span
                className={cn(
                  'transition-colors',
                  isMet
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                )}
              >
                {requirement.label}
              </span>
            </div>
          )
        })}
      </div>
      {allMet && (
        <div className="pt-1">
          <div className="h-1.5 bg-green-500 rounded-full animate-in fade-in duration-300" />
        </div>
      )}
    </div>
  )
}
