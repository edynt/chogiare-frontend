import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { SEOHead } from '@shared/components/seo/SEOHead'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Chính sách bảo mật"
        description="Chính sách bảo mật của Chợ Giá Rẻ - Cam kết bảo vệ thông tin cá nhân của bạn"
        keywords="chính sách bảo mật, privacy policy, bảo vệ dữ liệu, chợ giá rẻ"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>
        <p className="text-sm text-muted-foreground mb-8">Cập nhật lần cuối: 21/03/2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Giới thiệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chợ Giá Rẻ cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Thông tin chúng tôi thu thập</h2>
            <h3 className="text-lg font-medium mb-2 mt-4">2.1. Thông tin bạn cung cấp</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Họ tên, email, số điện thoại khi đăng ký tài khoản.</li>
              <li>Địa chỉ giao hàng.</li>
              <li>Thông tin thanh toán (được xử lý qua cổng thanh toán bảo mật).</li>
              <li>Nội dung tin nhắn, đánh giá sản phẩm.</li>
            </ul>
            <h3 className="text-lg font-medium mb-2 mt-4">2.2. Thông tin tự động thu thập</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Địa chỉ IP, loại trình duyệt, thiết bị sử dụng.</li>
              <li>Lịch sử xem sản phẩm và tìm kiếm.</li>
              <li>Cookie và công nghệ theo dõi tương tự.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Mục đích sử dụng thông tin</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Xử lý đơn hàng và giao dịch.</li>
              <li>Cung cấp dịch vụ hỗ trợ khách hàng.</li>
              <li>Cải thiện trải nghiệm người dùng và tối ưu dịch vụ.</li>
              <li>Gửi thông báo về đơn hàng, khuyến mãi (nếu bạn đồng ý).</li>
              <li>Phòng chống gian lận và bảo vệ an ninh nền tảng.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Chia sẻ thông tin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Với người bán/người mua để hoàn tất giao dịch (tên, địa chỉ giao hàng, số điện thoại).</li>
              <li>Với đối tác vận chuyển để giao hàng.</li>
              <li>Với cổng thanh toán để xử lý giao dịch.</li>
              <li>Khi có yêu cầu từ cơ quan pháp luật.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Bảo mật thông tin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn, bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Mã hóa SSL/TLS cho mọi kết nối.</li>
              <li>Mã hóa mật khẩu bằng thuật toán bcrypt.</li>
              <li>Kiểm soát truy cập nghiêm ngặt đối với dữ liệu người dùng.</li>
              <li>Sao lưu dữ liệu định kỳ.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cookie</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi sử dụng cookie để duy trì phiên đăng nhập, ghi nhớ tùy chọn và cải thiện trải nghiệm sử dụng. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể bị ảnh hưởng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Quyền của bạn</h2>
            <p className="text-muted-foreground leading-relaxed">Bạn có quyền:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Truy cập và xem thông tin cá nhân của mình.</li>
              <li>Chỉnh sửa hoặc cập nhật thông tin không chính xác.</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu liên quan.</li>
              <li>Từ chối nhận email marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Lưu trữ dữ liệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Thông tin của bạn được lưu trữ trong thời gian bạn duy trì tài khoản. Sau khi xóa tài khoản, dữ liệu sẽ được xóa hoặc ẩn danh hóa trong vòng 30 ngày, trừ khi pháp luật yêu cầu lưu trữ lâu hơn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Tự động xóa tài khoản không hoạt động</h2>
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-3">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                Lưu ý quan trọng
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Để bảo vệ dữ liệu và tối ưu hệ thống, tài khoản không đăng nhập trong vòng <strong>180 ngày (6 tháng)</strong> sẽ bị tự động xóa vĩnh viễn cùng toàn bộ dữ liệu liên quan, bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Thông tin cá nhân và hồ sơ tài khoản.</li>
              <li>Lịch sử đơn hàng, giỏ hàng.</li>
              <li>Sản phẩm đã đăng bán (đối với người bán).</li>
              <li>Đánh giá, tin nhắn và thông báo.</li>
              <li>Số dư ví và lịch sử giao dịch.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Hệ thống sẽ kiểm tra tự động hàng ngày. Để duy trì tài khoản, bạn chỉ cần đăng nhập ít nhất một lần trong vòng 180 ngày. Sau khi tài khoản bị xóa, dữ liệu <strong>không thể khôi phục</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Thay đổi chính sách</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo qua email hoặc trên website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Liên hệ</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nếu bạn có câu hỏi về Chính sách bảo mật, vui lòng liên hệ:<br />
              Email: support@chogiare.com<br />
              Hotline: 1900 1234
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
