import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary"></div>
              <span className="text-xl font-bold">Chogiare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng rao bán uy tín, kết nối người mua và người bán một cách an toàn và tiện lợi.
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
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                  Trợ giúp
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/dien-thoai-phu-kien" className="text-muted-foreground hover:text-foreground">
                  Điện thoại & Phụ kiện
                </Link>
              </li>
              <li>
                <Link to="/category/laptop-may-tinh" className="text-muted-foreground hover:text-foreground">
                  Laptop & Máy tính
                </Link>
              </li>
              <li>
                <Link to="/category/thoi-trang" className="text-muted-foreground hover:text-foreground">
                  Thời trang
                </Link>
              </li>
              <li>
                <Link to="/category/nha-cua-doi-song" className="text-muted-foreground hover:text-foreground">
                  Nhà cửa & Đời sống
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
