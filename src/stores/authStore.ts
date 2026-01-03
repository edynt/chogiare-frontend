import { create } from 'zustand'
import type { User } from '@/types'

/**
 * Auth Store - Cookie-based Authentication
 *
 * IMPORTANT: Tokens (accessToken, refreshToken) are stored as HttpOnly cookies
 * and managed by the backend. This store only manages user state and UI state.
 *
 * DO NOT store tokens in localStorage or this store.
 */

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User) => void
  logout: () => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      error: null,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    }),

  clearError: () => set({ error: null }),
}))
