# 🚀 Hướng dẫn Deploy lên Render.com

## 📋 Tổng quan
Dự án Milk Bank Management System được deploy với kiến trúc:
- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express (Web Service)
- **Database**: MySQL 8.0 (Managed Database)

## 🎯 Cách 1: Deploy với render.yaml (TỰ ĐỘNG - KHUYÊN DÙNG)

### Bước 1: Chuẩn bị Repository
```bash
# Đảm bảo file render.yaml đã được push
git add render.yaml
git commit -m "Add Render deployment config"
git push origin main
```

### Bước 2: Tạo Database trước
1. Đăng nhập vào [Render.com](https://render.com)
2. Click **New** → **MySQL**
3. Điền thông tin:
   - **Name**: `milkbank-db`
   - **Database Name**: `milkbank_prod`
   - **User**: `milkbank_user`
   - **Region**: `Singapore` (gần Việt Nam)
   - **Plan**: `Free`
4. Click **Create Database**
5. Lưu lại thông tin kết nối (Internal Database URL)

### Bước 3: Deploy Backend
1. Click **New** → **Web Service**
2. Connect GitHub repository
3. Cấu hình:
   - **Name**: `milkbank-backend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Thêm Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[từ Internal Database URL]
   DB_PORT=3306
   DB_NAME=milkbank_prod
   DB_USER=milkbank_user
   DB_PASSWORD=[từ Database]
   JWT_SECRET=[tạo ngẫu nhiên 32 ký tự]
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

5. Click **Create Web Service**

### Bước 4: Import Database Schema
```bash
# Kết nối MySQL từ local
mysql -h [External Database URL] -u milkbank_user -p milkbank_prod < MB_schema_v3.sql
```

Hoặc dùng MySQL Workbench/DBeaver để import file `MB_schema_v3.sql`.

### Bước 5: Deploy Frontend
1. Click **New** → **Static Site**
2. Connect cùng GitHub repository
3. Cấu hình:
   - **Name**: `milkbank-frontend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Thêm Environment Variables:
   ```
   VITE_BACKEND_URL=https://milkbank-backend.onrender.com
   ```

5. Click **Create Static Site**

### Bước 6: Cập nhật CORS trên Backend
Sau khi có URL frontend, quay lại Backend → Environment → Sửa:
```
CORS_ORIGIN=https://[your-frontend].onrender.com
```

---

## 🎯 Cách 2: Deploy với Docker (NÂNG CAO)

### Bước 1: Sử dụng Dockerfile ở root
File `Dockerfile` đã được tạo ở root sẽ build cả frontend và backend.

### Bước 2: Deploy trên Render
1. Click **New** → **Web Service**
2. Cấu hình:
   - **Name**: `milkbank-fullstack`
   - **Region**: `Singapore`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`

3. Environment Variables giống Cách 1

---

## 🎯 Cách 3: Deploy riêng Backend và Frontend (ĐƠN GIẢN)

### A. Deploy Backend
1. **New** → **Web Service**
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Thêm Environment Variables (xem Bước 3 Cách 1)

### B. Deploy Frontend
1. **New** → **Static Site**
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && VITE_BACKEND_URL=https://your-backend.onrender.com npm run build`
4. **Publish Directory**: `dist`

---

## ⚙️ Environment Variables cần thiết

### Backend (.env cho Render)
```env
# Server
NODE_ENV=production
PORT=10000

# Database
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com
DB_PORT=3306
DB_NAME=milkbank_prod
DB_USER=milkbank_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend.onrender.com

# Rate Limiting
RATE_LIMIT_MAX=100
```

### Frontend (.env cho Render)
```env
VITE_BACKEND_URL=https://milkbank-backend.onrender.com
```

---

## 🔧 Troubleshooting

### ❌ Lỗi: "failed to read dockerfile"
**Nguyên nhân**: Render không tìm thấy Dockerfile ở đúng vị trí.

**Giải pháp**:
- **Cách 1**: Không dùng Docker, chọn Runtime = Node (khuyên dùng)
- **Cách 2**: Đặt Dockerfile ở root (đã tạo sẵn)
- **Cách 3**: Chỉ định `Docker Context Directory` = `backend` hoặc `frontend`

### ❌ Lỗi: "Database connection failed"
**Giải pháp**:
- Kiểm tra Internal Database URL (dùng cho Render services)
- Đảm bảo đã import schema SQL
- Kiểm tra credentials chính xác

### ❌ Lỗi: "CORS blocked"
**Giải pháp**:
```env
# Backend Environment Variables
CORS_ORIGIN=https://your-frontend.onrender.com,https://*.onrender.com
```

### ❌ Frontend không gọi được API
**Giải pháp**:
```bash
# Rebuild frontend với đúng backend URL
VITE_BACKEND_URL=https://milkbank-backend.onrender.com npm run build
```

---

## 📊 Free Tier Limitations

| Service | Limit | Note |
|---------|-------|------|
| Web Service | 750h/month | Tự động sleep sau 15 phút không dùng |
| Static Site | Unlimited | Luôn luôn active |
| MySQL Database | 1GB storage | Đủ cho MVP |
| Bandwidth | 100GB/month | |

⚠️ **Lưu ý**: Free tier backend sẽ "ngủ" sau 15 phút không hoạt động. Lần đầu truy cập sau khi ngủ sẽ mất ~30-60 giây để "thức dậy".

---

## 🎉 Hoàn tất

Sau khi deploy xong, bạn sẽ có:
- **Frontend**: `https://milkbank-frontend.onrender.com`
- **Backend API**: `https://milkbank-backend.onrender.com/api`
- **Health Check**: `https://milkbank-backend.onrender.com/api/health`

---

## 🔄 Auto-Deploy

Mỗi khi push code lên GitHub, Render sẽ tự động:
1. Pull code mới nhất
2. Build lại project
3. Deploy version mới

Bạn có thể tắt auto-deploy trong Settings → Build & Deploy.

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, check logs:
- Render Dashboard → Your Service → Logs
- Xem "Deploy Logs" hoặc "Runtime Logs"
