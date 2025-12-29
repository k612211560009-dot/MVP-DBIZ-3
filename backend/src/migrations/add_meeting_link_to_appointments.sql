-- Add meeting_link column to appointments table
-- This field will store Google Meet or video call links for screening appointments

ALTER TABLE appointments
ADD COLUMN meeting_link VARCHAR(500) NULL
COMMENT 'Video meeting link for screening interviews'
AFTER preparation_instructions;

-- Add index for faster lookup of appointments with meeting links
CREATE INDEX idx_appointments_meeting_link ON appointments(meeting_link);
