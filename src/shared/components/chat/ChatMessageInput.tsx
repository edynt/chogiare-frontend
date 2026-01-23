import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { Button } from '@shared/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatMessageInputProps {
  onSend: (message: string) => void
  onTyping?: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
  initialMessage?: string
  onInitialMessageUsed?: () => void
}

export function ChatMessageInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Nhập tin nhắn...',
  initialMessage,
  onInitialMessageUsed,
}: ChatMessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialMessageUsedRef = useRef(false)

  // Set initial message when provided
  useEffect(() => {
    if (initialMessage && typeof initialMessage === 'string' && !initialMessageUsedRef.current) {
      setMessage(initialMessage)
      initialMessageUsedRef.current = true
      onInitialMessageUsed?.()
    }
  }, [initialMessage, onInitialMessageUsed])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!onTyping) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Send typing = true
    onTyping(true)

    // Set timeout to send typing = false after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false)
    }, 2000)
  }, [onTyping])

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = () => {
    const trimmed = (message || '').trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setMessage('')

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    onTyping?.(false)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    handleTyping()
  }

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Input area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-lg border bg-muted/50 px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'max-h-[120px] min-h-[36px]'
            )}
          />
        </div>

        {/* Emoji button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </Button>

        {/* Send button */}
        <Button
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          onClick={handleSubmit}
          disabled={disabled || !(message || '').trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
