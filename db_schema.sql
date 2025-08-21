-- This SQL script defines the schema for a meeting transcription and analysis application.
-- It is designed for MySQL and includes tables for users, meetings, participants,
-- transcript entries, and action items.

-- Drop tables if they exist to ensure a clean slate on script execution.
DROP TABLE IF EXISTS `action_items`;
DROP TABLE IF EXISTS `transcript_entries`;
DROP TABLE IF EXISTS `meeting_participants`;
DROP TABLE IF EXISTS `meetings`;
DROP TABLE IF EXISTS `users`;

-- Table to store user information globally across the application.
-- This allows users to be identified across different meetings.
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `voice_profile_url` VARCHAR(2048),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='Stores user profiles, including voice prints for speaker identification.';

-- Table to store the main details of each meeting.
CREATE TABLE `meetings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `meeting_date` DATETIME NOT NULL,
  `audio_url` VARCHAR(2048),
  `summary` TEXT,
  `key_discussion_points` TEXT,
  `decisions_made` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='Stores the core information about each recorded meeting.';

-- A join table to link users with the meetings they participated in.
-- This creates a many-to-many relationship between users and meetings.
CREATE TABLE `meeting_participants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `meeting_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `speaker_tag` VARCHAR(255),
    UNIQUE (`meeting_id`, `user_id`),
    FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) COMMENT='Links users to the meetings they attended.';

-- Table to store each segment of the meeting's transcript.
-- Each entry is linked to a meeting and the user who spoke.
CREATE TABLE `transcript_entries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `meeting_id` INT NOT NULL,
  `participant_id` INT,
  `speaker_tag` VARCHAR(255) NOT NULL COMMENT 'The original speaker tag, e.g., "Speaker 1"',
  `text` TEXT NOT NULL,
  `timestamp_start` TIME,
  `timestamp_end` TIME,
  FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`participant_id`) REFERENCES `meeting_participants`(`id`) ON DELETE SET NULL
) COMMENT='Stores individual lines of the diarized transcript.';

-- Table to store action items identified from the meeting.
-- Each action item is assigned to a specific participant.
CREATE TABLE `action_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `meeting_id` INT NOT NULL,
  `participant_id` INT NOT NULL,
  `action_item_description` TEXT NOT NULL,
  `due_date` DATE,
  `is_completed` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`participant_id`) REFERENCES `meeting_participants`(`id`) ON DELETE CASCADE
) COMMENT='Stores action items and assigns them to participants.';

-- Add indexes to foreign keys for faster queries.
CREATE INDEX `idx_meeting_participants_meeting_id` ON `meeting_participants`(`meeting_id`);
CREATE INDEX `idx_meeting_participants_user_id` ON `meeting_participants`(`user_id`);
CREATE INDEX `idx_transcript_entries_meeting_id` ON `transcript_entries`(`meeting_id`);
CREATE INDEX `idx_transcript_entries_participant_id` ON `transcript_entries`(`participant_id`);
CREATE INDEX `idx_action_items_meeting_id` ON `action_items`(`meeting_id`);
CREATE INDEX `idx_action_items_participant_id` ON `action_items`(`participant_id`);
