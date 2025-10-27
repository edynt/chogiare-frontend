import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { SEOHead } from '@/components/seo/SEOHead'

export default function AuthPage() {
  const location = useLocation()
  
  const getPageInfo = () => {
    if (location.pathname.includes('/login')) {
      return {
        title: 'Đăng nhập',
        description: 'Đăng nhập vào tài khoản Chogiare để mua sắm và bán hàng trực tuyến',
        keywords: 'đăng nhập, tài khoản, chogiare'
      }
    } else if (location.pathname.includes('/register')) {
      return {
        title: 'Đăng ký',
        description: 'Tạo tài khoản Chogiare miễn phí để bắt đầu mua sắm và bán hàng trực tuyến',
        keywords: 'đăng ký, tạo tài khoản, chogiare'
      }
    } else if (location.pathname.includes('/forgot-password')) {
      return {
        title: 'Quên mật khẩu',
        description: 'Khôi phục mật khẩu tài khoản Chogiare của bạn',
        keywords: 'quên mật khẩu, khôi phục mật khẩu, chogiare'
      }
    } else if (location.pathname.includes('/reset-password')) {
      return {
        title: 'Đặt lại mật khẩu',
        description: 'Đặt lại mật khẩu mới cho tài khoản Chogiare',
        keywords: 'đặt lại mật khẩu, reset password, chogiare'
      }
    }
    return {
      title: 'Xác thực',
      description: 'Đăng nhập hoặc đăng ký tài khoản Chogiare',
      keywords: 'xác thực, đăng nhập, đăng ký, chogiare'
    }
  }

  const pageInfo = getPageInfo()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SEOHead
        title={pageInfo.title}
        description={pageInfo.description}
        keywords={pageInfo.keywords}
      />
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-4 hover:opacity-80 hover:scale-105 transition-all duration-300">
            <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center hover:rotate-12 transition-transform duration-300">
              <span className="text-primary-foreground font-bold text-2xl">C</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-primary animate-in fade-in duration-1000 delay-200">Chogiare</h1>
          <p className="text-muted-foreground animate-in fade-in duration-1000 delay-300">Nền tảng rao bán uy tín</p>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="*" element={<LoginForm />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
