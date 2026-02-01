# 🔧 Fix lỗi khi dùng ngrok

## 🔴 **VẤN ĐỀ**

Khi share link ngrok → **OK**
Khi quay về localhost → **Bị lỗi đăng nhập**

### Nguyên nhân:

1. **CORS blocked**: Backend không cho phép origin từ ngrok
2. **localStorage domain-locked**: Token lưu ở localhost không work với ngrok và ngược lại
3. **Mixed content**: HTTPS (ngrok) gọi HTTP (localhost backend)

---

## ✅ **GIẢI PHÁP**

### **Bước 1: Cấu hình CORS cho ngrok**

File `backend/.env` đã được cấu hình:

```env
CORS_ORIGIN=http://localhost:3000,https://*.ngrok-free.app,https://*.ngrok-free.dev,https://*.ngrok.io
```

✅ **Đã OK** - Backend sẽ chấp nhận cả localhost và ngrok.

---

### **Bước 2: Sử dụng ngrok cho cả Frontend VÀ Backend**

**Vấn đề**: Nếu chỉ expose frontend qua ngrok, backend vẫn ở localhost → Mixed content!

**Giải pháp**: Chạy 2 ngrok tunnels:

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Terminal 3: Ngrok cho Backend
ngrok http 5001 --domain=<your-static-domain-backend>.ngrok-free.app

# Terminal 4: Ngrok cho Frontend
ngrok http 3000 --domain=<your-static-domain-frontend>.ngrok-free.app
```

**Cập nhật Frontend Environment:**

```bash
# frontend/.env.local
VITE_BACKEND_URL=https://<your-backend-domain>.ngrok-free.app
```

---

### **Bước 3: Script tự động (KHUYÊN DÙNG)**

Tạo file `start-ngrok.bat` để tự động:

```batch
@echo off
echo Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 5

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo Services started!
echo ======================================
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Now run ngrok manually:
echo   ngrok http 5001 --domain=your-backend.ngrok-free.app
echo   ngrok http 3000 --domain=your-frontend.ngrok-free.app
echo ======================================
```

---

### **Bước 4: Fix localStorage domain issue**

**Vấn đề**: Token lưu ở localhost không work với ngrok.

**Giải pháp tạm thời**: Clear localStorage khi chuyển domain

Thêm vào `frontend/src/App.jsx` hoặc `main.jsx`:

```javascript
// Detect domain change and clear old tokens
const currentDomain = window.location.hostname;
const lastDomain = localStorage.getItem("lastDomain");

if (lastDomain && lastDomain !== currentDomain) {
  console.log("🔄 Domain changed, clearing tokens...");
  localStorage.clear();
  sessionStorage.clear();
}
localStorage.setItem("lastDomain", currentDomain);
```

**Giải pháp tốt hơn**: Dùng session token thay vì localStorage (sẽ implement sau).

---

## 🎯 **HƯỚNG DẪN SỬ DỤNG ĐÚNG**

### **Scenario 1: Chỉ dev trên localhost**

```bash
# Không cần làm gì, mọi thứ work như bình thường
cd backend && npm start
cd frontend && npm run dev
```

### **Scenario 2: Share với người khác (dùng ngrok)**

**Cách 1: Chỉ share frontend (backend vẫn localhost - ĐƠN GIẢN)**

```bash
# 1. Start services
cd backend && npm start  # Port 5001
cd frontend && npm run dev  # Port 3000

# 2. Chỉ ngrok frontend
ngrok http 3000

# 3. Người dùng vào ngrok link
# ⚠️ LƯU Ý: Người dùng PHẢI ở cùng mạng LAN hoặc VPN
```

**Cách 2: Share cả 2 qua ngrok (CHÍNH THỨC)**

```bash
# 1. Start backend
cd backend && npm start

# 2. Ngrok backend (terminal riêng)
ngrok http 5001
# Copy ngrok URL: https://abc123.ngrok-free.app

# 3. Set frontend env
# Tạo file frontend/.env.local:
echo VITE_BACKEND_URL=https://abc123.ngrok-free.app > frontend/.env.local

# 4. Rebuild frontend
cd frontend
npm run dev

# 5. Ngrok frontend (terminal riêng)
ngrok http 3000

# 6. Share link frontend với người khác
```

---

## 🐛 **TROUBLESHOOTING**

### ❌ Lỗi: "CORS policy: No 'Access-Control-Allow-Origin'"

**Fix:**

```env
# backend/.env
CORS_ORIGIN=*
```

hoặc cụ thể:

```env
CORS_ORIGIN=http://localhost:3000,https://your-ngrok-url.ngrok-free.app
```

### ❌ Lỗi: "Token không hợp lệ" khi chuyển domain

**Fix:** Đăng xuất và đăng nhập lại, hoặc clear localStorage:

```javascript
// Browser console (F12)
localStorage.clear();
location.reload();
```

### ❌ Lỗi: "Mixed Content" (HTTPS gọi HTTP)

**Fix:** Phải dùng ngrok cho CẢ backend VÀ frontend.

### ❌ Lỗi: ngrok "Visit site" button

**Fix:** Bấm "Visit Site" button trên trang ngrok warning, hoặc dùng paid plan.

---

## 📝 **SCRIPT TỰ ĐỘNG**

### File: `start-with-ngrok.bat`

```batch
@echo off
echo ================================================
echo  Milk Bank System - Development with ngrok
echo ================================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok not found! Please install from https://ngrok.com/download
    pause
    exit /b 1
)

REM Start backend
echo [1/4] Starting Backend...
start "Backend API" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 5 >nul

REM Start frontend
echo [2/4] Starting Frontend...
start "Frontend Dev" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 >nul

REM Instructions
echo.
echo ================================================
echo ✅ Services started successfully!
echo ================================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo To share via ngrok, open 2 new terminals:
echo.
echo Terminal 1 (Backend):
echo   ngrok http 5001
echo.
echo Terminal 2 (Frontend):
echo   ngrok http 3000
echo.
echo Then update frontend/.env.local with backend ngrok URL
echo ================================================
pause
```

---

## 🎉 **KẾT LUẬN**

**TL;DR - Cách nhanh nhất:**

1. ✅ Backend `.env` đã có `CORS_ORIGIN` hỗ trợ ngrok
2. ⚠️ Khi share qua ngrok: Dùng ngrok cho CẢ 2 (frontend + backend)
3. ⚠️ Khi chuyển từ ngrok về localhost: Clear localStorage hoặc đăng xuất/nhập lại

**Không cần sửa code gì thêm!** Chỉ cần chạy đúng workflow.
