import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { SEOHead } from '@shared/components/seo/SEOHead'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Điều khoản sử dụng"
        description="Điều khoản sử dụng của Chợ Giá Rẻ - Nền tảng mua sỉ trực tuyến hàng đầu Việt Nam"
        keywords="điều khoản sử dụng, terms of service, chợ giá rẻ"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Điều khoản sử dụng</h1>
        <p className="text-sm text-muted-foreground mb-8">Cập nhật lần cuối: 21/03/2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Giới thiệu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chào mừng bạn đến với Chợ Giá Rẻ. Bằng việc truy cập và sử dụng website của chúng tôi, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Định nghĩa</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>"Nền tảng"</strong>: Website và ứng dụng Chợ Giá Rẻ.</li>
              <li><strong>"Người bán"</strong>: Cá nhân hoặc tổ chức đăng ký bán hàng trên nền tảng.</li>
              <li><strong>"Người mua"</strong>: Cá nhân hoặc tổ chức mua hàng thông qua nền tảng.</li>
              <li><strong>"Sản phẩm"</strong>: Hàng hóa được đăng bán trên nền tảng.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Đăng ký tài khoản</h2>
            <p className="text-muted-foreground leading-relaxed">
              Để sử dụng đầy đủ các tính năng, bạn cần đăng ký tài khoản với thông tin chính xác và đầy đủ. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Quy định đối với Người bán</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Cung cấp thông tin sản phẩm chính xác, trung thực.</li>
              <li>Đảm bảo chất lượng sản phẩm đúng như mô tả.</li>
              <li>Giao hàng đúng thời hạn cam kết.</li>
              <li>Tuân thủ pháp luật Việt Nam về thương mại điện tử.</li>
              <li>Không bán hàng giả, hàng nhái, hàng cấm.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Quy định đối với Người mua</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Cung cấp thông tin nhận hàng chính xác.</li>
              <li>Thanh toán đầy đủ và đúng hạn.</li>
              <li>Kiểm tra hàng hóa khi nhận và phản hồi kịp thời.</li>
              <li>Không lạm dụng chính sách hoàn trả.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Thanh toán</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chợ Giá Rẻ hỗ trợ nhiều phương thức thanh toán bao gồm chuyển khoản ngân hàng, ví điện tử và các phương thức khác. Mọi giao dịch đều được bảo mật và tuân thủ quy định của pháp luật.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Chính sách hoàn trả</h2>
            <p className="text-muted-foreground leading-relaxed">
              Người mua có quyền yêu cầu hoàn trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm không đúng mô tả, bị lỗi hoặc hư hỏng trong quá trình vận chuyển. Chi tiết chính sách hoàn trả sẽ được áp dụng theo từng người bán.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Sở hữu trí tuệ</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tất cả nội dung trên Chợ Giá Rẻ, bao gồm nhưng không giới hạn: logo, giao diện, mã nguồn, đều thuộc sở hữu của Chợ Giá Rẻ hoặc các bên liên quan. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý bằng văn bản.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Giới hạn trách nhiệm</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chợ Giá Rẻ là nền tảng trung gian kết nối người mua và người bán. Chúng tôi không chịu trách nhiệm trực tiếp về chất lượng sản phẩm, việc giao hàng hoặc các tranh chấp giữa người mua và người bán. Tuy nhiên, chúng tôi cam kết hỗ trợ giải quyết tranh chấp một cách công bằng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Thay đổi điều khoản</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chợ Giá Rẻ có quyền thay đổi các điều khoản này bất cứ lúc nào. Những thay đổi sẽ được thông báo trên website. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận các điều khoản mới.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Liên hệ</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng, vui lòng liên hệ:<br />
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
