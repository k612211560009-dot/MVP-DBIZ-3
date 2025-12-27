-- Create test donor users with proper password hashing
-- Password for all test donors: Donor123!@#

-- Insert Test Donor 1 User
INSERT INTO USER (
    user_id,
    email,
    password_hash,
    email_verified,
    name,
    phone,
    national_id,
    role,
    is_active,
    created_at,
    updated_at,
    failed_login_attempts,
    account_locked_until,
    last_password_change,
    last_login
)
VALUES (
    'donor-user-001',
    'donor001@example.com',
    '$2a$10$JyeZnhzh85PvAxS44pRyb.1mJFPjJhgXNkn.DG5qT32TcH9xntp5e',  -- Password: Donor123!@#
    1,
    'Le Thi Huong',
    '0923456789',
    '002234567890',
    'donor',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);

-- Insert Test Donor 2 User
INSERT INTO USER (
    user_id,
    email,
    password_hash,
    email_verified,
    name,
    phone,
    national_id,
    role,
    is_active,
    created_at,
    updated_at,
    failed_login_attempts,
    account_locked_until,
    last_password_change,
    last_login
)
VALUES (
    'donor-user-002',
    'donor002@example.com',
    '$2a$10$JyeZnhzh85PvAxS44pRyb.1mJFPjJhgXNkn.DG5qT32TcH9xntp5e',  -- Password: Donor123!@#
    1,
    'Pham Van Tuan',
    '0934567890',
    '002234567891',
    'donor',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);

SELECT 'Test donors created successfully!' AS message;
SELECT 'Email: donor001@example.com / donor002@example.com' AS credentials;
SELECT 'Password: Donor123!@#' AS password_info;
