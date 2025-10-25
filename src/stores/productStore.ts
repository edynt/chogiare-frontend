import { create } from 'zustand'
import type { Product, SearchFilters, PaginatedResponse } from '@/types'

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  searchFilters: SearchFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  isLoading: boolean
  error: string | null
}

interface ProductActions {
  setProducts: (products: Product[]) => void
  setFeaturedProducts: (products: Product[]) => void
  setCurrentProduct: (product: Product | null) => void
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  setPagination: (pagination: ProductState['pagination']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  removeProduct: (id: string) => void
  clearProducts: () => void
  clearError: () => void
}

type ProductStore = ProductState & ProductActions

export const useProductStore = create<ProductStore>((set, get) => ({
  // State
  products: [],
  featuredProducts: [],
  currentProduct: null,
  searchFilters: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  error: null,

  // Actions
  setProducts: (products) => set({ products }),
  setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
  setCurrentProduct: (currentProduct) => set({ currentProduct }),
  
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
  
  setPagination: (pagination) => set({ pagination }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    ),
    currentProduct: state.currentProduct?.id === id
      ? { ...state.currentProduct, ...updates }
      : state.currentProduct,
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
    currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
  })),
  
  clearProducts: () => set({
    products: [],
    currentProduct: null,
  }),
  
  clearError: () => set({ error: null }),
}))
