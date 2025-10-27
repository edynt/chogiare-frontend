import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SEOHead } from '@/components/seo/SEOHead'
import { 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Truck,
  User,
  Shield,
  MessageCircle,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Phone,
  Mail,
  MapPin,
  Clock,
  Headphones,
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  Users,
  Settings,
  Package,
  Heart
} from 'lucide-react'

interface HelpSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  items: HelpItem[]
}

interface HelpItem {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'guide' | 'faq'
  url?: string
  duration?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Bắt đầu',
      description: 'Hướng dẫn cơ bản để sử dụng Chogiare',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'text-blue-600',
      items: [
        {
          id: 'create-account',
          title: 'Tạo tài khoản mới',
          description: 'Hướng dẫn từng bước tạo tài khoản Chogiare',
          type: 'guide',
          duration: '5 phút',
          difficulty: 'easy'
        },
        {
          id: 'first-order',
          title: 'Đặt hàng lần đầu',
          description: 'Cách đặt hàng và thanh toán trên Chogiare',
          type: 'video',
          duration: '3 phút',
          difficulty: 'easy'
        },
        {
          id: 'profile-setup',
          title: 'Thiết lập hồ sơ cá nhân',
          description: 'Cập nhật thông tin cá nhân và địa chỉ giao hàng',
          type: 'article',
          duration: '2 phút',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'shopping',
      title: 'Mua sắm',
      description: 'Tất cả về việc mua sắm trên Chogiare',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'text-green-600',
      items: [
        {
          id: 'search-products',
          title: 'Tìm kiếm sản phẩm',
          description: 'Cách tìm kiếm và lọc sản phẩm hiệu quả',
          type: 'guide',
          duration: '4 phút',
          difficulty: 'easy'
        },
        {
          id: 'compare-products',
          title: 'So sánh sản phẩm',
          description: 'Sử dụng tính năng so sánh để chọn sản phẩm tốt nhất',
          type: 'video',
          duration: '2 phút',
          difficulty: 'easy'
        },
        {
          id: 'wishlist',
          title: 'Danh sách yêu thích',
          description: 'Lưu sản phẩm yêu thích và chia sẻ với bạn bè',
          type: 'article',
          duration: '3 phút',
          difficulty: 'easy'
        },
        {
          id: 'reviews',
          title: 'Đánh giá sản phẩm',
          description: 'Cách viết đánh giá hữu ích và đọc đánh giá của người khác',
          type: 'guide',
          duration: '5 phút',
          difficulty: 'medium'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      description: 'Quản lý đơn hàng và theo dõi vận chuyển',
      icon: <Package className="h-6 w-6" />,
      color: 'text-purple-600',
      items: [
        {
          id: 'track-order',
          title: 'Theo dõi đơn hàng',
          description: 'Kiểm tra trạng thái đơn hàng và vị trí giao hàng',
          type: 'guide',
          duration: '3 phút',
          difficulty: 'easy'
        },
        {
          id: 'cancel-order',
          title: 'Hủy đơn hàng',
          description: 'Cách hủy đơn hàng và điều kiện hoàn tiền',
          type: 'article',
          duration: '4 phút',
          difficulty: 'medium'
        },
        {
          id: 'return-refund',
          title: 'Đổi trả và hoàn tiền',
          description: 'Quy trình đổi trả sản phẩm và hoàn tiền',
          type: 'video',
          duration: '6 phút',
          difficulty: 'medium'
        },
        {
          id: 'order-history',
          title: 'Lịch sử đơn hàng',
          description: 'Xem và quản lý lịch sử mua hàng',
          type: 'guide',
          duration: '2 phút',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Thanh toán',
      description: 'Các phương thức thanh toán và bảo mật',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'text-orange-600',
      items: [
        {
          id: 'payment-methods',
          title: 'Phương thức thanh toán',
          description: 'Tất cả các cách thanh toán được hỗ trợ',
          type: 'article',
          duration: '3 phút',
          difficulty: 'easy'
        },
        {
          id: 'payment-security',
          title: 'Bảo mật thanh toán',
          description: 'Cách Chogiare bảo vệ thông tin thanh toán của bạn',
          type: 'guide',
          duration: '4 phút',
          difficulty: 'medium'
        },
        {
          id: 'installment',
          title: 'Trả góp',
          description: 'Hướng dẫn sử dụng tính năng trả góp',
          type: 'video',
          duration: '5 phút',
          difficulty: 'medium'
        },
        {
          id: 'vouchers',
          title: 'Mã giảm giá và voucher',
          description: 'Cách sử dụng mã giảm giá và voucher',
          type: 'guide',
          duration: '3 phút',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Giao hàng',
      description: 'Thông tin về vận chuyển và giao hàng',
      icon: <Truck className="h-6 w-6" />,
      color: 'text-teal-600',
      items: [
        {
          id: 'shipping-rates',
          title: 'Phí vận chuyển',
          description: 'Cách tính phí ship và điều kiện miễn phí',
          type: 'article',
          duration: '3 phút',
          difficulty: 'easy'
        },
        {
          id: 'delivery-time',
          title: 'Thời gian giao hàng',
          description: 'Thời gian giao hàng theo từng khu vực',
          type: 'guide',
          duration: '2 phút',
          difficulty: 'easy'
        },
        {
          id: 'delivery-options',
          title: 'Tùy chọn giao hàng',
          description: 'Các phương thức giao hàng có sẵn',
          type: 'video',
          duration: '4 phút',
          difficulty: 'easy'
        },
        {
          id: 'tracking',
          title: 'Theo dõi vận chuyển',
          description: 'Cách theo dõi đơn hàng đang vận chuyển',
          type: 'guide',
          duration: '3 phút',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'account',
      title: 'Tài khoản',
      description: 'Quản lý tài khoản và cài đặt cá nhân',
      icon: <User className="h-6 w-6" />,
      color: 'text-indigo-600',
      items: [
        {
          id: 'profile-settings',
          title: 'Cài đặt hồ sơ',
          description: 'Cập nhật thông tin cá nhân và tài khoản',
          type: 'guide',
          duration: '4 phút',
          difficulty: 'easy'
        },
        {
          id: 'password-security',
          title: 'Bảo mật mật khẩu',
          description: 'Cách tạo và bảo vệ mật khẩu mạnh',
          type: 'article',
          duration: '3 phút',
          difficulty: 'medium'
        },
        {
          id: 'two-factor',
          title: 'Xác thực 2 lớp',
          description: 'Thiết lập xác thực 2 lớp để bảo mật tài khoản',
          type: 'video',
          duration: '5 phút',
          difficulty: 'hard'
        },
        {
          id: 'privacy-settings',
          title: 'Cài đặt riêng tư',
          description: 'Quản lý quyền riêng tư và chia sẻ thông tin',
          type: 'guide',
          duration: '4 phút',
          difficulty: 'medium'
        }
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Liên hệ hỗ trợ',
      description: 'Chat trực tiếp với đội ngũ hỗ trợ',
      icon: <MessageCircle className="h-5 w-5" />,
      action: 'contact',
      color: 'bg-blue-500'
    },
    {
      title: 'Gọi hotline',
      description: '1900 123 456 - Hỗ trợ 24/7',
      icon: <Phone className="h-5 w-5" />,
      action: 'call',
      color: 'bg-green-500'
    },
    {
      title: 'Email hỗ trợ',
      description: 'Gửi email cho chúng tôi',
      icon: <Mail className="h-5 w-5" />,
      action: 'email',
      color: 'bg-purple-500'
    },
    {
      title: 'Tải ứng dụng',
      description: 'Tải app Chogiare trên điện thoại',
      icon: <Download className="h-5 w-5" />,
      action: 'download',
      color: 'bg-orange-500'
    }
  ]

  const popularTopics = [
    {
      title: 'Làm thế nào để đặt hàng?',
      category: 'Mua sắm',
      views: 1250
    },
    {
      title: 'Cách theo dõi đơn hàng',
      category: 'Đơn hàng',
      views: 980
    },
    {
      title: 'Phương thức thanh toán',
      category: 'Thanh toán',
      views: 850
    },
    {
      title: 'Chính sách đổi trả',
      category: 'Đơn hàng',
      views: 720
    },
    {
      title: 'Tạo tài khoản mới',
      category: 'Tài khoản',
      views: 650
    }
  ]

  const allItems = helpSections.flatMap(section => section.items)
  
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSection = selectedSection === 'all' || 
                           helpSections.find(s => s.id === selectedSection)?.items.includes(item)
    return matchesSearch && matchesSection
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'guide': return <BookOpen className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'faq': return <HelpCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trung tâm trợ giúp - Chogiare"
        description="Tìm kiếm câu trả lời, hướng dẫn và hỗ trợ cho tất cả các dịch vụ của Chogiare. Trung tâm trợ giúp toàn diện với video, bài viết và hướng dẫn chi tiết."
        keywords="trợ giúp, hỗ trợ, hướng dẫn, FAQ, chogiare, customer support"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Trung tâm trợ giúp Chogiare",
          "description": "Trung tâm trợ giúp và hỗ trợ khách hàng của Chogiare"
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Trung tâm trợ giúp</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Tìm kiếm câu trả lời, hướng dẫn và hỗ trợ cho tất cả các dịch vụ của chúng tôi
          </p>
          
          {/* Search */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Tìm kiếm câu trả lời..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Danh mục trợ giúp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedSection === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSection('all')}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Tất cả
                  <Badge variant="secondary" className="ml-auto">
                    {allItems.length}
                  </Badge>
                </Button>
                {helpSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className={section.color}>
                      {section.icon}
                    </div>
                    <span className="ml-2">{section.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {section.items.length}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Chủ đề phổ biến
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularTopics.map((topic, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium text-sm mb-1">{topic.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{topic.category}</span>
                      <span>{topic.views} lượt xem</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Help Content */}
          <div className="lg:col-span-3 space-y-6">
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-muted-foreground mb-4">
                    Không có bài viết nào phù hợp với tìm kiếm của bạn
                  </p>
                  <Button onClick={() => setSearchQuery('')}>
                    Xóa bộ lọc
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {item.type === 'video' ? 'Video' : 
                         item.type === 'guide' ? 'Hướng dẫn' :
                         item.type === 'article' ? 'Bài viết' : 'FAQ'}
                      </Badge>
                      {item.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration}
                        </Badge>
                      )}
                      {item.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty === 'easy' ? 'Dễ' :
                           item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </Badge>
                      )}
                    </div>

                    {expandedItems.has(item.id) && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="h-4 w-4" />
                          <span>Nội dung chi tiết sẽ được hiển thị ở đây</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Yêu thích
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Headphones className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Cần hỗ trợ thêm?</h2>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="tel:1900123456">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi hotline: 1900 123 456
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="/contact">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Liên hệ hỗ trợ
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
