import { faker } from '@faker-js/faker'
import type { Product, Category, User } from '@/types'

// Set Vietnamese locale for faker (new API)
faker.setDefaultRefDate('2024-01-01T00:00:00.000Z')

// Sample categories
const categories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại & Phụ kiện',
    slug: 'dien-thoai-phu-kien',
    description: 'Điện thoại thông minh và các phụ kiện liên quan',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Laptop & Máy tính',
    slug: 'laptop-may-tinh',
    description: 'Laptop, máy tính để bàn và phụ kiện',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Thời trang',
    slug: 'thoi-trang',
    description: 'Quần áo, giày dép, phụ kiện thời trang',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Gia dụng',
    slug: 'gia-dung',
    description: 'Đồ gia dụng, nội thất, trang trí nhà cửa',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sách & Văn phòng phẩm',
    slug: 'sach-van-phong-pham',
    description: 'Sách, tài liệu, dụng cụ văn phòng',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Thể thao & Du lịch',
    slug: 'the-thao-du-lich',
    description: 'Đồ thể thao, dụng cụ tập luyện, đồ du lịch',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Mỹ phẩm & Làm đẹp',
    slug: 'my-pham-lam-dep',
    description: 'Mỹ phẩm, sản phẩm chăm sóc da, làm đẹp',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Đồ chơi & Trẻ em',
    slug: 'do-choi-tre-em',
    description: 'Đồ chơi, sản phẩm cho trẻ em',
    productCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

// Sample product names by category
const productNames = {
  '1': [
    'iPhone 14 Pro Max 256GB',
    'Samsung Galaxy S23 Ultra',
    'Xiaomi 13 Pro',
    'OPPO Find X5 Pro',
    'Vivo X90 Pro',
    'AirPods Pro 2',
    'Samsung Galaxy Buds2 Pro',
    'Sony WH-1000XM5',
    'Ốp lưng iPhone 14',
    'Cáp sạc nhanh 100W',
  ],
  '2': [
    'MacBook Pro M2 13 inch',
    'Dell XPS 13',
    'HP Spectre x360',
    'Lenovo ThinkPad X1',
    'ASUS ROG Strix G15',
    'Chuột Logitech MX Master 3',
    'Bàn phím cơ Keychron K2',
    'Màn hình Dell UltraSharp 27',
    'Webcam Logitech C920',
    'Ổ cứng SSD Samsung 1TB',
  ],
  '3': [
    'Áo thun nam cao cấp',
    'Quần jean nữ slim fit',
    'Giày sneaker Adidas',
    'Túi xách da thật',
    'Đồng hồ Rolex Submariner',
    'Kính mát Ray-Ban',
    'Váy đầm công sở',
    'Áo khoác bomber',
    'Giày boot da lộn',
    'Ví nam da bò',
  ],
  '4': [
    'Máy lọc không khí Xiaomi',
    'Nồi cơm điện Tiger',
    'Máy xay sinh tố Philips',
    'Bàn làm việc gỗ',
    'Ghế văn phòng ergonomic',
    'Đèn bàn LED',
    'Thảm trải sàn',
    'Rèm cửa sổ',
    'Bình nước giữ nhiệt',
    'Máy hút bụi Dyson',
  ],
  '5': [
    'Sách "Đắc Nhân Tâm"',
    'Bút bi Parker',
    'Sổ tay Moleskine',
    'Máy tính Casio',
    'Bút chì Staedtler',
    'Tài liệu học tiếng Anh',
    'Sách "Tư duy nhanh và chậm"',
    'Bút highlight',
    'Kẹp giấy văn phòng',
    'Bảng trắng từ tính',
  ],
  '6': [
    'Giày chạy bộ Nike',
    'Quần áo thể thao Adidas',
    'Bóng đá World Cup',
    'Vợt cầu lông Yonex',
    'Ba lô du lịch Osprey',
    'Túi ngủ camping',
    'Bình nước thể thao',
    'Găng tay tập gym',
    'Thảm yoga',
    'Kính bơi Speedo',
  ],
  '7': [
    'Serum vitamin C',
    'Kem chống nắng SPF50',
    'Son môi MAC',
    'Mascara Maybelline',
    'Toner Hada Labo',
    'Kem dưỡng ẩm La Mer',
    'Tẩy trang Bioderma',
    'Mặt nạ đất sét',
    'Nước hoa Chanel',
    'Kem nền Estée Lauder',
  ],
  '8': [
    'Xe đạp trẻ em',
    'Đồ chơi LEGO',
    'Búp bê Barbie',
    'Xe điều khiển từ xa',
    'Bộ đồ chơi nấu ăn',
    'Sách tô màu',
    'Bóng bay helium',
    'Đồ chơi xếp hình',
    'Xe scooter trẻ em',
    'Bộ đồ chơi bác sĩ',
  ],
}

// Sample locations in Vietnam
const locations = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
]

// Generate fake users (sellers)
function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `user_${index + 1}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    roles: ['seller'] as const,
    postCount: faker.number.int({ min: 5, max: 50 }),
    storeInfo: {
      id: `store_${index + 1}`,
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      logo: faker.image.url(),
      banner: faker.image.url(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      isVerified: faker.datatype.boolean({ probability: 0.7 }),
      rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 10, max: 500 }),
      createdAt: faker.date.past().toISOString(),
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }))
}

// Generate fake products
function generateProducts(count: number, users: User[]): Product[] {
  return Array.from({ length: count }, (_, index) => {
    const category = faker.helpers.arrayElement(categories)
    const categoryNames =
      productNames[category.id as keyof typeof productNames] || []
    const productName = faker.helpers.arrayElement(categoryNames)
    const seller = faker.helpers.arrayElement(users)
    const basePrice = faker.number.int({ min: 100000, max: 50000000 })
    const originalPrice = faker.datatype.boolean({ probability: 0.3 })
      ? faker.number.int({
          min: Math.floor(basePrice * 1.1),
          max: Math.floor(basePrice * 1.5),
        })
      : undefined

    return {
      id: `product_${index + 1}`,
      title: productName,
      description: faker.commerce.productDescription(),
      price: basePrice,
      originalPrice,
      categoryId: category.id,
      category,
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.url()
      ),
      condition: faker.helpers.arrayElement([
        'new',
        'like_new',
        'good',
        'fair',
        'poor',
      ]),
      tags: faker.helpers.arrayElements(
        [
          'hot',
          'new',
          'sale',
          'trending',
          'limited',
          'premium',
          'eco-friendly',
          'handmade',
        ],
        { min: 1, max: 3 }
      ),
      location: faker.helpers.arrayElement(locations),
      stock: faker.number.int({ min: 0, max: 100 }),
      sellerId: seller.id,
      seller,
      store: seller.storeInfo,
      status: faker.helpers.arrayElement(['active', 'sold', 'draft']),
      badges: faker.helpers.arrayElements(
        ['NEW', 'FEATURED', 'PROMO', 'HOT', 'SALE'],
        { min: 0, max: 2 }
      ),
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 200 }),
      viewCount: faker.number.int({ min: 0, max: 1000 }),
      isFeatured: faker.datatype.boolean({ probability: 0.1 }),
      isPromoted: faker.datatype.boolean({ probability: 0.05 }),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }
  })
}

// Update category product counts
function updateCategoryCounts(products: Product[]): Category[] {
  const categoryCounts = products.reduce(
    (acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return categories.map(category => ({
    ...category,
    productCount: categoryCounts[category.id] || 0,
  }))
}

// Main seeder function
export function seedData() {
  console.log('🌱 Starting data seeding...')

  // Generate users
  const users = generateUsers(50)
  console.log(`✅ Generated ${users.length} users`)

  // Generate products
  const products = generateProducts(200, users)
  console.log(`✅ Generated ${products.length} products`)

  // Update category counts
  const updatedCategories = updateCategoryCounts(products)
  console.log(`✅ Updated category counts`)

  return {
    users,
    products,
    categories: updatedCategories,
  }
}

// Export individual data generators
export { generateUsers, generateProducts, updateCategoryCounts, categories }

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const data = seedData()

  console.log('\n📊 Seeding Summary:')
  console.log(`- Users: ${data.users.length}`)
  console.log(`- Products: ${data.products.length}`)
  console.log(`- Categories: ${data.categories.length}`)

  // Save to JSON files for development
  const fs = await import('fs')
  const path = await import('path')
  const { fileURLToPath } = await import('url')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const outputDir = path.join(__dirname, '../../public/data')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(outputDir, 'seed-data.json'),
    JSON.stringify(data, null, 2)
  )

  console.log(`\n💾 Data saved to ${outputDir}/seed-data.json`)
  console.log('🎉 Seeding completed!')
}
