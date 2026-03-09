-- SPIMS Database Schema
-- Smart Public Infrastructure Monitoring System
-- PostgreSQL Database Design

-- Create database (run this separately)
-- CREATE DATABASE spims_db;
-- \c spims_db;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for better data integrity
CREATE TYPE user_role AS ENUM ('public', 'enterprise', 'admin');
CREATE TYPE complaint_status AS ENUM ('reported', 'in_progress', 'resolved');
CREATE TYPE assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'cancelled');

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store hashed passwords
    role user_role NOT NULL DEFAULT 'public',
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =============================================
-- ENTERPRISES TABLE
-- =============================================
CREATE TABLE enterprises (
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

-- Create indexes
CREATE INDEX idx_enterprises_name ON enterprises(name);
CREATE INDEX idx_enterprises_department ON enterprises(department);

-- =============================================
-- COMPLAINTS TABLE
-- =============================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8), -- Supports precision up to ~1 meter
    longitude DECIMAL(11, 8), -- Supports precision up to ~1 meter
    status complaint_status NOT NULL DEFAULT 'reported',
    priority INTEGER DEFAULT 1, -- 1=Low, 2=Medium, 3=High, 4=Critical
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100), -- e.g., 'streetlight', 'pothole', 'water', etc.
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    is_public BOOLEAN DEFAULT TRUE, -- Whether complaint is visible to public
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_location ON complaints(latitude, longitude);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);

-- =============================================
-- ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    worker_name VARCHAR(255),
    worker_contact VARCHAR(255),
    status assignment_status NOT NULL DEFAULT 'assigned',
    assigned_by UUID REFERENCES users(id), -- Admin who assigned
    estimated_completion_date DATE,
    actual_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_assignments_complaint_id ON assignments(complaint_id);
CREATE INDEX idx_assignments_enterprise_id ON assignments(enterprise_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_assigned_by ON assignments(assigned_by);

-- =============================================
-- STATUS UPDATES TABLE
-- =============================================
CREATE TABLE status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status complaint_status NOT NULL,
    updated_by UUID NOT NULL REFERENCES users(id),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE, -- Whether update is visible to complaint author
    attachment_url VARCHAR(500), -- For progress photos, documents, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_status_updates_complaint_id ON status_updates(complaint_id);
CREATE INDEX idx_status_updates_updated_by ON status_updates(updated_by);
CREATE INDEX idx_status_updates_created_at ON status_updates(created_at);

-- =============================================
-- ADDITIONAL TABLES FOR ENHANCED FUNCTIONALITY
-- =============================================

-- Categories table for better organization
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Icon name for UI
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table for user notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Comments table for additional communication
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for comments
CREATE INDEX idx_comments_complaint_id ON comments(complaint_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- =============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enterprises_updated_at BEFORE UPDATE ON enterprises 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_status_updates_updated_at BEFORE UPDATE ON status_updates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for complaint details with user and assignment info
CREATE VIEW complaint_details AS
SELECT 
    c.id,
    c.title,
    c.description,
    c.image_url,
    c.location,
    c.latitude,
    c.longitude,
    c.status,
    c.priority,
    c.category,
    c.created_at,
    c.updated_at,
    c.resolved_at,
    u.name as user_name,
    u.email as user_email,
    e.name as enterprise_name,
    e.department as enterprise_department,
    a.worker_name,
    a.status as assignment_status
FROM complaints c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN assignments a ON c.id = a.complaint_id
LEFT JOIN enterprises e ON a.enterprise_id = e.id;

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(c.id) as total_complaints,
    COUNT(CASE WHEN c.status = 'reported' THEN 1 END) as pending_complaints,
    COUNT(CASE WHEN c.status = 'in_progress' THEN 1 END) as in_progress_complaints,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_complaints
FROM users u
LEFT JOIN complaints c ON u.id = c.user_id
GROUP BY u.id, u.name, u.email;

-- View for enterprise workload
CREATE VIEW enterprise_workload AS
SELECT 
    e.id,
    e.name,
    e.department,
    COUNT(a.id) as total_assignments,
    COUNT(CASE WHEN a.status = 'assigned' THEN 1 END) as pending_assignments,
    COUNT(CASE WHEN a.status = 'in_progress' THEN 1 END) as in_progress_assignments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_assignments
FROM enterprises e
LEFT JOIN assignments a ON e.id = a.enterprise_id
GROUP BY e.id, e.name, e.department;

-- =============================================
-- SAMPLE FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to automatically create status update when complaint status changes
CREATE OR REPLACE FUNCTION create_status_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create status update if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_updates (complaint_id, status, updated_by, comment)
        VALUES (NEW.id, NEW.status, NEW.user_id, 'Status automatically updated');
        
        -- Set resolved_at timestamp when status becomes resolved
        IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
            NEW.resolved_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to complaints table
CREATE TRIGGER complaint_status_change BEFORE UPDATE ON complaints 
    FOR EACH ROW EXECUTE FUNCTION create_status_update();

-- =============================================
-- CONSTRAINTS AND VALIDATION
-- =============================================

-- Ensure latitude is within valid range
ALTER TABLE complaints ADD CONSTRAINT check_latitude 
    CHECK (latitude >= -90 AND latitude <= 90);

-- Ensure longitude is within valid range
ALTER TABLE complaints ADD CONSTRAINT check_longitude 
    CHECK (longitude >= -180 AND longitude <= 180);

-- Ensure priority is within valid range
ALTER TABLE complaints ADD CONSTRAINT check_priority 
    CHECK (priority >= 1 AND priority <= 4);

-- Ensure email format (basic check)
ALTER TABLE users ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- =============================================
-- SECURITY - ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own data
CREATE POLICY user_own_data ON users
    FOR ALL TO authenticated_user
    USING (id = current_user_id());

-- Policy for users to see their own complaints
CREATE POLICY user_own_complaints ON complaints
    FOR ALL TO authenticated_user
    USING (user_id = current_user_id() OR is_public = TRUE);

-- Note: You'll need to implement current_user_id() function based on your auth system

-- =============================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================

-- Composite indexes for common query patterns
CREATE INDEX idx_complaints_user_status ON complaints(user_id, status);
CREATE INDEX idx_complaints_location_status ON complaints(latitude, longitude, status);
CREATE INDEX idx_assignments_enterprise_status ON assignments(enterprise_id, status);

-- Partial indexes for active records only
CREATE INDEX idx_active_users ON users(id) WHERE is_active = TRUE;
CREATE INDEX idx_active_enterprises ON enterprises(id) WHERE is_active = TRUE;
CREATE INDEX idx_unresolved_complaints ON complaints(id) WHERE status != 'resolved';

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE users IS 'Stores user account information for all user types';
COMMENT ON TABLE enterprises IS 'Government departments and organizations that handle complaints';
COMMENT ON TABLE complaints IS 'Infrastructure issues reported by users';
COMMENT ON TABLE assignments IS 'Assignment of complaints to enterprises/workers';
COMMENT ON TABLE status_updates IS 'Timeline of status changes for complaints';
COMMENT ON TABLE categories IS 'Predefined categories for organizing complaints';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE comments IS 'Additional comments on complaints';

COMMENT ON COLUMN users.role IS 'User role: public (citizen), enterprise (government worker), admin (system admin)';
COMMENT ON COLUMN complaints.priority IS 'Priority level: 1=Low, 2=Medium, 3=High, 4=Critical';
COMMENT ON COLUMN complaints.is_public IS 'Whether complaint is visible to other users';
COMMENT ON COLUMN status_updates.is_public IS 'Whether status update is visible to complaint author';