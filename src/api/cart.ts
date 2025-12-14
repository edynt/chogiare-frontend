import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  price: number
  productName: string
  productImage: string
  productPrice: number
  productStock: number
  productStatus: string
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId: number
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface CartStats {
  totalItems: number
  totalValue: number
  uniqueProducts: number
}

export interface AddCartItemRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemQuantityRequest {
  quantity: number
}

export const cartApi = {
  // Cart operations
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart')
    return response.data.data
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart')
  },

  getCartStats: async (): Promise<CartStats> => {
    const response = await apiClient.get<ApiResponse<CartStats>>('/cart/stats')
    return response.data.data
  },

  // Cart item operations
  addItem: async (data: AddCartItemRequest): Promise<CartItem> => {
    const response = await apiClient.post<ApiResponse<CartItem>>('/cart/items', data)
    return response.data.data
  },

  updateItemQuantity: async (itemId: string, data: UpdateCartItemQuantityRequest): Promise<CartItem> => {
    const response = await apiClient.patch<ApiResponse<CartItem>>(`/cart/items/${itemId}`, data)
    return response.data.data
  },

  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`)
  },
}
