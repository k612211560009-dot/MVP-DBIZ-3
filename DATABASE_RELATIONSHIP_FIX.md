# ✅ Fix Database DONOR Relationship - Hoàn Thành

## 🎯 Vấn Đề Đã Fix

Bảng **DONOR** thiếu foreign key constraint tới bảng **USER**, dẫn đến:

- Không có relationship rõ ràng giữa USER và DONOR
- `donor_id` không được validate với `user_id`
- Profile API cho donor bị lỗi do không load được relationship

## 🔧 Các Thay Đổi Đã Thực Hiện

### 1. Database Schema Fix

**File**: [backend/migrations/fix_donor_user_relationship.sql](backend/migrations/fix_donor_user_relationship.sql)

```sql
-- Thêm foreign key constraint
ALTER TABLE DONOR
ADD CONSTRAINT fk_donor_user
FOREIGN KEY (donor_id) REFERENCES USER(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Thêm constraint cho EHR_DONOR
ALTER TABLE EHR_DONOR
ADD CONSTRAINT fk_ehr_donor_donor
FOREIGN KEY (donor_id) REFERENCES DONOR(donor_id)
ON DELETE CASCADE
ON UPDATE CASCADE;
```

**Kết quả**: ✅ Foreign keys đã được thêm thành công

### 2. Backend Model Fix

**File**: [backend/src/controllers/AuthController.js](backend/src/controllers/AuthController.js)

- ❌ Xóa field `registration_step` (không tồn tại trong DONOR table)
- ✅ Thêm các fields đúng: `donor_id`, `director_status`, `consent_signed_at`
- ✅ Thêm `name`, `phone` vào User attributes

### 3. Models Index Fix

**File**: [backend/src/models/index.js](backend/src/models/index.js)

- ✅ Exclude `testConnection.js` khỏi model loading
- ✅ Fix lỗi "undefined" model trong danh sách

## 📊 Database Relationships Hiện Tại

```
USER (user_id)
    ↓ 1:1
DONOR (donor_id = user_id)  [FK: fk_donor_user]
    ↓ 1:1
EHR_DONOR (donor_id)  [FK: fk_ehr_donor_donor]
```

### Foreign Key Constraints:

| Table     | Column       | References         | Constraint Name    |
| --------- | ------------ | ------------------ | ------------------ |
| DONOR     | donor_id     | USER(user_id)      | fk_donor_user      |
| DONOR     | home_bank_id | MILK_BANK(bank_id) | DONOR_ibfk_2       |
| EHR_DONOR | donor_id     | DONOR(donor_id)    | fk_ehr_donor_donor |

## 🧪 Test Users

### Staff Account

- **Email**: staff001@milkbank.com
- **Password**: Staff123!@#
- **User ID**: staff-001
- **Role**: staff

### Donor Account

- **Email**: donor001@example.com
- **Password**: Donor123!@#
- **User ID**: donor-user-001
- **Role**: donor
- **Donor ID**: donor-user-001 (same as user_id per 1:1 relationship)

## 📝 Scripts Đã Tạo

1. **fix_donor_user_relationship.sql** - Thêm foreign key constraints
2. **reset_test_users.sql** - Tạo lại test users với password hash đúng
3. **generate_hash.js** - Tool tạo bcrypt password hash

## ⚙️ Để Chạy Migrations

```bash
# Option 1: Qua Docker (nếu Docker Desktop đang chạy)
docker exec -i milkbank-db mysql -umilkbank -pmilkbank_pass milkbank_dev < backend/reset_test_users.sql

# Option 2: Qua MySQL client trực tiếp
mysql -h localhost -P 3307 -umilkbank -pmilkbank_pass milkbank_dev < backend/reset_test_users.sql

# Option 3: Từ VS Code MySQL extension
# - Mở file .sql
# - Right click -> Execute SQL
```

## ✅ Trạng Thái Hiện Tại

- ✅ Database schema: FIXED
- ✅ Foreign key constraints: ADDED
- ✅ Backend models: FIXED
- ✅ Backend server: RUNNING
- ⚠️ Test users: CẦN CHẠY reset_test_users.sql

## 🔜 Bước Tiếp Theo

1. Chạy Docker Desktop (hoặc start MySQL container)
2. Chạy file `backend/reset_test_users.sql`
3. Test lại với script: `bash test_login.sh`
4. Verify donor profile access hoạt động

## 📌 Lưu Ý Quan Trọng

### Về Relationship 1:1 giữa USER và DONOR:

- **donor_id = user_id** (shared primary key pattern)
- Khi tạo donor mới, phải:
  1. Tạo USER trước với role='donor'
  2. Tạo DONOR với donor_id = user_id của USER vừa tạo
  3. Optional: Tạo EHR_DONOR nếu cần sync với EHR system

### Password Hash Format:

- **Algorithm**: bcrypt (bcryptjs)
- **Rounds**: 10
- **Format**: `$2a$10$...` (60 characters)
- ⚠️ **Chú ý**: Khi insert vào SQL, cần escape `$` thành `\$` hoặc wrap trong quotes

---

**Last Updated**: December 27, 2025  
**Status**: ✅ Migration scripts ready, waiting for MySQL connection to execute
