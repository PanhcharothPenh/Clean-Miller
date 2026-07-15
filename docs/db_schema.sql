-- ============================================================================
-- SQL SCHEMA FOR CLEAN24 LAUNDRY MANAGEMENT SYSTEM (PRODUCTION)
-- Target Database: MySQL 8.x
-- Strict Multi-Branch Separation Architecture
-- ============================================================================

CREATE DATABASE IF NOT EXISTS clean24_laundry_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE clean24_laundry_db;

-- ----------------------------------------------------------------------------
-- 1. Table: branches
-- ----------------------------------------------------------------------------
CREATE TABLE branches (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_code VARCHAR(30) NOT NULL UNIQUE,
    branch_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    manager_id VARCHAR(50) DEFAULT NULL,
    opening_time VARCHAR(20) DEFAULT '06:00 AM',
    closing_time VARCHAR(20) DEFAULT '10:00 PM',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_branch_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Owner', 'Admin', 'Manager', 'Staff') NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: user_branch_access
-- Links users with branches they are permitted to manage
-- ----------------------------------------------------------------------------
CREATE TABLE user_branch_access (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    branch_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_branch (user_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: staff
-- ----------------------------------------------------------------------------
CREATE TABLE staff (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    position ENUM('Manager', 'Cashier', 'Helper', 'Technician') NOT NULL,
    shift ENUM('Morning', 'Afternoon', 'Night', 'Full Time') NOT NULL,
    start_date DATE NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Active', 'Resigned', 'Suspended') DEFAULT 'Active',
    photo_url VARCHAR(255) DEFAULT NULL,
    id_card_number VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_staff_branch (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: attendance
-- ----------------------------------------------------------------------------
CREATE TABLE attendance (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    check_in VARCHAR(20) DEFAULT NULL,
    check_out VARCHAR(20) DEFAULT NULL,
    shift_type VARCHAR(50) NOT NULL,
    work_hours DECIMAL(5, 2) DEFAULT 0.00,
    overtime_hours DECIMAL(5, 2) DEFAULT 0.00,
    status ENUM('Present', 'Absent', 'Late', 'Day Off') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE KEY uq_staff_date (staff_id, attendance_date),
    INDEX idx_att_date (branch_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table: salaries (Payroll Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE salaries (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    salary_period VARCHAR(30) NOT NULL, -- Format: "YYYY-MM" or custom
    base_salary DECIMAL(10, 2) NOT NULL,
    overtime DECIMAL(10, 2) DEFAULT 0.00,
    bonus DECIMAL(10, 2) DEFAULT 0.00,
    deduction DECIMAL(10, 2) DEFAULT 0.00,
    advance_payment DECIMAL(10, 2) DEFAULT 0.00,
    net_salary DECIMAL(10, 2) GENERATED ALWAYS AS (base_salary + overtime + bonus - deduction - advance_payment) STORED,
    payment_date DATE DEFAULT NULL,
    payment_method ENUM('Cash', 'ABA', 'Bank Transfer', 'QR Payment') DEFAULT 'ABA',
    paid_by VARCHAR(100) DEFAULT NULL,
    note TEXT DEFAULT NULL,
    status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    INDEX idx_salary_period (branch_id, salary_period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table: income (Daily Service Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE income (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    income_date DATE NOT NULL,
    service_type ENUM('Washing', 'Drying', 'Washing + Drying', 'Other') NOT NULL,
    machine_number VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS ((quantity * unit_price) - discount) STORED,
    payment_method ENUM('Cash', 'ABA', 'Bank Transfer', 'QR Payment') NOT NULL,
    staff_in_charge VARCHAR(100) NOT NULL,
    customer_note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_inc_date (branch_id, income_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Table: expenses
-- ----------------------------------------------------------------------------
CREATE TABLE expenses (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'ABA', 'Bank Transfer', 'QR Payment') NOT NULL,
    paid_to VARCHAR(150) NOT NULL,
    receipt_url VARCHAR(255) DEFAULT NULL,
    created_by VARCHAR(100) NOT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_exp_date (branch_id, expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Table: inventory_items
-- ----------------------------------------------------------------------------
CREATE TABLE inventory_items (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    minimum_stock_alert DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    supplier VARCHAR(150) DEFAULT NULL,
    purchase_date DATE DEFAULT NULL,
    used_quantity DECIMAL(10, 2) DEFAULT 0.00,
    remaining_stock DECIMAL(10, 2) GENERATED ALWAYS AS (current_stock - used_quantity) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_inv_branch (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Table: inventory_transactions
-- ----------------------------------------------------------------------------
CREATE TABLE inventory_transactions (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    transaction_type ENUM('In', 'Out') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    note VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Table: machines
-- ----------------------------------------------------------------------------
CREATE TABLE machines (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    machine_code_sku VARCHAR(50) NOT NULL UNIQUE,
    machine_type ENUM('Washer', 'Dryer') NOT NULL,
    machine_number VARCHAR(30) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    capacity_kg DECIMAL(5, 2) NOT NULL,
    status ENUM('Available', 'In Use', 'Maintenance', 'Broken') DEFAULT 'Available',
    purchase_date DATE DEFAULT NULL,
    maintenance_note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_mach_status (branch_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. Table: machine_maintenance
-- ----------------------------------------------------------------------------
CREATE TABLE machine_maintenance (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    service_date DATE NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    repaired_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. Table: payments (Revenue Tracking Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    reference_id VARCHAR(50) NOT NULL, -- links to income_id or custom service
    payment_method ENUM('Cash', 'ABA', 'Bank Transfer', 'QR Payment') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reconciled ENUM('Yes', 'No') DEFAULT 'No',
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_pay_reconcile (branch_id, reconciled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. Table: settings (Shop parameters)
-- ----------------------------------------------------------------------------
CREATE TABLE settings (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    shop_name VARCHAR(100) DEFAULT 'Clean24 Laundry',
    opening_hours VARCHAR(100) DEFAULT '6:00 AM – 10:00 PM',
    main_currency VARCHAR(10) DEFAULT 'USD',
    exchange_rate_khr INT DEFAULT 4100,
    default_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. Table: audit_logs (Enterprise Security logs)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_username VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    branch_id VARCHAR(50) DEFAULT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_audit_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED INITIAL CONFIGURATION & REFERENCE DATA
-- ============================================================================

INSERT INTO settings (id, shop_name, opening_hours, main_currency, exchange_rate_khr, default_language)
VALUES ('cfg_001', 'Clean24 Laundry', '6:00 AM – 10:00 PM', 'USD', 4100, 'en');

-- Add trigger to prevent multi-branch bypass inside DB checks
DELIMITER //
CREATE TRIGGER before_staff_insert
BEFORE INSERT ON staff
FOR EACH ROW
BEGIN
    IF NEW.branch_id IS NULL OR NEW.branch_id = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CRITICAL ERROR: branch_id is required to uphold strict branch separation policies.';
    END IF;
END;
//
DELIMITER ;
