# MVP-DBIZ-3

Milk Bank Donor/Staff Portal

## Project Overview

This project is a comprehensive donor and staff management system for a milk bank, including:

- **Frontend**: React (Vite, Tailwind, shadcn/ui)
- **Backend**: Node.js/Express, Sequelize ORM
- **Database**: MySQL (default port 3306)

## Local Development Setup (No Docker)

1. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
2. **Start MySQL** (ensure MySQL is running on port 3306)
3. **Start backend**
   ```bash
   cd backend
   npm start
   ```
4. **Start frontend**
   ```bash
   cd frontend
   npm run dev
   ```
5. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## Staff & Donor UI Testing Checklist

### Pre-Testing Setup

- [x] Backend restarted (AuthService fix applied)
- [x] Frontend running on http://localhost:3000
- [x] Backend running on http://localhost:5000
- [ ] Browser cache cleared
- [ ] DevTools console open (F12)

### 1. Staff Login & Redirect

1. Go to http://localhost:3000
2. Click "Đăng nhập"
3. Login as staff user (medical_staff or admin_staff)
4. Should redirect to `/staff/dashboard` (not `/` or `/donor/dashboard`)

### 2. Donor Login & Redirect

1. Logout if logged in
2. Login as donor user
3. Should redirect to `/donor/dashboard`

### 3. Console & Network Checks

- Open DevTools (F12), check Console for errors (screenshot if any)
- In Network tab, filter `Fetch/XHR`, find `/api/auth/login` request, check Response:
  ```json
  {
   "success": true,
   "message": "...",
   "user": { ... },
   "redirectUrl": "/staff/dashboard",  // or /donor/dashboard
   "token": "..."
  }
  ```

### 4. Staff Dashboard UI

- Logout button visible at sidebar bottom, clickable, logs out to homepage
- KPI cards show correct numbers (not strange text)
- Sidebar menu items:
  - Dashboard: `/staff/dashboard`
  - Danh sách Donor: `/staff/donors`
  - Đăng ký Donor: `/staff/donors/register`
  - Sàng lọc: `/staff/donors/screening`
  - Danh sách hiến sữa: `/staff/donations`
  - Lịch hẹn: `/staff/appointments`
  - Xét nghiệm: `/staff/tests`
  - Quản lý điểm thưởng: `/staff/rewards`
- Note any menu that does not work, does not load, or errors
- Check for layout issues (sidebar overlap, scrollbars, cut-off content)

### 5. Report Format

After testing, report:

- Login redirect status (staff/donor)
- Console errors
- `/api/auth/login` response
- Logout button visibility
- Dashboard data status
- Menu items not working
- Layout issues
- Screenshots (dashboard, sidebar, errors)

---

## Troubleshooting

**If redirect is wrong:**

- Ensure backend is restarted: `taskkill /F /IM node.exe` then `cd backend && npm start`
- Clear frontend cache: `npm run dev` or delete `node_modules/.vite` then restart
- Try incognito/private window or another browser

**Other issues:**

- Check backend logs for errors
- Check API responses in DevTools
- Provide screenshots and error details for support

---

## Notes

- All Docker-related files/scripts have been removed for this repo version
- For Docker setup, see previous versions or contact maintainers
