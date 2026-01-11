import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    adminApi,
    type QueryAdminUsersParams,
    type QueryAdminOrdersParams,
    type QueryAdminTransactionsParams,
    type QueryModerationProductsParams,
    type QueryContentParams,
    type QueryTicketsParams,
    type QueryReportsParams,
    type QueryNotificationsParams,
    type CreateContentData,
    type CreateNotificationData,
    type QueryAdminCategoriesParams,
    type CreateCategoryData,
    type UpdateUserDto,
    type UpdateUserRolesDto,
    type QueryAdminPackagesParams,
    type CreatePackageData,
} from '@admin/api/admin'

const defaultQueryOptions = {
    retry: (failureCount: number, error: unknown) => {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } }
            const status = axiosError.response?.status
            if (status === 403 || status === 404) {
                return false
            }
        }
        return failureCount < 2
    },
    retryDelay: 1000,
}

export function useAdminDashboardStats() {
    return useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: () => adminApi.getDashboardStats(),
        ...defaultQueryOptions,
    })
}

export function useAdminRecentActivities(limit?: number) {
    return useQuery({
        queryKey: ['admin-recent-activities', limit],
        queryFn: () => adminApi.getRecentActivities(limit),
        ...defaultQueryOptions,
    })
}

export function useAdminTopSellers(limit?: number) {
    return useQuery({
        queryKey: ['admin-top-sellers', limit],
        queryFn: () => adminApi.getTopSellers(limit),
        ...defaultQueryOptions,
    })
}

export function useAnalyticsOverview(timeRange?: string) {
    return useQuery({
        queryKey: ['analytics-overview', timeRange],
        queryFn: () => adminApi.getAnalyticsOverview(timeRange),
        ...defaultQueryOptions,
    })
}

export function useAnalyticsTopProducts(limit?: number) {
    return useQuery({
        queryKey: ['analytics-top-products', limit],
        queryFn: () => adminApi.getAnalyticsTopProducts(limit),
        ...defaultQueryOptions,
    })
}

export function useAnalyticsTopSellers(limit?: number) {
    return useQuery({
        queryKey: ['analytics-top-sellers', limit],
        queryFn: () => adminApi.getAnalyticsTopSellers(limit),
        ...defaultQueryOptions,
    })
}

export function useCategoryStats() {
    return useQuery({
        queryKey: ['category-stats'],
        queryFn: () => adminApi.getCategoryStats(),
        ...defaultQueryOptions,
    })
}

export function useAdminUsers(params?: QueryAdminUsersParams) {
    return useQuery({
        queryKey: ['admin-users', params],
        queryFn: () => adminApi.getUsers(params),
        ...defaultQueryOptions,
    })
}

export function useAdminUser(id: string) {
    return useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => adminApi.getUser(id),
        enabled: !!id,
        ...defaultQueryOptions,
    })
}

export function useAdminUserStats() {
    return useQuery({
        queryKey: ['admin-user-stats'],
        queryFn: () => adminApi.getUserStats(),
        ...defaultQueryOptions,
    })
}

export function useApproveUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.approveUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useSuspendUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.suspendUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useActivateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.activateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useBulkApproveUsers() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userIds: string[]) => adminApi.bulkApproveUsers(userIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useBulkSuspendUsers() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userIds: string[]) => adminApi.bulkSuspendUsers(userIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
            adminApi.updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        },
    })
}

export function useUpdateUserRoles() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRolesDto }) =>
            adminApi.updateUserRoles(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] })
        },
    })
}

export function useAdminOrders(params?: QueryAdminOrdersParams) {
    return useQuery({
        queryKey: ['admin-orders', params],
        queryFn: () => adminApi.getOrders(params),
        ...defaultQueryOptions,
    })
}

export function useAdminOrder(id: string) {
    return useQuery({
        queryKey: ['admin-order', id],
        queryFn: () => adminApi.getOrder(id),
        enabled: !!id,
        ...defaultQueryOptions,
    })
}

export function useAdminOrderStats() {
    return useQuery({
        queryKey: ['admin-order-stats'],
        queryFn: () => adminApi.getOrderStats(),
        ...defaultQueryOptions,
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            queryClient.invalidateQueries({ queryKey: ['admin-order-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useUpdateOrderPaymentStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) => adminApi.updateOrderPaymentStatus(id, paymentStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            queryClient.invalidateQueries({ queryKey: ['admin-order-stats'] })
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
        },
    })
}

export function useAdminTransactions(params?: QueryAdminTransactionsParams) {
    return useQuery({
        queryKey: ['admin-transactions', params],
        queryFn: () => adminApi.getTransactions(params),
        ...defaultQueryOptions,
    })
}

export function useAdminTransaction(id: number) {
    return useQuery({
        queryKey: ['admin-transaction', id],
        queryFn: () => adminApi.getTransaction(id),
        enabled: !!id,
        ...defaultQueryOptions,
    })
}

export function useAdminPaymentStats() {
    return useQuery({
        queryKey: ['admin-payment-stats'],
        queryFn: () => adminApi.getPaymentStats(),
        ...defaultQueryOptions,
    })
}

// Product Moderation Hooks
export function useModerationProducts(params?: QueryModerationProductsParams) {
    return useQuery({
        queryKey: ['moderation-products', params],
        queryFn: () => adminApi.getModerationProducts(params),
        ...defaultQueryOptions,
    })
}


export function useApproveProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.approveProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-products'] })
            queryClient.invalidateQueries({ queryKey: ['moderation-stats'] })
        },
    })
}

export function useRejectProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminApi.rejectProduct(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-products'] })
            queryClient.invalidateQueries({ queryKey: ['moderation-stats'] })
        },
    })
}

export function useBulkApproveProducts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (productIds: string[]) => adminApi.bulkApproveProducts(productIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-products'] })
            queryClient.invalidateQueries({ queryKey: ['moderation-stats'] })
        },
    })
}

export function useBulkRejectProducts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ productIds, reason }: { productIds: string[]; reason?: string }) => adminApi.bulkRejectProducts(productIds, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-products'] })
            queryClient.invalidateQueries({ queryKey: ['moderation-stats'] })
        },
    })
}

// Content Management Hooks
export function useContents(params?: QueryContentParams) {
    return useQuery({
        queryKey: ['admin-contents', params],
        queryFn: () => adminApi.getContents(params),
        ...defaultQueryOptions,
    })
}

export function useContentStats() {
    return useQuery({
        queryKey: ['admin-content-stats'],
        queryFn: () => adminApi.getContentStats(),
        ...defaultQueryOptions,
    })
}

export function useCreateContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateContentData) => adminApi.createContent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contents'] })
            queryClient.invalidateQueries({ queryKey: ['admin-content-stats'] })
        },
    })
}

export function useUpdateContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateContentData> }) => adminApi.updateContent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contents'] })
            queryClient.invalidateQueries({ queryKey: ['admin-content-stats'] })
        },
    })
}

export function useDeleteContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contents'] })
            queryClient.invalidateQueries({ queryKey: ['admin-content-stats'] })
        },
    })
}

export function usePublishContent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.publishContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contents'] })
            queryClient.invalidateQueries({ queryKey: ['admin-content-stats'] })
        },
    })
}

// Support Tickets Hooks
export function useTickets(params?: QueryTicketsParams) {
    return useQuery({
        queryKey: ['admin-tickets', params],
        queryFn: () => adminApi.getTickets(params),
        ...defaultQueryOptions,
    })
}

export function useTicket(id: string) {
    return useQuery({
        queryKey: ['admin-ticket', id],
        queryFn: () => adminApi.getTicket(id),
        enabled: !!id,
        ...defaultQueryOptions,
    })
}


export function useUpdateTicketStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateTicketStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] })
            queryClient.invalidateQueries({ queryKey: ['admin-ticket-stats'] })
        },
    })
}

export function useAssignTicket() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) => adminApi.assignTicket(id, assignedTo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] })
        },
    })
}

export function useReplyToTicket() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => adminApi.replyToTicket(id, message),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-ticket', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] })
        },
    })
}

// Reports Hooks
export function useReportsOverview(params?: QueryReportsParams) {
    return useQuery({
        queryKey: ['admin-reports-overview', params],
        queryFn: () => adminApi.getReportsOverview(params),
        ...defaultQueryOptions,
    })
}

export function useRevenueChart(params?: QueryReportsParams) {
    return useQuery({
        queryKey: ['admin-revenue-chart', params],
        queryFn: () => adminApi.getRevenueChart(params),
        ...defaultQueryOptions,
    })
}

export function useCategoryDistribution() {
    return useQuery({
        queryKey: ['admin-category-distribution'],
        queryFn: () => adminApi.getCategoryDistribution(),
        ...defaultQueryOptions,
    })
}

export function useTopProductsReport(params?: { limit?: number; timeRange?: string }) {
    return useQuery({
        queryKey: ['admin-top-products-report', params],
        queryFn: () => adminApi.getTopProducts(params),
        ...defaultQueryOptions,
    })
}

export function useTopSellersReport(params?: { limit?: number; timeRange?: string }) {
    return useQuery({
        queryKey: ['admin-top-sellers-report', params],
        queryFn: () => adminApi.getTopSellersReport(params),
        ...defaultQueryOptions,
    })
}

export function useDailyStats(params?: QueryReportsParams) {
    return useQuery({
        queryKey: ['admin-daily-stats', params],
        queryFn: () => adminApi.getDailyStats(params),
        ...defaultQueryOptions,
    })
}

export function useExportReport() {
    return useMutation({
        mutationFn: (params?: QueryReportsParams) => adminApi.exportReport(params),
    })
}

// Notification Hooks
export function useNotifications(params?: QueryNotificationsParams) {
    return useQuery({
        queryKey: ['admin-notifications', params],
        queryFn: () => adminApi.getNotifications(params),
        ...defaultQueryOptions,
    })
}

export function useNotificationStats() {
    return useQuery({
        queryKey: ['admin-notification-stats'],
        queryFn: () => adminApi.getNotificationStats(),
        ...defaultQueryOptions,
    })
}

export function useNotificationTemplates() {
    return useQuery({
        queryKey: ['admin-notification-templates'],
        queryFn: () => adminApi.getNotificationTemplates(),
        ...defaultQueryOptions,
    })
}

export function useCreateNotification() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateNotificationData) => adminApi.createNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
            queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] })
        },
    })
}

export function useSendNotification() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.sendNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
            queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] })
        },
    })
}

// Admin Header Notifications Hooks
export function useAdminHeaderNotifications(limit?: number) {
    return useQuery({
        queryKey: ['admin-header-notifications', limit],
        queryFn: () => adminApi.getHeaderNotifications(limit),
        refetchInterval: 60000, // Refetch every 60 seconds
        ...defaultQueryOptions,
    })
}

export function useMarkHeaderNotificationAsRead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminApi.markHeaderNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-header-notifications'] })
        },
    })
}

export function useMarkAllHeaderNotificationsAsRead() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => adminApi.markAllHeaderNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-header-notifications'] })
        },
    })
}

// System Settings Hooks
export function useSystemSettings() {
    return useQuery({
        queryKey: ['admin-system-settings'],
        queryFn: () => adminApi.getSystemSettings(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...defaultQueryOptions,
    })
}

export function useSettingsByCategory<T>(category: string) {
    return useQuery({
        queryKey: ['admin-settings-category', category],
        queryFn: () => adminApi.getSettingsByCategory<T>(category),
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        ...defaultQueryOptions,
    })
}

export function useUpdateSystemSettings() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (settings: Parameters<typeof adminApi.updateSystemSettings>[0]) =>
            adminApi.updateSystemSettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-system-settings'] })
            queryClient.invalidateQueries({ queryKey: ['admin-settings-category'] })
        },
    })
}

export function useUpdateSettingsByCategory<T>() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ category, settings }: { category: string; settings: T }) =>
            adminApi.updateSettingsByCategory<T>(category, settings),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-system-settings'] })
            queryClient.invalidateQueries({ queryKey: ['admin-settings-category', variables.category] })
        },
    })
}

export function useSystemHealth() {
    return useQuery({
        queryKey: ['admin-system-health'],
        queryFn: () => adminApi.getSystemHealth(),
        refetchInterval: 30000, // Refresh every 30 seconds
        ...defaultQueryOptions,
    })
}

// Category Hooks
export function useAdminCategories(params?: QueryAdminCategoriesParams) {
    return useQuery({
        queryKey: ['admin-categories', params],
        queryFn: () => adminApi.getCategories(params),
        ...defaultQueryOptions,
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCategoryData) => adminApi.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateCategoryData> }) =>
            adminApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => adminApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
        },
    })
}

// Package hooks
export function useAdminPackages(params?: QueryAdminPackagesParams) {
    return useQuery({
        queryKey: ['admin-packages', params],
        queryFn: () => adminApi.getPackages(params),
        ...defaultQueryOptions,
    })
}

export function useAdminPackage(id: number) {
    return useQuery({
        queryKey: ['admin-package', id],
        queryFn: () => adminApi.getPackage(id),
        enabled: !!id,
        ...defaultQueryOptions,
    })
}

export function useAdminPackageStats() {
    return useQuery({
        queryKey: ['admin-package-stats'],
        queryFn: () => adminApi.getPackageStats(),
        ...defaultQueryOptions,
    })
}

export function useCreatePackage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreatePackageData) => adminApi.createPackage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
            queryClient.invalidateQueries({ queryKey: ['admin-package-stats'] })
        },
    })
}

export function useUpdatePackage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreatePackageData> }) =>
            adminApi.updatePackage(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
            queryClient.invalidateQueries({ queryKey: ['admin-package-stats'] })
        },
    })
}

export function useDeletePackage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => adminApi.deletePackage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
            queryClient.invalidateQueries({ queryKey: ['admin-package-stats'] })
        },
    })
}
