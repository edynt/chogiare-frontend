export type Language = 'vi' | 'en'

export interface Translation {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    edit: string
    delete: string
    view: string
    search: string
    filter: string
    sort: string
    price: string
    quantity: string
    total: string
    subtotal: string
    shipping: string
    tax: string
    discount: string
    totalAmount: string
    continue: string
    back: string
    next: string
    previous: string
    close: string
    open: string
    yes: string
    no: string
    all: string
    none: string
    select: string
    selected: string
    clear: string
    reset: string
    apply: string
    submit: string
    login: string
    logout: string
    register: string
    profile: string
    settings: string
    help: string
    about: string
    contact: string
    terms: string
    privacy: string
    copyright: string
  }

  // Navigation
  nav: {
    home: string
    products: string
    categories: string
    sellers: string
    chat: string
    admin: string
    dashboard: string
    manageProducts: string
  }

  // Home page
  home: {
    title: string
    subtitle: string
    description: string
    cta: string
    features: {
      title: string
      items: Array<{
        title: string
        description: string
      }>
    }
    trust: {
      title: string
      items: Array<{
        title: string
        description: string
      }>
    }
  }

  // Product page
  product: {
    title: string
    description: string
    price: string
    originalPrice: string
    discount: string
    condition: string
    location: string
    seller: string
    rating: string
    reviews: string
    views: string
    stock: string
    addToCart: string
    buyNow: string
    contactSeller: string
    share: string
    report: string
    similarProducts: string
    productDetails: string
    specifications: string
    questions: string
    warranty: string
    returnPolicy: string
  }

  // Category page
  category: {
    title: string
    subtitle: string
    description: string
    featured: string
    trending: string
    all: string
    searchPlaceholder: string
    viewMode: {
      grid: string
      list: string
    }
    emptyState: {
      title: string
      description: string
      action: string
    }
    stats: {
      products: string
      subcategories: string
    }
  }

  // Chat page
  chat: {
    title: string
    subtitle: string
    searchPlaceholder: string
    selectChat: string
    typeMessage: string
    send: string
    online: string
    offline: string
    lastSeen: string
    typing: string
    delivered: string
    read: string
    trust: {
      security: string
      fastResponse: string
      support24: string
    }
  }

  // Admin page
  admin: {
    title: string
    subtitle: string
    overview: string
    users: string
    products: string
    orders: string
    settings: string
    stats: {
      totalUsers: string
      totalProducts: string
      totalOrders: string
      revenue: string
      activeUsers: string
      newProducts: string
      completedOrders: string
    }
    recentActivity: string
    quickActions: string
    pendingReviews: string
    manageUsers: string
    viewReports: string
    handleComplaints: string
    approveProducts: string
    productCategories: string
    violatedProducts: string
    pendingOrders: string
    completedOrders: string
    cancelledOrders: string
    security: string
    statistics: string
    generalSettings: string
  }

  // Auth page
  auth: {
    login: {
      title: string
      subtitle: string
      email: string
      password: string
      rememberMe: string
      forgotPassword: string
      noAccount: string
      signUp: string
    }
    register: {
      title: string
      subtitle: string
      fullName: string
      email: string
      password: string
      confirmPassword: string
      agreeTerms: string
      haveAccount: string
      signIn: string
    }
  }

  // Product management
  productManagement: {
    title: string
    addProduct: string
    editProduct: string
    deleteProduct: string
    productName: string
    productDescription: string
    category: string
    price: string
    originalPrice: string
    condition: string
    location: string
    stock: string
    images: string
    tags: string
    status: string
    featured: string
    promoted: string
    active: string
    inactive: string
    draft: string
    pending: string
    rejected: string
    stats: {
      total: string
      active: string
      sold: string
      outOfStock: string
    }
  }

  // Payment page
  payment: {
    title: string
    orderSummary: string
    paymentMethod: string
    deliveryAddress: string
    billingAddress: string
    sameAsDelivery: string
    placeOrder: string
    securePayment: string
    trust: {
      secure: string
      encrypted: string
      guaranteed: string
    }
  }
}

export const translations: Record<Language, Translation> = {
  vi: {
    common: {
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      save: 'Lưu',
      edit: 'Sửa',
      delete: 'Xóa',
      view: 'Xem',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      price: 'Giá',
      quantity: 'Số lượng',
      total: 'Tổng',
      subtotal: 'Tạm tính',
      shipping: 'Phí vận chuyển',
      tax: 'Thuế',
      discount: 'Giảm giá',
      totalAmount: 'Tổng tiền',
      continue: 'Tiếp tục',
      back: 'Quay lại',
      next: 'Tiếp theo',
      previous: 'Trước',
      close: 'Đóng',
      open: 'Mở',
      yes: 'Có',
      no: 'Không',
      all: 'Tất cả',
      none: 'Không có',
      select: 'Chọn',
      selected: 'Đã chọn',
      clear: 'Xóa',
      reset: 'Đặt lại',
      apply: 'Áp dụng',
      submit: 'Gửi',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      register: 'Đăng ký',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      help: 'Trợ giúp',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
      terms: 'Điều khoản',
      privacy: 'Bảo mật',
      copyright: 'Bản quyền',
    },
    nav: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      categories: 'Danh mục',
      sellers: 'Người bán',
      chat: 'Tin nhắn',
      admin: 'Quản trị',
      dashboard: 'Bảng điều khiển',
      manageProducts: 'Quản lý sản phẩm',
    },
    home: {
      title: 'Chogiare',
      subtitle: 'Nơi mua sắm giá tốt',
      description: 'Khám phá hàng nghìn sản phẩm chất lượng với giá cả hợp lý',
      cta: 'Bắt đầu mua sắm',
      features: {
        title: 'Tại sao chọn Chogiare?',
        items: [
          {
            title: 'Giá tốt nhất',
            description:
              'So sánh giá từ nhiều người bán để tìm được mức giá tốt nhất',
          },
          {
            title: 'Chất lượng đảm bảo',
            description: 'Tất cả sản phẩm đều được kiểm duyệt kỹ lưỡng',
          },
        ],
      },
      trust: {
        title: 'Tin tưởng và an toàn',
        items: [
          {
            title: 'Bảo mật tuyệt đối',
            description: 'Thông tin cá nhân được mã hóa và bảo vệ',
          },
          {
            title: 'Thanh toán an toàn',
            description: 'Hỗ trợ nhiều phương thức thanh toán bảo mật',
          },
          {
            title: 'Hỗ trợ 24/7',
            description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng',
          },
        ],
      },
    },
    product: {
      title: 'Chi tiết sản phẩm',
      description: 'Mô tả',
      price: 'Giá',
      originalPrice: 'Giá gốc',
      discount: 'Giảm giá',
      condition: 'Tình trạng',
      location: 'Vị trí',
      seller: 'Người bán',
      rating: 'Đánh giá',
      reviews: 'Đánh giá',
      views: 'Lượt xem',
      stock: 'Kho',
      addToCart: 'Thêm vào giỏ',
      buyNow: 'Mua ngay',
      contactSeller: 'Liên hệ người bán',
      share: 'Chia sẻ',
      report: 'Báo cáo',
      similarProducts: 'Sản phẩm tương tự',
      productDetails: 'Chi tiết sản phẩm',
      specifications: 'Thông số kỹ thuật',
      questions: 'Câu hỏi',
      warranty: 'Bảo hành',
      returnPolicy: 'Chính sách đổi trả',
    },
    category: {
      title: 'Danh mục sản phẩm',
      subtitle: 'Khám phá hàng nghìn sản phẩm được phân loại rõ ràng',
      description:
        'Khám phá hàng nghìn sản phẩm được phân loại rõ ràng, dễ dàng tìm kiếm',
      featured: 'Danh mục nổi bật',
      trending: 'Danh mục đang hot',
      all: 'Tất cả danh mục',
      searchPlaceholder: 'Tìm kiếm danh mục...',
      viewMode: {
        grid: 'Lưới',
        list: 'Danh sách',
      },
      emptyState: {
        title: 'Không tìm thấy danh mục',
        description: 'Không có danh mục nào phù hợp với từ khóa tìm kiếm',
        action: 'Xem tất cả danh mục',
      },
      stats: {
        products: 'sản phẩm',
        subcategories: 'danh mục con',
      },
    },
    chat: {
      title: 'Tin nhắn',
      subtitle:
        'Liên hệ trực tiếp với người bán để được tư vấn và hỗ trợ tốt nhất',
      searchPlaceholder: 'Tìm kiếm cuộc trò chuyện...',
      selectChat: 'Chọn cuộc trò chuyện',
      typeMessage: 'Nhập tin nhắn...',
      send: 'Gửi',
      online: 'Đang hoạt động',
      offline: 'Ngoại tuyến',
      lastSeen: 'Hoạt động lần cuối',
      typing: 'Đang nhập...',
      delivered: 'Đã gửi',
      read: 'Đã đọc',
      trust: {
        security: 'Bảo mật tuyệt đối',
        fastResponse: 'Phản hồi nhanh',
        support24: 'Hỗ trợ 24/7',
      },
    },
    admin: {
      title: 'Quản trị hệ thống',
      subtitle:
        'Quản lý toàn bộ hoạt động của nền tảng Chogiare - Nơi mua sắm giá tốt',
      overview: 'Tổng quan',
      users: 'Người dùng',
      products: 'Sản phẩm',
      orders: 'Đơn hàng',
      settings: 'Cài đặt',
      stats: {
        totalUsers: 'Tổng người dùng',
        totalProducts: 'Tổng sản phẩm',
        totalOrders: 'Tổng đơn hàng',
        revenue: 'Doanh thu',
        activeUsers: 'đang hoạt động',
        newProducts: 'sản phẩm mới',
        completedOrders: 'đã hoàn thành',
      },
      recentActivity: 'Hoạt động gần đây',
      quickActions: 'Thao tác nhanh',
      pendingReviews: 'Kiểm duyệt sản phẩm',
      manageUsers: 'Quản lý người dùng',
      viewReports: 'Xem báo cáo',
      handleComplaints: 'Xử lý khiếu nại',
      approveProducts: 'Kiểm duyệt sản phẩm',
      productCategories: 'Danh mục sản phẩm',
      violatedProducts: 'Sản phẩm vi phạm',
      pendingOrders: 'Đơn hàng chờ xử lý',
      completedOrders: 'Đơn hàng hoàn thành',
      cancelledOrders: 'Đơn hàng hủy',
      security: 'Bảo mật',
      statistics: 'Thống kê',
      generalSettings: 'Cấu hình chung',
    },
    auth: {
      login: {
        title: 'Đăng nhập',
        subtitle: 'Chào mừng bạn quay trở lại',
        email: 'Email',
        password: 'Mật khẩu',
        rememberMe: 'Ghi nhớ đăng nhập',
        forgotPassword: 'Quên mật khẩu?',
        noAccount: 'Chưa có tài khoản?',
        signUp: 'Đăng ký ngay',
      },
      register: {
        title: 'Đăng ký',
        subtitle: 'Tạo tài khoản mới',
        fullName: 'Họ và tên',
        email: 'Email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        agreeTerms: 'Tôi đồng ý với điều khoản sử dụng',
        haveAccount: 'Đã có tài khoản?',
        signIn: 'Đăng nhập',
      },
    },
    productManagement: {
      title: 'Quản lý sản phẩm',
      addProduct: 'Thêm sản phẩm',
      editProduct: 'Sửa sản phẩm',
      deleteProduct: 'Xóa sản phẩm',
      productName: 'Tên sản phẩm',
      productDescription: 'Mô tả sản phẩm',
      category: 'Danh mục',
      price: 'Giá',
      originalPrice: 'Giá gốc',
      condition: 'Tình trạng',
      location: 'Vị trí',
      stock: 'Số lượng',
      images: 'Hình ảnh',
      tags: 'Thẻ',
      status: 'Trạng thái',
      featured: 'Nổi bật',
      promoted: 'Quảng cáo',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      draft: 'Bản nháp',
      pending: 'Chờ duyệt',
      rejected: 'Từ chối',
      stats: {
        total: 'Tổng số',
        active: 'Đang bán',
        sold: 'Đã bán',
        outOfStock: 'Hết hàng',
      },
    },
    payment: {
      title: 'Thanh toán',
      orderSummary: 'Tóm tắt đơn hàng',
      paymentMethod: 'Phương thức thanh toán',
      deliveryAddress: 'Địa chỉ giao hàng',
      billingAddress: 'Địa chỉ thanh toán',
      sameAsDelivery: 'Giống địa chỉ giao hàng',
      placeOrder: 'Đặt hàng',
      securePayment: 'Thanh toán an toàn',
      trust: {
        secure: 'Bảo mật',
        encrypted: 'Mã hóa',
        guaranteed: 'Đảm bảo',
      },
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      discount: 'Discount',
      totalAmount: 'Total Amount',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      all: 'All',
      none: 'None',
      select: 'Select',
      selected: 'Selected',
      clear: 'Clear',
      reset: 'Reset',
      apply: 'Apply',
      submit: 'Submit',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      profile: 'Profile',
      settings: 'Settings',
      help: 'Help',
      about: 'About',
      contact: 'Contact',
      terms: 'Terms',
      privacy: 'Privacy',
      copyright: 'Copyright',
    },
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      sellers: 'Sellers',
      chat: 'Messages',
      admin: 'Admin',
      dashboard: 'Dashboard',
      manageProducts: 'Manage Products',
    },
    home: {
      title: 'Chogiare',
      subtitle: 'Where to shop for good prices',
      description:
        'Discover thousands of quality products at reasonable prices',
      cta: 'Start Shopping',
      features: {
        title: 'Why choose Chogiare?',
        items: [
          {
            title: 'Best Prices',
            description:
              'Compare prices from multiple sellers to find the best deals',
          },
          {
            title: 'Quality Guaranteed',
            description: 'All products are carefully reviewed and verified',
          },
          {
            title: 'Fast Delivery',
            description: 'Receive items within 24-48 hours in major cities',
          },
        ],
      },
      trust: {
        title: 'Trust and Security',
        items: [
          {
            title: 'Absolute Security',
            description: 'Personal information is encrypted and protected',
          },
          {
            title: 'Secure Payment',
            description: 'Support for multiple secure payment methods',
          },
          {
            title: '24/7 Support',
            description: 'Customer service team is always ready to help',
          },
        ],
      },
    },
    product: {
      title: 'Product Details',
      description: 'Description',
      price: 'Price',
      originalPrice: 'Original Price',
      discount: 'Discount',
      condition: 'Condition',
      location: 'Location',
      seller: 'Seller',
      rating: 'Rating',
      reviews: 'Reviews',
      views: 'Views',
      stock: 'Stock',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      contactSeller: 'Contact Seller',
      share: 'Share',
      report: 'Report',
      similarProducts: 'Similar Products',
      productDetails: 'Product Details',
      specifications: 'Specifications',
      questions: 'Questions',
      warranty: 'Warranty',
      returnPolicy: 'Return Policy',
    },
    category: {
      title: 'Product Categories',
      subtitle: 'Discover thousands of clearly categorized products',
      description:
        'Discover thousands of clearly categorized products, easy to search',
      featured: 'Featured Categories',
      trending: 'Trending Categories',
      all: 'All Categories',
      searchPlaceholder: 'Search categories...',
      viewMode: {
        grid: 'Grid',
        list: 'List',
      },
      emptyState: {
        title: 'No categories found',
        description: 'No categories match your search criteria',
        action: 'View all categories',
      },
      stats: {
        products: 'products',
        subcategories: 'subcategories',
      },
    },
    chat: {
      title: 'Messages',
      subtitle: 'Contact sellers directly for consultation and support',
      searchPlaceholder: 'Search conversations...',
      selectChat: 'Select a conversation',
      typeMessage: 'Type a message...',
      send: 'Send',
      online: 'Online',
      offline: 'Offline',
      lastSeen: 'Last seen',
      typing: 'Typing...',
      delivered: 'Delivered',
      read: 'Read',
      trust: {
        security: 'Absolute Security',
        fastResponse: 'Fast Response',
        support24: '24/7 Support',
      },
    },
    admin: {
      title: 'System Administration',
      subtitle:
        'Manage all activities of Chogiare platform - Where to shop for good prices',
      overview: 'Overview',
      users: 'Users',
      products: 'Products',
      orders: 'Orders',
      settings: 'Settings',
      stats: {
        totalUsers: 'Total Users',
        totalProducts: 'Total Products',
        totalOrders: 'Total Orders',
        revenue: 'Revenue',
        activeUsers: 'active',
        newProducts: 'new products',
        completedOrders: 'completed',
      },
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      pendingReviews: 'Approve Products',
      manageUsers: 'Manage Users',
      viewReports: 'View Reports',
      handleComplaints: 'Handle Complaints',
      approveProducts: 'Approve Products',
      productCategories: 'Product Categories',
      violatedProducts: 'Violated Products',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      cancelledOrders: 'Cancelled Orders',
      security: 'Security',
      statistics: 'Statistics',
      generalSettings: 'General Settings',
    },
    auth: {
      login: {
        title: 'Login',
        subtitle: 'Welcome back',
        email: 'Email',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        signUp: 'Sign up now',
      },
      register: {
        title: 'Register',
        subtitle: 'Create new account',
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        agreeTerms: 'I agree to the terms of service',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
      },
    },
    productManagement: {
      title: 'Product Management',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      productName: 'Product Name',
      productDescription: 'Product Description',
      category: 'Category',
      price: 'Price',
      originalPrice: 'Original Price',
      condition: 'Condition',
      location: 'Location',
      stock: 'Stock',
      images: 'Images',
      tags: 'Tags',
      status: 'Status',
      featured: 'Featured',
      promoted: 'Promoted',
      active: 'Active',
      inactive: 'Inactive',
      draft: 'Draft',
      pending: 'Pending',
      rejected: 'Rejected',
      stats: {
        total: 'Total',
        active: 'Active',
        sold: 'Sold',
        outOfStock: 'Out of Stock',
      },
    },
    payment: {
      title: 'Payment',
      orderSummary: 'Order Summary',
      paymentMethod: 'Payment Method',
      deliveryAddress: 'Delivery Address',
      billingAddress: 'Billing Address',
      sameAsDelivery: 'Same as delivery address',
      placeOrder: 'Place Order',
      securePayment: 'Secure Payment',
      trust: {
        secure: 'Secure',
        encrypted: 'Encrypted',
        guaranteed: 'Guaranteed',
      },
    },
  },
}

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return typeof value === 'string' ? value : key
}

export const useTranslation = (language: Language) => {
  return {
    t: (key: string) => getTranslation(language, key),
    language,
  }
}
