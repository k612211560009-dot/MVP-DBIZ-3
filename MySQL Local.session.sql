CREATE TABLE `USER` (
  `user_id` varchar(36) PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL COMMENT 'Bcrypt hashed password',
  `name` varchar(255),
  `phone` varchar(255),
  `national_id` varchar(255) UNIQUE COMMENT 'Citizen ID',
  `role` varchar(255) NOT NULL COMMENT 'donor|medical_staff|director|admin',
  `email_verified` boolean DEFAULT false COMMENT 'Email verification status',
  `last_login` timestamp NULL COMMENT 'Last login timestamp',
  `failed_login_attempts` int DEFAULT 0 COMMENT 'Failed login counter for account lockout',
  `account_locked_until` timestamp NULL COMMENT 'Account lockout expiration',
  `last_password_change` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Password change tracking',
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp DEFAULT (now())
);

CREATE TABLE `MILK_BANK` (
  `bank_id` varchar(36) PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `province` varchar(255),
  `address` varchar(255),
  `phone` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `DONOR` (
  `donor_id` varchar(36) PRIMARY KEY COMMENT '1–1 with USER (shared PK)',
  `home_bank_id` varchar(36) COMMENT 'current affiliation',
  `donor_status` varchar(255) NOT NULL DEFAULT 'in_progress' COMMENT 'in_progress|active|suspended|removed|rejected|failed_positive|abandoned',
  `screening_status` varchar(255) NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected',
  `director_status` varchar(255) NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected',
  `consent_signed_at` timestamp,
  `consent_method` varchar(255),
  `weekly_days` int COMMENT 'bitmask 1=Mon,2=Tue,4=Wed,8=Thu,16=Fri,32=Sat,64=Sun',
  `preferred_start` time,
  `preferred_end` time,
  `max_visits_per_week` int DEFAULT 2,
  `points_total` int DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `EHR_DONOR` (
  `donor_id` varchar(36) PRIMARY KEY COMMENT '1–1 with DONOR (shared PK)',
  `national_id` varchar(255) NOT NULL COMMENT 'copied from USER for audit',
  `full_name` varchar(255),
  `date_of_birth` date,
  `phone` varchar(20),
  `email` varchar(255),
  `address` text,
  `province` varchar(100),
  `district` varchar(100),
  `ward` varchar(100),
  `source_system` varchar(255) DEFAULT 'national_ehr',
  `last_fetched_at` timestamp NOT NULL DEFAULT (now()),
  `hiv_result` varchar(255) COMMENT 'negative|positive|indeterminate|unknown',
  `hiv_sample_date` date,
  `hiv_valid_until` date,
  `hbv_result` varchar(255),
  `hbv_sample_date` date,
  `hbv_valid_until` date,
  `hcv_result` varchar(255),
  `hcv_sample_date` date,
  `hcv_valid_until` date,
  `syphilis_result` varchar(255),
  `syphilis_sample_date` date,
  `syphilis_valid_until` date,
  `htlv_result` varchar(255),
  `htlv_sample_date` date,
  `htlv_valid_until` date,
  `is_clear` boolean NOT NULL DEFAULT false COMMENT 'all required tests negative & valid',
  `raw_json` json,
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `DONATION_VISIT` (
  `visit_id` varchar(36) PRIMARY KEY,
  `donor_id` varchar(36) NOT NULL,
  `bank_id` varchar(36) NOT NULL,
  `scheduled_start` timestamp,
  `scheduled_end` timestamp,
  `origin` varchar(255) COMMENT 'system|user|staff',
  `status` varchar(255) NOT NULL DEFAULT 'proposed' COMMENT 'proposed|scheduled|confirmed|skipped|cancelled|completed',
  `health_status` varchar(255) COMMENT 'good|bad|n/a',
  `health_note` text,
  `volume_ml` decimal,
  `container_count` int,
  `quality_note` text,
  `points_awarded` int DEFAULT 0,
  `recorded_by` varchar(36),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `VISIT_SCHEDULE` (
  `visit_id` varchar(36) PRIMARY KEY COMMENT '1–1 with DONATION_VISIT (shared PK)',
  `plan_month` varchar(255) NOT NULL COMMENT 'YYYY-MM planning cycle',
  `plan_type` varchar(255) NOT NULL COMMENT 'monthly_day|monthly_nth_weekday|ad_hoc',
  `day_of_month` int COMMENT '1–31; use last valid day if month shorter',
  `week_of_month` int COMMENT '1–5 (1=first week)',
  `weekday` int COMMENT '1=Mon..7=Sun',
  `window_start` time,
  `window_end` time,
  `proposed_on` timestamp NOT NULL DEFAULT (now()),
  `proposed_by` varchar(36),
  `reschedule_count` int DEFAULT 0,
  `rule_snapshot` json,
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

ALTER TABLE `DONOR` ADD FOREIGN KEY (`donor_id`) REFERENCES `USER` (`user_id`);

ALTER TABLE `DONOR` ADD FOREIGN KEY (`home_bank_id`) REFERENCES `MILK_BANK` (`bank_id`);

ALTER TABLE `EHR_DONOR` ADD FOREIGN KEY (`donor_id`) REFERENCES `DONOR` (`donor_id`);

ALTER TABLE `DONATION_VISIT` ADD FOREIGN KEY (`donor_id`) REFERENCES `DONOR` (`donor_id`);

ALTER TABLE `DONATION_VISIT` ADD FOREIGN KEY (`bank_id`) REFERENCES `MILK_BANK` (`bank_id`);

ALTER TABLE `DONATION_VISIT` ADD FOREIGN KEY (`recorded_by`) REFERENCES `USER` (`user_id`);

ALTER TABLE `VISIT_SCHEDULE` ADD FOREIGN KEY (`visit_id`) REFERENCES `DONATION_VISIT` (`visit_id`);

ALTER TABLE `VISIT_SCHEDULE` ADD FOREIGN KEY (`proposed_by`) REFERENCES `USER` (`user_id`);