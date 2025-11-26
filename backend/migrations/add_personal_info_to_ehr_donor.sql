-- Add personal information fields to EHR_DONOR table
-- This allows storing donor personal information alongside medical records

ALTER TABLE EHR_DONOR 
ADD COLUMN full_name VARCHAR(255) NULL AFTER national_id,
ADD COLUMN date_of_birth DATE NULL AFTER full_name,
ADD COLUMN phone VARCHAR(20) NULL AFTER date_of_birth,
ADD COLUMN email VARCHAR(255) NULL AFTER phone,
ADD COLUMN address TEXT NULL AFTER email,
ADD COLUMN province VARCHAR(100) NULL AFTER address,
ADD COLUMN district VARCHAR(100) NULL AFTER province,
ADD COLUMN ward VARCHAR(100) NULL AFTER district;

-- Add indexes for commonly searched fields
CREATE INDEX idx_ehr_donor_phone ON EHR_DONOR(phone);
CREATE INDEX idx_ehr_donor_email ON EHR_DONOR(email);
CREATE INDEX idx_ehr_donor_province ON EHR_DONOR(province);
