-- ================================================
-- MentorKhet - Complete Database Setup Script
-- Run: mysql -u root -p mentorkhet < database-setup.sql
-- ================================================

DROP TABLE IF EXISTS `mentee_interests`;
DROP TABLE IF EXISTS `mentor_skills`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `feedback`;
DROP TABLE IF EXISTS `matchings`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `mentees`;
DROP TABLE IF EXISTS `mentors`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `auth_tokens`;
DROP TABLE IF EXISTS `users`;

-- ================================================
-- TABLE: users
-- ================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'mentor', 'mentee') NOT NULL DEFAULT 'mentee',
  `phone` VARCHAR(20) NULL,
  `avatar` VARCHAR(255) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `lastLogin` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: auth_tokens
-- ================================================
CREATE TABLE `auth_tokens` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `refreshToken` VARCHAR(500) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `expiresAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: skills
-- ================================================
CREATE TABLE `skills` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `category` VARCHAR(50) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: mentors
-- ================================================
CREATE TABLE `mentors` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL UNIQUE,
  `title` VARCHAR(100) NULL,
  `company` VARCHAR(100) NULL,
  `bio` TEXT NULL,
  `yearsOfExperience` INT NOT NULL DEFAULT 0,
  `skills` TEXT NULL,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `totalSessions` INT NOT NULL DEFAULT 0,
  `isAvailable` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: mentor_skills (Junction Table)
-- ================================================
CREATE TABLE `mentor_skills` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `mentorId` VARCHAR(36) NOT NULL,
  `skillId` VARCHAR(36) NOT NULL,
  `proficiencyLevel` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
  `yearsOfExperience` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_mentor_skill` (`mentorId`, `skillId`),
  FOREIGN KEY (`mentorId`) REFERENCES `mentors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: mentees
-- ================================================
CREATE TABLE `mentees` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL UNIQUE,
  `occupation` VARCHAR(100) NULL,
  `organization` VARCHAR(100) NULL,
  `goals` TEXT NULL,
  `interests` TEXT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: mentee_interests (Junction Table)
-- ================================================
CREATE TABLE `mentee_interests` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `menteeId` VARCHAR(36) NOT NULL,
  `skillId` VARCHAR(36) NOT NULL,
  `priority` INT NOT NULL DEFAULT 1,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_mentee_interest` (`menteeId`, `skillId`),
  FOREIGN KEY (`menteeId`) REFERENCES `mentees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: sessions
-- ================================================
CREATE TABLE `sessions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `mentorId` VARCHAR(36) NOT NULL,
  `menteeId` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `scheduledAt` TIMESTAMP NOT NULL,
  `duration` INT NOT NULL DEFAULT 60,
  `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') NOT NULL DEFAULT 'PENDING',
  `meetingLink` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`mentorId`) REFERENCES `mentors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menteeId`) REFERENCES `mentees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: feedback
-- ================================================
CREATE TABLE `feedback` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `mentorId` VARCHAR(36) NOT NULL,
  `menteeId` VARCHAR(36) NOT NULL,
  `sessionId` VARCHAR(36) NULL UNIQUE,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT NULL,
  `isAnonymous` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`mentorId`) REFERENCES `mentors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menteeId`) REFERENCES `mentees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: matchings
-- ================================================
CREATE TABLE `matchings` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `mentorId` VARCHAR(36) NOT NULL,
  `menteeId` VARCHAR(36) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `reason` TEXT NULL,
  `matchedBy` VARCHAR(36) NULL,
  `matchedAt` TIMESTAMP NULL,
  `completedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`mentorId`) REFERENCES `mentors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menteeId`) REFERENCES `mentees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: notifications
-- ================================================
CREATE TABLE `notifications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP') NOT NULL DEFAULT 'IN_APP',
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `readAt` TIMESTAMP NULL,
  `actionUrl` VARCHAR(255) NULL,
  `metadata` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- TABLE: activity_logs
-- ================================================
CREATE TABLE `activity_logs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(36) NULL,
  `action` ENUM('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'APPROVE', 'DECLINE', 'COMPLETE', 'CANCEL') NOT NULL,
  `entity` VARCHAR(100) NOT NULL,
  `entityId` VARCHAR(36) NOT NULL,
  `description` TEXT NULL,
  `ipAddress` VARCHAR(50) NULL,
  `userAgent` TEXT NULL,
  `metadata` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- INSERT SAMPLE DATA
-- ================================================

-- Users (password: password123)
INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `role`, `phone`) VALUES
('u1', 'Admin',    'User',  'admin@mentorkhet.com',   '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'admin',  '012345678'),
('u2', 'Sok',      'Heng',  'sok.heng@example.com',   '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentor', '012345679'),
('u3', 'Chea',     'Sovann','chea.sovann@example.com', '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentor', '012345680'),
('u4', 'Thida',    'Mey',   'thida.mey@example.com',   '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentor', '012345681'),
('u5', 'Sophea',   'Kim',   'sophea.kim@example.com',  '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentee', '012345682'),
('u6', 'Vannak',   'Long',  'vannak.long@example.com', '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentee', '012345683'),
('u7', 'Dara',     'Pich',  'dara.pich@example.com',   '$2b$10$rQJqKMqTmTHFBc7X5gHj0u3ZGJLhxfTULGXBmF3QXsXBhMHWX4VLe', 'mentee', '012345684');

-- Mentors
INSERT INTO `mentors` (`id`, `userId`, `title`, `company`, `bio`, `yearsOfExperience`, `rating`, `totalSessions`) VALUES
('m1', 'u2', 'Senior Software Engineer', 'Google', 'Experienced in web development, TypeScript, and cloud architecture.', 8, 4.80, 25),
('m2', 'u3', 'Data Scientist', 'Meta', 'Expert in machine learning, Python, and data analysis.', 6, 4.50, 18),
('m3', 'u4', 'UX Designer', 'Adobe', 'Creative designer with focus on user research and product design.', 5, 4.20, 12);

-- Mentees
INSERT INTO `mentees` (`id`, `userId`, `occupation`, `organization`, `goals`) VALUES
('e1', 'u5', 'Student', 'Institute of Technology of Cambodia', 'Become full-stack developer'),
('e2', 'u6', 'Junior Developer', 'Tech Startup', 'Improve Python and ML skills'),
('e3', 'u7', 'Freelancer', NULL, 'Learn UI/UX design professionally');

-- Skills
INSERT INTO `skills` (`id`, `name`, `category`) VALUES
('s1',  'JavaScript',       'TECHNICAL'),
('s2',  'TypeScript',       'TECHNICAL'),
('s3',  'Node.js',          'TECHNICAL'),
('s4',  'React',            'TECHNICAL'),
('s5',  'Python',           'TECHNICAL'),
('s6',  'Machine Learning', 'TECHNICAL'),
('s7',  'PostgreSQL',       'TECHNICAL'),
('s8',  'SQL',              'TECHNICAL'),
('s9',  'UI Design',        'CREATIVE'),
('s10', 'Figma',            'CREATIVE'),
('s11', 'UX Research',      'SOFT_SKILLS'),
('s12', 'Communication',    'SOFT_SKILLS'),
('s13', 'Leadership',       'SOFT_SKILLS'),
('s14', 'Data Analysis',    'TECHNICAL'),
('s15', 'Web Development',  'TECHNICAL');

-- Mentor Skills (Junction)
INSERT INTO `mentor_skills` (`id`, `mentorId`, `skillId`, `proficiencyLevel`, `yearsOfExperience`) VALUES
('ms1',  'm1', 's1', 'EXPERT',    8),
('ms2',  'm1', 's2', 'ADVANCED',  5),
('ms3',  'm1', 's3', 'EXPERT',    7),
('ms4',  'm1', 's4', 'ADVANCED',  4),
('ms5',  'm2', 's5', 'EXPERT',    6),
('ms6',  'm2', 's6', 'ADVANCED',  4),
('ms7',  'm2', 's8', 'ADVANCED',  5),
('ms8',  'm2', 's14','EXPERT',    6),
('ms9',  'm3', 's9', 'EXPERT',    5),
('ms10', 'm3', 's10','EXPERT',    5),
('ms11', 'm3', 's11','ADVANCED',  3);

-- Mentee Interests (Junction)
INSERT INTO `mentee_interests` (`id`, `menteeId`, `skillId`, `priority`) VALUES
('mi1',  'e1', 's1',  1),
('mi2',  'e1', 's3',  2),
('mi3',  'e1', 's4',  3),
('mi4',  'e1', 's15', 4),
('mi5',  'e2', 's5',  1),
('mi6',  'e2', 's6',  2),
('mi7',  'e2', 's8',  3),
('mi8',  'e2', 's14', 4),
('mi9',  'e3', 's9',  1),
('mi10', 'e3', 's10', 2),
('mi11', 'e3', 's11', 3);

-- Sessions
INSERT INTO `sessions` (`id`, `mentorId`, `menteeId`, `title`, `description`, `scheduledAt`, `duration`, `status`, `meetingLink`) VALUES
('ss1', 'm1', 'e1', 'Introduction to Node.js', 'Learn basics of Node.js and Express', '2026-05-25 14:00:00', 60, 'COMPLETED', 'https://meet.google.com/abc-defg-hij'),
('ss2', 'm1', 'e1', 'React Hooks Deep Dive', 'Understand useState, useEffect, useContext', '2026-05-28 10:00:00', 90, 'CONFIRMED', 'https://meet.google.com/xyz-1234-abc'),
('ss3', 'm2', 'e2', 'Python for Data Science', 'Introduction to pandas and numpy', '2026-05-26 15:00:00', 60, 'COMPLETED', 'https://meet.google.com/def-5678-ghi'),
('ss4', 'm2', 'e2', 'Machine Learning Basics', 'Supervised vs unsupervised', '2026-05-30 09:00:00', 90, 'PENDING', NULL),
('ss5', 'm3', 'e3', 'Figma Basics Workshop', 'Create UI mockups', '2026-05-27 13:00:00', 60, 'CONFIRMED', 'https://meet.google.com/ghi-9012-jkl');

-- Feedback
INSERT INTO `feedback` (`id`, `mentorId`, `menteeId`, `sessionId`, `rating`, `comment`) VALUES
('f1', 'm1', 'e1', 'ss1', 5, 'Excellent session! Very clear explanations.'),
('f2', 'm2', 'e2', 'ss3', 4, 'Good teaching style, more examples would help.');

-- Notifications
INSERT INTO `notifications` (`id`, `userId`, `title`, `message`, `isRead`) VALUES
('n1', 'u5', 'Session Confirmed', 'Your session "React Hooks Deep Dive" has been confirmed', 0),
('n2', 'u2', 'New Session Request', 'Sophea Kim requested a session: Introduction to Node.js', 1),
('n3', 'u7', 'Session Reminder', 'Your session "Figma Basics Workshop" is tomorrow at 1PM', 0);

-- ================================================
-- SUMMARY
-- ================================================
SELECT '========================================' AS '';
SELECT 'DATABASE SETUP COMPLETE!' AS '';
SELECT '========================================' AS '';
SELECT CONCAT('Tables created: ', COUNT(*)) AS '' FROM information_schema.tables WHERE table_schema = DATABASE();
SELECT '' AS '';
SHOW TABLES;
SELECT '' AS '';
SELECT 'Data inserted:' AS '';
SELECT '  7 users (1 admin, 3 mentors, 3 mentees)' AS '';
SELECT '  15 skills' AS '';
SELECT '  11 mentor_skills' AS '';
SELECT '  11 mentee_interests' AS '';
SELECT '  5 sessions' AS '';
SELECT '  2 feedback' AS '';
SELECT '  3 notifications' AS '';
SELECT '' AS '';
SELECT 'Test login: admin@mentorkhet.com / password123' AS '';
