import React from 'react'
import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Droplet className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Chogiare
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nền tảng mua sỉ hàng đầu, kết nối người mua và người bán một cách an toàn và tiện lợi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/seller/products" className="text-muted-foreground hover:text-foreground">
                  Quản lý sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-muted-foreground hover:text-foreground">
                  Quản lý kho
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-foreground">
                  Tin nhắn
                </Link>
              </li>
              <li>
                <Link to="/seller/notifications" className="text-muted-foreground hover:text-foreground">
                  Thông báo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên hệ</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@chogiare.com</p>
              <p>Hotline: 1900 1234</p>
              <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Chogiare. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
