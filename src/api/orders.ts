import { apiClient } from './axios'
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
  orders: Order[]
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
  storeId: string
  paymentMethod: string
  shippingAddress: string
  billingAddress: string
  notes?: string
  items: CreateOrderItemRequest[]
}

export interface CreateOrderItemRequest {
  productId: string
  quantity: number
}

export interface UpdateOrderRequest {
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  shippingAddress?: string
  billingAddress?: string
  notes?: string
}

export const ordersApi = {
  // Order CRUD operations
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/v1/orders', data)
    return response.data.data
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/v1/orders/${id}`)
    return response.data.data
  },

  listOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/v1/orders', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  listUserOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>('/v1/orders/my', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  listStoreOrders: async (storeId: string, page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<ApiResponse<OrderListResponse>>(`/v1/orders/store/${storeId}`, {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },

  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/v1/orders/${id}`, data)
    return response.data.data
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/v1/orders/${id}/status`, { status })
    return response.data.data
  },

  updateOrderPaymentStatus: async (id: string, paymentStatus: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/v1/orders/${id}/payment-status`, { paymentStatus })
    return response.data.data
  },

  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/orders/${id}`)
  },

  // Statistics
  getOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/v1/orders/stats')
    return response.data.data
  },

  getStoreOrderStats: async (storeId: string): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>(`/v1/orders/stats/store/${storeId}`)
    return response.data.data
  },

  getUserOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/v1/orders/stats/my')
    return response.data.data
  },
}
