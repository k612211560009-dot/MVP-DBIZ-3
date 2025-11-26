-- Insert a test staff user
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
    UUID(),
    'staff001@milkbank.com',
    '$2b$10$XQz8Z3K4N6J5L7M9P2Q4R.S6T8U0V2W4X6Y8Z0A2B4C6D8E0F2G4H6',  -- Password: Staff123!@#
    1,
    'Nguyen Van Minh',
    '0901234567',
    '001234567890',
    'staff',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);

-- Insert another staff user
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
    UUID(),
    'staff002@milkbank.com',
    '$2b$10$XQz8Z3K4N6J5L7M9P2Q4R.S6T8U0V2W4X6Y8Z0A2B4C6D8E0F2G4H6',  -- Password: Staff123!@#
    1,
    'Tran Thi Lan',
    '0912345678',
    '001234567891',
    'staff',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);

-- Insert third staff user
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
    UUID(),
    'staff003@milkbank.com',
    '$2b$10$XQz8Z3K4N6J5L7M9P2Q4R.S6T8U0V2W4X6Y8Z0A2B4C6D8E0F2G4H6',  -- Password: Staff123!@#
    1,
    'Le Van Hung',
    '0923456789',
    '001234567892',
    'staff',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);

-- Verify inserted staff
SELECT user_id, email, name, role, is_active, created_at 
FROM USER 
WHERE role = 'staff' 
ORDER BY created_at DESC;
