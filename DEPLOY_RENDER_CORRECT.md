# 🚀 Hướng dẫn Deploy đúng cách trên Render.com

## ⚠️ LỖI BẠN GẶP PHẢI

```
error Couldn't find a package.json file in "/opt/render/project/src"
```

**Nguyên nhân**: Render không tìm thấy package.json vì:
1. Đang tìm ở thư mục root (`/opt/render/project/src`)
2. Nhưng package.json nằm trong `backend/` hoặc `frontend/`
3. Root Directory chưa được cấu hình đúng

---

## ✅ GIẢI PHÁP - 2 CÁCH

### **CÁCH 1: Tạo service mới từ render.yaml (KHUYÊN DÙNG)**

#### Bước 1: Xóa service cũ
1. Vào Render Dashboard
2. Chọn service bị lỗi → Settings → Delete Service

#### Bước 2: Deploy từ Blueprint
1. Click **New** → **Blueprint**
2. Connect GitHub repository: `MVP-DBIZ-3`
3. Chọn file `render.yaml`
4. Click **Apply**

Render sẽ tự động tạo:
- ✅ Backend service (rootDir: backend)
- ✅ Frontend service (rootDir: frontend)
- ✅ MySQL database

---

### **CÁCH 2: Tạo service thủ công (nếu không dùng Blueprint)**

#### A. Backend Service

1. **New** → **Web Service**
2. **Connect Repository**: `MVP-DBIZ-3`
3. **Cấu hình**:
   ```
   Name: milkbank-backend
   Region: Singapore
   Branch: main
   
   Root Directory: backend        ← QUAN TRỌNG!
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   
   Instance Type: Free
   ```

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   
   DB_HOST=<your-render-mysql-internal-host>
   DB_PORT=3306
   DB_NAME=milkbank_prod
   DB_USER=milkbank_user
   DB_PASSWORD=<your-password>
   
   JWT_SECRET=<generate-random-32-chars>
   JWT_EXPIRES_IN=7d
   
   CORS_ORIGIN=*
   ```

5. Click **Create Web Service**

#### B. Frontend Service

1. **New** → **Static Site**
2. **Connect Repository**: `MVP-DBIZ-3`
3. **Cấu hình**:
   ```
   Name: milkbank-frontend
   Region: Singapore
   Branch: main
   
   Root Directory: frontend       ← QUAN TRỌNG!
   Build Command: npm install && npm run build
   Publish Directory: dist
   
   Instance Type: Free
   ```

4. **Environment Variables**:
   ```
   VITE_BACKEND_URL=https://milkbank-backend.onrender.com
   ```
   (Thay bằng URL backend thực tế sau khi backend deploy xong)

5. Click **Create Static Site**

---

## 🔧 NẾU VẪN BỊ LỖI

### Kiểm tra lại Root Directory

Trên Render Dashboard → Service → Settings:

**Backend:**
- ✅ Root Directory: `backend`
- ✅ Build Command: `npm install` hoặc `npm ci --omit=dev`
- ✅ Start Command: `npm start`

**Frontend:**
- ✅ Root Directory: `frontend`
- ✅ Build Command: `npm install && npm run build`
- ✅ Publish Directory: `dist`

### Nếu Render dùng Yarn thay vì npm

Thêm file `package.json` engine:

**Đã có sẵn trong backend/package.json:**
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

Hoặc bắt buộc dùng npm bằng cách thêm `.npmrc`:

---

## 📋 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] File `render.yaml` đã được push lên GitHub
- [ ] Backend có `backend/package.json`
- [ ] Frontend có `frontend/package.json`
- [ ] Root Directory được set đúng: `backend` hoặc `frontend`
- [ ] Build command không có `cd` (vì rootDir đã set)
- [ ] Database đã tạo và lấy được credentials

---

## 🎯 SO SÁNH 2 CÁCH

| Tiêu chí | Blueprint (render.yaml) | Thủ công |
|----------|------------------------|----------|
| **Dễ dàng** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Nhanh** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Tự động** | ✅ Tạo cả 3 services | ❌ Tạo từng cái |
| **Lỗi config** | ❌ Ít | ⚠️ Dễ sai |
| **Khuyên dùng** | ✅ CÓ | ❌ Không |

---

## 🔍 DEBUG

Nếu vẫn lỗi, check logs:

1. Render Dashboard → Service → Logs
2. Tìm dòng:
   ```
   ==> Cloning from https://github.com/...
   ==> Entering directory '/opt/render/project/src/backend'  ← Phải thấy /backend
   ==> Running 'npm install'
   ```

Nếu không thấy `/backend` → Root Directory chưa đúng!

---

## 💡 LƯU Ý

- **Free tier**: Backend sẽ sleep sau 15 phút không dùng
- **Database**: Dùng Internal URL cho backend, External URL cho client tools
- **CORS**: Set `CORS_ORIGIN=*` trong dev, cụ thể hơn trong production

---

## 🆘 NẾU VẪN BỊ SAI

Share screenshot của:
1. Service Settings (Root Directory section)
2. Deploy Logs (toàn bộ)
3. Environment Variables list

Tôi sẽ giúp debug cụ thể!
