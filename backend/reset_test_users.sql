-- Reset and create test users
-- Run this script to fix user authentication

-- Delete existing test users
DELETE FROM USER WHERE email IN ('staff001@milkbank.com', 'donor001@example.com');

-- Create staff user
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
    last_password_change
) VALUES (
    'staff-001',
    'staff001@milkbank.com',
    '$2a$10$G38pfkduAS9iC7Y11hkWLuoVGfR0qNGkIDG67V/Hm0WlooLJSNMme',
    1,
    'Nguyen Van Minh - Staff',
    '0901234567',
    '011234567890',
    'staff',
    1,
    NOW(),
    NOW(),
    0,
    NOW()
);

-- Create donor user
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
    last_password_change
) VALUES (
    'donor-user-001',
    'donor001@example.com',
    '$2a$10$JyeZnhzh85PvAxS44pRyb.1mJFPjJhgXNkn.DG5qT32TcH9xntp5e',
    1,
    'Le Thi Huong - Donor',
    '0923456789',
    '002234567890',
    'donor',
    1,
    NOW(),
    NOW(),
    0,
    NOW()
);

-- Create donor profile (donor_id = user_id as per 1:1 relationship)
INSERT INTO DONOR (
    donor_id,
    donor_status,
    screening_status,
    director_status,
    points_total
) VALUES (
    'donor-user-001',
    'active',
    'approved',
    'approved',
    0
) ON DUPLICATE KEY UPDATE 
    donor_status = 'active',
    screening_status = 'approved',
    director_status = 'approved';

SELECT '✅ Test users created successfully!' AS result;
SELECT '📧 Staff: staff001@milkbank.com / Password: Staff123!@#' AS credentials;
SELECT '📧 Donor: donor001@example.com / Password: Donor123!@#' AS credentials;
