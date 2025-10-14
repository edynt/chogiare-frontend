import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, Category, SearchFilters, PaginatedResponse } from '@/types'

interface ProductState {
  products: Product[]
  categories: Category[]
  featuredProducts: Product[]
  searchFilters: SearchFilters
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  } | null
  isLoading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  searchFilters: {
    page: 1,
    limit: 20,
    sortBy: 'newest',
  },
  pagination: null,
  isLoading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload)
    },
    updateProduct: (state, action: PayloadAction<{ id: string; updates: Partial<Product> }>) => {
      const index = state.products.findIndex((p: Product) => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload.updates }
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p: Product) => p.id !== action.payload)
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },
    setSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload }
    },
    setPagination: (state, action: PayloadAction<PaginatedResponse<Product>['pagination']>) => {
      state.pagination = action.payload
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
  setCategories,
  setFeaturedProducts,
  setSearchFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
} = productSlice.actions

export default productSlice.reducer
