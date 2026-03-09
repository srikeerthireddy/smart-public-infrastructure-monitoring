-- SPIMS Database Setup Script
-- Smart Public Infrastructure Monitoring System
-- Complete database setup for PostgreSQL

-- =============================================
-- DATABASE CREATION
-- =============================================
-- Run this section separately as superuser
-- CREATE DATABASE spims_db;
-- CREATE USER spims_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;

-- Connect to the database
-- \c spims_db;

-- =============================================
-- EXECUTE MIGRATIONS IN ORDER
-- =============================================

-- Migration 1: Create initial schema
\i migrations/001_create_initial_schema.sql

-- Migration 2: Add additional tables
\i migrations/002_add_additional_tables.sql

-- Migration 3: Add triggers and functions
\i migrations/003_add_triggers_and_functions.sql

-- =============================================
-- LOAD SEED DATA (OPTIONAL - FOR DEVELOPMENT)
-- =============================================
-- Uncomment the following line to load sample data
-- \i seeds/seed_data.sql

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
-- Grant necessary permissions to application user
GRANT USAGE ON SCHEMA public TO spims_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spims_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spims_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO spims_user;

-- =============================================
-- VERIFICATION
-- =============================================
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- =============================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================
-- Additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_status ON complaints(user_id, status);
CREATE INDEX IF NOT EXISTS idx_complaints_location_status ON complaints(latitude, longitude, status);
CREATE INDEX IF NOT EXISTS idx_assignments_enterprise_status ON assignments(enterprise_id, status);
CREATE INDEX IF NOT EXISTS idx_active_users ON users(id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_unresolved_complaints ON complaints(id) WHERE status != 'resolved';

-- Update statistics
ANALYZE;

ECHO 'SPIMS Database setup completed successfully!';