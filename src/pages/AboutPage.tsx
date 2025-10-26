import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SEOHead } from '@/components/seo/SEOHead'
import { 
  Heart,
  Users,
  Target,
  Award,
  Globe,
  Shield,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react'

export default function AboutPage() {

  const stats = [
    { label: 'Người dùng', value: '1M+', icon: Users },
    { label: 'Sản phẩm', value: '500K+', icon: Target },
    { label: 'Giao dịch', value: '10M+', icon: TrendingUp },
    { label: 'Đánh giá', value: '4.8/5', icon: Star }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Tâm huyết',
      description: 'Chúng tôi đặt khách hàng làm trung tâm, luôn nỗ lực mang đến trải nghiệm mua sắm tốt nhất.'
    },
    {
      icon: Shield,
      title: 'Tin cậy',
      description: 'Cam kết bảo mật thông tin và giao dịch an toàn cho mọi khách hàng.'
    },
    {
      icon: Zap,
      title: 'Nhanh chóng',
      description: 'Tối ưu hóa quy trình để mang đến dịch vụ nhanh chóng và hiệu quả.'
    },
    {
      icon: Globe,
      title: 'Toàn cầu',
      description: 'Kết nối người mua và người bán trên toàn quốc với tiêu chuẩn quốc tế.'
    }
  ]

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: 'https://i.pravatar.cc/150?img=1',
      description: '15 năm kinh nghiệm trong lĩnh vực thương mại điện tử'
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: 'https://i.pravatar.cc/150?img=2',
      description: 'Chuyên gia công nghệ với 12 năm phát triển hệ thống'
    },
    {
      name: 'Lê Văn C',
      position: 'CMO',
      avatar: 'https://i.pravatar.cc/150?img=3',
      description: 'Chuyên gia marketing với nhiều chiến dịch thành công'
    },
    {
      name: 'Phạm Thị D',
      position: 'Head of Operations',
      avatar: 'https://i.pravatar.cc/150?img=4',
      description: 'Quản lý vận hành với kinh nghiệm 10 năm'
    }
  ]

  const achievements = [
    {
      year: '2020',
      title: 'Thành lập',
      description: 'Chogiare được thành lập với tầm nhìn trở thành nền tảng mua sắm hàng đầu Việt Nam'
    },
    {
      year: '2021',
      title: '1 triệu người dùng',
      description: 'Đạt mốc 1 triệu người dùng đăng ký trong năm đầu tiên'
    },
    {
      year: '2022',
      title: 'Giải thưởng E-commerce',
      description: 'Nhận giải thưởng "Nền tảng thương mại điện tử tốt nhất Việt Nam"'
    },
    {
      year: '2023',
      title: 'Mở rộng toàn quốc',
      description: 'Mở rộng dịch vụ đến 63 tỉnh thành trên cả nước'
    },
    {
      year: '2024',
      title: 'Tương lai',
      description: 'Tiếp tục phát triển và đổi mới để phục vụ khách hàng tốt hơn'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Về chúng tôi - Chogiare"
        description="Tìm hiểu về Chogiare - nền tảng mua sắm trực tuyến hàng đầu Việt Nam với sứ mệnh kết nối người mua và người bán một cách an toàn, tiện lợi."
        keywords="về chogiare, giới thiệu, công ty, mua sắm online, thương mại điện tử"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Chogiare",
          "url": "https://chogiare.com",
          "description": "Nền tảng mua sắm trực tuyến hàng đầu Việt Nam",
          "foundingDate": "2024",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "VN"
          }
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Về Chogiare</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Chogiare là nền tảng thương mại điện tử hàng đầu Việt Nam, 
            kết nối người mua và người bán với mục tiêu mang đến trải nghiệm mua sắm 
            tiện lợi, an toàn và tiết kiệm nhất.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Được tin dùng bởi 1M+ người</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Bảo mật tuyệt đối</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Chogiare trong con số</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Sứ mệnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi cam kết tạo ra một nền tảng mua sắm minh bạch, 
                  công bằng và hiệu quả, giúp mọi người dễ dàng tìm kiếm và 
                  mua được những sản phẩm chất lượng với giá cả hợp lý nhất.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Tầm nhìn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Trở thành nền tảng thương mại điện tử số 1 Việt Nam, 
                  góp phần phát triển kinh tế số và tạo cơ hội kinh doanh 
                  cho mọi người dân Việt Nam.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">{member.position}</Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Hành trình phát triển</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 px-4">
                    <Card className={`${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-md`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{achievement.year}</Badge>
                          <Award className="h-4 w-4 text-warning" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-muted-foreground text-sm">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center relative z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 px-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Bạn có câu hỏi hoặc góp ý? Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="mailto:contact@chogiare.com">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@chogiare.com
                </a>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="tel:1900123456">
                  <Phone className="h-4 w-4 mr-2" />
                  1900 123 456
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
