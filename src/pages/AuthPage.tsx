import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { SEOHead } from '@/components/seo/SEOHead'
import { APP_NAME } from '@/constants/app.constants'

export default function AuthPage() {
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')
  
  const getPageInfo = () => {
    if (isAdmin) {
      return {
        title: 'Đăng nhập Admin',
        description: `Đăng nhập vào trang quản trị ${APP_NAME}`,
        keywords: 'admin, đăng nhập, quản trị, chogiare'
      }
    } else if (location.pathname.includes('/login')) {
      return {
        title: 'Đăng nhập',
        description: `Đăng nhập vào tài khoản ${APP_NAME} để mua sắm và bán hàng trực tuyến`,
        keywords: 'đăng nhập, tài khoản, chogiare'
      }
    } else if (location.pathname.includes('/register')) {
      return {
        title: 'Đăng ký',
        description: `Tạo tài khoản ${APP_NAME} miễn phí để bắt đầu mua sắm và bán hàng trực tuyến`,
        keywords: 'đăng ký, tạo tài khoản, chogiare'
      }
    } else if (location.pathname.includes('/forgot-password')) {
      return {
        title: 'Quên mật khẩu',
        description: `Khôi phục mật khẩu tài khoản ${APP_NAME} của bạn`,
        keywords: 'quên mật khẩu, khôi phục mật khẩu, chogiare'
      }
    } else if (location.pathname.includes('/reset-password')) {
      return {
        title: 'Đặt lại mật khẩu',
        description: `Đặt lại mật khẩu mới cho tài khoản ${APP_NAME}`,
        keywords: 'đặt lại mật khẩu, reset password, chogiare'
      }
    }
    return {
      title: 'Xác thực',
      description: `Đăng nhập hoặc đăng ký tài khoản ${APP_NAME}`,
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
              <svg 
                className="w-10 h-10 text-primary-foreground" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2.69C12 2.69 6 7.5 6 12.5C6 16.64 9.36 20 13.5 20C17.64 20 21 16.64 21 12.5C21 7.5 15 2.69 12 2.69Z" 
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-primary animate-in fade-in duration-1000 delay-200">{APP_NAME}</h1>
          <p className="text-muted-foreground animate-in fade-in duration-1000 delay-300">
            {isAdmin ? 'Trang quản trị hệ thống' : 'Nền tảng rao bán uy tín'}
          </p>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
          <Routes>
            <Route path="/login" element={<LoginForm isAdmin={isAdmin} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="*" element={<LoginForm isAdmin={isAdmin} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
