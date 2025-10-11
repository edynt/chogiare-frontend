import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

interface CartItem {
  product: Product
  quantity: number
  addedAt: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.product.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          product,
          quantity,
          addedAt: new Date().toISOString(),
        })
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload)
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.product.id === productId)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId)
        } else {
          item.quantity = quantity
        }
        
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
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
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions

export default cartSlice.reducer
