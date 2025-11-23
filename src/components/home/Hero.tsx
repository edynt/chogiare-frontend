import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Store, Shield, Users, TrendingUp, Upload, MessageCircle, Wallet, BarChart3 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hệ thống <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bán Sỉ</span>
              <br />
              Chuyên nghiệp & Hiện đại
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nền tảng quản lý bán sỉ toàn diện với 2 hệ thống riêng biệt: 
              <strong className="text-foreground"> Admin</strong> để quản lý hệ thống và 
              <strong className="text-foreground"> Seller</strong> để quản lý cửa hàng. 
              Tối ưu hóa quy trình kinh doanh với công nghệ tiên tiến.
            </p>
          </div>

          {/* Two Systems Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            {/* Admin System Card */}
            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Hệ thống Admin</h3>
              <p className="text-muted-foreground mb-4">
                Quản lý người dùng, xử lý khiếu nại, và điều hành toàn bộ hệ thống
              </p>
              <ul className="text-left space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Quản lý người dùng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Xử lý khiếu nại
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Quản lý chủ sản phẩm
                </li>
              </ul>
              <Button size="lg" variant="outline" asChild className="w-full">
                <Link to="/admin">Truy cập Admin</Link>
              </Button>
            </div>

            {/* Seller System Card */}
            <div className="bg-card border-2 border-secondary/20 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4">
                <Store className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Hệ thống Seller</h3>
              <p className="text-muted-foreground mb-4">
                Quản lý cửa hàng, đơn hàng, sản phẩm và doanh thu một cách hiệu quả
              </p>
              <ul className="text-left space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-secondary">✓</span> Import sản phẩm Excel/CSV
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">✓</span> Quản lý đơn hàng & ví tiền
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary">✓</span> Tin nhắn & doanh thu
                </li>
              </ul>
              <Button size="lg" asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                <Link to="/auth/register">Đăng ký làm Seller</Link>
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Link to="/dashboard">
                <Store className="mr-2 h-5 w-5" />
                Vào Dashboard Seller
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Link to="/products">Xem sản phẩm</Link>
            </Button>
          </div>

          {/* Key Features Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="h-7 w-7 text-blue-600" />
              </div>
              <div className="font-semibold text-sm">Import Excel/CSV</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-7 w-7 text-green-600" />
              </div>
              <div className="font-semibold text-sm">Quản lý đơn hàng</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-7 w-7 text-purple-600" />
              </div>
              <div className="font-semibold text-sm">Ví điện tử</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-7 w-7 text-orange-600" />
              </div>
              <div className="font-semibold text-sm">Tin nhắn</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
