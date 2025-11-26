-- Fix Authentication Columns for USER table
-- Run this after docker-compose down to restore authentication columns

USE milkbank_dev;

-- Check if columns exist before adding
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'milkbank_dev' 
  AND TABLE_NAME = 'USER' 
  AND COLUMN_NAME = 'password_hash';

-- Add columns only if they don't exist
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `USER` 
   ADD COLUMN `password_hash` VARCHAR(255) NOT NULL AFTER `role`,
   ADD COLUMN `email_verified` BOOLEAN DEFAULT FALSE AFTER `password_hash`,
   ADD COLUMN `last_login` TIMESTAMP NULL AFTER `email_verified`,
   ADD COLUMN `failed_login_attempts` INT DEFAULT 0 AFTER `last_login`,
   ADD COLUMN `account_locked_until` TIMESTAMP NULL AFTER `failed_login_attempts`,
   ADD COLUMN `last_password_change` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `account_locked_until`;',
  'SELECT "Authentication columns already exist" AS Status;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show final structure
DESC USER;

SELECT 'Authentication columns fixed!' AS Result;
