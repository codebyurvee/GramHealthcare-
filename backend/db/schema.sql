CREATE DATABASE IF NOT EXISTS gramhealth_db;
USE gramhealth_db;

-- 1. Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'health_worker', 'facility_staff') NOT NULL,
    preferred_language ENUM('en', 'hi', 'pa') DEFAULT 'en',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Facilities Table 
CREATE TABLE facilities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(150) NOT NULL,
    type ENUM('PHC', 'CHC', 'District Hospital', 'Medical College') NOT NULL,
    district VARCHAR(100),
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    contact_number VARCHAR(15),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude)
);

-- 3. Patients Table (Synthetic data only)
CREATE TABLE patients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(15),
    preferred_language ENUM('en', 'hi', 'pa') DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Referrals Table (Core Workflow + Offline Sync)
CREATE TABLE referrals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    offline_id VARCHAR(50) UNIQUE, 
    patient_id CHAR(36) NOT NULL,
    health_worker_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    symptoms TEXT NOT NULL,
    status ENUM('REQUESTED', 'REFERRED', 'VISIT_CONFIRMED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED') DEFAULT 'REQUESTED',
    sync_status ENUM('synced', 'pending') DEFAULT 'synced',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (health_worker_id) REFERENCES users(id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- 5. Follow-Ups Table
CREATE TABLE follow_ups (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    referral_id CHAR(36) NOT NULL,
    notes TEXT,
    scheduled_date DATE NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'MISSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE
);
