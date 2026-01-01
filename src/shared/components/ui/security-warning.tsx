import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@shared/components/ui/alert'
import { Shield, CreditCard, Phone, Ban } from 'lucide-react'

interface SecurityWarningProps {
  variant?: 'default' | 'payment' | 'contact' | 'scam'
  className?: string
}

export function SecurityWarning({ variant = 'default', className }: SecurityWarningProps) {
  const warnings = {
    default: {
      icon: Shield,
      title: '⚠️ Lưu ý quan trọng',
      items: [
        'Chúng tôi là nền tảng trung gian kết nối người mua và người bán',
        'Người mua và người bán tự thỏa thuận về phương thức thanh toán và giao hàng',
        'Nền tảng không xử lý thanh toán, không chịu trách nhiệm về giao dịch tài chính',
        'Vui lòng thỏa thuận rõ ràng với người bán về điều kiện thanh toán trước khi đặt hàng',
        'Kiểm tra kỹ thông tin người bán, đánh giá và uy tín trước khi quyết định',
        'Nếu có vấn đề, vui lòng liên hệ trực tiếp với người bán hoặc báo cáo cho chúng tôi'
      ]
    },
    payment: {
      icon: CreditCard,
      title: '⚠️ Lưu ý về thanh toán',
      items: [
        'Nền tảng không xử lý thanh toán, người mua và người bán tự thỏa thuận',
        'Vui lòng thỏa thuận rõ ràng với người bán về phương thức thanh toán (COD, chuyển khoản, v.v.)',
        'Nên thanh toán sau khi nhận hàng và kiểm tra chất lượng (COD) để an toàn hơn',
        'Nếu chuyển khoản trước, chỉ chuyển sau khi đã thỏa thuận rõ ràng và tin tưởng người bán',
        'Lưu giữ đầy đủ hóa đơn, chứng từ giao dịch để làm bằng chứng nếu có tranh chấp',
        'Nếu có vấn đề về thanh toán, vui lòng liên hệ trực tiếp với người bán để giải quyết'
      ]
    },
    contact: {
      icon: Phone,
      title: '⚠️ Lưu ý về liên hệ',
      items: [
        'Bạn có thể liên hệ với người bán qua kênh chat của nền tảng hoặc thông tin công khai',
        'Nên trao đổi rõ ràng về sản phẩm, giá cả, phương thức thanh toán và giao hàng',
        'Lưu giữ lịch sử chat để làm bằng chứng nếu có tranh chấp',
        'Nếu người bán yêu cầu thông tin nhạy cảm (mật khẩu, OTP), hãy từ chối và báo cáo',
        'Nền tảng chỉ là trung gian kết nối, không chịu trách nhiệm về nội dung trao đổi giữa các bên'
      ]
    },
    scam: {
      icon: Ban,
      title: '🚨 Cảnh báo lừa đảo',
      items: [
        'CẢNH GIÁC với các đề nghị quá hấp dẫn, giá rẻ bất thường so với thị trường',
        'Nên thanh toán sau khi nhận hàng và kiểm tra chất lượng (COD) để an toàn hơn',
        'KHÔNG cung cấp thông tin nhạy cảm như mật khẩu, OTP, mã PIN cho bất kỳ ai',
        'Kiểm tra kỹ đánh giá, uy tín và thông tin của người bán trước khi quyết định',
        'Nếu có dấu hiệu lừa đảo hoặc hành vi đáng ngờ, hãy báo cáo ngay cho chúng tôi',
        'Lưu giữ đầy đủ hóa đơn, chứng từ và lịch sử giao dịch để làm bằng chứng'
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

