-- --------------------------------------------------------------------------------
-- Sample Data Insertion for the Meeting Scheduler Application
-- This script populates the 'teams' and 'meetings' tables with guaranteed
-- Version 4 UUIDs, compatible with strict backend validation.
-- --------------------------------------------------------------------------------

-- Select the database to use
USE `meeting_scheduler`;

-- --------------------------------------------------------------------------------
-- Optional: Clean up existing data before inserting new data.
-- To make this script re-runnable, you can uncomment the following lines.
-- WARNING: This will delete ALL data from your meetings and teams tables.
-- --------------------------------------------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE `meetings`;
-- TRUNCATE TABLE `teams`;
-- SET FOREIGN_KEY_CHECKS = 1;
-- --------------------------------------------------------------------------------


-- --------------------------------------------------------------------------------
-- Step 1: Insert records into the 'teams' table with Version 4 UUIDs
-- --------------------------------------------------------------------------------
INSERT INTO `teams` (`team_code`, `team_name`) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'UI Team'),
('110e8400-e29b-41d4-a716-446655440000', 'Backend Team'),
('6ec0bd7f-11c0-43da-975e-2a8ad2ebae0b', 'Mobile Team'),
('7c20c5a0-5e58-4b76-8b45-1c7a4023f05d', 'QA Team');


-- --------------------------------------------------------------------------------
-- Step 2: Insert records into the 'meetings' table using the v4 UUIDs from above
-- --------------------------------------------------------------------------------
INSERT INTO `meetings` (`meeting_code`, `team_code`, `start_time`, `end_time`, `description`, `room`) VALUES
-- Meetings for UI Team ('f47ac10b-58cc-4372-a567-0e02b2c3d479')
('a2c3d4b1-6a4e-4e89-8a21-1b2c3d4e5f6a', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2025-11-24 10:00:00', '2025-11-24 11:30:00', 'New Dashboard Design Review', 'Conference Room A'),
('b3d4e5c2-7b5f-4f9a-9b32-2c3d4e5f6a7b', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2025-11-25 14:00:00', '2025-11-25 15:00:00', 'Component Library Sync', 'Meeting Room 1'),

-- Meetings for Backend Team ('110e8400-e29b-41d4-a716-446655440000')
('c4e5f6d3-8c6a-4aaB-ac43-3d4e5f6a7b8c', '110e8400-e29b-41d4-a716-446655440000', '2025-11-24 11:00:00', '2025-11-24 12:30:00', 'API Gateway Design Session', 'Conference Room B'),
('d5f6a7e4-9d7b-4bbC-bd54-4e5f6a7b8c9d', '110e8400-e29b-41d4-a716-446655440000', '2025-11-26 09:00:00', '2025-11-26 09:30:00', 'Database Migration Planning', 'War Room'),

-- Meetings for Mobile Team ('6ec0bd7f-11c0-43da-975e-2a8ad2ebae0b')
('e6a7b8f5-ae8c-4ccD-ce65-5f6a7b8c9d0e', '6ec0bd7f-11c0-43da-975e-2a8ad2ebae0b', '2025-11-27 09:30:00', '2025-11-27 10:00:00', 'Weekly Stand-up', 'Virtual - Zoom');

-- The QA Team has no meetings scheduled yet.