import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

const handleApiError = <T>(error: unknown, defaultValue: T): T => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } }
        const status = axiosError.response?.status
        if (status === 403 || status === 404) {
            console.warn(`API endpoint not available: ${status}`)
            return defaultValue
        }
    }
    throw error
}

export interface AdminDashboardStats {
    totalUsers: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        sellers: number
        buyers: number
    }
    totalProducts: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        active: number
        pending: number
    }
    totalOrders: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        completed: number
        processing: number
    }
    revenue: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        commission: number
        profit: number
    }
}

export interface RecentActivity {
    id: string
    type: string
    title: string
    description: string
    time: string
    status: 'success' | 'warning' | 'error' | 'pending'
}

export interface TopSeller {
    name: string
    orders: number
    revenue: number
    rating: number
}

export interface AnalyticsOverviewStats {
    totalViews: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
    }
    newUsers: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
    }
    orders: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        conversionRate: number
    }
    revenue: {
        value: number
        change: number
        changeType: 'positive' | 'negative'
        profit: number
    }
}

export interface AnalyticsTopProduct {
    name: string
    views: number
    orders: number
    revenue: number
    growth: string
}

export interface CategoryStat {
    name: string
    products: number
    orders: number
    revenue: number
    percentage: number
}

export interface AdminUser {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    status: string
    verified: boolean
    joinDate: string
    lastActive: string
    totalOrders: number
    totalRevenue: number
    rating: number
    location?: string
    avatar?: string
}

export interface AdminUserListResponse {
    items: AdminUser[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface AdminUserStats {
    active: number
    pending: number
    suspended: number
    sellers: number
    verified: number
}

export interface QueryAdminUsersParams {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    role?: string
}

export interface AdminCategory {
    id: number
    name: string
    slug: string
    description: string | null
    image: string | null
    parentId: number | null
    productCount: number
    isActive: boolean
    displayOrder: number
    metadata: Record<string, any>
    createdAt: string
    updatedAt: string
    parent?: {
        id: number
        name: string
        slug: string
    } | null
    children?: {
        id: number
        name: string
        slug: string
        productCount: number
        isActive: boolean
    }[]
}

export interface AdminCategoryListResponse {
    items: AdminCategory[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CreateCategoryData {
    name: string
    slug?: string
    description?: string
    image?: string
    parentId?: number | null
    isActive?: boolean
    displayOrder?: number
}

export interface QueryAdminCategoriesParams {
    page?: number
    pageSize?: number
    parentId?: number | null
    isActive?: boolean
    includeChildren?: boolean
}

export interface AdminOrderItem {
    id: string
    orderId: string
    productId: string
    productName: string
    productImage: string
    price: number
    quantity: number
    subtotal: number
}

export interface AdminOrder {
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
    userPhone?: string
    sellerName?: string
    sellerEmail?: string
    sellerPhone?: string
    items: AdminOrderItem[]
    createdAt: string
    updatedAt: string
    completedAt?: string
    trackingNumber?: string
    commission?: number
    netAmount?: number
}

export interface AdminOrderListResponse {
    items: AdminOrder[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface AdminOrderStats {
    totalOrders: number
    totalRevenue: number
    totalCommission: number
    pendingOrders: number
    processingOrders: number
    shippedOrders: number
    completedOrders: number
    cancelledOrders: number
}

export interface QueryAdminOrdersParams {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    paymentStatus?: string
    dateFilter?: string
}

export interface AdminTransaction {
    id: number
    userId?: number
    orderId?: string
    type: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    paymentMethod: string | null
    reference: string | null
    description: string | null
    createdAt: string
    updatedAt: string
    completedAt?: string
    fee?: number
    netAmount?: number
    userName?: string
    userEmail?: string
}

export interface AdminTransactionListResponse {
    items: AdminTransaction[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface AdminPaymentStats {
    totalTransactions: number
    totalAmount: number
    pendingTransactions: number
    completedTransactions: number
    failedTransactions: number
    totalCommission: number
}

export interface QueryAdminTransactionsParams {
    page?: number
    pageSize?: number
    type?: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
    status?: 'pending' | 'completed' | 'failed' | 'cancelled'
    search?: string
    dateFilter?: string
}

// Product Moderation Types
export interface ModerationProduct {
    id: string
    title: string
    seller: string
    sellerId: string
    category: string
    price: number
    originalPrice?: number
    status: 'pending' | 'approved' | 'rejected' | 'draft'
    priority: 'high' | 'medium' | 'low'
    submittedAt: string
    reviewedAt?: string
    reviewer?: string
    images: string[]
    description: string
    violations: string[]
    aiScore: number
    manualReview: boolean
    tags: string[]
    stock: number
    views: number
    sales: number
}

export interface ModerationProductListResponse {
    items: ModerationProduct[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface ModerationStats {
    pending: number
    approved: number
    rejected: number
    avgAiScore: number
}

export interface QueryModerationProductsParams {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    category?: string
    priority?: string
}

// Service Package Types
export interface ServicePackage {
    id: number
    name: string
    price: number
    duration: string
    features: string[]
    limitations: string[]
    isActive: boolean
    subscribers: number
    revenue: number
}

export interface PackageStats {
    totalPackages: number
    activePackages: number
    totalSubscribers: number
    monthlyRevenue: number
    popularPackage: string | null
}

export interface CreatePackageData {
    name: string
    price: number
    duration: string
    features: string[]
    limitations: string[]
    isActive: boolean
}

// Content Management Types
export interface ContentItem {
    id: string
    title: string
    type: 'policy' | 'guide' | 'faq' | 'blog'
    status: 'published' | 'draft' | 'archived'
    author: string
    createdAt: string
    updatedAt: string
    views: number
    slug: string
    content: string
    tags: string[]
    isPublic: boolean
}

export interface ContentListResponse {
    items: ContentItem[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface ContentStats {
    total: number
    published: number
    draft: number
    totalViews: number
}

export interface CreateContentData {
    title: string
    type: 'policy' | 'guide' | 'faq' | 'blog'
    status: 'published' | 'draft' | 'archived'
    content: string
    slug: string
    tags: string[]
    isPublic: boolean
}

export interface QueryContentParams {
    page?: number
    pageSize?: number
    search?: string
    type?: string
    status?: string
}

// Support Ticket Types
export interface TicketCustomer {
    name: string
    email: string
    phone: string
}

export interface TicketMessage {
    id: string
    sender: string
    message: string
    isAdmin: boolean
    createdAt: string
}

export interface SupportTicket {
    id: string
    title: string
    category: 'account' | 'product' | 'payment' | 'technical' | 'report' | 'question'
    priority: 'urgent' | 'high' | 'medium' | 'low'
    status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
    customer: TicketCustomer
    assignedTo: string
    createdAt: string
    updatedAt: string
    lastReply: string
    replies: number
    tags: string[]
    description: string
    messages?: TicketMessage[]
}

export interface TicketListResponse {
    items: SupportTicket[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface TicketStats {
    total: number
    open: number
    inProgress: number
    resolved: number
    closed: number
}

export interface TicketReply {
    id: string
    ticketId: string
    message: string
    author: string
    createdAt: string
}

export interface QueryTicketsParams {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    priority?: string
    category?: string
}

// Reports Types
export interface ReportsOverview {
    totalViews: { value: number; change: number; changeType: 'positive' | 'negative' }
    newUsers: { value: number; change: number; changeType: 'positive' | 'negative' }
    orders: { value: number; change: number; changeType: 'positive' | 'negative' }
    revenue: { value: number; change: number; changeType: 'positive' | 'negative' }
}

export interface RevenueChartData {
    date: string
    revenue: number
    orders: number
}

export interface CategoryDistribution {
    name: string
    value: number
    percentage: number
}

export interface TopProductReport {
    id: string
    name: string
    category: string
    sales: number
    revenue: number
    views: number
}

export interface TopSellerReport {
    id: string
    name: string
    email: string
    products: number
    orders: number
    revenue: number
    rating: number
}

export interface DailyStat {
    date: string
    visitors: number
    orders: number
    revenue: number
    newUsers: number
}

export interface QueryReportsParams {
    timeRange?: '7d' | '30d' | '90d' | '1y'
    dateFrom?: string
    dateTo?: string
}

export const adminApi = {
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalUsers: { value: 0, change: 0, changeType: 'positive' as const, sellers: 0, buyers: 0 },
                totalProducts: { value: 0, change: 0, changeType: 'positive' as const, active: 0, pending: 0 },
                totalOrders: { value: 0, change: 0, changeType: 'positive' as const, completed: 0, processing: 0 },
                revenue: { value: 0, change: 0, changeType: 'positive' as const, commission: 0, profit: 0 },
            })
        }
    },

    getRecentActivities: async (limit?: number): Promise<RecentActivity[]> => {
        try {
            const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/admin/dashboard/activities', {
                params: { limit },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getTopSellers: async (limit?: number): Promise<TopSeller[]> => {
        try {
            const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/dashboard/top-sellers', {
                params: { limit },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getAnalyticsOverview: async (timeRange?: string): Promise<AnalyticsOverviewStats> => {
        try {
            const response = await apiClient.get<ApiResponse<AnalyticsOverviewStats>>('/admin/analytics/overview', {
                params: { timeRange },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalViews: { value: 0, change: 0, changeType: 'positive' as const },
                newUsers: { value: 0, change: 0, changeType: 'positive' as const },
                orders: { value: 0, change: 0, changeType: 'positive' as const, conversionRate: 0 },
                revenue: { value: 0, change: 0, changeType: 'positive' as const, profit: 0 },
            })
        }
    },

    getAnalyticsTopProducts: async (limit?: number): Promise<AnalyticsTopProduct[]> => {
        try {
            const response = await apiClient.get<ApiResponse<AnalyticsTopProduct[]>>('/admin/analytics/top-products', {
                params: { limit },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getAnalyticsTopSellers: async (limit?: number): Promise<TopSeller[]> => {
        try {
            const response = await apiClient.get<ApiResponse<TopSeller[]>>('/admin/analytics/top-sellers', {
                params: { limit },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getCategoryStats: async (): Promise<CategoryStat[]> => {
        try {
            const response = await apiClient.get<ApiResponse<CategoryStat[]>>('/admin/analytics/category-stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getUsers: async (params?: QueryAdminUsersParams): Promise<AdminUserListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminUserListResponse>>('/admin/users', {
                params,
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getUser: async (id: string): Promise<AdminUser> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${id}`)
            return response.data.data
        } catch (error) {
            throw error
        }
    },

    getUserStats: async (): Promise<AdminUserStats> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminUserStats>>('/admin/users/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                active: 0,
                pending: 0,
                suspended: 0,
                sellers: 0,
                verified: 0,
            })
        }
    },

    approveUser: async (id: string): Promise<AdminUser> => {
        const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/approve`)
        return response.data.data
    },

    suspendUser: async (id: string): Promise<AdminUser> => {
        const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/suspend`)
        return response.data.data
    },

    activateUser: async (id: string): Promise<AdminUser> => {
        const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/activate`)
        return response.data.data
    },

    bulkApproveUsers: async (userIds: string[]): Promise<{ count: number }> => {
        const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/users/bulk-approve', {
            userIds,
        })
        return response.data.data
    },

    bulkSuspendUsers: async (userIds: string[]): Promise<{ count: number }> => {
        const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/users/bulk-suspend', {
            userIds,
        })
        return response.data.data
    },

    getOrders: async (params?: QueryAdminOrdersParams): Promise<AdminOrderListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminOrderListResponse>>('/admin/orders', {
                params,
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getOrder: async (id: string): Promise<AdminOrder> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`)
            return response.data.data
        } catch (error) {
            throw error
        }
    },

    getOrderStats: async (): Promise<AdminOrderStats> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminOrderStats>>('/admin/orders/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalOrders: 0,
                totalRevenue: 0,
                totalCommission: 0,
                pendingOrders: 0,
                processingOrders: 0,
                shippedOrders: 0,
                completedOrders: 0,
                cancelledOrders: 0,
            })
        }
    },

    updateOrderStatus: async (id: string, status: string): Promise<AdminOrder> => {
        const response = await apiClient.patch<ApiResponse<AdminOrder>>(
            `/admin/orders/${id}/status`,
            {},
            { params: { status } }
        )
        return response.data.data
    },

    updateOrderPaymentStatus: async (id: string, paymentStatus: string): Promise<AdminOrder> => {
        const response = await apiClient.patch<ApiResponse<AdminOrder>>(
            `/admin/orders/${id}/payment-status`,
            {},
            { params: { paymentStatus } }
        )
        return response.data.data
    },

    getTransactions: async (params?: QueryAdminTransactionsParams): Promise<AdminTransactionListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminTransactionListResponse>>('/admin/payments/transactions', {
                params,
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getTransaction: async (id: number): Promise<AdminTransaction> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminTransaction>>(`/admin/payments/transactions/${id}`)
            return response.data.data
        } catch (error) {
            throw error
        }
    },

    getPaymentStats: async (): Promise<AdminPaymentStats> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminPaymentStats>>('/admin/payments/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalTransactions: 0,
                totalAmount: 0,
                pendingTransactions: 0,
                completedTransactions: 0,
                failedTransactions: 0,
                totalCommission: 0,
            })
        }
    },

    // Product Moderation APIs
    getModerationProducts: async (params?: QueryModerationProductsParams): Promise<ModerationProductListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<ModerationProductListResponse>>('/admin/moderation/products', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getModerationStats: async (): Promise<ModerationStats> => {
        try {
            const response = await apiClient.get<ApiResponse<ModerationStats>>('/admin/moderation/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                pending: 0,
                approved: 0,
                rejected: 0,
                avgAiScore: 0,
            })
        }
    },

    approveProduct: async (id: string): Promise<ModerationProduct> => {
        const response = await apiClient.put<ApiResponse<ModerationProduct>>(`/admin/moderation/products/${id}/approve`)
        return response.data.data
    },

    rejectProduct: async (id: string, reason?: string): Promise<ModerationProduct> => {
        const response = await apiClient.put<ApiResponse<ModerationProduct>>(`/admin/moderation/products/${id}/reject`, { reason })
        return response.data.data
    },

    bulkApproveProducts: async (productIds: string[]): Promise<{ count: number }> => {
        const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/moderation/products/bulk-approve', { productIds })
        return response.data.data
    },

    bulkRejectProducts: async (productIds: string[], reason?: string): Promise<{ count: number }> => {
        const response = await apiClient.post<ApiResponse<{ count: number }>>('/admin/moderation/products/bulk-reject', { productIds, reason })
        return response.data.data
    },

    // Service Packages APIs
    getPackages: async (): Promise<ServicePackage[]> => {
        try {
            const response = await apiClient.get<ApiResponse<ServicePackage[]>>('/admin/packages')
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getPackageStats: async (): Promise<PackageStats> => {
        try {
            const response = await apiClient.get<ApiResponse<PackageStats>>('/admin/packages/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalPackages: 0,
                activePackages: 0,
                totalSubscribers: 0,
                monthlyRevenue: 0,
                popularPackage: null,
            })
        }
    },

    createPackage: async (data: CreatePackageData): Promise<ServicePackage> => {
        const response = await apiClient.post<ApiResponse<ServicePackage>>('/admin/packages', data)
        return response.data.data
    },

    updatePackage: async (id: number, data: Partial<CreatePackageData>): Promise<ServicePackage> => {
        const response = await apiClient.put<ApiResponse<ServicePackage>>(`/admin/packages/${id}`, data)
        return response.data.data
    },

    deletePackage: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/packages/${id}`)
    },

    togglePackageStatus: async (id: number): Promise<ServicePackage> => {
        const response = await apiClient.put<ApiResponse<ServicePackage>>(`/admin/packages/${id}/toggle-status`)
        return response.data.data
    },

    // Content Management APIs
    getContents: async (params?: QueryContentParams): Promise<ContentListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<ContentListResponse>>('/admin/contents', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getContentStats: async (): Promise<ContentStats> => {
        try {
            const response = await apiClient.get<ApiResponse<ContentStats>>('/admin/contents/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                total: 0,
                published: 0,
                draft: 0,
                totalViews: 0,
            })
        }
    },

    createContent: async (data: CreateContentData): Promise<ContentItem> => {
        const response = await apiClient.post<ApiResponse<ContentItem>>('/admin/contents', data)
        return response.data.data
    },

    updateContent: async (id: string, data: Partial<CreateContentData>): Promise<ContentItem> => {
        const response = await apiClient.put<ApiResponse<ContentItem>>(`/admin/contents/${id}`, data)
        return response.data.data
    },

    deleteContent: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/contents/${id}`)
    },

    publishContent: async (id: string): Promise<ContentItem> => {
        const response = await apiClient.put<ApiResponse<ContentItem>>(`/admin/contents/${id}/publish`)
        return response.data.data
    },

    // Support Tickets APIs
    getTickets: async (params?: QueryTicketsParams): Promise<TicketListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<TicketListResponse>>('/admin/tickets', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getTicket: async (id: string): Promise<SupportTicket> => {
        const response = await apiClient.get<ApiResponse<SupportTicket>>(`/admin/tickets/${id}`)
        return response.data.data
    },

    getTicketStats: async (): Promise<TicketStats> => {
        try {
            const response = await apiClient.get<ApiResponse<TicketStats>>('/admin/tickets/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                total: 0,
                open: 0,
                inProgress: 0,
                resolved: 0,
                closed: 0,
            })
        }
    },

    updateTicketStatus: async (id: string, status: string): Promise<SupportTicket> => {
        const response = await apiClient.patch<ApiResponse<SupportTicket>>(`/admin/tickets/${id}/status`, { status })
        return response.data.data
    },

    assignTicket: async (id: string, assignedTo: string): Promise<SupportTicket> => {
        const response = await apiClient.patch<ApiResponse<SupportTicket>>(`/admin/tickets/${id}/assign`, { assignedTo })
        return response.data.data
    },

    replyToTicket: async (id: string, message: string): Promise<TicketReply> => {
        const response = await apiClient.post<ApiResponse<TicketReply>>(`/admin/tickets/${id}/replies`, { message })
        return response.data.data
    },

    // Reports APIs
    getReportsOverview: async (params?: QueryReportsParams): Promise<ReportsOverview> => {
        try {
            const response = await apiClient.get<ApiResponse<ReportsOverview>>('/admin/reports/overview', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                totalViews: { value: 0, change: 0, changeType: 'positive' as const },
                newUsers: { value: 0, change: 0, changeType: 'positive' as const },
                orders: { value: 0, change: 0, changeType: 'positive' as const },
                revenue: { value: 0, change: 0, changeType: 'positive' as const },
            })
        }
    },

    getRevenueChart: async (params?: QueryReportsParams): Promise<RevenueChartData[]> => {
        try {
            const response = await apiClient.get<ApiResponse<RevenueChartData[]>>('/admin/reports/revenue-chart', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getCategoryDistribution: async (): Promise<CategoryDistribution[]> => {
        try {
            const response = await apiClient.get<ApiResponse<CategoryDistribution[]>>('/admin/reports/category-distribution')
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getTopProducts: async (params?: { limit?: number; timeRange?: string }): Promise<TopProductReport[]> => {
        try {
            const response = await apiClient.get<ApiResponse<TopProductReport[]>>('/admin/reports/top-products', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getTopSellersReport: async (params?: { limit?: number; timeRange?: string }): Promise<TopSellerReport[]> => {
        try {
            const response = await apiClient.get<ApiResponse<TopSellerReport[]>>('/admin/reports/top-sellers', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    getDailyStats: async (params?: QueryReportsParams): Promise<DailyStat[]> => {
        try {
            const response = await apiClient.get<ApiResponse<DailyStat[]>>('/admin/reports/daily-stats', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    exportReport: async (params?: QueryReportsParams): Promise<Blob> => {
        const response = await apiClient.get<Blob>('/admin/reports/export', {
            params,
            responseType: 'blob',
        })
        return response.data
    },

    // Notifications APIs
    getNotifications: async (params?: QueryNotificationsParams): Promise<NotificationListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<NotificationListResponse>>('/admin/notifications', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    getNotificationStats: async (): Promise<NotificationStats> => {
        try {
            const response = await apiClient.get<ApiResponse<NotificationStats>>('/admin/notifications/stats')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                total: 0,
                sent: 0,
                delivered: 0,
                opened: 0,
                clicked: 0,
            })
        }
    },

    getNotificationTemplates: async (): Promise<NotificationTemplate[]> => {
        try {
            const response = await apiClient.get<ApiResponse<NotificationTemplate[]>>('/admin/notifications/templates')
            return response.data.data
        } catch (error) {
            return handleApiError(error, [])
        }
    },

    createNotification: async (data: CreateNotificationData): Promise<AdminNotification> => {
        const response = await apiClient.post<ApiResponse<AdminNotification>>('/admin/notifications', data)
        return response.data.data
    },

    sendNotification: async (id: string): Promise<AdminNotification> => {
        const response = await apiClient.post<ApiResponse<AdminNotification>>(`/admin/notifications/${id}/send`)
        return response.data.data
    },

    // Header Notifications APIs
    getHeaderNotifications: async (limit?: number): Promise<AdminHeaderNotificationsResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminHeaderNotificationsResponse>>('/admin/dashboard/header-notifications', {
                params: { limit },
            })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                unreadCount: 0,
            })
        }
    },

    markHeaderNotificationAsRead: async (id: string): Promise<{ success: boolean; id: string }> => {
        const response = await apiClient.post<ApiResponse<{ success: boolean; id: string }>>(`/admin/dashboard/header-notifications/${id}/read`)
        return response.data.data
    },

    markAllHeaderNotificationsAsRead: async (): Promise<{ success: boolean }> => {
        const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/admin/dashboard/header-notifications/read-all')
        return response.data.data
    },

    // System Settings APIs
    getSystemSettings: async (): Promise<SystemSettings> => {
        try {
            const response = await apiClient.get<ApiResponse<SystemSettings>>('/admin/settings')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                general: {} as GeneralSettings,
                payment: {} as PaymentSettings,
                product: {} as ProductSettings,
                user: {} as UserSettings,
                notification: {} as NotificationSettings,
                security: {} as SecuritySettings,
                seo: {} as SeoSettings,
                email: {} as EmailSettings,
                storage: {} as StorageSettings,
                backup: {} as BackupSettings,
                cache: {} as CacheSettings,
                social: {} as SocialSettings,
                legal: {} as LegalSettings,
            })
        }
    },

    getSettingsByCategory: async <T>(category: string): Promise<T> => {
        const response = await apiClient.get<ApiResponse<T>>(`/admin/settings/${category}`)
        return response.data.data
    },

    updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
        const response = await apiClient.put<ApiResponse<SystemSettings>>('/admin/settings', settings)
        return response.data.data
    },

    updateSettingsByCategory: async <T>(category: string, settings: T): Promise<T> => {
        const response = await apiClient.put<ApiResponse<T>>(`/admin/settings/${category}`, settings)
        return response.data.data
    },

    getSystemHealth: async (): Promise<SystemHealth> => {
        try {
            const response = await apiClient.get<ApiResponse<SystemHealth>>('/admin/settings/health')
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                server: { cpu: 0, memory: 0, disk: 0, status: 'unknown' },
                uptime: '0h 0m',
                version: '1.0.0',
                nodeVersion: 'unknown',
                platform: 'unknown',
                services: { database: 'unknown', cache: 'unknown', storage: 'unknown', email: 'unknown' },
            })
        }
    },

    // Category APIs
    getCategories: async (params?: QueryAdminCategoriesParams): Promise<AdminCategoryListResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<AdminCategoryListResponse>>('/categories', { params })
            return response.data.data
        } catch (error) {
            return handleApiError(error, {
                items: [],
                total: 0,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                totalPages: 0,
            })
        }
    },

    createCategory: async (data: CreateCategoryData): Promise<AdminCategory> => {
        const response = await apiClient.post<ApiResponse<AdminCategory>>('/categories', data)
        return response.data.data
    },

    updateCategory: async (id: number, data: Partial<CreateCategoryData>): Promise<AdminCategory> => {
        const response = await apiClient.patch<ApiResponse<AdminCategory>>(`/categories/${id}`, data)
        return response.data.data
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/categories/${id}`)
    },
}

// Notification types
export interface AdminNotification {
    id: string
    type: 'email' | 'sms' | 'push'
    recipient: string
    subject: string
    content: string
    status: 'pending' | 'sent' | 'delivered' | 'failed'
    sentAt: string | null
    deliveredAt: string | null
    openedAt: string | null
    clickedAt: string | null
    template: string
    createdAt: string
}

export interface NotificationTemplate {
    id: string
    name: string
    type: 'email' | 'sms' | 'push'
    subject: string
    content: string
    variables: string[]
    status: 'active' | 'draft'
    createdAt: string
    updatedAt: string
    usage: number
}

export interface NotificationStats {
    total: number
    sent: number
    delivered: number
    opened: number
    clicked: number
}

export interface NotificationListResponse {
    items: AdminNotification[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface QueryNotificationsParams {
    page?: number
    pageSize?: number
    search?: string
    type?: string
    status?: string
}

export interface CreateNotificationData {
    type: 'email' | 'sms' | 'push'
    recipients: string[]
    subject: string
    content: string
    template?: string
}

// Admin Header Notification Types
export interface AdminHeaderNotification {
    id: string
    title: string
    time: string
    unread: boolean
    type: 'user' | 'product' | 'order'
    link: string
}

export interface AdminHeaderNotificationsResponse {
    items: AdminHeaderNotification[]
    unreadCount: number
}

// System Settings Types
export interface PaymentMethods {
    creditCard: boolean
    momo: boolean
    zalopay: boolean
    vnpay: boolean
    bankTransfer: boolean
    cod: boolean
}

export interface NotificationTemplates {
    welcome: boolean
    orderConfirmation: boolean
    orderShipped: boolean
    orderDelivered: boolean
    passwordReset: boolean
    priceAlert: boolean
    newMessage: boolean
}

export interface SocialLogin {
    facebook: boolean
    google: boolean
    apple: boolean
    zalo: boolean
}

export interface SocialShare {
    facebook: boolean
    twitter: boolean
    pinterest: boolean
    whatsapp: boolean
    zalo: boolean
    copyLink: boolean
}

export interface GeneralSettings {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    supportEmail: string
    supportPhone: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
    maintenanceMode: boolean
    maintenanceMessage: string
    registrationEnabled: boolean
    emailVerification: boolean
    phoneVerification: boolean
}

export interface PaymentSettings {
    defaultCurrency: string
    supportedCurrencies: string[]
    paymentMethods: PaymentMethods
    commissionRate: number
    commissionType: string
    minimumWithdraw: number
    maximumWithdraw: number
    withdrawFee: number
    paymentTimeout: number
    refundPeriod: number
    autoPayoutEnabled: boolean
    payoutSchedule: string
    holdPeriod: number
}

export interface ProductSettings {
    maxProductsPerUser: number
    maxProductsPerFreePlan: number
    maxImagesPerProduct: number
    maxVideoPerProduct: number
    maxFileSize: number
    allowedImageFormats: string[]
    autoApprove: boolean
    moderationRequired: boolean
    aiModeration: boolean
    featuredPrice: number
    promotedPrice: number
    boostPrice: number
    productExpiryDays: number
    autoRenew: boolean
    lowStockThreshold: number
    outOfStockBehavior: string
    allowPreorder: boolean
    allowDigitalProducts: boolean
    requireSKU: boolean
    requireBarcode: boolean
}

export interface UserSettings {
    maxLoginAttempts: number
    lockoutDuration: number
    passwordMinLength: number
    requireUppercase: boolean
    requireNumber: boolean
    requireSpecialChar: boolean
    passwordExpiry: number
    sessionTimeout: number
    rememberMeDuration: number
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    twoFactorAuth: boolean
    twoFactorMethods: string[]
    profileCompletion: boolean
    avatarRequired: boolean
    phoneRequired: boolean
    addressRequired: boolean
    identityVerification: boolean
    sellerVerification: boolean
}

export interface NotificationSettings {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    inAppEnabled: boolean
    emailFrom: string
    emailFromName: string
    smsProvider: string
    pushProvider: string
    notificationQueue: boolean
    batchSize: number
    retryAttempts: number
    retryDelay: number
    digestEnabled: boolean
    digestFrequency: string
    templates: NotificationTemplates
}

export interface SecuritySettings {
    sslEnabled: boolean
    forceHttps: boolean
    corsEnabled: boolean
    corsOrigins: string[]
    rateLimiting: boolean
    rateLimit: number
    rateLimitWindow: number
    apiKeyRequired: boolean
    ipWhitelist: boolean
    whitelistedIPs: string[]
    blacklistedIPs: string[]
    auditLogging: boolean
    auditRetention: number
    dataEncryption: boolean
    encryptionAlgorithm: string
    sessionEncryption: boolean
    cookieSecure: boolean
    cookieSameSite: string
    csrfProtection: boolean
    xssProtection: boolean
    contentSecurityPolicy: boolean
    captchaEnabled: boolean
    captchaProvider: string
    captchaOnLogin: boolean
    captchaOnRegister: boolean
    captchaOnContact: boolean
}

export interface SeoSettings {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage: string
    twitterCard: string
    canonicalUrl: string
    robotsTxt: boolean
    sitemapEnabled: boolean
    sitemapFrequency: string
    googleAnalytics: string
    googleTagManager: string
    facebookPixel: string
    structuredData: boolean
    breadcrumbs: boolean
}

export interface EmailSettings {
    provider: string
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    smtpUser: string
    smtpPassword: string
    sendgridApiKey: string
    mailgunApiKey: string
    mailgunDomain: string
    sesRegion: string
    sesAccessKey: string
    sesSecretKey: string
    testEmail: string
    emailFooter: string
    unsubscribeLink: boolean
}

export interface StorageSettings {
    provider: string
    localPath: string
    s3Bucket: string
    s3Region: string
    s3AccessKey: string
    s3SecretKey: string
    s3Endpoint: string
    cloudinaryCloudName: string
    cloudinaryApiKey: string
    cloudinaryApiSecret: string
    cdnEnabled: boolean
    cdnUrl: string
    imageOptimization: boolean
    imageQuality: number
    thumbnailSizes: number[]
    maxUploadSize: number
    allowedFileTypes: string[]
}

export interface BackupSettings {
    enabled: boolean
    frequency: string
    time: string
    retention: number
    includeDatabase: boolean
    includeUploads: boolean
    includeLogs: boolean
    storageProvider: string
    s3Bucket: string
    googleDriveFolder: string
    encryptBackup: boolean
    notifyOnSuccess: boolean
    notifyOnFailure: boolean
    lastBackup: string | null
    lastBackupSize: string | null
    lastBackupStatus: string | null
}

export interface CacheSettings {
    enabled: boolean
    driver: string
    redisHost: string
    redisPort: number
    redisPassword: string
    memcachedHost: string
    memcachedPort: number
    ttl: number
    prefix: string
    pageCache: boolean
    pageCacheTtl: number
    apiCache: boolean
    apiCacheTtl: number
    queryCache: boolean
    queryCacheTtl: number
    staticCache: boolean
    staticCacheTtl: number
}

export interface SocialSettings {
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    youtubeUrl: string
    tiktokUrl: string
    zaloOA: string
    facebookAppId: string
    facebookAppSecret: string
    googleClientId: string
    googleClientSecret: string
    appleClientId: string
    appleTeamId: string
    socialLogin: SocialLogin
    socialShare: SocialShare
}

export interface LegalSettings {
    termsOfService: string
    privacyPolicy: string
    refundPolicy: string
    shippingPolicy: string
    cookiePolicy: string
    gdprCompliance: boolean
    cookieConsent: boolean
    ageVerification: boolean
    minimumAge: number
    taxEnabled: boolean
    taxRate: number
    taxIncluded: boolean
    invoiceEnabled: boolean
    invoicePrefix: string
}

export interface SystemSettings {
    general: GeneralSettings
    payment: PaymentSettings
    product: ProductSettings
    user: UserSettings
    notification: NotificationSettings
    security: SecuritySettings
    seo: SeoSettings
    email: EmailSettings
    storage: StorageSettings
    backup: BackupSettings
    cache: CacheSettings
    social: SocialSettings
    legal: LegalSettings
}

export interface SystemHealthServer {
    cpu: number
    memory: number
    disk: number
    status: string
}

export interface SystemHealthServices {
    database: string
    cache: string
    storage: string
    email: string
}

export interface SystemHealth {
    server: SystemHealthServer
    uptime: string
    version: string
    nodeVersion: string
    platform: string
    services: SystemHealthServices
}
