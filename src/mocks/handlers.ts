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

    let filteredProducts = [...demoData.products]

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

    return HttpResponse.json({
      success: true,
      data: product,
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
]
