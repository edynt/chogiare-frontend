import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import type { ChatMessage } from '@user/api/chat'

export interface ChatMessagePayload {
  conversationId: number
  message: ChatMessage
}

export interface TypingPayload {
  conversationId: number
  userId: number
  isTyping: boolean
}

interface UseChatSocketOptions {
  onNewMessage?: (payload: ChatMessagePayload) => void
  onUserTyping?: (payload: TypingPayload) => void
  onMessageRead?: (payload: { conversationId: number; userId: number }) => void
}

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

// Singleton socket instance
let socketInstance: Socket | null = null
let socketRefCount = 0

const getOrCreateSocket = (): Socket => {
  if (!socketInstance) {
    console.log(
      '[ChatSocket] Creating socket connection to:',
      `${SOCKET_URL}/chat`
    )
    socketInstance = io(`${SOCKET_URL}/chat`, {
      withCredentials: true,
      transports: ['polling', 'websocket'], // Start with polling to ensure cookies are sent
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      // Cookies will be sent automatically via withCredentials
    })

    // Debug listeners
    socketInstance.on('connect', () => {
      console.log('[ChatSocket] Socket connected with id:', socketInstance?.id)
    })

    socketInstance.on('new_message', payload => {
      console.log('[ChatSocket] Received new_message event:', payload)
    })

    socketInstance.on('connect_error', error => {
      console.error('[ChatSocket] Connection error:', error.message)
    })
  }
  socketRefCount++
  return socketInstance
}

const releaseSocket = () => {
  socketRefCount--
  if (socketRefCount <= 0 && socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
    socketRefCount = 0
  }
}

export const useChatSocket = (options: UseChatSocketOptions = {}) => {
  const { onNewMessage, onUserTyping, onMessageRead } = options
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [isConnected, setIsConnected] = useState(false)

  // Store callbacks in refs to avoid re-subscriptions
  const onNewMessageRef = useRef(onNewMessage)
  const onUserTypingRef = useRef(onUserTyping)
  const onMessageReadRef = useRef(onMessageRead)

  // Update refs when callbacks change
  useEffect(() => {
    onNewMessageRef.current = onNewMessage
  }, [onNewMessage])

  useEffect(() => {
    onUserTypingRef.current = onUserTyping
  }, [onUserTyping])

  useEffect(() => {
    onMessageReadRef.current = onMessageRead
  }, [onMessageRead])

  // Connect to socket - only depends on isAuthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const socket = getOrCreateSocket()
    socketRef.current = socket

    // Connection handlers
    const handleConnect = () => {
      setIsConnected(true)
      console.log('[ChatSocket] Connected')
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      console.log('[ChatSocket] Disconnected')
    }

    const handleConnectError = (error: Error) => {
      console.error('[ChatSocket] Connection error:', error.message)
      setIsConnected(false)
    }

    // Set initial connection state
    setIsConnected(socket.connected)

    // Only add listeners if not already added
    if (!socket.hasListeners('connect')) {
      socket.on('connect', handleConnect)
    }
    if (!socket.hasListeners('disconnect')) {
      socket.on('disconnect', handleDisconnect)
    }
    if (!socket.hasListeners('connect_error')) {
      socket.on('connect_error', handleConnectError)
    }

    return () => {
      releaseSocket()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [isAuthenticated])

  // Event handlers - separate effect to handle message events
  useEffect(() => {
    if (!isAuthenticated || !socketRef.current) {
      return
    }

    const socket = socketRef.current

    // Event handlers that use refs
    const handleNewMessage = (payload: ChatMessagePayload) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['chat', 'messages', payload.conversationId.toString()],
      })
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversations'],
      })
      // Call custom handler
      onNewMessageRef.current?.(payload)
    }

    const handleUserTyping = (payload: TypingPayload) => {
      onUserTypingRef.current?.(payload)
    }

    const handleMessageRead = (payload: {
      conversationId: number
      userId: number
    }) => {
      queryClient.invalidateQueries({
        queryKey: ['chat', 'messages', payload.conversationId.toString()],
      })
      onMessageReadRef.current?.(payload)
    }

    // Add event listeners
    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleUserTyping)
    socket.on('message_read', handleMessageRead)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('message_read', handleMessageRead)
    }
  }, [isAuthenticated, queryClient])

  // Send message via socket
  const sendMessage = useCallback(
    async (
      conversationId: number,
      content: string,
      messageType: number = 0 // 0=text, 1=image, 2=file
    ) => {
      if (!socketRef.current?.connected) {
        throw new Error('Socket not connected')
      }

      return new Promise((resolve, reject) => {
        socketRef.current!.emit(
          'send_message',
          { conversationId, content, messageType },
          (response: {
            success?: boolean
            error?: string
            message?: ChatMessage
          }) => {
            if (response.error) {
              reject(new Error(response.error))
            } else {
              resolve(response.message)
            }
          }
        )
      })
    },
    []
  )

  // Join conversation room
  const joinConversation = useCallback((conversationId: number) => {
    if (!socketRef.current?.connected) return

    socketRef.current.emit(
      'join_conversation',
      { conversationId },
      (response: { success?: boolean; error?: string }) => {
        if (response.error) {
          console.error(
            '[ChatSocket] Failed to join conversation:',
            response.error
          )
        }
      }
    )
  }, [])

  // Leave conversation room
  const leaveConversation = useCallback((conversationId: number) => {
    if (!socketRef.current?.connected) return

    socketRef.current.emit('leave_conversation', { conversationId })
  }, [])

  // Mark messages as read
  const markAsRead = useCallback(
    (conversationId: number) => {
      if (!socketRef.current?.connected) return

      socketRef.current.emit(
        'mark_read',
        { conversationId },
        (response: { success?: boolean; error?: string }) => {
          if (response.success) {
            queryClient.invalidateQueries({
              queryKey: ['chat', 'conversations'],
            })
          }
        }
      )
    },
    [queryClient]
  )

  // Send typing indicator
  const sendTyping = useCallback(
    (conversationId: number, isTyping: boolean) => {
      if (!socketRef.current?.connected) return

      socketRef.current.emit('typing', { conversationId, isTyping })
    },
    []
  )

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isConnected,
      socket: socketRef.current,
      sendMessage,
      joinConversation,
      leaveConversation,
      markAsRead,
      sendTyping,
    }),
    [
      isConnected,
      sendMessage,
      joinConversation,
      leaveConversation,
      markAsRead,
      sendTyping,
    ]
  )
}
