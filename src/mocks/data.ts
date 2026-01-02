import type { DemoData } from '@/types'
import type { ModerationProduct } from '@admin/api/admin'
import sampleData from '../../public/data/sample-products.json'

function generateModerationProducts(): ModerationProduct[] {
  const statuses: Array<'pending' | 'approved' | 'rejected' | 'draft'> = ['pending', 'approved', 'rejected', 'draft']
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low']
  const categories = ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện', 'Đồng hồ', 'Thiết bị âm thanh']
  const sellers = [
    { id: 'seller-1', name: 'TechStore Pro' },
    { id: 'seller-2', name: 'Gadget World' },
    { id: 'seller-3', name: 'Digital Plaza' },
    { id: 'seller-4', name: 'Smart Devices' },
    { id: 'seller-5', name: 'Elite Electronics' },
  ]
  const violations = [
    'Hình ảnh không rõ ràng',
    'Thiếu thông tin chi tiết',
    'Giá không hợp lý',
    'Mô tả sản phẩm không chính xác',
    'Vi phạm chính sách nội dung',
  ]
  const tags = ['Hot', 'Sale', 'New', 'Trending', 'Limited']

  const products: ModerationProduct[] = []

  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const seller = sellers[Math.floor(Math.random() * sellers.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const aiScore = Math.random() * 100
    const hasViolations = aiScore < 70
    const submittedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)

    products.push({
      id: `mod-prod-${i}`,
      title: `Sản phẩm ${i} - ${category}`,
      seller: seller.name,
      sellerId: seller.id,
      category,
      price: Math.floor(Math.random() * 50000000) + 1000000,
      originalPrice: Math.floor(Math.random() * 60000000) + 1000000,
      status,
      priority,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending' ? new Date(submittedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      reviewer: status !== 'pending' ? 'Admin User' : undefined,
      images: [
        `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`,
        `https://images.unsplash.com/photo-${1500000000001 + i}?w=400&h=400&fit=crop`,
      ],
      description: `Mô tả chi tiết cho sản phẩm ${i}. Đây là một sản phẩm chất lượng cao với nhiều tính năng ưu việt.`,
      violations: hasViolations ? [violations[Math.floor(Math.random() * violations.length)]] : [],
      aiScore: Math.round(aiScore),
      manualReview: aiScore < 60 || hasViolations,
      tags: [tags[Math.floor(Math.random() * tags.length)]],
      stock: Math.floor(Math.random() * 100) + 1,
      views: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 50),
    })
  }

  return products
}

export const demoData: DemoData = {
  categories: sampleData.categories.map(cat => ({
    ...cat,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  products: sampleData.products.map(prod => ({
    ...prod,
    title: prod.name,
    categoryId: prod.category,
    condition: 'new' as const,
    location: 'Hồ Chí Minh',
    sellerId: prod.seller.id,
    status: 'active' as const,
    badges: [],
    rating: prod.rating,
    reviewCount: prod.reviewCount,
    viewCount: 0,
    isFeatured: false,
    isPromoted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Ensure seller object has all required fields
    seller: {
      id: prod.seller.id,
      name: prod.seller.name,
      email: 'seller@example.com',
      phone: '0123456789',
      avatar: prod.seller.avatar,
      roles: ['seller'] as const,
      postCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Remove the old category field and ensure we have categoryId
    category: undefined,
  })),
  moderationProducts: generateModerationProducts(),
  users: sampleData.users.map(user => ({
    ...user,
    roles: ['buyer'] as const,
    postCount: 0,
    updatedAt: new Date().toISOString(),
  })),
  orders: sampleData.orders.map((order, index) => {
    const userNames = [
      'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E',
      'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H', 'Ngô Văn I', 'Dương Thị K',
      'Lý Văn L', 'Võ Thị M', 'Đỗ Văn N', 'Phan Thị O', 'Trương Văn P'
    ]
    const userEmails = [
      'nguyenvana@example.com', 'tranthib@example.com', 'levanc@example.com',
      'phamthid@example.com', 'hoangvane@example.com', 'vuthif@example.com',
      'dangvang@example.com', 'buithih@example.com', 'ngovani@example.com',
      'duongthik@example.com', 'lyvanl@example.com', 'vothim@example.com',
      'dovann@example.com', 'phanthio@example.com', 'truongvanp@example.com'
    ]
    const addresses = [
      '123 Đường ABC, Quận 1, TP.HCM',
      '456 Đường XYZ, Quận Cầu Giấy, Hà Nội',
      '789 Đường DEF, Quận Thanh Khê, Đà Nẵng',
      '321 Đường GHI, Quận Ninh Kiều, Cần Thơ',
      '654 Đường JKL, Quận Hải Châu, Đà Nẵng',
      '987 Đường MNO, Quận Bình Thạnh, TP.HCM',
      '147 Đường PQR, Quận Đống Đa, Hà Nội',
      '258 Đường STU, Quận Liên Chiểu, Đà Nẵng',
      '369 Đường VWX, Quận 3, TP.HCM',
      '741 Đường YZ, Quận Ba Đình, Hà Nội',
      '852 Đường AA, Quận Hải An, Hải Phòng',
      '963 Đường BB, Quận Ngô Quyền, Hải Phòng',
      '159 Đường CC, Quận Thủ Đức, TP.HCM',
      '357 Đường DD, Quận Hoàn Kiếm, Hà Nội',
      '468 Đường EE, Quận Sơn Trà, Đà Nẵng'
    ]
    const productNames = [
      'iPhone 14 Pro Max 256GB',
      'Samsung Galaxy S23 Ultra',
      'MacBook Air M2 13 inch',
      'AirPods Pro 2nd Gen',
      'iPad Pro 12.9 inch',
      'Apple Watch Series 9',
      'Sony WH-1000XM5',
      'Dell XPS 13',
      'Samsung Galaxy Watch 6',
      'Microsoft Surface Pro 9',
      'Google Pixel 8 Pro',
      'OnePlus 12',
      'Xiaomi 14 Pro',
      'Huawei Mate 60 Pro',
      'Oppo Find X6 Pro'
    ]
    const productImages = [
      'https://images.unsplash.com/photo-1592899677977-9c10b588e3e9?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=80&h=80&fit=crop'
    ]
    const paymentMethods = ['momo', 'cod', 'bank_transfer', 'ewallet']
    const paymentStatuses = ['pending', 'completed', 'failed']
    
    return {
      id: order.id,
      userId: index + 1,
      storeId: 'store-1',
      status: order.status,
      paymentStatus: paymentStatuses[index % paymentStatuses.length],
      paymentMethod: paymentMethods[index % paymentMethods.length],
      subtotal: order.total,
      tax: 0,
      shipping: 0,
      discount: index % 3 === 0 ? Math.floor(order.total * 0.1) : 0,
      total: order.total - (index % 3 === 0 ? Math.floor(order.total * 0.1) : 0),
      currency: 'VND',
      shippingAddress: addresses[index % addresses.length],
      billingAddress: addresses[index % addresses.length],
      notes: index % 4 === 0 ? 'Giao hàng trong giờ hành chính' : '',
      storeName: 'TechStore Pro',
      storeLogo: '/store-logo.jpg',
      userEmail: userEmails[index % userEmails.length],
      userName: userNames[index % userNames.length],
      items: order.items.map((item, itemIndex) => ({
        id: `item-${order.id}-${itemIndex}`,
        orderId: order.id,
        productId: item.productId,
        productName: productNames[(index + itemIndex) % productNames.length],
        productImage: productImages[(index + itemIndex) % productImages.length],
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      createdAt: order.createdAt,
      updatedAt: new Date().toISOString(),
    }
  }) as any,
}