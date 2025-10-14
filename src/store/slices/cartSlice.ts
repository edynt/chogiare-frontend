import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Cart, CartItem } from '@/api/cart'

interface CartState {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  cart: null,
  isOpen: false,
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload
      state.error = null
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const existingItemIndex = state.cart.items.findIndex(item => item.id === action.payload.id)
        if (existingItemIndex >= 0) {
          state.cart.items[existingItemIndex] = action.payload
        } else {
          state.cart.items.push(action.payload)
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(item => item.id !== action.payload)
      }
    },
    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const index = state.cart.items.findIndex(item => item.id === action.payload.id)
        if (index >= 0) {
          state.cart.items[index] = action.payload
        }
      }
    },
    clearCart: (state) => {
      if (state.cart) {
        state.cart.items = []
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setLoading,
  setError,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions

export default cartSlice.reducer
