import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, AuthTokens } from '@/types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.isAuthenticated = true
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateTokens,
  clearError,
} = authSlice.actions

export default authSlice.reducer
