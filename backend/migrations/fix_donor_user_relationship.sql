-- Migration: Fix DONOR table relationship with USER table
-- Issue: DONOR.donor_id should be a foreign key to USER.user_id (1-1 relationship)
-- Date: 2025-12-27

-- Step 1: Check current data integrity
SELECT 'Checking existing DONOR records...' AS step;
SELECT donor_id, 
       (SELECT user_id FROM USER WHERE user_id = DONOR.donor_id) AS matching_user_id,
       CASE 
         WHEN (SELECT user_id FROM USER WHERE user_id = DONOR.donor_id) IS NULL 
         THEN 'ORPHANED' 
         ELSE 'OK' 
       END AS status
FROM DONOR;

-- Step 2: Add foreign key constraint to ensure donor_id references USER.user_id
SELECT 'Adding foreign key constraint...' AS step;

ALTER TABLE DONOR
ADD CONSTRAINT fk_donor_user
FOREIGN KEY (donor_id) REFERENCES USER(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 3: Do the same for EHR_DONOR
SELECT 'Adding foreign key constraint for EHR_DONOR...' AS step;

ALTER TABLE EHR_DONOR
ADD CONSTRAINT fk_ehr_donor_donor
FOREIGN KEY (donor_id) REFERENCES DONOR(donor_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Step 4: Verify constraints
SELECT 'Verifying constraints...' AS step;

SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    information_schema.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'milkbank_dev'
    AND TABLE_NAME IN ('DONOR', 'EHR_DONOR')
    AND REFERENCED_TABLE_NAME IS NOT NULL;

SELECT '✅ Migration completed successfully!' AS result;
