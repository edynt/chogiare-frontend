import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, type InputProps } from './input'
import { cn } from '@/lib/utils'
import { Button } from './button'

export type PasswordInputProps = Omit<InputProps, 'type'>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          tabIndex={-1}
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-visible:ring-0"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
