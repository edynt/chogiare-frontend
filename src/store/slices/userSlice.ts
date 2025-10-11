import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, StoreInfo } from '@/types'

interface UserState {
  profile: User | null
  store: StoreInfo | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  store: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    updateStore: (state, action: PayloadAction<Partial<StoreInfo>>) => {
      if (state.store) {
        state.store = { ...state.store, ...action.payload }
      } else {
        state.store = action.payload as StoreInfo
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  updateProfile,
  updateStore,
  setLoading,
  setError,
  clearError,
} = userSlice.actions

export default userSlice.reducer
