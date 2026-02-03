-- Create appointments table for donor scheduling
-- Run this on Aiven MySQL database

CREATE TABLE IF NOT EXISTS `appointments` (
  `appointment_id` varchar(36) NOT NULL,
  `donor_id` varchar(36) NOT NULL,
  `bank_id` varchar(36) DEFAULT NULL,
  `appointment_type` varchar(50) DEFAULT 'consultation',
  `appointment_date` datetime NOT NULL,
  `time_slot` varchar(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'scheduled',
  `priority_level` int DEFAULT 1,
  `notes` text,
  `preparation_instructions` text,
  `meeting_link` varchar(500) DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `created_by` varchar(36) DEFAULT NULL,
  `cancelled_reason` text,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `medical_staff_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `idx_donor_id` (`donor_id`),
  KEY `idx_appointment_date` (`appointment_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_appointments_donor` FOREIGN KEY (`donor_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointments_bank` FOREIGN KEY (`bank_id`) REFERENCES `MILK_BANK` (`bank_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_appointments_staff` FOREIGN KEY (`medical_staff_id`) REFERENCES `USER` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert sample data (optional)
-- Uncomment if you want test data
-- INSERT INTO `appointments` (appointment_id, donor_id, appointment_date, status) VALUES
-- (UUID(), 'donor-user-001', '2026-02-10 10:00:00', 'scheduled');
