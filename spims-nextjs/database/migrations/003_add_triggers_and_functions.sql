-- Migration: 003_add_triggers_and_functions.sql
-- Description: Add triggers, functions, and views
-- Date: 2026-03-09
-- Author: SPIMS Development Team

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
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

-- Function to automatically create status update when complaint status changes
CREATE OR REPLACE FUNCTION create_status_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_updates (complaint_id, status, updated_by, comment)
        VALUES (NEW.id, NEW.status, NEW.user_id, 'Status automatically updated');
        
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

-- Create useful views
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