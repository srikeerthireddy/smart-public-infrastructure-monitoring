-- SPIMS Database Manual Setup for pgAdmin 4
-- Run these commands step by step in pgAdmin Query Tool

-- =============================================
-- STEP 1: Create User and Database
-- Run this first while connected to 'postgres' database
-- =============================================

-- Create spims_user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'spims_user') THEN
        CREATE USER spims_user WITH PASSWORD 'keerthi';
        RAISE NOTICE 'User spims_user created successfully!';
    ELSE
        RAISE NOTICE 'User spims_user already exists.';
    END IF;
END
$$;

-- Create spims_db database (if not exists)
SELECT 'CREATE DATABASE spims_db OWNER spims_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spims_db')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;
GRANT CREATE ON SCHEMA public TO spims_user;

-- Show success message
SELECT 'Database setup completed! Now connect to spims_db database and run STEP 2.' as status;

-- =============================================
-- STEP 2: Create Tables and Schema
-- Connect to 'spims_db' database and run this
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('public', 'enterprise', 'admin');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Type user_role already exists.';
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status AS ENUM ('reported', 'in_progress', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Type complaint_status already exists.';
END $$;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'public',
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status complaint_status NOT NULL DEFAULT 'reported',
    priority INTEGER DEFAULT 1,
    category VARCHAR(100),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ENTERPRISES TABLE
CREATE TABLE IF NOT EXISTS enterprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    address TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- STATUS_UPDATES TABLE
CREATE TABLE IF NOT EXISTS status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL,
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    updated_by UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_status_updates_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    CONSTRAINT fk_status_updates_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    complaint_id UUID,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);
CREATE INDEX IF NOT EXISTS idx_status_updates_complaint_id ON status_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enterprises_updated_at ON enterprises;
CREATE TRIGGER update_enterprises_updated_at BEFORE UPDATE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample enterprises
INSERT INTO enterprises (name, department, contact_email, contact_phone, address) VALUES
('City Public Works', 'Infrastructure', 'works@city.gov', '+1-555-0101', '123 City Hall, Main St'),
('Water Department', 'Utilities', 'water@city.gov', '+1-555-0102', '456 Water Plant Rd'),
('Electrical Services', 'Utilities', 'electric@city.gov', '+1-555-0103', '789 Power Station Ave')
ON CONFLICT DO NOTHING;

-- Insert sample admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('System Admin', 'admin@spims.gov', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Show completion status
SELECT 
    'SPIMS Database setup completed successfully!' as message,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'complaints', 'enterprises', 'status_updates', 'notifications');

-- Show table summary
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as columns
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
AND t.table_name IN ('users', 'complaints', 'enterprises', 'status_updates', 'notifications')
ORDER BY t.table_name;