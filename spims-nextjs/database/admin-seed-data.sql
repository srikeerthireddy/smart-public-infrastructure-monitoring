-- Admin Seed Data for SPIMS
-- Run this in pgAdmin Query Tool on spims_db

-- Insert admin user with hashed password (Admin@123)
-- Password hash generated using bcrypt with 12 rounds
INSERT INTO users (
    id,
    name, 
    email, 
    password, 
    role, 
    phone, 
    address,
    is_active,
    email_verified,
    approval_status,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'System Administrator',
    'admin@gmail.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVjzZUhxC', -- Admin@123
    'admin',
    '+1-555-0000',
    'SPIMS Headquarters, Admin Building',
    true,
    true,
    'approved',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create admin analytics views for dashboard
CREATE OR REPLACE VIEW admin_system_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'public') as total_public_users,
    (SELECT COUNT(*) FROM users WHERE role = 'enterprise') as total_enterprise_users,
    (SELECT COUNT(*) FROM users WHERE role = 'enterprise' AND approval_status = 'pending') as pending_enterprises,
    (SELECT COUNT(*) FROM users WHERE role = 'enterprise' AND approval_status = 'approved') as approved_enterprises,
    (SELECT COUNT(*) FROM users WHERE role = 'enterprise' AND approval_status = 'rejected') as rejected_enterprises,
    (SELECT COUNT(*) FROM complaints) as total_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'reported') as pending_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'in_progress') as in_progress_complaints,
    (SELECT COUNT(*) FROM complaints WHERE status = 'resolved') as resolved_complaints,
    (SELECT COUNT(*) FROM enterprises) as total_enterprises,
    (SELECT COUNT(*) FROM enterprise_workers) as total_workers,
    (SELECT COUNT(*) FROM complaint_assignments) as total_assignments;

-- Create view for recent system activity
CREATE OR REPLACE VIEW admin_recent_activity AS
SELECT 
    'user_registration' as activity_type,
    u.name as entity_name,
    u.email as entity_email,
    u.role as entity_role,
    u.created_at as activity_time,
    'New user registered' as description
FROM users u
WHERE u.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT 
    'complaint_submitted' as activity_type,
    c.title as entity_name,
    c.location as entity_email,
    'complaint' as entity_role,
    c.created_at as activity_time,
    'New complaint submitted' as description
FROM complaints c
WHERE c.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT 
    'enterprise_registration' as activity_type,
    e.name as entity_name,
    e.contact_email as entity_email,
    'enterprise' as entity_role,
    e.created_at as activity_time,
    'New enterprise registered' as description
FROM enterprises e
WHERE e.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

ORDER BY activity_time DESC
LIMIT 50;

-- Create view for enterprise approval queue
CREATE OR REPLACE VIEW admin_approval_queue AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email as user_email,
    u.phone as user_phone,
    u.address as user_address,
    u.approval_status,
    u.created_at as registration_date,
    e.id as enterprise_id,
    e.name as enterprise_name,
    e.department,
    e.contact_email as enterprise_email,
    e.address as enterprise_address,
    e.description as enterprise_description
FROM users u
JOIN enterprises e ON u.enterprise_id = e.id
WHERE u.role = 'enterprise' AND u.approval_status = 'pending'
ORDER BY u.created_at ASC;

-- Success message
SELECT 'Admin seed data and views created successfully!' as message;