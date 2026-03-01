export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: (filters?: unknown) => ['products', filters] as const,
    infinite: (filters?: unknown) => ['products', 'infinite', filters] as const,
    detail: (id: number | string) => ['product', id] as const,
    featured: (limit?: number) => ['products', 'featured', limit] as const,
    search: (query: string, filters?: unknown) =>
      ['products', 'search', query, filters] as const,
    seller: (filters?: unknown) => ['seller', 'products', filters] as const,
    my: (filters?: unknown) => ['products', 'my', filters] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  sellers: {
    all: ['sellers'] as const,
    lists: (filters?: unknown) => ['sellers', filters] as const,
    detail: (id: number | string) => ['sellers', id] as const,
    user: ['sellers', 'user'] as const,
    search: (query: string, filters?: unknown) =>
      ['sellers', 'search', query, filters] as const,
    stats: ['sellers', 'stats'] as const,
    userStats: ['sellers', 'stats', 'user'] as const,
    sellerStats: (sellerId: number | string) =>
      ['sellers', 'stats', sellerId] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: (filters?: unknown) => ['orders', filters] as const,
    detail: (id: number | string) => ['orders', id] as const,
    user: (filters?: unknown) => ['orders', 'user', filters] as const,
    seller: (sellerId: number | string, filters?: unknown) =>
      ['orders', 'seller', sellerId, filters] as const,
    sellerInfinite: (sellerId: number | string) =>
      ['orders', 'seller', 'infinite', sellerId] as const,
    userInfinite: ['orders', 'user', 'infinite'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    lists: (filters?: unknown) => ['reviews', filters] as const,
    product: (productId: number | string, filters?: unknown) =>
      ['reviews', 'product', productId, filters] as const,
    user: (filters?: unknown) => ['reviews', 'user', filters] as const,
    seller: (sellerId: number | string, filters?: unknown) =>
      ['reviews', 'seller', sellerId, filters] as const,
    detail: (id: number | string) => ['reviews', id] as const,
    stats: ['reviews', 'stats'] as const,
    productStats: (productId: number | string) =>
      ['reviews', 'stats', 'product', productId] as const,
    sellerStats: (sellerId: number | string) =>
      ['reviews', 'stats', 'seller', sellerId] as const,
  },
  cart: {
    all: ['cart'] as const,
    stats: ['cart', 'stats'] as const,
  },
  reports: {
    revenueOverview: (params?: unknown) =>
      ['revenue-overview', params] as const,
    revenueData: (params?: unknown) => ['revenue-data', params] as const,
    topProducts: (params?: unknown) => ['top-products', params] as const,
    categoryRevenue: (params?: unknown) =>
      ['category-revenue', params] as const,
  },
  admin: {
    dashboardStats: ['admin-dashboard-stats'] as const,
    recentActivities: (limit?: number) =>
      ['admin-recent-activities', limit] as const,
    topSellers: (limit?: number) => ['admin-top-sellers', limit] as const,
    analyticsOverview: (timeRange?: string) =>
      ['analytics-overview', timeRange] as const,
    analyticsTopProducts: (limit?: number) =>
      ['analytics-top-products', limit] as const,
    analyticsTopSellers: (limit?: number) =>
      ['analytics-top-sellers', limit] as const,
    categoryStats: ['category-stats'] as const,
  },
  wallet: {
    balance: ['wallet', 'balance'] as const,
    transactions: (params?: unknown) =>
      ['wallet', 'transactions', params] as const,
    transaction: (id: number | string) =>
      ['wallet', 'transaction', id] as const,
    depositPackages: ['wallet', 'deposit-packages'] as const,
  },
  notifications: {
    all: (params?: unknown) => ['notifications', params] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
} as const
