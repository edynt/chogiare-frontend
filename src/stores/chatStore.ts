import { create } from 'zustand'

interface ChatState {
  // UI State
  isOpen: boolean
  activeConversationId: string | null
  view: 'list' | 'conversation'

  // Realtime State
  typingUsers: Record<string, number[]> // conversationId -> userIds
  onlineUsers: Set<number>

  // Unread count (from conversations, tracked locally for badge)
  totalUnreadCount: number
}

interface ChatActions {
  // UI Actions
  openChat: (conversationId?: string) => void
  closeChat: () => void
  setActiveConversation: (id: string | null) => void
  setView: (view: 'list' | 'conversation') => void
  goBackToList: () => void

  // Realtime Actions
  setUserTyping: (
    conversationId: string,
    userId: number,
    isTyping: boolean
  ) => void
  clearTypingUsers: (conversationId: string) => void
  setUserOnline: (userId: number, isOnline: boolean) => void

  // Badge
  setTotalUnreadCount: (count: number) => void
  incrementUnreadCount: () => void
  decrementUnreadCount: (amount?: number) => void
}

type ChatStore = ChatState & ChatActions

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial State
  isOpen: false,
  activeConversationId: null,
  view: 'list',
  typingUsers: {},
  onlineUsers: new Set(),
  totalUnreadCount: 0,

  // UI Actions
  openChat: (conversationId?: string) => {
    if (conversationId) {
      set({
        isOpen: true,
        activeConversationId: conversationId,
        view: 'conversation',
      })
    } else {
      set({ isOpen: true, view: 'list' })
    }
  },

  closeChat: () => {
    set({
      isOpen: false,
      activeConversationId: null,
      view: 'list',
    })
  },

  setActiveConversation: (id: string | null) => {
    set({
      activeConversationId: id,
      view: id ? 'conversation' : 'list',
    })
  },

  setView: (view: 'list' | 'conversation') => {
    set({ view })
  },

  goBackToList: () => {
    set({
      activeConversationId: null,
      view: 'list',
    })
  },

  // Realtime Actions
  setUserTyping: (conversationId: string, userId: number, isTyping: boolean) => {
    set(state => {
      const typingUsers = { ...state.typingUsers }
      const currentTyping = typingUsers[conversationId] || []

      if (isTyping && !currentTyping.includes(userId)) {
        typingUsers[conversationId] = [...currentTyping, userId]
      } else if (!isTyping) {
        typingUsers[conversationId] = currentTyping.filter(id => id !== userId)
      }

      return { typingUsers }
    })
  },

  clearTypingUsers: (conversationId: string) => {
    set(state => {
      const typingUsers = { ...state.typingUsers }
      delete typingUsers[conversationId]
      return { typingUsers }
    })
  },

  setUserOnline: (userId: number, isOnline: boolean) => {
    set(state => {
      const onlineUsers = new Set(state.onlineUsers)
      if (isOnline) {
        onlineUsers.add(userId)
      } else {
        onlineUsers.delete(userId)
      }
      return { onlineUsers }
    })
  },

  // Badge Actions
  setTotalUnreadCount: (count: number) => {
    set({ totalUnreadCount: Math.max(0, count) })
  },

  incrementUnreadCount: () => {
    set(state => ({ totalUnreadCount: state.totalUnreadCount + 1 }))
  },

  decrementUnreadCount: (amount = 1) => {
    set(state => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount - amount),
    }))
  },
}))
