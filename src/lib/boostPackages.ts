export interface BoostPackage {
  id: string
  name: string
  type: 'payPerView' | 'payPerDay' | 'featuredSlot' | 'boostToCategory'
  price: number
  description: string
  config?: {
    views?: number
    days?: number
    showInBanner?: boolean
    showInTopList?: boolean
    pricePer1000Views?: number
  }
}

export const BOOST_PACKAGES: Record<string, BoostPackage[]> = {
  payPerView: [
    {
      id: 'ppv_1k',
      name: '1,000 lượt xem',
      type: 'payPerView',
      price: 50000,
      description: 'Trả phí theo số lượt xem thực tế',
      config: { views: 1000, pricePer1000Views: 50000 }
    },
    {
      id: 'ppv_5k',
      name: '5,000 lượt xem',
      type: 'payPerView',
      price: 200000,
      description: 'Trả phí theo số lượt xem thực tế',
      config: { views: 5000, pricePer1000Views: 40000 }
    }
  ],
  payPerDay: [
    {
      id: 'ppd_1',
      name: '1 ngày',
      type: 'payPerDay',
      price: 50000,
      description: 'Đẩy bài trong 1 ngày',
      config: { days: 1 }
    },
    {
      id: 'ppd_3',
      name: '3 ngày',
      type: 'payPerDay',
      price: 120000,
      description: 'Đẩy bài trong 3 ngày',
      config: { days: 3 }
    },
    {
      id: 'ppd_7',
      name: '7 ngày',
      type: 'payPerDay',
      price: 250000,
      description: 'Đẩy bài trong 7 ngày',
      config: { days: 7 }
    }
  ],
  featuredSlot: [
    {
      id: 'featured_1',
      name: 'Vị trí nổi bật - 1 ngày',
      type: 'featuredSlot',
      price: 100000,
      description: 'Hiển thị ở banner và top danh sách',
      config: { days: 1, showInBanner: true, showInTopList: true }
    },
    {
      id: 'featured_7',
      name: 'Vị trí nổi bật - 7 ngày',
      type: 'featuredSlot',
      price: 600000,
      description: 'Hiển thị ở banner và top danh sách',
      config: { days: 7, showInBanner: true, showInTopList: true }
    }
  ],
  boostToCategory: [
    {
      id: 'category_3',
      name: 'Đẩy lên danh mục - 3 ngày',
      type: 'boostToCategory',
      price: 80000,
      description: 'Đẩy sản phẩm lên đầu danh mục',
      config: { days: 3 }
    },
    {
      id: 'category_7',
      name: 'Đẩy lên danh mục - 7 ngày',
      type: 'boostToCategory',
      price: 180000,
      description: 'Đẩy sản phẩm lên đầu danh mục',
      config: { days: 7 }
    }
  ]
}

// TYPE_INFO will be defined in components that use it with actual icon components

