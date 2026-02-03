-- Create notifications table for staff alerts
-- Run this on both local and Aiven MySQL database

CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'new_appointment, new_donor_registration, screening_pending, etc.',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `priority` varchar(20) NOT NULL DEFAULT 'medium' COMMENT 'low, medium, high, urgent',
  `status` varchar(20) NOT NULL DEFAULT 'unread' COMMENT 'unread, read, archived',
  `related_donor_id` varchar(36) DEFAULT NULL COMMENT 'Link to donor if applicable',
  `related_entity_type` varchar(50) DEFAULT NULL COMMENT 'appointment, donor, screening_session, etc.',
  `related_entity_id` varchar(36) DEFAULT NULL COMMENT 'ID of related entity',
  `metadata` json DEFAULT NULL COMMENT 'Additional data in JSON format',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` timestamp NULL DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_related_donor` (`related_donor_id`),
  CONSTRAINT `fk_notifications_donor` FOREIGN KEY (`related_donor_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create index for unread notifications query (most common)
CREATE INDEX `idx_status_created` ON `notifications` (`status`, `created_at` DESC);
