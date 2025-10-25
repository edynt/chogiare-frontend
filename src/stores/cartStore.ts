import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  totalItems: number
  totalValue: number
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

interface CartActions {
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

type CartStore = CartState & CartActions

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalValue: 0,
      isOpen: false,
      isLoading: false,
      error: null,

      // Actions
      addItem: (product, quantity) => {
        const { items } = get()
        const existingItem = items.find(item => item.productId === product.id)
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            totalItems: state.totalItems + quantity,
            totalValue: state.totalValue + (product.price * quantity),
            isOpen: true, // Auto-open cart when adding item
          }))
        } else {
          const newItem: CartItem = {
            id: `item-${Date.now()}`,
            cartId: 'cart-1',
            productId: product.id,
            quantity,
            price: product.price,
            productName: product.title,
            productImage: product.images[0] || '/placeholder.jpg',
            productPrice: product.price,
            productStock: product.stock,
            productStatus: product.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set((state) => ({
            items: [...state.items, newItem],
            totalItems: state.totalItems + quantity,
            totalValue: state.totalValue + (product.price * quantity),
            isOpen: true, // Auto-open cart when adding item
          }))
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => {
          const item = state.items.find(item => item.productId === productId)
          if (!item) return state

          const quantityDiff = quantity - item.quantity
          const valueDiff = item.productPrice * quantityDiff

          return {
            items: state.items.map(item =>
              item.productId === productId
                ? { ...item, quantity, updatedAt: new Date().toISOString() }
                : item
            ),
            totalItems: state.totalItems + quantityDiff,
            totalValue: state.totalValue + valueDiff,
          }
        })
      },

      removeItem: (productId) => {
        set((state) => {
          const item = state.items.find(item => item.productId === productId)
          if (!item) return state

          return {
            items: state.items.filter(item => item.productId !== productId),
            totalItems: state.totalItems - item.quantity,
            totalValue: state.totalValue - (item.productPrice * item.quantity),
          }
        })
      },

      clearCart: () => set({
        items: [],
        totalItems: 0,
        totalValue: 0,
      }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalValue: state.totalValue,
      }),
    }
  )
)
