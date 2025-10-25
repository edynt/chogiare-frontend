import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SEOHead } from '@/components/seo/SEOHead'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Headphones,
  Mail as MailIcon,
  MessageSquare,
  Calendar,
  User,
  Building
} from 'lucide-react'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactMethods = [
    {
      icon: Phone,
      title: 'Điện thoại',
      description: 'Gọi trực tiếp cho chúng tôi',
      contact: '1900 123 456',
      availability: '24/7',
      color: 'text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Gửi email cho chúng tôi',
      contact: 'contact@chogiare.com',
      availability: 'Phản hồi trong 24h',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat trực tiếp với hỗ trợ',
      contact: 'Bắt đầu chat',
      availability: '8:00 - 22:00',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Văn phòng',
      description: 'Đến trực tiếp văn phòng',
      contact: 'Tầng 10, Tòa nhà ABC, Hà Nội',
      availability: '8:00 - 17:30',
      color: 'text-orange-600'
    }
  ]

  const departments = [
    {
      name: 'Hỗ trợ khách hàng',
      email: 'support@chogiare.com',
      phone: '1900 123 456',
      description: 'Hỗ trợ về đơn hàng, thanh toán, giao hàng'
    },
    {
      name: 'Hỗ trợ người bán',
      email: 'seller@chogiare.com',
      phone: '1900 123 457',
      description: 'Hỗ trợ về tài khoản người bán, đăng sản phẩm'
    },
    {
      name: 'Hợp tác kinh doanh',
      email: 'partnership@chogiare.com',
      phone: '1900 123 458',
      description: 'Hợp tác, quảng cáo, liên kết'
    },
    {
      name: 'Báo chí & Truyền thông',
      email: 'press@chogiare.com',
      phone: '1900 123 459',
      description: 'Thông tin báo chí, phỏng vấn'
    }
  ]

  const faqs = [
    {
      question: 'Làm thế nào để liên hệ hỗ trợ khách hàng?',
      answer: 'Bạn có thể liên hệ qua điện thoại 1900 123 456, email support@chogiare.com hoặc sử dụng live chat trên website.'
    },
    {
      question: 'Thời gian phản hồi email là bao lâu?',
      answer: 'Chúng tôi cam kết phản hồi email trong vòng 24 giờ làm việc. Với các vấn đề khẩn cấp, vui lòng gọi hotline.'
    },
    {
      question: 'Có thể đến trực tiếp văn phòng không?',
      answer: 'Có, bạn có thể đến văn phòng tại Tầng 10, Tòa nhà ABC, Hà Nội trong giờ hành chính (8:00 - 17:30).'
    },
    {
      question: 'Live chat có hoạt động 24/7 không?',
      answer: 'Live chat hoạt động từ 8:00 - 22:00 hàng ngày. Ngoài giờ này, vui lòng sử dụng email hoặc để lại tin nhắn.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Liên hệ - Chogiare"
        description="Liên hệ với Chogiare để được hỗ trợ, tư vấn hoặc báo cáo vấn đề. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7."
        keywords="liên hệ, hỗ trợ, tư vấn, chogiare, customer service"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Liên hệ Chogiare",
          "description": "Trang liên hệ và hỗ trợ khách hàng của Chogiare",
          "mainEntity": {
            "@type": "Organization",
            "name": "Chogiare",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84-xxx-xxx-xxx",
              "contactType": "customer service",
              "availableLanguage": "Vietnamese"
            }
          }
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến từ bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Cách liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${method.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                        <p className="font-medium text-sm">{method.contact}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {method.availability}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Phòng ban
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="font-semibold mb-1">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-3 w-3" />
                        <span>{dept.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{dept.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Tin nhắn đã được gửi!</h3>
                    <p className="text-muted-foreground mb-4">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Nhập email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Chủ đề</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chủ đề" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Câu hỏi chung</SelectItem>
                            <SelectItem value="order">Đơn hàng</SelectItem>
                            <SelectItem value="payment">Thanh toán</SelectItem>
                            <SelectItem value="shipping">Giao hàng</SelectItem>
                            <SelectItem value="technical">Hỗ trợ kỹ thuật</SelectItem>
                            <SelectItem value="business">Hợp tác kinh doanh</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Nhập tiêu đề tin nhắn"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Nội dung *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Nhập nội dung tin nhắn..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Các trường có dấu * là bắt buộc</span>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Câu hỏi thường gặp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Info */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Địa chỉ văn phòng</h3>
                <p className="text-muted-foreground">
                  Tầng 10, Tòa nhà ABC<br />
                  123 Đường ABC, Quận XYZ<br />
                  Hà Nội, Việt Nam
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
                <p className="text-muted-foreground">
                  Thứ 2 - Thứ 6: 8:00 - 17:30<br />
                  Thứ 7: 8:00 - 12:00<br />
                  Chủ nhật: Nghỉ
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
                <p className="text-muted-foreground">
                  Hotline: 1900 123 456<br />
                  Email: support@chogiare.com<br />
                  Live Chat: Có sẵn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
