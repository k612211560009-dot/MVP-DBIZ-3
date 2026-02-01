-- Check existing users in database
SELECT 
    user_id,
    email,
    role,
    is_active,
    email_verified,
    LENGTH(password_hash) as password_length,
    SUBSTRING(password_hash, 1, 20) as password_preview,
    failed_login_attempts,
    account_locked_until,
    created_at
FROM USER 
WHERE email IN ('donor001@example.com', 'staff001@milkbank.com', 'staff.test@milkbank.com', 'donor.test@milkbank.com')
ORDER BY email;
