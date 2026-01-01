import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: number
  storeId: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: string
  billingAddress: string
  notes?: string
  storeName?: string
  storeLogo?: string
  userEmail?: string
  userName?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderListResponse {
  items: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}

export interface CreateOrderRequest {
  storeId: number
  paymentMethod?: string
  shippingAddressId?: number
  billingAddressId?: number
  notes?: string
  items: CreateOrderItemRequest[]
}

export interface CreateOrderItemRequest {
  productId: number
  quantity: number
}

export interface CreateOrderFromCartRequest {
  storeId: number
  paymentMethod?: string
  shippingAddressId?: number
  billingAddressId?: number
  notes?: string
}

export interface UpdateOrderRequest {
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  shippingAddressId?: number
  billingAddressId?: number
  notes?: string
}

export const ordersApi = {
  // Order CRUD operations
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data)
    return response.data.data
  },

  createOrderFromCart: async (data: CreateOrderFromCartRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders/from-cart', data)
    return response.data.data
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data.data
  },

  getOrders: async (filters?: { page?: number; pageSize?: number }): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/orders', {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  getUserOrders: async (filters?: { page?: number; pageSize?: number }): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/orders/my', {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  getStoreOrders: async (storeId: string, filters?: { page?: number; pageSize?: number }): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>(`/orders/store/${storeId}`, {
      params: { 
        page: filters?.page || 1, 
        pageSize: filters?.pageSize || 10 
      }
    })
    return response.data.data
  },

  listOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/orders', {
      params: { page, pageSize }
    })
    return response.data.data
  },

  listUserOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/orders/my', {
      params: { page, pageSize }
    })
    return response.data.data
  },

  listStoreOrders: async (storeId: string, page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>(`/orders/store/${storeId}`, {
      params: { page, pageSize }
    })
    return response.data.data
  },

  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}`, data)
    return response.data.data
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      {},
      { params: { status } }
    )
    return response.data.data
  },

  confirmOrder: async (id: string, sellerNotes?: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/confirm`,
      {},
      { params: sellerNotes ? { sellerNotes } : {} }
    )
    return response.data.data
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/payment-status`,
      {},
      { params: { paymentStatus } }
    )
    return response.data.data
  },

  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`)
  },

  // Statistics
  getOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/orders/stats')
    return response.data.data
  },

  getStoreOrderStats: async (storeId: string): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>(`/orders/stats/store/${storeId}`)
    return response.data.data
  },

  getUserOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/orders/stats/my')
    return response.data.data
  },
}
