-- Update milk_bank table with Bệnh viện Nhi Trung ương information
-- Run this on both local and production database

-- First, check if the default milk bank exists
SELECT * FROM MILK_BANK WHERE bank_id = '550e8400-e29b-41d4-a716-446655440101';

-- Update the existing milk bank record
UPDATE MILK_BANK 
SET 
  name = 'Ngân hàng Sữa Mẹ - Bệnh viện Nhi Trung ương',
  province = 'Hà Nội',
  address = '18/879 Đường La Thành, Phường Láng Hạ, Quận Đống Đa, Hà Nội'
WHERE bank_id = '550e8400-e29b-41d4-a716-446655440101';

-- If the record doesn't exist, insert it
INSERT INTO MILK_BANK (bank_id, name, province, address, created_at)
SELECT 
  '550e8400-e29b-41d4-a716-446655440101',
  'Ngân hàng Sữa Mẹ - Bệnh viện Nhi Trung ương',
  'Hà Nội',
  '18/879 Đường La Thành, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM MILK_BANK WHERE bank_id = '550e8400-e29b-41d4-a716-446655440101'
);

-- Verify the update
SELECT * FROM MILK_BANK WHERE bank_id = '550e8400-e29b-41d4-a716-446655440101';
