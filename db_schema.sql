-- This is a recommended database schema for the MeetingPN application.
-- It is designed for a MySQL database.

-- -----------------------------------------------------
-- Table `meetings`
-- Stores the core information for each meeting.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `meetings` (
  `id` VARCHAR(36) NOT NULL COMMENT 'A unique identifier for the meeting (e.g., UUID or a timestamp-based ID).',
  `title` VARCHAR(255) NOT NULL COMMENT 'The title of the meeting.',
  `meeting_date` DATETIME NOT NULL COMMENT 'The date and time when the meeting took place.',
  `audio_url` TEXT NULL COMMENT 'URL or path to the stored audio file.',
  `duration_seconds` INT NULL COMMENT 'The duration of the meeting in seconds.',
  `summary` TEXT NULL COMMENT 'The AI-generated summary of the meeting.',
  `key_discussion_points` TEXT NULL COMMENT 'AI-extracted key discussion points.',
  `decisions_made` TEXT NULL COMMENT 'AI-extracted decisions made during the meeting.',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = 'Stores overall meeting details and summaries.';


-- -----------------------------------------------------
-- Table `participants`
-- Stores information about each unique participant in a meeting.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `participants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meeting_id` VARCHAR(36) NOT NULL COMMENT 'Foreign key to the meetings table.',
  `speaker_id` VARCHAR(100) NOT NULL COMMENT 'The original identifier assigned by the AI (e.g., "Speaker 1").',
  `name` VARCHAR(255) NOT NULL COMMENT 'The name assigned to the speaker by the user.',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_participants_meetings_idx` (`meeting_id` ASC),
  UNIQUE INDEX `unique_participant_in_meeting` (`meeting_id` ASC, `speaker_id` ASC) COMMENT 'Ensures a speaker ID is unique within a single meeting.',
  CONSTRAINT `fk_participants_meetings`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `meetings` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Stores participants for each meeting, linking AI speaker IDs to real names.';


-- -----------------------------------------------------
-- Table `transcript_entries`
-- Stores each line of the diarized transcript.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transcript_entries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meeting_id` VARCHAR(36) NOT NULL,
  `participant_id` INT NOT NULL COMMENT 'The participant who spoke this line.',
  `text` TEXT NOT NULL COMMENT 'The transcribed text for this entry.',
  `timestamp_start` FLOAT NULL COMMENT 'Optional: start time of the speech in seconds.',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_transcript_entries_meetings_idx` (`meeting_id` ASC),
  INDEX `fk_transcript_entries_participants_idx` (`participant_id` ASC),
  CONSTRAINT `fk_transcript_entries_meetings`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `meetings` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_transcript_entries_participants`
    FOREIGN KEY (`participant_id`)
    REFERENCES `participants` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Stores individual lines of the meeting transcript.';


-- -----------------------------------------------------
-- Table `action_items`
-- Stores action items and assigns them to a participant.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `action_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meeting_id` VARCHAR(36) NOT NULL,
  `participant_id` INT NULL COMMENT 'The participant assigned to this action item. Can be NULL if unassigned.',
  `description` TEXT NOT NULL COMMENT 'The description of the action item.',
  `is_completed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_action_items_meetings_idx` (`meeting_id` ASC),
  INDEX `fk_action_items_participants_idx` (`participant_id` ASC),
  CONSTRAINT `fk_action_items_meetings`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `meetings` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_action_items_participants`
    FOREIGN KEY (`participant_id`)
    REFERENCES `participants` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Stores action items identified from meetings.';
