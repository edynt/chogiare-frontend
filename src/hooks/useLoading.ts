import { useState, useCallback } from 'react'

interface UseLoadingOptions {
  delay?: number
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useLoading(options: UseLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async (asyncFn: () => Promise<void>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add minimum delay for better UX
      if (options.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay))
      }

      await asyncFn()
      options.onSuccess?.()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    execute,
    reset
  }
}
