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
  orderNo: string | null
  buyerId: number
  sellerId: number
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentImage?: string
  paymentProofUrl?: string // New field from backend
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: string
  billingAddress: string
  notes?: string
  sellerName?: string
  sellerLogo?: string
  buyerEmail?: string
  buyerName?: string
  userEmail?: string // Alias for buyerEmail
  userName?: string // Alias for buyerName
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
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}

export interface CreateOrderRequest {
  sellerId: number
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
  sellerId: number
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

export interface UploadPaymentImageResponse {
  url: string
  order: Order
}

export const ordersApi = {
  /**
   * Upload payment proof image for an order
   * @param orderId - The order ID
   * @param file - The image file to upload
   * @param onProgress - Optional progress callback
   * @returns Updated order with payment image URL
   */
  uploadPaymentImage: async (
    orderId: string,
    file: File,
    onProgress?: (progress: {
      loaded: number
      total: number
      percentage: number
    }) => void
  ): Promise<Order> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<{ data: Order }>>(
      `/orders/${orderId}/payment-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            })
          }
        },
      }
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  // Order CRUD operations
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<{ data: Order }>>(
      '/orders',
      data
    )
    // Backend returns { message, data: order }, so response.data.data.data is the actual order
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  createOrderFromCart: async (
    data: CreateOrderFromCartRequest
  ): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<{ data: Order }>>(
      '/orders/from-cart',
      data
    )
    // Backend returns { message, data: order }, so response.data.data.data is the actual order
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<{ data: Order }>>(
      `/orders/${id}`
    )
    // Backend returns { message, data: order }, so response.data.data.data is the actual order
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  getOrders: async (filters?: {
    page?: number
    pageSize?: number
  }): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >('/orders', {
      params: {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
      },
    })
    // Backend returns { message, data: result }, so response.data.data.data is the actual result
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  getUserOrders: async (filters?: {
    page?: number
    pageSize?: number
  }): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >('/orders/my', {
      params: {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
      },
    })
    // Backend returns { message, data: result }, so response.data.data.data is the actual result
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  getSellerOrdersById: async (
    sellerId: string,
    filters?: { page?: number; pageSize?: number }
  ): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >(`/orders/seller/${sellerId}`, {
      params: {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
      },
    })
    // Backend returns { message, data: result }, so response.data.data.data is the actual result
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  getSellerOrders: async (filters?: {
    page?: number
    pageSize?: number
    status?: string
    paymentStatus?: string
  }): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >('/orders/seller/my', {
      params: {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        status: filters?.status,
        paymentStatus: filters?.paymentStatus,
      },
    })
    // Backend returns { success, data: { data: { items, total, page, pageSize, totalPages } }, code, message }
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  listOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >('/orders', {
      params: { page, pageSize },
    })
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  listUserOrders: async (
    page = 1,
    pageSize = 10
  ): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >('/orders/my', {
      params: { page, pageSize },
    })
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  listSellerOrders: async (
    sellerId: string,
    page = 1,
    pageSize = 10
  ): Promise<OrderListResponse> => {
    const response = await apiClient.get<
      ApiResponse<{ data: OrderListResponse }>
    >(`/orders/seller/${sellerId}`, {
      params: { page, pageSize },
    })
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderListResponse }).data
      : (result as unknown as OrderListResponse)
  },

  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<{ data: Order }>>(
      `/orders/${id}`,
      data
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<{ data: Order }>>(
      `/orders/${id}/status`,
      {},
      { params: { status } }
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  confirmOrder: async (id: string, sellerNotes?: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<{ data: Order }>>(
      `/orders/${id}/confirm`,
      {},
      { params: sellerNotes ? { sellerNotes } : {} }
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  updateOrderPaymentStatus: async (
    id: string,
    paymentStatus: string,
    paymentProofUrl?: string
  ): Promise<Order> => {
    const body: { paymentStatus: string; paymentProofUrl?: string } = {
      paymentStatus,
    }
    if (paymentProofUrl) {
      body.paymentProofUrl = paymentProofUrl
    }
    const response = await apiClient.patch<ApiResponse<{ data: Order }>>(
      `/orders/${id}/payment-status`,
      body
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: Order }).data
      : (result as unknown as Order)
  },

  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`)
  },

  // Statistics
  getOrderStats: async (): Promise<OrderStats> => {
    const response =
      await apiClient.get<ApiResponse<{ data: OrderStats }>>('/orders/stats')
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderStats }).data
      : (result as unknown as OrderStats)
  },

  getSellerOrderStats: async (sellerId: string): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<{ data: OrderStats }>>(
      `/orders/stats/seller/${sellerId}`
    )
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderStats }).data
      : (result as unknown as OrderStats)
  },

  getUserOrderStats: async (): Promise<OrderStats> => {
    const response =
      await apiClient.get<ApiResponse<{ data: OrderStats }>>('/orders/stats/my')
    const result = response.data.data
    return 'data' in result
      ? (result as { data: OrderStats }).data
      : (result as unknown as OrderStats)
  },
}
