# Mother Milk Bank Management System - Implementation Guide

## Tổng quan hệ thống

Hệ thống quản lý ngân hàng sữa mẹ (Mother Milk Bank Management System) là ứng dụng web hỗ trợ quy trình hoàn chỉnh từ đăng ký, sàng lọc, xét nghiệm, phê duyệt đến ghi nhận hiến sữa và thanh toán cho các mẹ donor.

## 📋 Danh sách Screens (20+ Artboards)

### Desktop & Tablet Views

1. **Dashboard** - Tổng quan KPI, biểu đồ, hoạt động gần đây
2. **Registered Donor List** - Danh sách mẹ đã đăng ký với bộ lọc
3. **Appointment List** - Quản lý lịch hẹn (All & My Appointments)
4. **Screening Form** - Phiếu sàng lọc 10 câu hỏi
5. **Donor Profile Detail** - Hồ sơ chi tiết với 6 tabs
6. **Donor Donation Log** - Nhật ký tất cả lần hiến sữa
7. **Record Donation** - Form ghi nhận lần hiến sữa mới
8. **EHR Test Monitor** - Theo dõi kết quả xét nghiệm
9. **Alerts Manager** - Quản lý cảnh báo hệ thống
10. **Reports** - Báo cáo thống kê theo tháng
11. **Configure Rewards** - Cấu hình quy tắc điểm thưởng
12. **Payment Support** - Hỗ trợ thanh toán và biên lai
13. **Empty States** - Trạng thái rỗng cho mỗi danh sách
14. **Error States** - Trạng thái lỗi với retry
15. **Loading States** - Skeleton loaders
16. **Quick View Drawer** - Xem nhanh thông tin donor
17. **Mark Failed Modal** - Đánh dấu lịch hẹn thất bại
18. **E-signature Modal** - Flow ký số với OTP
19. **Transfer Payment Modal** - Xác nhận chuyển khoản
20. **Create Reward Rule Modal** - Tạo quy tắc điểm thưởng

## 🎨 Component Library

### Layout Components
- **Sidebar** (`AppSidebar.tsx`) - Navigation menu với role-based items
- **Topbar** (`Topbar.tsx`) - Header với search, notifications, user menu
- **Layout** (`Layout.tsx`) - Wrapper component

### Reusable Components
- **KPI Card** (`KPICard.tsx`) - Card hiển thị chỉ số với icon, value, trend
- **DataTable** (`DataTable.tsx`) - Table với pagination, sorting, filters
- **Empty State** (`EmptyState.tsx`) - Trạng thái rỗng với CTA
- **Error State** (`ErrorState.tsx`) - Trạng thái lỗi với retry
- **Loading State** (`LoadingState.tsx`) - Skeleton placeholders

### ShadCN UI Components (Pre-installed)
- Badge, Button, Card, Dialog, Drawer, Input, Label, Select, Tabs, Toast, và nhiều hơn nữa

## 🔄 Interactive Prototype Flows

### 1. Mark Appointment as Failed
**Flow:** Click "Thất bại" → Chọn lý do → Nhập ghi chú → Xác nhận → Cập nhật trạng thái + Gửi SMS

**Implementation:**
```typescript
// In AppointmentList.tsx
const handleMarkAsFailed = () => {
  // POST /api/admin/appointments/{id}/mark_failed
  // Body: { reason: string, notes: string }
  // Then: Update UI + Show toast + Send SMS notification
}
```

### 2. Fill Screening Form → Complete
**Flow:** Điền thông tin cá nhân → Trả lời 10 câu hỏi → Chọn kết quả (Pass/Fail) → Lưu → Cập nhật trạng thái appointment

**Implementation:**
```typescript
// In ScreeningForm.tsx
const handleSubmit = async () => {
  // Validate all questions answered
  // POST /api/admin/appointments/{id}/screening
  // Update appointment status to 'completed'
  // Update donor status to 'needs_tests' or 'rejected'
}
```

### 3. Approve Donor Profile → E-sign Stepper (OTP)
**Flow:** Click "Duyệt hồ sơ" → Chọn CA provider → Gửi OTP → Nhập mã OTP → Xác thực → Lưu chữ ký + Cập nhật trạng thái

**Implementation:**
```typescript
// In DonorProfile.tsx - ESignatureModal component
Step 1: Preview consent document + Select CA provider
Step 2: POST /api/ca-provider/initiate-signing → Receive OTP via SMS
Step 3: Enter OTP → POST /api/ca-provider/verify-otp
Step 4: POST /api/admin/donors/{id}/approve with signature data
```

### 4. Record Donation → Update Log + Award Points
**Flow:** Kiểm tra sức khỏe → Nhập lượng sữa & containers → Lưu → Tính điểm tự động → Cập nhật log + Gửi thông báo

**Implementation:**
```typescript
// In RecordDonation.tsx
const handleSubmit = async () => {
  // POST /api/admin/appointments/{id}/donation
  // Auto-calculate points based on reward rules
  // Update donation log, donor's total volume, point balance
  // Send SMS notification with summary
}
```

## 📝 API Endpoints & Required Fields

### Donors
```
GET /api/admin/donors?status=&q=&page=&per_page=&sort_by=&order=
GET /api/admin/donors/{id}
POST /api/admin/donors/{id}/approve { action, caProvider, otp, signatureData }
POST /api/admin/donors/{id}/reject { reason }

Required fields for donor:
- name (required, min 2 chars)
- dob (required, age 18-45)
- phone (required, unique, Vietnamese format)
- email (required, unique, valid email)
- address (required)
- emergencyContact (required, phone format)
```

### Appointments
```
GET /api/admin/appointments?date=&staff_id=&status=&type=
POST /api/admin/appointments/{id}/mark_failed { reason, notes }
POST /api/admin/appointments/{id}/screening { personalInfo, questions, result, failReasons }
POST /api/admin/appointments/{id}/donation { donorId, healthStatus, volume, containers, notes }
```

### Donations
```
GET /api/admin/donations?donor_id=&date_from=&date_to=&page=&per_page=
```

### EHR Tests
```
GET /api/admin/ehr-tests?donor_id=&validity=&test_type=
POST /api/admin/ehr-tests/extract
PATCH /api/admin/ehr-tests/{id}/verify
```

### Alerts
```
GET /api/admin/alerts?status=&priority=&type=
PATCH /api/admin/alerts/{id}/resolve
POST /api/admin/alerts/{id}/send-reminder
```

### Payments
```
GET /api/admin/payments?status=
POST /api/admin/payments/{id}/mark-transferred { transferDate, receiptFile }
```

### Reward Rules
```
GET /api/admin/reward-rules
POST /api/admin/reward-rules { name, volumeThreshold, points, effectiveFrom, effectiveTo, active }
PATCH /api/admin/reward-rules/{id}
DELETE /api/admin/reward-rules/{id}
```

## 🔐 Permissions & Validation Rules

### Director / Admin
- Full access to all modules
- Approve/reject donor profiles (E-signature)
- Configure reward rules
- Manage payments
- Export reports

### Medical Staff
- View "My Appointments" only
- Fill screening forms
- Record donations
- Check-in appointments
- Cannot approve donors or configure system

### Finance Staff
- View donor list (read-only)
- Manage payments (mark transferred, upload receipts)
- View financial reports

### Validation Rules
- **Donor age:** 18-45 years old
- **Phone:** Unique, Vietnamese format (09xx, 03xx, 07xx, 08xx, 05xx)
- **Email:** Unique, valid email format
- **Screening:** All 10 questions must be answered
- **Donation volume:** > 0 if health status = good, = 0 if bad
- **Container count:** Should match volume (roughly 150-200ml per container)
- **Test validity:** 6 months for HIV, Hepatitis B/C, Syphilis

## 📊 Sample Mock Data

### Donor
```json
{
  "id": "MB-000123",
  "name": "Nguyễn Thị A",
  "dob": "1990-05-10",
  "phone": "0912345678",
  "ehrId": "EHR-12345",
  "status": "pending",
  "registeredAt": "2025-10-01",
  "email": "nguyenthia@email.com",
  "address": "Quận 1, TP.HCM",
  "emergencyContact": "0987654321"
}
```

### Appointment
```json
{
  "id": "AP-20251021-01",
  "donorId": "MB-000123",
  "donorName": "Nguyễn Thị A",
  "type": "screening",
  "date": "2025-10-21",
  "time": "09:00",
  "staff": "Bs. Lê Văn B",
  "status": "scheduled"
}
```

### Donation Record
```json
{
  "id": "D-20251015-01",
  "donorId": "MB-000125",
  "donorName": "Lê Thị C",
  "date": "2025-10-15",
  "volume": 350,
  "containers": 2,
  "staff": "Bs. Lê Văn B",
  "points": 10,
  "healthStatus": "good"
}
```

## 🎯 Design Tokens & Styling

### Typography
- **H1 (Display):** text-2xl, font-medium
- **H2 (Page Title):** text-xl, font-medium
- **H3 (Section):** text-lg, font-medium
- **Body:** text-base, font-normal

### Spacing
- Page padding: `p-6` (24px)
- Section gap: `space-y-6` (24px)
- Card padding: `p-4` to `p-6`
- Element gap: `gap-4` (16px)

### Colors
- Primary: `#030213` (dark blue-black)
- Secondary: `oklch(0.95 0.0058 264.53)`
- Muted: `#ececf0`
- Destructive: `#d4183d`

### Border Radius
- Small: `calc(var(--radius) - 4px)`
- Medium: `calc(var(--radius) - 2px)`
- Large: `var(--radius)` = 10px

## 📱 Responsive Design

### Desktop (1440px+)
- Full sidebar visible
- All features enabled
- Multi-column layouts

### Tablet (1024px - 1439px)
- Collapsible sidebar
- Responsive grids (2-3 columns)
- Touch-optimized buttons

### Mobile (< 1024px)
- Hidden sidebar (drawer menu)
- Single column layouts
- Bottom navigation (optional)

## 🚀 Deployment Checklist

- [ ] Set up backend API server
- [ ] Configure database (PostgreSQL/MySQL)
- [ ] Set up file storage (AWS S3/Azure Blob)
- [ ] Configure email service (SendGrid/AWS SES)
- [ ] Configure SMS service (VNPT SMS/Twilio)
- [ ] Integrate CA provider API (VNPT-CA/VN PT/Viettel CA)
- [ ] Set environment variables
- [ ] Build frontend (`npm run build`)
- [ ] Deploy to hosting (Vercel/Netlify/AWS)
- [ ] Set up SSL certificate
- [ ] Configure CORS and security headers
- [ ] Set up monitoring and logging

## 📚 Additional Features to Consider

1. **Notifications:**
   - WebSocket for real-time alerts
   - Email digest (daily summary)
   - SMS notifications for critical events

2. **Audit Trail:**
   - Log all approval/rejection actions
   - Track payment status changes
   - Record configuration changes

3. **Integrations:**
   - Hospital EHR system (API or file import)
   - Payment gateway (optional)
   - Barcode scanner for container tracking

4. **Advanced Features:**
   - Bulk operations (export, assign, delete)
   - Custom date range reports
   - Scheduled automated jobs (daily test extraction)
   - Multi-language support (Vietnamese, English)

## 📞 Support & Contact

For questions or issues, please refer to the documentation or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Developed by:** Figma Make AI Assistant
