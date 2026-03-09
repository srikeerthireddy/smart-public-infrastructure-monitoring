-- Enterprise Schema Updates for SPIMS
-- Run this in pgAdmin Query Tool on spims_db

-- Add enterprise approval status to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS enterprise_id UUID REFERENCES enterprises(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create enterprise_workers table for worker management
CREATE TABLE IF NOT EXISTS enterprise_workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create complaint_assignments table
CREATE TABLE IF NOT EXISTS complaint_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES enterprise_workers(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    priority_level INTEGER DEFAULT 1,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    UNIQUE(complaint_id) -- One assignment per complaint
);

-- Create status_updates table for tracking complaint progress
CREATE TABLE IF NOT EXISTS status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    updated_by UUID NOT NULL REFERENCES users(id),
    update_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_enterprise_id ON users(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
CREATE INDEX IF NOT EXISTS idx_enterprise_workers_enterprise_id ON enterprise_workers(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_complaint_assignments_complaint_id ON complaint_assignments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_assignments_enterprise_id ON complaint_assignments(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_status_updates_complaint_id ON status_updates(complaint_id);

-- Insert sample workers for existing enterprises
INSERT INTO enterprise_workers (enterprise_id, name, email, phone, specialization) 
SELECT 
    e.id,
    'John Smith',
    'john.smith@' || LOWER(REPLACE(e.name, ' ', '')) || '.gov',
    '+1-555-' || LPAD((RANDOM() * 9999)::INT::TEXT, 4, '0'),
    CASE 
        WHEN e.department = 'Infrastructure' THEN 'Road Maintenance'
        WHEN e.department = 'Utilities' THEN 'Water Systems'
        ELSE 'General Maintenance'
    END
FROM enterprises e
WHERE NOT EXISTS (
    SELECT 1 FROM enterprise_workers ew WHERE ew.enterprise_id = e.id
);

-- Insert more sample workers
INSERT INTO enterprise_workers (enterprise_id, name, email, phone, specialization)
SELECT 
    e.id,
    'Sarah Johnson',
    'sarah.johnson@' || LOWER(REPLACE(e.name, ' ', '')) || '.gov',
    '+1-555-' || LPAD((RANDOM() * 9999)::INT::TEXT, 4, '0'),
    CASE 
        WHEN e.department = 'Infrastructure' THEN 'Street Lighting'
        WHEN e.department = 'Utilities' THEN 'Electrical Systems'
        ELSE 'Emergency Response'
    END
FROM enterprises e;

-- Create a view for enterprise dashboard statistics
CREATE OR REPLACE VIEW enterprise_dashboard_stats AS
SELECT 
    e.id as enterprise_id,
    e.name as enterprise_name,
    COUNT(DISTINCT ca.complaint_id) as total_assigned_complaints,
    COUNT(DISTINCT CASE WHEN c.status = 'reported' THEN ca.complaint_id END) as pending_complaints,
    COUNT(DISTINCT CASE WHEN c.status = 'in_progress' THEN ca.complaint_id END) as in_progress_complaints,
    COUNT(DISTINCT CASE WHEN c.status = 'resolved' THEN ca.complaint_id END) as resolved_complaints,
    COUNT(DISTINCT ew.id) as total_workers,
    COUNT(DISTINCT CASE WHEN ew.is_active = true THEN ew.id END) as active_workers
FROM enterprises e
LEFT JOIN complaint_assignments ca ON e.id = ca.enterprise_id
LEFT JOIN complaints c ON ca.complaint_id = c.id
LEFT JOIN enterprise_workers ew ON e.id = ew.enterprise_id
GROUP BY e.id, e.name;

-- Success message
SELECT 'Enterprise schema updated successfully!' as message;