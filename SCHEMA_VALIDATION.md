# ✅ Database Schema Validation - Hoàn Chỉnh

## 📊 Kiểm Tra Schema - 27/12/2025

### ✅ Schema Đã Chuẩn và Hoàn Chỉnh

Tất cả các bảng đã được kiểm tra và **MATCH** với database thực tế:

---

## 🔑 Quan Hệ Giữa Các Bảng

### USER ↔ DONOR ↔ EHR_DONOR (1:1:1 Relationship)

```
USER (user_id) [PK]
    ↓ 1:1 (shared PK)
DONOR (donor_id = user_id) [PK, FK → USER.user_id]
    ↓ 1:1 (shared PK)
EHR_DONOR (donor_id = user_id) [PK, FK → DONOR.donor_id]
```

### ✅ Xác Nhận: KHÔNG CẦN user_id riêng

**Đúng theo thiết kế shared primary key pattern:**

- `DONOR.donor_id` **CHÍNH LÀ** `USER.user_id` (không có cột user_id riêng)
- `EHR_DONOR.donor_id` **CHÍNH LÀ** `DONOR.donor_id` = `USER.user_id`

**Lợi ích:**

- ✅ Đảm bảo 1:1 relationship tuyệt đối
- ✅ Không có orphan records
- ✅ Cascade delete tự động
- ✅ Query đơn giản hơn

---

## 📋 Chi Tiết Các Bảng

### 1. USER Table ✅

**Mục đích:** Lưu thông tin authentication và cơ bản của tất cả users

**Key Fields:**

- `user_id` - PK, varchar(36) UUID
- `email` - UNIQUE, authentication identifier
- `password_hash` - bcrypt hash
- `national_id` - UNIQUE, Citizen ID
- `role` - donor|medical_staff|director|admin
- `email_verified`, `is_active` - Account status
- `failed_login_attempts`, `account_locked_until` - Security
- `last_password_change`, `last_login` - Audit trail

**Foreign Keys:** None (root table)

---

### 2. DONOR Table ✅

**Mục đích:** Thông tin đăng ký và trạng thái của donor

**Key Fields:**

- `donor_id` - PK, FK → USER.user_id (shared PK)
- `home_bank_id` - FK → MILK_BANK.bank_id
- `donor_status` - in_progress|active|suspended|removed|rejected|failed_positive|abandoned
- `screening_status` - pending|approved|rejected
- `director_status` - pending|approved|rejected
- `consent_signed_at`, `consent_method` - Consent tracking
- `weekly_days` - Bitmask cho ngày trong tuần
- `preferred_start`, `preferred_end` - Time preferences
- `max_visits_per_week`, `points_total` - Limits & rewards

**Foreign Keys:**

- `donor_id` → `USER(user_id)` - ON DELETE CASCADE
- `home_bank_id` → `MILK_BANK(bank_id)`

**⚠️ Lưu ý:** donor_id KHÔNG phải auto-increment, phải = user_id khi tạo

---

### 3. EHR_DONOR Table ✅

**Mục đích:** Dữ liệu từ EHR system (External Health Records)

**Đã cập nhật schema với các fields:**

- `donor_id` - PK, FK → DONOR.donor_id (shared PK)
- `national_id` - Copy từ USER for audit trail
- **Personal Info (từ EHR):**
  - `full_name`, `date_of_birth`
  - `phone`, `email`
  - `address`, `province`, `district`, `ward`
- **System Info:**
  - `source_system` - Default 'national_ehr'
  - `last_fetched_at` - Timestamp
- **Test Results (5 loại):**
  - HIV, HBV, HCV, Syphilis, HTLV
  - Mỗi loại có: `_result`, `_sample_date`, `_valid_until`
- `is_clear` - Boolean: all tests negative & valid
- `raw_json` - Original EHR response

**Foreign Keys:**

- `donor_id` → `DONOR(donor_id)` - ON DELETE CASCADE

---

### 4. MILK_BANK Table ✅

**Mục đích:** Thông tin các ngân sữa

**Fields:**

- `bank_id` - PK
- `name` - UNIQUE
- `province`, `address`, `phone`
- `created_at`

---

### 5. DONATION_VISIT Table ✅

**Mục đích:** Lịch sử các lần hiến/dự kiến hiến

**Fields:**

- `visit_id` - PK
- `donor_id` - FK → DONOR
- `bank_id` - FK → MILK_BANK
- `scheduled_start`, `scheduled_end`
- `origin` - system|user|staff
- `status` - proposed|scheduled|confirmed|skipped|cancelled|completed
- `health_status`, `health_note` - Health check
- `volume_ml`, `container_count`, `quality_note` - Donation data
- `points_awarded` - Reward points
- `recorded_by` - FK → USER (staff)

**Foreign Keys:**

- `donor_id` → `DONOR(donor_id)`
- `bank_id` → `MILK_BANK(bank_id)`
- `recorded_by` → `USER(user_id)`

---

### 6. VISIT_SCHEDULE Table ✅

**Mục đích:** Quy tắc lên lịch định kỳ

**Fields:**

- `visit_id` - PK, FK → DONATION_VISIT (1:1 shared PK)
- `plan_month` - YYYY-MM
- `plan_type` - monthly_day|monthly_nth_weekday|ad_hoc
- **Pattern:**
  - `day_of_month` - 1-31
  - `week_of_month` - 1-5
  - `weekday` - 1=Mon..7=Sun
  - `window_start`, `window_end` - Time range
- `proposed_on`, `proposed_by` - Tracking
- `reschedule_count` - History
- `rule_snapshot` - JSON backup of rules

**Foreign Keys:**

- `visit_id` → `DONATION_VISIT(visit_id)`
- `proposed_by` → `USER(user_id)`

---

## 🔐 Foreign Key Constraints Summary

| Child Table    | Column       | Parent Table   | Parent Column | On Delete | On Update |
| -------------- | ------------ | -------------- | ------------- | --------- | --------- |
| DONOR          | donor_id     | USER           | user_id       | CASCADE   | CASCADE   |
| DONOR          | home_bank_id | MILK_BANK      | bank_id       | -         | -         |
| EHR_DONOR      | donor_id     | DONOR          | donor_id      | CASCADE   | CASCADE   |
| DONATION_VISIT | donor_id     | DONOR          | donor_id      | -         | -         |
| DONATION_VISIT | bank_id      | MILK_BANK      | bank_id       | -         | -         |
| DONATION_VISIT | recorded_by  | USER           | user_id       | -         | -         |
| VISIT_SCHEDULE | visit_id     | DONATION_VISIT | visit_id      | -         | -         |
| VISIT_SCHEDULE | proposed_by  | USER           | user_id       | -         | -         |

---

## 📝 Workflow Tạo Donor Mới

### Bước 1: Tạo USER

```sql
INSERT INTO USER (user_id, email, password_hash, role, ...)
VALUES ('uuid-here', 'email@example.com', '$2a$10$...', 'donor', ...);
```

### Bước 2: Tạo DONOR (dùng cùng user_id)

```sql
INSERT INTO DONOR (donor_id, donor_status, screening_status, ...)
VALUES ('uuid-here', 'in_progress', 'pending', ...);
-- donor_id PHẢI BẰNG user_id từ bước 1
```

### Bước 3: (Optional) Sync EHR Data

```sql
INSERT INTO EHR_DONOR (donor_id, national_id, full_name, ...)
VALUES ('uuid-here', 'national-id', 'Full Name', ...);
-- donor_id PHẢI BẰNG user_id từ bước 1
```

---

## ✅ Kết Luận

### Schema Status: **🟢 CHUẨN & SẴN SÀNG**

- ✅ Tất cả bảng match với database thực tế
- ✅ Foreign keys đã được thiết lập đúng
- ✅ Shared PK pattern được implement đúng
- ✅ KHÔNG CẦN thêm user_id vào DONOR/EHR_DONOR
- ✅ Cascade delete hoạt động tốt
- ✅ Login & authentication đang hoạt động 100%

### Files đã được chuẩn hóa:

- ✅ `MySQL Local.session.sql` - Schema definition
- ✅ Backend models - Sequelize associations
- ✅ AuthController - Profile loading
- ✅ Test users - Đã tạo và verify thành công

**Last Updated:** December 27, 2025  
**Database:** milkbank_dev (MySQL 8.0)  
**Status:** Production-ready schema ✅
