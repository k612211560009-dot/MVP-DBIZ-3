# MySQL Database Guide

## 1. Database Setup & Configuration

### 1.1 Initial Database Setup

```sql
CREATE DATABASE milk_bank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'milk_bank_user'@'%' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON milk_bank.* TO 'milk_bank_user'@'%';
FLUSH PRIVILEGES;

USE milk_bank;
```

### 1.4 Canonical MVP schema

For fast development you can import the canonical MVP schema provided in this repo: `MB_schema_v3.sql`.

Import (local mysql client):

```bash
mysql -u milk_bank_user -p -h 127.0.0.1 milk_bank < ./MB_schema_v3.sql
```

If you use Docker (recommended for local dev):

```bash
# start mysql container (example)
# docker compose up -d
# then import into running mysql container:
docker exec -i <mysql-container-name> mysql -u root -p$MYSQL_ROOT_PASSWORD milk_bank < ./MB_schema_v3.sql
```

Notes:

- `MB_schema_v3.sql` is the canonical snapshot for the MVP (core tables only). Primary keys are `CHAR(36)` UUID strings — the application should set these UUIDs on INSERT (or use migrations/seeder code to insert rows).
- For production, we recommend using migrations (Sequelize CLI) in addition to maintaining `MB_schema_v3.sql` as a reference snapshot.

### 1.2 Complete Schema Implementation

#### Core Tables with Enhanced Constraints

```sql
-- Users table with authentication
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    national_id VARCHAR(20) UNIQUE,
    role ENUM('donor', 'medical_staff', 'director', 'admin') NOT NULL DEFAULT 'donor',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_national_id (national_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Donor profiles
CREATE TABLE donors (
    donor_id CHAR(36) PRIMARY KEY,
    home_bank_id CHAR(36),
    date_of_birth DATE NOT NULL,
    address TEXT,
    emergency_contact JSON,
    donor_status ENUM('in_progress', 'active', 'suspended', 'removed', 'rejected', 'failed_positive', 'abandoned') DEFAULT 'in_progress',
    screening_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    director_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    registration_step INT DEFAULT 1,
    consent_signed_at TIMESTAMP NULL,
    consent_document_url VARCHAR(500),
    weekly_availability JSON,
    points_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (donor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_donor_status (donor_status),
    INDEX idx_screening_status (screening_status),
    INDEX idx_director_status (director_status),
    INDEX idx_created_at (created_at),
    INDEX idx_points (points_total),
    CHECK (date_of_birth <= DATE_SUB(CURRENT_DATE, INTERVAL 18 YEAR))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.3 Data Seeding for Development

#### Initial Admin User

```sql
INSERT INTO users (user_id, email, password_hash, name, role, is_active) VALUES
(UUID(), 'admin@milkbank.org', '$2b$12$hashed_password_here', 'System Administrator', 'admin', TRUE);

INSERT INTO users (user_id, email, password_hash, name, role, is_active) VALUES
(UUID(), 'director@milkbank.org', '$2b$12$hashed_password_here', 'Milk Bank Director', 'director', TRUE);

INSERT INTO users (user_id, email, password_hash, name, role, is_active) VALUES
(UUID(), 'staff1@milkbank.org', '$2b$12$hashed_password_here', 'Dr. Nguyen Van A', 'medical_staff', TRUE);
```

#### Sample Reward Rules

```sql
INSERT INTO reward_rules (rule_id, name, description, volume_min, volume_max, points, is_active, valid_from, created_by) VALUES
(UUID(), 'Basic Donation', 'Standard points for small donations', 50, 150, 50, TRUE, '2024-01-01', (SELECT user_id FROM users WHERE role = 'admin' LIMIT 1)),
(UUID(), 'Medium Donation', 'Bonus points for medium donations', 151, 300, 150, TRUE, '2024-01-01', (SELECT user_id FROM users WHERE role = 'admin' LIMIT 1)),
(UUID(), 'Large Donation', 'Premium points for large donations', 301, 500, 300, TRUE, '2024-01-01', (SELECT user_id FROM users WHERE role = 'admin' LIMIT 1));
```

## 2. Query Optimization

### 2.1 Critical Query Indexes

```sql
-- Appointment performance indexes
CREATE INDEX idx_appointment_donor_date ON appointments(donor_id, scheduled_start);
CREATE INDEX idx_appointment_staff_date ON appointments(medical_staff_id, scheduled_start);
CREATE INDEX idx_appointment_status_date ON appointments(status, scheduled_start);

-- Donation tracking indexes
CREATE INDEX idx_donation_donor_date ON donation_records(donor_id, donation_date);
CREATE INDEX idx_donation_volume_date ON donation_records(milk_volume_ml, donation_date);

-- Screening performance indexes
CREATE INDEX idx_screening_donor_date ON screening_sessions(donor_id, screening_date);
CREATE INDEX idx_screening_result_date ON screening_sessions(screening_result, screening_date);
```

### 2.2 Optimized Query Examples

#### Get Donor Dashboard Data

```sql
SELECT
    d.donor_id,
    u.name,
    u.email,
    d.donor_status,
    d.points_total,
    COUNT(DISTINCT a.appointment_id) as total_appointments,
    COUNT(DISTINCT dr.donation_id) as total_donations,
    COALESCE(SUM(dr.milk_volume_ml), 0) as total_volume_ml
FROM donors d
JOIN users u ON d.donor_id = u.user_id
LEFT JOIN appointments a ON d.donor_id = a.donor_id
LEFT JOIN donation_records dr ON d.donor_id = dr.donor_id
WHERE d.donor_id = ?
GROUP BY d.donor_id, u.name, u.email, d.donor_status, d.points_total;
```

#### Get Available Time Slots

```sql
SELECT
    TIME(scheduled_start) as slot_time,
    DATE(scheduled_start) as slot_date,
    COUNT(*) as booked_slots,
    medical_staff_id
FROM appointments
WHERE scheduled_start BETWEEN ? AND ?
    AND status IN ('scheduled', 'confirmed')
GROUP BY DATE(scheduled_start), TIME(scheduled_start), medical_staff_id
HAVING booked_slots < 1; -- Assuming one appointment per slot
```

## 3. Database Maintenance

### 3.1 Regular Maintenance Scripts

```sql
-- Clean up old appointments (keep 6 months)
DELETE FROM appointments
WHERE scheduled_start < DATE_SUB(NOW(), INTERVAL 6 MONTH)
AND status IN ('completed', 'cancelled', 'failed');

-- Archive old donation records (move to archive table)
INSERT INTO donation_records_archive
SELECT * FROM donation_records
WHERE donation_date < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Update points totals (scheduled job)
UPDATE donors d
SET points_total = (
    SELECT COALESCE(SUM(points), 0)
    FROM point_transactions pt
    WHERE pt.donor_id = d.donor_id
    AND pt.transaction_type = 'earned'
) - (
    SELECT COALESCE(SUM(points), 0)
    FROM point_transactions pt
    WHERE pt.donor_id = d.donor_id
    AND pt.transaction_type = 'redeemed'
);
```
