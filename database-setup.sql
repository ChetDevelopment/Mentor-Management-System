-- ============================================================
-- Mentor Management System — Production Database Setup
-- Run ONCE before deploying to production
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS mentor_management_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Create application user with least privilege
-- IMPORTANT: Change the password before running!
CREATE USER IF NOT EXISTS 'mentor_user'@'%' IDENTIFIED BY 'CHANGE_ME_TO_STRONG_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON mentor_management_system.* TO 'mentor_user'@'%';
REVOKE DROP, ALTER, CREATE, INDEX ON mentor_management_system.* FROM 'mentor_user'@'%';
FLUSH PRIVILEGES;

USE mentor_management_system;

-- ============================================================
-- SECURITY TABLES
-- ============================================================

-- Token blacklist for access token revocation
CREATE TABLE IF NOT EXISTS token_blacklist (
    id CHAR(36) PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auth tokens with hashed refresh tokens
CREATE TABLE IF NOT EXISTS auth_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    refresh_token_hash VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME,
    device_info VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_refresh_hash (refresh_token_hash),
    INDEX idx_active (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions with device tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    refresh_token_hash VARCHAR(64),
    device_name VARCHAR(200),
    device_type VARCHAR(50),
    os VARCHAR(50),
    browser VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    location VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at DATETIME,
    expires_at DATETIME,
    logged_out_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_active (user_id, is_active),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log (append-only)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    event VARCHAR(50) NOT NULL,
    user_id CHAR(36),
    ip_address VARCHAR(45),
    details JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_event (event),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SCHEDULED EVENTS (Cleanup)
-- ============================================================

DELIMITER //

CREATE EVENT IF NOT EXISTS clean_expired_tokens
ON SCHEDULE EVERY 1 HOUR
COMMENT 'Remove expired token blacklist entries'
DO
BEGIN
    DELETE FROM token_blacklist WHERE expires_at < NOW();
    DELETE FROM user_sessions WHERE expires_at < NOW() AND is_active = FALSE;
END//

CREATE EVENT IF NOT EXISTS clean_expired_auth_tokens
ON SCHEDULE EVERY 24 HOUR
COMMENT 'Remove expired auth tokens older than 30 days'
DO
BEGIN
    DELETE FROM auth_tokens WHERE expires_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
END//

DELIMITER ;
