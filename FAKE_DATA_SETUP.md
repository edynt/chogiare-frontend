# Fake Data Setup

Hệ thống đã được cấu hình để sử dụng fake data thay vì API thật. Tất cả các API calls sẽ được intercept bởi Mock Service Worker (MSW) và trả về dữ liệu giả.

## Cấu hình hiện tại

### 1. MSW (Mock Service Worker)

- MSW được khởi tạo trong `src/main.tsx`
- Chỉ hoạt động trong môi trường development (`import.meta.env.DEV`)
- Intercept tất cả API calls và trả về fake data

### 2. API Configuration

- Base URL được cấu hình thành `/api` thay vì `http://localhost:8080/api`
- Tất cả API endpoints đã được cập nhật để sử dụng đúng paths

### 3. Mock Handlers

- Tất cả API endpoints đã được mock trong `src/mocks/handlers.ts`
- Bao gồm: Auth, Products, Categories, Cart, Orders, Reviews, Stores, Chat, Upload

## Các API Endpoints được hỗ trợ

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Lấy thông tin profile

### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/featured` - Lấy sản phẩm nổi bật
- `POST /api/products` - Tạo sản phẩm mới
- `PATCH /api/products/:id` - Cập nhật sản phẩm

### Categories

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục

### Cart

- `GET /api/cart` - Lấy giỏ hàng
- `GET /api/cart/stats` - Lấy thống kê giỏ hàng
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ
- `PATCH /api/cart/items/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/items/:itemId` - Xóa sản phẩm khỏi giỏ

### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/my` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### Reviews

- `GET /api/reviews` - Lấy danh sách đánh giá
- `GET /api/reviews/product/:productId` - Lấy đánh giá theo sản phẩm
- `POST /api/reviews` - Tạo đánh giá mới

### Stores

- `GET /api/stores` - Lấy danh sách cửa hàng
- `GET /api/stores/my` - Lấy cửa hàng của user
- `GET /api/stores/:id` - Lấy chi tiết cửa hàng

### Chat

- `GET /api/chat/conversations` - Lấy danh sách cuộc trò chuyện
- `GET /api/chat/conversations/:id` - Lấy chi tiết cuộc trò chuyện
- `GET /api/chat/conversations/:id/messages` - Lấy tin nhắn
- `POST /api/chat/conversations/:id/messages` - Gửi tin nhắn

### Upload

- `POST /api/upload/file` - Upload file đơn
- `POST /api/upload/files` - Upload nhiều file
- `POST /api/upload/avatar` - Upload avatar
- `GET /api/upload/files/:fileId` - Lấy thông tin file
- `DELETE /api/upload/files/:fileId` - Xóa file

## Cách sử dụng

1. **Chạy ứng dụng**: `npm run dev`
2. **MSW sẽ tự động khởi động** và intercept tất cả API calls
3. **Tất cả API calls sẽ trả về fake data** thay vì gọi API thật

## Fake Data Sources

- **Sample data**: Được load từ `public/data/sample-products.json`
- **Generated data**: Một số data được generate động trong mock handlers
- **Consistent data**: Tất cả fake data đều có cấu trúc nhất quán

## Lưu ý

- Fake data chỉ hoạt động trong development mode
- Trong production, bạn cần cấu hình API thật
- Tất cả fake data đều có cấu trúc giống với API thật
- Có thể dễ dàng chuyển đổi giữa fake data và API thật bằng cách thay đổi environment variables

## Troubleshooting

Nếu gặp vấn đề:

1. **Kiểm tra console** để xem MSW có khởi động không
2. **Kiểm tra Network tab** để xem API calls có được intercept không
3. **Kiểm tra mock handlers** có đúng endpoint paths không
4. **Restart dev server** nếu cần thiết
