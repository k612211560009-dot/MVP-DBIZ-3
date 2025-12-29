-- Update staff.test@milkbank.com password to Staff123!@#
UPDATE USER 
SET password_hash = '$2a$10$G38pfkduAS9iC7Y11hkWLuoVGfR0qNGkIDG67V/Hm0WlooLJSNMme'
WHERE email = 'staff.test@milkbank.com';

-- Verify the update
SELECT email, role, name, 
       SUBSTRING(password_hash, 1, 20) as hash_preview
FROM USER 
WHERE email = 'staff.test@milkbank.com';
