import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sellerApi } from '../seller'
import type {
  SellerDashboardStats,
  RevenueStats,
  CustomerStats,
} from '../seller'
import * as axios from '@shared/api/axios'

// Mock the axios client
vi.mock('@shared/api/axios', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
  return {
    apiClient: mockApiClient,
  }
})

describe('Seller API', () => {
  const mockApiClient = axios.apiClient as Record<string, ReturnType<typeof vi.fn>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Module Exports', () => {
    it('should export sellerApi object', () => {
      expect(sellerApi).toBeDefined()
      expect(typeof sellerApi).toBe('object')
    })

    it('should export all required dashboard methods', () => {
      expect(sellerApi.getDashboardStats).toBeDefined()
      expect(typeof sellerApi.getDashboardStats).toBe('function')
    })

    it('should export all product management methods', () => {
      expect(sellerApi.getMyProducts).toBeDefined()
      expect(sellerApi.getMyProduct).toBeDefined()
      expect(sellerApi.createProduct).toBeDefined()
      expect(sellerApi.updateProduct).toBeDefined()
      expect(sellerApi.deleteProduct).toBeDefined()
      expect(sellerApi.bulkUpdateProducts).toBeDefined()
    })

    it('should export all stock management methods', () => {
      expect(sellerApi.updateStock).toBeDefined()
      expect(sellerApi.getLowStockProducts).toBeDefined()
    })

    it('should export all order management methods', () => {
      expect(sellerApi.getMyOrders).toBeDefined()
      expect(sellerApi.getMyOrder).toBeDefined()
      expect(sellerApi.updateOrderStatus).toBeDefined()
    })

    it('should export all revenue/analytics methods', () => {
      expect(sellerApi.getRevenueStats).toBeDefined()
    })

    it('should export all customer management methods', () => {
      expect(sellerApi.getMyCustomers).toBeDefined()
      expect(sellerApi.getCustomerStats).toBeDefined()
      expect(sellerApi.getCustomerOrders).toBeDefined()
    })

    it('should export all notification methods', () => {
      expect(sellerApi.getMyNotifications).toBeDefined()
      expect(sellerApi.markNotificationAsRead).toBeDefined()
      expect(sellerApi.markAllNotificationsAsRead).toBeDefined()
    })
  })

  describe('Dashboard Stats', () => {
    it('should call /seller/dashboard/stats endpoint', async () => {
      const mockData: SellerDashboardStats = {
        totalProducts: 10,
        activeProducts: 8,
        soldProducts: 2,
        totalRevenue: 1000,
        totalOrders: 5,
        pendingOrders: 1,
        completedOrders: 4,
        totalCustomers: 20,
        lowStockProducts: 2,
        outOfStockProducts: 1,
      }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      const result = await sellerApi.getDashboardStats()

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/dashboard/stats')
      expect(result).toEqual(mockData)
    })
  })

  describe('Products Management', () => {
    it('should call /seller/products with filters', async () => {
      const mockData = {
        data: [],
        pagination: { page: 1, pageSize: 10 },
      }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getMyProducts({ page: 1, search: 'test' })

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/products', {
        params: {
          page: 1,
          search: 'test',
        },
      })
    })

    it('should call /seller/products/:id for single product', async () => {
      const mockProduct = { id: '1', title: 'Test Product' }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockProduct },
      })

      await sellerApi.getMyProduct('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/products/1')
    })

    it('should call /seller/products for creating product', async () => {
      const mockProduct = { id: '1', title: 'New Product' }

      mockApiClient.post.mockResolvedValueOnce({
        data: { data: mockProduct },
      })

      await sellerApi.createProduct({
        title: 'New Product',
        categoryId: 1,
        price: 100,
        stock: 10,
        condition: 'new',
      })

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/seller/products',
        expect.any(Object)
      )
    })

    it('should call /seller/products/:id for updating product', async () => {
      const mockProduct = { id: '1', title: 'Updated Product' }

      mockApiClient.patch.mockResolvedValueOnce({
        data: { data: mockProduct },
      })

      await sellerApi.updateProduct('1', { title: 'Updated Product' })

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/products/1',
        expect.any(Object)
      )
    })

    it('should call /seller/products/:id for deleting product', async () => {
      mockApiClient.delete.mockResolvedValueOnce({})

      await sellerApi.deleteProduct('1')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/seller/products/1')
    })

    it('should call /seller/products/bulk for bulk updates', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }]

      mockApiClient.patch.mockResolvedValueOnce({
        data: { data: mockProducts },
      })

      await sellerApi.bulkUpdateProducts([{ id: '1', data: {} }])

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/products/bulk',
        expect.any(Object)
      )
    })
  })

  describe('Stock Management', () => {
    it('should call /seller/products/:id/stock for updating stock', async () => {
      const mockProduct = { id: '1', stock: 50 }

      mockApiClient.patch.mockResolvedValueOnce({
        data: { data: mockProduct },
      })

      await sellerApi.updateStock('1', 50)

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/products/1/stock',
        { stock: 50 }
      )
    })

    it('should call /seller/products/low-stock endpoint', async () => {
      const mockProducts = [{ id: '1', stock: 5 }]

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockProducts },
      })

      await sellerApi.getLowStockProducts(10)

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/seller/products/low-stock',
        {
          params: { threshold: 10 },
        }
      )
    })
  })

  describe('Orders Management', () => {
    it('should call /seller/orders endpoint', async () => {
      const mockData = { data: [], pagination: { page: 1 } }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getMyOrders({ page: 1 })

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/orders', {
        params: { page: 1 },
      })
    })

    it('should call /seller/orders/:id for single order', async () => {
      const mockOrder = { id: '1', status: 'pending' }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockOrder },
      })

      await sellerApi.getMyOrder('1')

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/orders/1')
    })

    it('should call /seller/orders/:id/status for updating order status', async () => {
      const mockOrder = { id: '1', status: 'shipped' }

      mockApiClient.patch.mockResolvedValueOnce({
        data: { data: mockOrder },
      })

      await sellerApi.updateOrderStatus('1', 'shipped')

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/orders/1/status',
        {
          status: 'shipped',
        }
      )
    })
  })

  describe('Revenue & Analytics', () => {
    it('should call /seller/revenue endpoint', async () => {
      const mockData: RevenueStats = {
        daily: [],
        weekly: [],
        monthly: [],
        total: 1000,
        averageOrderValue: 100,
      }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getRevenueStats({ period: 'daily' })

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/revenue', {
        params: { period: 'daily' },
      })
    })
  })

  describe('Customer Management', () => {
    it('should call /seller/customers endpoint', async () => {
      const mockData = { data: [], pagination: { page: 1 } }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getMyCustomers({ page: 1 })

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/customers', {
        params: { page: 1 },
      })
    })

    it('should call /seller/customers/stats endpoint', async () => {
      const mockData: CustomerStats = {
        totalCustomers: 10,
        activeCustomers: 7,
        newCustomers: 2,
        returningCustomers: 8,
        topCustomers: [],
      }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getCustomerStats()

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/customers/stats')
    })

    it('should call /seller/customers/:id/orders endpoint', async () => {
      const mockData = { data: [], pagination: { page: 1 } }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getCustomerOrders('1', { page: 1 })

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/seller/customers/1/orders',
        {
          params: { page: 1 },
        }
      )
    })
  })

  describe('Notifications', () => {
    it('should call /seller/notifications endpoint', async () => {
      const mockData = { data: [], pagination: { page: 1 } }

      mockApiClient.get.mockResolvedValueOnce({
        data: { data: mockData },
      })

      await sellerApi.getMyNotifications({ page: 1 })

      expect(mockApiClient.get).toHaveBeenCalledWith('/seller/notifications', {
        params: { page: 1 },
      })
    })

    it('should call /seller/notifications/:id/read endpoint', async () => {
      mockApiClient.patch.mockResolvedValueOnce({})

      await sellerApi.markNotificationAsRead('1')

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/notifications/1/read'
      )
    })

    it('should call /seller/notifications/read-all endpoint', async () => {
      mockApiClient.patch.mockResolvedValueOnce({})

      await sellerApi.markAllNotificationsAsRead()

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/seller/notifications/read-all'
      )
    })
  })

  describe('Endpoint URL Validation', () => {
    it('should use /seller/* endpoints instead of /products/*', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: {} } })
      mockApiClient.post.mockResolvedValue({ data: { data: {} } })
      mockApiClient.patch.mockResolvedValue({ data: { data: {} } })
      mockApiClient.delete.mockResolvedValue({})

      // Test that all endpoints start with /seller/
      await sellerApi.getDashboardStats()
      await sellerApi.getMyProducts()
      await sellerApi.createProduct({
        title: '',
        categoryId: 1,
        price: 0,
        stock: 0,
        condition: '',
      })
      await sellerApi.updateProduct('1', {})
      await sellerApi.deleteProduct('1')
      await sellerApi.getMyOrders()
      await sellerApi.getRevenueStats()
      await sellerApi.getMyCustomers()

      const calls = [
        ...mockApiClient.get.mock.calls,
        ...mockApiClient.post.mock.calls,
        ...mockApiClient.patch.mock.calls,
        ...mockApiClient.delete.mock.calls,
      ]

      calls.forEach(call => {
        const endpoint = call[0]
        expect(endpoint).toMatch(/^\/seller\//)
      })
    })
  })
})
