# API Integration Setup

Hệ thống đã được cấu hình để sử dụng API thật từ backend thay vì Mock Service Worker (MSW).

## Cấu hình

### 1. Environment Variables

Tạo file `.env` trong thư mục root với nội dung:

```env
VITE_API_URL=http://localhost:3000/api
```

Hoặc nếu backend chạy ở port khác:

```env
VITE_API_URL=http://localhost:YOUR_PORT/api
```

### 2. Vite Proxy Configuration

Vite đã được cấu hình với proxy để forward requests từ `/api` đến backend server:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
```

### 3. API Client Configuration

API client (`src/api/axios.ts`) đã được cấu hình để:

- Sử dụng `VITE_API_URL` từ environment variables
- Fallback về `/api` nếu không có env variable
- Tự động thêm Bearer token vào headers
- Tự động refresh token khi hết hạn

## Chạy ứng dụng

### 1. Start Backend Server

```bash
cd chogiare_backend
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3000`

### 2. Start Frontend

```bash
cd chogiare-web
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## API Endpoints

Tất cả các API endpoints đã được tích hợp:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Reviews**: `/api/reviews/*`
- **Stores**: `/api/stores/*`
- **Chat**: `/api/chat/*`
- **Upload**: `/api/upload/*`
- **Addresses**: `/api/addresses/*`
- **Shipping**: `/api/shipping/*`

## Lưu ý

1. **MSW đã được tắt**: Mock Service Worker không còn được khởi tạo trong `main.tsx`
2. **Mock data trong components**: Một số admin/inventory pages vẫn có mock data hardcoded - cần tích hợp API khi backend sẵn sàng
3. **CORS**: Đảm bảo backend cho phép CORS từ frontend origin
4. **Authentication**: Tokens được lưu trong localStorage với key `auth_tokens`

## Troubleshooting

### API không kết nối được

1. Kiểm tra backend đang chạy: `curl http://localhost:3000/api/health`
2. Kiểm tra `VITE_API_URL` trong `.env`
3. Kiểm tra CORS settings trong backend
4. Kiểm tra network tab trong browser DevTools

### Token refresh không hoạt động

1. Kiểm tra `auth_tokens` trong localStorage
2. Kiểm tra response format từ `/api/auth/refresh`
3. Xem console logs để debug
