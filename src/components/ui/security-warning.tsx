import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Shield, CreditCard, Phone, Ban } from 'lucide-react'

interface SecurityWarningProps {
  variant?: 'default' | 'payment' | 'contact' | 'scam'
  className?: string
}

export function SecurityWarning({ variant = 'default', className }: SecurityWarningProps) {
  const warnings = {
    default: {
      icon: Shield,
      title: '⚠️ Cảnh báo bảo mật',
      items: [
        'Không chuyển khoản trước khi nhận hàng, trừ khi đã xác nhận với người bán qua chat',
        'Kiểm tra kỹ thông tin người bán trước khi đặt hàng',
        'Chỉ thanh toán qua các kênh chính thức của nền tảng',
        'Không cung cấp mật khẩu, OTP, hoặc thông tin tài khoản ngân hàng cho bất kỳ ai',
        'Nếu có dấu hiệu lừa đảo, vui lòng báo cáo ngay cho chúng tôi'
      ]
    },
    payment: {
      icon: CreditCard,
      title: '⚠️ Cảnh báo thanh toán',
      items: [
        'CHỈ thanh toán qua các kênh chính thức của nền tảng',
        'KHÔNG chuyển khoản trực tiếp vào tài khoản cá nhân của người bán',
        'KHÔNG thanh toán qua các ứng dụng chat như Zalo, Facebook Messenger',
        'Luôn kiểm tra thông tin đơn hàng trước khi thanh toán',
        'Nếu người bán yêu cầu thanh toán ngoài nền tảng, đây có thể là dấu hiệu lừa đảo',
        'Báo cáo ngay nếu phát hiện hành vi đáng ngờ'
      ]
    },
    contact: {
      icon: Phone,
      title: '⚠️ Cảnh báo liên hệ',
      items: [
        'Chỉ liên hệ với người bán qua kênh chat chính thức của nền tảng',
        'KHÔNG cung cấp số điện thoại, email cá nhân cho người bán',
        'KHÔNG chuyển sang các ứng dụng chat khác như Zalo, Telegram',
        'Nếu người bán yêu cầu liên hệ ngoài nền tảng, đây có thể là dấu hiệu lừa đảo',
        'Tất cả giao dịch phải được thực hiện trên nền tảng để được bảo vệ'
      ]
    },
    scam: {
      icon: Ban,
      title: '🚨 Cảnh báo lừa đảo',
      items: [
        'CẢNH GIÁC với các đề nghị quá hấp dẫn, giá rẻ bất thường',
        'KHÔNG chuyển tiền trước khi nhận hàng và kiểm tra chất lượng',
        'KHÔNG cung cấp thông tin tài khoản, mật khẩu, OTP cho bất kỳ ai',
        'Nếu người bán yêu cầu thanh toán qua tài khoản cá nhân, đây là DẤU HIỆU LỪA ĐẢO',
        'Luôn kiểm tra đánh giá và uy tín của người bán trước khi đặt hàng',
        'Báo cáo ngay các hành vi đáng ngờ qua hotline hoặc email hỗ trợ'
      ]
    }
  }

  const warning = warnings[variant]
  const Icon = warning.icon

  return (
    <Alert className={`border-orange-500 bg-orange-50 ${className}`}>
      <Icon className="h-5 w-5 text-orange-600" />
      <AlertTitle className="text-orange-900 font-bold mb-2">
        {warning.title}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <ul className="list-disc list-inside space-y-1.5 text-sm text-orange-800">
          {warning.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-orange-200">
          <p className="text-xs text-orange-700">
            <strong>Hotline hỗ trợ:</strong> 1900-xxxx | <strong>Email:</strong> support@chogiare.com
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}

