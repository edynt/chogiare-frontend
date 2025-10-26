import { http, HttpResponse } from 'msw'
import { demoData } from './data'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = await request.json() as { email: string; password: string }
    
    // Mock login - accept any email/password for demo
    const user = demoData.users.find(u => u.email === email) || demoData.users[0]
    
    return HttpResponse.json({
      success: true,
      data: {
        user,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600,
        },
      },
    })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      postCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        user: newUser,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600,
        },
      },
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
        expiresIn: 3600,
      },
    })
  }),

  http.get('/api/auth/profile', () => {
    return HttpResponse.json({
      success: true,
      data: demoData.users[0],
    })
  }),

  // Products endpoints
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const categoryId = url.searchParams.get('categoryId')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const query = url.searchParams.get('query')
    const condition = url.searchParams.get('condition')
    const location = url.searchParams.get('location')
    const rating = url.searchParams.get('rating')
    const badges = url.searchParams.get('badges')
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    let filteredProducts = [...demoData.products]

    // Apply filters
    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId)
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice))
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice))
    }

    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (condition) {
      filteredProducts = filteredProducts.filter(p => p.condition === condition)
    }

    if (location) {
      filteredProducts = filteredProducts.filter(p => 
        p.location?.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (rating) {
      const minRating = parseFloat(rating)
      filteredProducts = filteredProducts.filter(p => p.rating >= minRating)
    }

    if (badges) {
      const badgeList = badges.split(',')
      filteredProducts = filteredProducts.filter(p => 
        p.badges && p.badges.some(badge => badgeList.includes(badge))
      )
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'viewCount':
          aValue = a.viewCount || 0
          bValue = b.viewCount || 0
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || '').getTime()
          bValue = new Date(b.createdAt || '').getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedProducts,
        total: filteredProducts.length,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
          hasNext: endIndex < filteredProducts.length,
          hasPrev: page > 1,
        },
      },
    })
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = demoData.products.find(p => p.id === params.id)
    
    if (!product) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure all required fields are present
    const enrichedProduct = {
      ...product,
      title: product.title,
      badges: product.badges || [],
      tags: product.tags || [],
      images: product.images || [],
      seller: product.seller || {
        id: 'seller-1',
        name: 'Default Seller',
        avatar: '/avatar.jpg'
      },
      store: product.store || null,
      location: product.location || 'Hồ Chí Minh',
      condition: product.condition || 'Mới',
      viewCount: product.viewCount || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock || 0,
      price: product.price || 0,
      originalPrice: product.originalPrice || null,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    }

    return HttpResponse.json({
      success: true,
      data: enrichedProduct,
    })
  }),

  http.get('/api/products/featured', ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    
    const featuredProducts = demoData.products
      .filter(p => p.isFeatured)
      .slice(0, limit)

    return HttpResponse.json({
      success: true,
      data: featuredProducts,
    })
  }),

  // Categories endpoints
  http.get('/api/categories', () => {
    return HttpResponse.json({
      success: true,
      data: demoData.categories,
    })
  }),

  http.get('/api/categories/:id', ({ params }) => {
    const category = demoData.categories.find(c => c.id === params.id)
    
    if (!category) {
      return HttpResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: category,
    })
  }),

  // Seller endpoints
  http.get('/api/seller/products', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    // Mock seller products (first user's products)
    const sellerProducts = demoData.products.filter(p => p.sellerId === demoData.users[0].id)
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = sellerProducts.slice(startIndex, endIndex)

    return HttpResponse.json({
      success: true,
      data: {
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total: sellerProducts.length,
          totalPages: Math.ceil(sellerProducts.length / limit),
          hasNext: endIndex < sellerProducts.length,
          hasPrev: page > 1,
        },
      },
    })
  }),

  // Seller products endpoints
  http.get('/api/seller/products', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status')
    const query = url.searchParams.get('query')

    let filteredProducts = [...demoData.products]

    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === status)
    }

    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedProducts,
        total: filteredProducts.length,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
          hasNext: endIndex < filteredProducts.length,
          hasPrev: page > 1,
        },
      },
    })
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as any
    const newProduct = {
      id: `prod${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    demoData.products.push(newProduct)
    
    return HttpResponse.json({
      success: true,
      data: newProduct,
    })
  }),

  http.patch('/api/products/:id', async ({ params, request }) => {
    const productId = params.id as string
    const updates = await request.json() as any
    
    const productIndex = demoData.products.findIndex(p => p.id === productId)
    if (productIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    demoData.products[productIndex] = {
      ...demoData.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      success: true,
      data: demoData.products[productIndex],
    })
  }),

  // Cart endpoints
  http.get('/api/cart', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'cart-1',
        userId: 1,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/cart/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalItems: 0,
        totalValue: 0,
        uniqueProducts: 0,
      },
    })
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const data = await request.json() as any
    const newItem = {
      id: `item-${Date.now()}`,
      cartId: 'cart-1',
      productId: data.productId,
      quantity: data.quantity,
      price: 100000,
      productName: 'Sample Product',
      productImage: '/placeholder.jpg',
      productPrice: 100000,
      productStock: 10,
      productStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({
      success: true,
      data: newItem,
    })
  }),

  http.patch('/api/cart/items/:itemId', async ({ params, request }) => {
    const data = await request.json() as any
    return HttpResponse.json({
      success: true,
      data: {
        id: params.itemId,
        quantity: data.quantity,
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.delete('/api/cart/items/:itemId', () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete('/api/cart', () => {
    return HttpResponse.json({ success: true })
  }),

  // Orders endpoints
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    return HttpResponse.json({
      success: true,
      data: {
        orders: demoData.orders.slice((page - 1) * pageSize, page * pageSize),
        total: demoData.orders.length,
        page,
        pageSize,
        totalPages: Math.ceil(demoData.orders.length / pageSize),
      },
    })
  }),

  http.get('/api/orders/my', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    return HttpResponse.json({
      success: true,
      data: {
        items: demoData.orders.slice((page - 1) * pageSize, page * pageSize),
        total: demoData.orders.length,
        page,
        pageSize,
        totalPages: Math.ceil(demoData.orders.length / pageSize),
      },
    })
  }),

  http.get('/api/orders/store/:storeId', ({ params, request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    // Filter orders by storeId
    const storeOrders = demoData.orders.filter(order => (order as any).storeId === params.storeId)
    
    return HttpResponse.json({
      success: true,
      data: {
        items: storeOrders.slice((page - 1) * pageSize, page * pageSize),
        total: storeOrders.length,
        page,
        pageSize,
        totalPages: Math.ceil(storeOrders.length / pageSize),
      },
    })
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = demoData.orders.find(o => o.id === params.id)
    
    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: order,
    })
  }),

  http.post('/api/orders', async ({ request }) => {
    const data = await request.json() as any
    const newOrder = {
      id: `order-${Date.now()}`,
      ...data,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: 100000,
      tax: 10000,
      shipping: 30000,
      discount: 0,
      total: 140000,
      currency: 'VND',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    demoData.orders.push(newOrder)
    
    return HttpResponse.json({
      success: true,
      data: newOrder,
    })
  }),

  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    const data = await request.json() as any
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: data.status,
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/orders/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalOrders: demoData.orders.length,
        pendingOrders: 2,
        processingOrders: 1,
        shippedOrders: 3,
        deliveredOrders: 5,
        cancelledOrders: 1,
        totalRevenue: 5000000,
        averageOrderValue: 250000,
      },
    })
  }),

  // Reviews endpoints
  http.get('/api/reviews', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    const reviews = Array.from({ length: 20 }, (_, i) => ({
      id: `review-${i + 1}`,
      productId: `prod-${(i % 5) + 1}`,
      userId: 1,
      rating: Math.floor(Math.random() * 5) + 1,
      title: `Review ${i + 1}`,
      comment: `This is review ${i + 1}`,
      images: [],
      isVerified: Math.random() > 0.5,
      helpful: Math.floor(Math.random() * 10),
      userName: 'User Name',
      userEmail: 'user@example.com',
      userAvatar: '/avatar.jpg',
      productName: 'Product Name',
      productImage: '/product.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: {
        reviews: reviews.slice((page - 1) * pageSize, page * pageSize),
        total: reviews.length,
        page,
        pageSize,
        totalPages: Math.ceil(reviews.length / pageSize),
      },
    })
  }),

  http.get('/api/reviews/product/:productId', ({ params, request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    const reviews = Array.from({ length: 10 }, (_, i) => ({
      id: `review-${i + 1}`,
      productId: params.productId,
      userId: 1,
      rating: Math.floor(Math.random() * 5) + 1,
      title: `Review ${i + 1}`,
      comment: `This is review ${i + 1}`,
      images: [],
      isVerified: Math.random() > 0.5,
      helpful: Math.floor(Math.random() * 10),
      buyerId: `user-${i + 1}`,
      buyer: {
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        avatar: '/avatar.jpg',
        roles: ['buyer'] as const,
        postCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sellerId: 'seller-1',
      productName: 'Product Name',
      productImage: '/product.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: {
        items: reviews.slice((page - 1) * pageSize, page * pageSize),
        total: reviews.length,
        page,
        pageSize,
        totalPages: Math.ceil(reviews.length / pageSize),
      },
    })
  }),

  http.post('/api/reviews', async ({ request }) => {
    const data = await request.json() as any
    const newReview = {
      id: `review-${Date.now()}`,
      ...data,
      userId: 1,
      images: [],
      isVerified: false,
      helpful: 0,
      userName: 'User Name',
      userEmail: 'user@example.com',
      userAvatar: '/avatar.jpg',
      productName: 'Product Name',
      productImage: '/product.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({
      success: true,
      data: newReview,
    })
  }),

  http.get('/api/reviews/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalReviews: 50,
        averageRating: 4.2,
        ratingCounts: { 1: 2, 2: 3, 3: 8, 4: 15, 5: 22 },
        verifiedReviews: 30,
      },
    })
  }),

  // Stores endpoints
  http.get('/api/stores', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    const stores = Array.from({ length: 15 }, (_, i) => ({
      id: `store-${i + 1}`,
      userId: 1,
      name: `Store ${i + 1}`,
      description: `Description for store ${i + 1}`,
      logo: '/store-logo.jpg',
      banner: '/store-banner.jpg',
      website: 'https://example.com',
      phone: '+84123456789',
      email: `store${i + 1}@example.com`,
      address: '123 Main St',
      city: 'Ho Chi Minh City',
      state: 'Ho Chi Minh',
      country: 'Vietnam',
      postalCode: '70000',
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100),
      productCount: Math.floor(Math.random() * 50),
      followerCount: Math.floor(Math.random() * 1000),
      isVerified: Math.random() > 0.5,
      isActive: true,
      userName: 'Store Owner',
      userEmail: 'owner@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: {
        stores: stores.slice((page - 1) * pageSize, page * pageSize),
        total: stores.length,
        page,
        pageSize,
        totalPages: Math.ceil(stores.length / pageSize),
      },
    })
  }),

  http.get('/api/stores/my', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'store-1',
        userId: 1,
        name: 'My Store',
        description: 'My store description',
        logo: '/store-logo.jpg',
        banner: '/store-banner.jpg',
        website: 'https://mystore.com',
        phone: '+84123456789',
        email: 'mystore@example.com',
        address: '123 Main St',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        country: 'Vietnam',
        postalCode: '70000',
        rating: 4.5,
        reviewCount: 25,
        productCount: 10,
        followerCount: 150,
        isVerified: true,
        isActive: true,
        userName: 'Store Owner',
        userEmail: 'owner@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/stores/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        userId: 1,
        name: 'Store Name',
        description: 'Store description',
        logo: '/store-logo.jpg',
        banner: '/store-banner.jpg',
        website: 'https://example.com',
        phone: '+84123456789',
        email: 'store@example.com',
        address: '123 Main St',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        country: 'Vietnam',
        postalCode: '70000',
        rating: 4.5,
        reviewCount: 25,
        productCount: 10,
        followerCount: 150,
        isVerified: true,
        isActive: true,
        userName: 'Store Owner',
        userEmail: 'owner@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/stores/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalStores: 100,
        activeStores: 85,
        verifiedStores: 60,
        averageRating: 4.2,
        totalProducts: 5000,
        totalFollowers: 10000,
      },
    })
  }),

  // Chat endpoints
  http.get('/api/chat/conversations', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    
    const conversations = Array.from({ length: 20 }, (_, i) => ({
      id: `conv-${i + 1}`,
      type: 'direct',
      title: `Conversation ${i + 1}`,
      participants: [
        {
          id: `part-${i + 1}`,
          conversationId: `conv-${i + 1}`,
          userId: 1,
          role: 'member',
          joinedAt: new Date().toISOString(),
        }
      ],
      lastMessage: {
        id: `msg-${i + 1}`,
        conversationId: `conv-${i + 1}`,
        senderId: 1,
        messageType: 'text',
        content: `Last message ${i + 1}`,
        isRead: Math.random() > 0.5,
        senderName: 'User Name',
        senderEmail: 'user@example.com',
        senderAvatar: '/avatar.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      unreadCount: Math.floor(Math.random() * 5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: {
        conversations: conversations.slice((page - 1) * pageSize, page * pageSize),
        total: conversations.length,
        page,
        pageSize,
        totalPages: Math.ceil(conversations.length / pageSize),
      },
    })
  }),

  http.get('/api/chat/conversations/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        type: 'direct',
        title: 'Conversation',
        participants: [
          {
            id: 'part-1',
            conversationId: params.id,
            userId: 1,
            role: 'member',
            joinedAt: new Date().toISOString(),
          }
        ],
        lastMessage: {
          id: 'msg-1',
          conversationId: params.id,
          senderId: 1,
          messageType: 'text',
          content: 'Hello',
          isRead: true,
          senderName: 'User Name',
          senderEmail: 'user@example.com',
          senderAvatar: '/avatar.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/chat/conversations/:id/messages', ({ params, request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '50')
    
    const messages = Array.from({ length: 50 }, (_, i) => ({
      id: `msg-${i + 1}`,
      conversationId: params.id,
      senderId: Math.floor(Math.random() * 2) + 1,
      messageType: 'text',
      content: `Message ${i + 1}`,
      isRead: Math.random() > 0.5,
      senderName: 'User Name',
      senderEmail: 'user@example.com',
      senderAvatar: '/avatar.jpg',
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      updatedAt: new Date(Date.now() - i * 60000).toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: {
        messages: messages.slice((page - 1) * pageSize, page * pageSize),
        total: messages.length,
        page,
        pageSize,
        totalPages: Math.ceil(messages.length / pageSize),
      },
    })
  }),

  http.post('/api/chat/conversations/:id/messages', async ({ params, request }) => {
    const data = await request.json() as any
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: params.id,
      senderId: 1,
      messageType: data.messageType || 'text',
      content: data.content,
      isRead: false,
      senderName: 'User Name',
      senderEmail: 'user@example.com',
      senderAvatar: '/avatar.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({
      success: true,
      data: newMessage,
    })
  }),

  http.get('/api/chat/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalConversations: 25,
        totalMessages: 500,
        unreadMessages: 12,
        activeConversations: 8,
      },
    })
  }),

  // Upload endpoints
  http.post('/api/upload/file', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    return HttpResponse.json({
      success: true,
      data: {
        id: `file-${Date.now()}`,
        url: '/uploads/sample.jpg',
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
    })
  }),

  http.post('/api/upload/files', async ({ request }) => {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    const results = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      url: `/uploads/sample-${index}.jpg`,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    }))
    
    return HttpResponse.json({
      success: true,
      data: results,
    })
  }),

  http.post('/api/upload/avatar', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('avatar') as File
    
    return HttpResponse.json({
      success: true,
      data: {
        id: `avatar-${Date.now()}`,
        url: '/uploads/avatar.jpg',
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
    })
  }),

  http.get('/api/upload/files/:fileId', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.fileId,
        url: '/uploads/sample.jpg',
        filename: 'sample.jpg',
        size: 1024000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
    })
  }),

  http.delete('/api/upload/files/:fileId', () => {
    return HttpResponse.json({ success: true })
  }),

  // Demo data seeding
  http.post('/api/demo/seed', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>
    
    // In a real app, this would save to database
    console.log('Seeding demo data:', data)
    
    return HttpResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
    })
  }),

  // Shipping endpoints
  http.get('/api/shipping/:orderId', ({ params }) => {
    const orderId = params.orderId as string
    
    // Mock shipping data based on order status
    const mockShippingData = {
      orderId,
      trackingNumber: `VN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      carrier: 'Viettel Post',
      status: 'in_transit' as const,
      currentLocation: 'Trung tâm phân phối TP.HCM',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      steps: [
        {
          id: '1',
          status: 'completed' as const,
          title: 'Đơn hàng đã được xác nhận',
          description: 'Đơn hàng đã được xác nhận và chuẩn bị xuất kho',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Kho hàng TechStore Pro',
          icon: null,
          estimatedTime: '30 phút'
        },
        {
          id: '2',
          status: 'completed' as const,
          title: 'Đã xuất kho',
          description: 'Đơn hàng đã được đóng gói và xuất kho',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Kho hàng TechStore Pro',
          icon: null,
          estimatedTime: '2 giờ'
        },
        {
          id: '3',
          status: 'completed' as const,
          title: 'Đang vận chuyển',
          description: 'Đơn hàng đang được vận chuyển đến trung tâm phân phối',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Trung tâm phân phối TP.HCM',
          icon: null,
          estimatedTime: '4 giờ'
        },
        {
          id: '4',
          status: 'current' as const,
          title: 'Đang phân loại',
          description: 'Đơn hàng đang được phân loại để giao hàng',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          location: 'Trung tâm phân phối TP.HCM',
          icon: null,
          estimatedTime: '1 giờ'
        },
        {
          id: '5',
          status: 'pending' as const,
          title: 'Đang giao hàng',
          description: 'Đơn hàng đang được giao đến địa chỉ của bạn',
          timestamp: '',
          location: 'Quận 1, TP.HCM',
          icon: null,
          estimatedTime: '30 phút'
        },
        {
          id: '6',
          status: 'pending' as const,
          title: 'Đã giao hàng',
          description: 'Đơn hàng đã được giao thành công',
          timestamp: '',
          location: 'Địa chỉ giao hàng',
          icon: null,
          estimatedTime: 'Hoàn thành'
        }
      ],
      deliveryAddress: {
        recipient: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC',
        city: 'TP.HCM',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé'
      },
      carrierInfo: {
        name: 'Viettel Post',
        phone: '19008088',
        website: 'https://viettelpost.vn'
      }
    }

    return HttpResponse.json({
      success: true,
      data: mockShippingData
    })
  }),

  http.get('/api/shipping/:orderId/history', ({ params }) => {
    const orderId = params.orderId as string
    
    const mockHistory = [
      {
        id: '1',
        orderId,
        status: 'processing',
        location: 'Kho hàng TechStore Pro',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Đơn hàng đã được xác nhận',
        carrier: 'Viettel Post'
      },
      {
        id: '2',
        orderId,
        status: 'shipped',
        location: 'Kho hàng TechStore Pro',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Đơn hàng đã xuất kho',
        carrier: 'Viettel Post'
      },
      {
        id: '3',
        orderId,
        status: 'in_transit',
        location: 'Trung tâm phân phối TP.HCM',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Đơn hàng đang vận chuyển',
        carrier: 'Viettel Post'
      }
    ]

    return HttpResponse.json({
      success: true,
      data: mockHistory
    })
  }),

  http.get('/api/shipping/track/:trackingNumber', ({ params }) => {
    const trackingNumber = params.trackingNumber as string
    
    // Return same mock data for tracking number lookup
    return HttpResponse.json({
      success: true,
      data: {
        orderId: 'ORD-001',
        trackingNumber,
        carrier: 'Viettel Post',
        status: 'in_transit',
        currentLocation: 'Trung tâm phân phối TP.HCM',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        steps: [],
        deliveryAddress: {
          recipient: 'Nguyễn Văn A',
          phone: '0901234567',
          address: '123 Đường ABC',
          city: 'TP.HCM',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé'
        },
        carrierInfo: {
          name: 'Viettel Post',
          phone: '19008088',
          website: 'https://viettelpost.vn'
        }
      }
    })
  }),

  http.patch('/api/shipping/:orderId', async ({ params, request }) => {
    const orderId = params.orderId as string
    const data = await request.json() as { status: string }
    
    return HttpResponse.json({
      success: true,
      data: {
        id: `update-${Date.now()}`,
        orderId,
        status: data.status,
        location: 'Trung tâm phân phối TP.HCM',
        timestamp: new Date().toISOString(),
        description: `Cập nhật trạng thái: ${data.status}`,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  }),

]
