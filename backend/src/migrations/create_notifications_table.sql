-- Create notifications table for staff alerts
CREATE TABLE IF NOT EXISTS notifications (
  notification_id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'new_donor_registration', 'test_expiring', 'payment_pending', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('unread', 'read', 'resolved') DEFAULT 'unread',
  related_donor_id VARCHAR(36),
  related_entity_type VARCHAR(50), -- 'donor', 'appointment', 'donation', etc.
  related_entity_id VARCHAR(36),
  metadata JSON, -- Additional data like donor name, email, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by VARCHAR(36),
  FOREIGN KEY (related_donor_id) REFERENCES DONOR(donor_id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by) REFERENCES USER(user_id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
