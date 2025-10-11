import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, Order, StoreInfo } from '@/types'

interface SellerState {
  products: Product[]
  orders: Order[]
  store: StoreInfo | null
  stats: {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    pendingOrders: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: SellerState = {
  products: [],
  orders: [],
  store: null,
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  },
  isLoading: false,
  error: null,
}

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload)
    },
    updateProduct: (state, action: PayloadAction<{ id: string; updates: Partial<Product> }>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload.updates }
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
    updateOrder: (state, action: PayloadAction<{ id: string; updates: Partial<Order> }>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id)
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload.updates }
      }
    },
    setStore: (state, action: PayloadAction<StoreInfo>) => {
      state.store = action.payload
    },
    updateStore: (state, action: PayloadAction<Partial<StoreInfo>>) => {
      if (state.store) {
        state.store = { ...state.store, ...action.payload }
      }
    },
    setStats: (state, action: PayloadAction<Partial<SellerState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload }
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
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setOrders,
  updateOrder,
  setStore,
  updateStore,
  setStats,
  setLoading,
  setError,
  clearError,
} = sellerSlice.actions

export default sellerSlice.reducer
