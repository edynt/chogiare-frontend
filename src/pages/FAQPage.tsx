import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
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
  Info
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
  isExpanded?: boolean
}

export default function FAQPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = [
    { id: 'all', name: 'Tất cả', icon: HelpCircle },
    { id: 'shopping', name: 'Mua sắm', icon: ShoppingCart },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard },
    { id: 'shipping', name: 'Giao hàng', icon: Truck },
    { id: 'account', name: 'Tài khoản', icon: User },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'support', name: 'Hỗ trợ', icon: MessageCircle }
  ]

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Làm thế nào để đặt hàng trên Chogiare?',
      answer: 'Để đặt hàng trên Chogiare, bạn cần: 1) Tìm kiếm sản phẩm mong muốn, 2) Chọn sản phẩm và nhấn "Mua ngay" hoặc "Thêm vào giỏ", 3) Kiểm tra thông tin đơn hàng, 4) Chọn phương thức thanh toán, 5) Xác nhận đơn hàng. Bạn sẽ nhận được email xác nhận đơn hàng sau khi đặt thành công.',
      category: 'shopping',
      tags: ['đặt hàng', 'mua sắm', 'hướng dẫn'],
      helpful: 245,
      notHelpful: 12
    },
    {
      id: '2',
      question: 'Các phương thức thanh toán nào được chấp nhận?',
      answer: 'Chogiare chấp nhận nhiều phương thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), Ví điện tử (MoMo, ZaloPay, VNPay), Chuyển khoản ngân hàng, Thanh toán khi nhận hàng (COD), Ví Chogiare. Tất cả giao dịch đều được mã hóa và bảo mật tuyệt đối.',
      category: 'payment',
      tags: ['thanh toán', 'thẻ tín dụng', 'ví điện tử', 'cod'],
      helpful: 189,
      notHelpful: 8
    },
    {
      id: '3',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng phụ thuộc vào vị trí và loại sản phẩm: Nội thành Hà Nội/TP.HCM: 1-2 ngày, Các tỉnh thành khác: 2-5 ngày, Vùng sâu vùng xa: 5-7 ngày. Sản phẩm đặc biệt (điện tử, đồng hồ) có thể cần thêm 1-2 ngày để kiểm tra chất lượng.',
      category: 'shipping',
      tags: ['giao hàng', 'thời gian', 'vận chuyển'],
      helpful: 156,
      notHelpful: 15
    },
    {
      id: '4',
      question: 'Làm thế nào để tạo tài khoản?',
      answer: 'Để tạo tài khoản Chogiare: 1) Nhấn "Đăng ký" ở góc phải màn hình, 2) Nhập thông tin cá nhân (họ tên, email, số điện thoại), 3) Tạo mật khẩu mạnh, 4) Xác thực email qua link được gửi, 5) Hoàn tất đăng ký. Bạn có thể đăng nhập ngay sau khi xác thực email.',
      category: 'account',
      tags: ['đăng ký', 'tài khoản', 'hướng dẫn'],
      helpful: 98,
      notHelpful: 5
    },
    {
      id: '5',
      question: 'Thông tin cá nhân có được bảo mật không?',
      answer: 'Chogiare cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Chúng tôi sử dụng mã hóa SSL 256-bit, tuân thủ các tiêu chuẩn bảo mật quốc tế, không chia sẻ thông tin với bên thứ ba, và có hệ thống giám sát bảo mật 24/7. Thông tin chỉ được sử dụng để cung cấp dịch vụ và cải thiện trải nghiệm mua sắm.',
      category: 'security',
      tags: ['bảo mật', 'thông tin cá nhân', 'privacy'],
      helpful: 203,
      notHelpful: 7
    },
    {
      id: '6',
      question: 'Có thể hủy đơn hàng sau khi đặt không?',
      answer: 'Có, bạn có thể hủy đơn hàng trong các trường hợp: Đơn hàng chưa được xác nhận (hủy ngay), Đơn hàng đã xác nhận nhưng chưa giao (hủy trong 30 phút), Đơn hàng đang giao (liên hệ hotline). Để hủy đơn hàng, vào "Đơn hàng của tôi" và chọn "Hủy đơn hàng" hoặc gọi hotline 1900 123 456.',
      category: 'shopping',
      tags: ['hủy đơn hàng', 'đơn hàng', 'hỗ trợ'],
      helpful: 134,
      notHelpful: 18
    },
    {
      id: '7',
      question: 'Làm thế nào để đổi/trả hàng?',
      answer: 'Chogiare hỗ trợ đổi/trả hàng trong 30 ngày kể từ ngày nhận hàng với điều kiện: Sản phẩm còn nguyên vẹn, có hóa đơn mua hàng, không thuộc danh mục không đổi trả. Quy trình: 1) Liên hệ hotline hoặc chat, 2) Cung cấp thông tin đơn hàng, 3) Gửi hàng về kho, 4) Kiểm tra và xử lý, 5) Hoàn tiền hoặc đổi hàng mới.',
      category: 'shopping',
      tags: ['đổi trả', 'hoàn tiền', 'chính sách'],
      helpful: 167,
      notHelpful: 22
    },
    {
      id: '8',
      question: 'Phí vận chuyển được tính như thế nào?',
      answer: 'Phí vận chuyển được tính dựa trên: Khoảng cách (nội thành, liên tỉnh), Trọng lượng và kích thước sản phẩm, Phương thức vận chuyển (tiêu chuẩn, nhanh, siêu tốc). Miễn phí ship cho đơn hàng từ 300.000đ trong nội thành, từ 500.000đ cho các tỉnh thành khác. Bạn có thể xem phí ship chính xác khi thanh toán.',
      category: 'shipping',
      tags: ['phí vận chuyển', 'ship', 'miễn phí'],
      helpful: 145,
      notHelpful: 11
    },
    {
      id: '9',
      question: 'Làm thế nào để liên hệ hỗ trợ khách hàng?',
      answer: 'Bạn có thể liên hệ hỗ trợ qua: Hotline: 1900 123 456 (24/7), Email: support@chogiare.com, Live Chat trên website (8:00-22:00), Facebook Messenger, Zalo OA. Với các vấn đề khẩn cấp, vui lòng gọi hotline để được hỗ trợ nhanh nhất.',
      category: 'support',
      tags: ['hỗ trợ', 'liên hệ', 'hotline', 'chat'],
      helpful: 178,
      notHelpful: 9
    },
    {
      id: '10',
      question: 'Có chương trình khuyến mãi nào không?',
      answer: 'Chogiare thường xuyên có các chương trình khuyến mãi: Flash Sale hàng ngày, Mã giảm giá cho khách hàng mới, Chương trình tích điểm đổi quà, Miễn phí ship cho đơn hàng đủ điều kiện, Khuyến mãi theo mùa và ngày lễ. Theo dõi trang "Khuyến mãi" hoặc đăng ký nhận thông báo để không bỏ lỡ ưu đãi.',
      category: 'shopping',
      tags: ['khuyến mãi', 'giảm giá', 'flash sale'],
      helpful: 198,
      notHelpful: 6
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
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

  const handleHelpful = (id: string, isHelpful: boolean) => {
    // In a real app, this would make an API call
    console.log(`FAQ ${id} marked as ${isHelpful ? 'helpful' : 'not helpful'}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Câu hỏi thường gặp</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Tìm câu trả lời cho những thắc mắc phổ biến về dịch vụ của chúng tôi
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = category.id === 'all' ? faqs.length : faqs.filter(f => f.category === category.id).length
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy câu hỏi</h3>
                  <p className="text-muted-foreground mb-4">
                    Không có câu hỏi nào phù hợp với tìm kiếm của bạn
                  </p>
                  <Button onClick={() => setSearchQuery('')}>
                    Xóa bộ lọc
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(faq.id)}
                      >
                        {expandedItems.has(faq.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedItems.has(faq.id) && (
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Câu trả lời này có hữu ích không?</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleHelpful(faq.id, true)}
                                className="text-success hover:text-success"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Có ({faq.helpful})
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleHelpful(faq.id, false)}
                                className="text-destructive hover:text-destructive"
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Không ({faq.notHelpful})
                              </Button>
                            </div>
                          </div>
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
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy câu trả lời?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi để được tư vấn chi tiết
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="tel:1900123456">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Gọi hotline: 1900 123 456
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="mailto:support@chogiare.com">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Email hỗ trợ
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
