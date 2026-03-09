-- SPIMS Database Seed Data
-- Smart Public Infrastructure Monitoring System
-- Sample data for development and testing

-- =============================================
-- SEED CATEGORIES
-- =============================================
INSERT INTO categories (id, name, description, icon, color) VALUES
(uuid_generate_v4(), 'streetlight', 'Street lighting issues', 'lightbulb', '#FFA500'),
(uuid_generate_v4(), 'pothole', 'Road surface problems', 'road', '#8B4513'),
(uuid_generate_v4(), 'water', 'Water system issues', 'droplet', '#0066CC'),
(uuid_generate_v4(), 'traffic', 'Traffic signal problems', 'traffic-light', '#FF0000'),
(uuid_generate_v4(), 'sidewalk', 'Sidewalk and walkway issues', 'footprints', '#808080'),
(uuid_generate_v4(), 'garbage', 'Waste management issues', 'trash', '#228B22'),
(uuid_generate_v4(), 'park', 'Parks and recreation issues', 'tree', '#32CD32'),
(uuid_generate_v4(), 'other', 'Other infrastructure issues', 'alert-triangle', '#6B7280');

-- =============================================
-- SEED USERS
-- =============================================
-- Note: Passwords should be hashed in real implementation
-- These are example bcrypt hashes for 'password123'
INSERT INTO users (id, name, email, password, role, phone, address, email_verified) VALUES
-- Public Users (Citizens)
(uuid_generate_v4(), 'John Doe', 'john.doe@email.com', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'public', '+1-555-0101', '123 Main St, Downtown', TRUE),
(uuid_generate_v4(), 'Sarah Johnson', 'sarah.johnson@email.com', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'public', '+1-555-0102', '456 Oak Ave, Midtown', TRUE),
(uuid_generate_v4(), 'Mike Rodriguez', 'mike.rodriguez@email.com', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'public', '+1-555-0103', '789 Pine St, Uptown', TRUE),
(uuid_generate_v4(), 'Eleanor Davis', 'eleanor.davis@email.com', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'public', '+1-555-0104', '321 Elm St, Riverside', TRUE),
(uuid_generate_v4(), 'David Wilson', 'david.wilson@email.com', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'public', '+1-555-0105', '654 Maple Dr, Hillside', TRUE),

-- Enterprise Users (Government Workers)
(uuid_generate_v4(), 'Tom Anderson', 'tom.anderson@city.gov', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'enterprise', '+1-555-0201', 'City Hall, 100 Government Plaza', TRUE),
(uuid_generate_v4(), 'Lisa Chen', 'lisa.chen@publicworks.gov', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'enterprise', '+1-555-0202', 'Public Works Dept, 200 Service Rd', TRUE),
(uuid_generate_v4(), 'Robert Taylor', 'robert.taylor@utilities.gov', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'enterprise', '+1-555-0203', 'Utilities Dept, 300 Power St', TRUE),

-- Admin Users
(uuid_generate_v4(), 'Admin User', 'admin@spims.gov', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'admin', '+1-555-0301', 'SPIMS Headquarters, 400 Tech Blvd', TRUE),
(uuid_generate_v4(), 'System Manager', 'manager@spims.gov', '$2b$10$rOjLnZZ8Z5Z8Z5Z8Z5Z8Zu', 'admin', '+1-555-0302', 'SPIMS Headquarters, 400 Tech Blvd', TRUE);

-- =============================================
-- SEED ENTERPRISES
-- =============================================
INSERT INTO enterprises (id, name, department, contact_email, contact_phone, address, description) VALUES
(uuid_generate_v4(), 'City Public Works', 'Infrastructure Maintenance', 'contact@publicworks.gov', '+1-555-1001', '200 Service Road, Downtown', 'Responsible for road maintenance, street lighting, and general infrastructure'),
(uuid_generate_v4(), 'Municipal Utilities', 'Water & Utilities', 'info@utilities.gov', '+1-555-1002', '300 Power Street, Industrial District', 'Manages water, sewer, and electrical utilities'),
(uuid_generate_v4(), 'Parks & Recreation', 'Parks Department', 'parks@city.gov', '+1-555-1003', '150 Park Avenue, Green District', 'Maintains public parks, playgrounds, and recreational facilities'),
(uuid_generate_v4(), 'Traffic Management', 'Transportation', 'traffic@city.gov', '+1-555-1004', '500 Transit Way, Central', 'Handles traffic signals, road signs, and transportation infrastructure'),
(uuid_generate_v4(), 'Waste Management', 'Sanitation', 'waste@city.gov', '+1-555-1005', '600 Disposal Lane, Industrial', 'Manages garbage collection, recycling, and waste disposal services');

-- =============================================
-- SEED COMPLAINTS
-- =============================================
-- Get user IDs for reference (in real implementation, you'd use actual UUIDs)
WITH user_ids AS (
    SELECT id, email FROM users WHERE role = 'public' LIMIT 5
)
INSERT INTO complaints (id, title, description, image_url, location, latitude, longitude, status, priority, user_id, category, created_at) 
SELECT 
    uuid_generate_v4(),
    complaint_data.title,
    complaint_data.description,
    complaint_data.image_url,
    complaint_data.location,
    complaint_data.latitude,
    complaint_data.longitude,
    complaint_data.status,
    complaint_data.priority,
    user_ids.id,
    complaint_data.category,
    complaint_data.created_at
FROM user_ids,
(VALUES 
    ('Street Light Not Working', 'The street light on Main Road has been out for 3 days, making it dangerous for pedestrians at night.', '/images/streetlight_broken.jpg', 'Main Road, Downtown', 40.7128, -74.0060, 'in_progress', 3, 'streetlight', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('Large Pothole on Highway', 'Dangerous pothole on Highway 101 causing damage to vehicles. Approximately 2 feet wide and 6 inches deep.', '/images/pothole_highway.jpg', 'Highway 101, Mile Marker 15', 40.7589, -73.9851, 'reported', 4, 'pothole', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('Broken Water Pipe', 'Water pipe burst near Central Park entrance, flooding the sidewalk and creating a safety hazard.', '/images/water_pipe_burst.jpg', 'Central Park Entrance, 5th Avenue', 40.7829, -73.9654, 'resolved', 4, 'water', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    ('Traffic Signal Malfunction', 'Traffic light at Broadway & 42nd Street is stuck on red in all directions, causing traffic backup.', '/images/traffic_signal.jpg', 'Broadway & 42nd Street Intersection', 40.7580, -73.9855, 'in_progress', 4, 'traffic', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('Damaged Sidewalk', 'Cracked and uneven sidewalk on Oak Street creating trip hazard for pedestrians, especially elderly.', '/images/sidewalk_damage.jpg', 'Oak Street, Residential Area', 40.7505, -73.9934, 'reported', 2, 'sidewalk', CURRENT_TIMESTAMP - INTERVAL '1 week'),
    ('Overflowing Garbage Bin', 'Public garbage bin at Pine Street Park has been overflowing for days, attracting pests.', '/images/garbage_overflow.jpg', 'Pine Street Park, Recreation Area', 40.7614, -73.9776, 'in_progress', 2, 'garbage', CURRENT_TIMESTAMP - INTERVAL '4 days'),
    ('Broken Park Bench', 'Wooden bench in Riverside Park is broken and has sharp edges, posing safety risk to children.', '/images/broken_bench.jpg', 'Riverside Park, Near Playground', 40.7489, -73.9680, 'reported', 2, 'park', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('Flickering Street Light', 'Street light on Elm Street flickers constantly, providing inadequate lighting for the area.', NULL, 'Elm Street, Near School Zone', 40.7445, -73.9902, 'reported', 2, 'streetlight', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    ('Clogged Storm Drain', 'Storm drain on Maple Drive is completely blocked, causing water to pool during rain.', '/images/clogged_drain.jpg', 'Maple Drive, Residential', 40.7356, -73.9889, 'reported', 3, 'water', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('Graffiti on Public Building', 'Extensive graffiti on the side of the community center building needs cleaning.', '/images/graffiti_building.jpg', 'Community Center, 123 Community Blvd', 40.7667, -73.9734, 'reported', 1, 'other', CURRENT_TIMESTAMP - INTERVAL '1 week')
) AS complaint_data(title, description, image_url, location, latitude, longitude, status, priority, category, created_at)
WHERE user_ids.email = 'john.doe@email.com'

UNION ALL

SELECT 
    uuid_generate_v4(),
    complaint_data.title,
    complaint_data.description,
    complaint_data.image_url,
    complaint_data.location,
    complaint_data.latitude,
    complaint_data.longitude,
    complaint_data.status,
    complaint_data.priority,
    user_ids.id,
    complaint_data.category,
    complaint_data.created_at
FROM user_ids,
(VALUES 
    ('Loose Manhole Cover', 'Manhole cover on Second Street is loose and makes loud noise when vehicles pass over.', NULL, 'Second Street, Business District', 40.7523, -73.9876, 'reported', 3, 'other', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('Dead Tree in Park', 'Large dead tree in Washington Park poses falling risk, especially during storms.', '/images/dead_tree.jpg', 'Washington Park, West Side', 40.7298, -73.9765, 'in_progress', 3, 'park', CURRENT_TIMESTAMP - INTERVAL '1 week')
) AS complaint_data(title, description, image_url, location, latitude, longitude, status, priority, category, created_at)
WHERE user_ids.email = 'sarah.johnson@email.com';

-- =============================================
-- SEED ASSIGNMENTS
-- =============================================
-- Assign some complaints to enterprises
WITH complaint_enterprise_mapping AS (
    SELECT 
        c.id as complaint_id,
        e.id as enterprise_id,
        CASE 
            WHEN c.category = 'streetlight' THEN 'Public Works'
            WHEN c.category = 'pothole' THEN 'Public Works'
            WHEN c.category = 'water' THEN 'Municipal Utilities'
            WHEN c.category = 'traffic' THEN 'Traffic Management'
            WHEN c.category = 'sidewalk' THEN 'Public Works'
            WHEN c.category = 'garbage' THEN 'Waste Management'
            WHEN c.category = 'park' THEN 'Parks & Recreation'
            ELSE 'Public Works'
        END as target_dept
    FROM complaints c, enterprises e
    WHERE e.name LIKE '%' || 
        CASE 
            WHEN c.category = 'streetlight' THEN 'Public Works'
            WHEN c.category = 'pothole' THEN 'Public Works'
            WHEN c.category = 'water' THEN 'Utilities'
            WHEN c.category = 'traffic' THEN 'Traffic'
            WHEN c.category = 'sidewalk' THEN 'Public Works'
            WHEN c.category = 'garbage' THEN 'Waste'
            WHEN c.category = 'park' THEN 'Parks'
            ELSE 'Public Works'
        END || '%'
    AND c.status IN ('in_progress', 'resolved')
)
INSERT INTO assignments (id, complaint_id, enterprise_id, worker_name, worker_contact, status, estimated_completion_date, actual_completion_date, notes)
SELECT 
    uuid_generate_v4(),
    cem.complaint_id,
    cem.enterprise_id,
    CASE 
        WHEN cem.target_dept = 'Public Works' THEN 'Mike Johnson'
        WHEN cem.target_dept = 'Municipal Utilities' THEN 'Sarah Williams'
        WHEN cem.target_dept = 'Traffic Management' THEN 'David Brown'
        WHEN cem.target_dept = 'Waste Management' THEN 'Lisa Garcia'
        WHEN cem.target_dept = 'Parks & Recreation' THEN 'Tom Wilson'
        ELSE 'John Smith'
    END,
    CASE 
        WHEN cem.target_dept = 'Public Works' THEN 'mike.johnson@publicworks.gov'
        WHEN cem.target_dept = 'Municipal Utilities' THEN 'sarah.williams@utilities.gov'
        WHEN cem.target_dept = 'Traffic Management' THEN 'david.brown@traffic.gov'
        WHEN cem.target_dept = 'Waste Management' THEN 'lisa.garcia@waste.gov'
        WHEN cem.target_dept = 'Parks & Recreation' THEN 'tom.wilson@parks.gov'
        ELSE 'john.smith@city.gov'
    END,
    CASE 
        WHEN c.status = 'resolved' THEN 'completed'::assignment_status
        WHEN c.status = 'in_progress' THEN 'in_progress'::assignment_status
        ELSE 'assigned'::assignment_status
    END,
    CURRENT_DATE + INTERVAL '3 days',
    CASE WHEN c.status = 'resolved' THEN CURRENT_DATE - INTERVAL '1 day' ELSE NULL END,
    'Assignment created automatically based on complaint category'
FROM complaint_enterprise_mapping cem
JOIN complaints c ON cem.complaint_id = c.id;

-- =============================================
-- SEED STATUS UPDATES
-- =============================================
-- Create status updates for complaints with assignments
INSERT INTO status_updates (id, complaint_id, status, updated_by, comment, attachment_url)
SELECT 
    uuid_generate_v4(),
    c.id,
    'reported'::complaint_status,
    c.user_id,
    'Initial complaint submitted by citizen',
    c.image_url
FROM complaints c

UNION ALL

SELECT 
    uuid_generate_v4(),
    c.id,
    'in_progress'::complaint_status,
    u.id,
    'Complaint has been assigned to our team and work will begin shortly',
    NULL
FROM complaints c
JOIN assignments a ON c.id = a.complaint_id
JOIN users u ON u.role = 'enterprise'
WHERE c.status = 'in_progress'
LIMIT 1

UNION ALL

SELECT 
    uuid_generate_v4(),
    c.id,
    'resolved'::complaint_status,
    u.id,
    'Issue has been resolved. Thank you for reporting this problem.',
    '/images/resolution_photo.jpg'
FROM complaints c
JOIN assignments a ON c.id = a.complaint_id
JOIN users u ON u.role = 'enterprise'
WHERE c.status = 'resolved'
LIMIT 1;

-- =============================================
-- SEED NOTIFICATIONS
-- =============================================
-- Create notifications for users about their complaints
INSERT INTO notifications (id, user_id, complaint_id, title, message, type)
SELECT 
    uuid_generate_v4(),
    c.user_id,
    c.id,
    'Complaint Status Update',
    'Your complaint "' || c.title || '" has been updated to: ' || c.status,
    CASE 
        WHEN c.status = 'resolved' THEN 'success'
        WHEN c.status = 'in_progress' THEN 'info'
        ELSE 'info'
    END
FROM complaints c
WHERE c.status IN ('in_progress', 'resolved');

-- =============================================
-- SEED COMMENTS
-- =============================================
-- Add some comments to complaints
INSERT INTO comments (id, complaint_id, user_id, comment)
SELECT 
    uuid_generate_v4(),
    c.id,
    c.user_id,
    'This issue is really affecting our daily commute. Hope it gets fixed soon!'
FROM complaints c
WHERE c.category = 'pothole'
LIMIT 1

UNION ALL

SELECT 
    uuid_generate_v4(),
    c.id,
    u.id,
    'We have received your complaint and are working on a solution. Thank you for your patience.'
FROM complaints c
JOIN users u ON u.role = 'enterprise'
WHERE c.status = 'in_progress'
LIMIT 2;

-- =============================================
-- UPDATE STATISTICS
-- =============================================
-- Update table statistics for better query performance
ANALYZE users;
ANALYZE enterprises;
ANALYZE complaints;
ANALYZE assignments;
ANALYZE status_updates;
ANALYZE categories;
ANALYZE notifications;
ANALYZE comments;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- These queries can be used to verify the seed data was inserted correctly

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'enterprises', COUNT(*) FROM enterprises
UNION ALL
SELECT 'complaints', COUNT(*) FROM complaints
UNION ALL
SELECT 'assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'status_updates', COUNT(*) FROM status_updates
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'comments', COUNT(*) FROM comments;

-- Show complaint distribution by status
SELECT status, COUNT(*) as count 
FROM complaints 
GROUP BY status 
ORDER BY count DESC;

-- Show complaint distribution by category
SELECT category, COUNT(*) as count 
FROM complaints 
GROUP BY category 
ORDER BY count DESC;

-- Show users with their complaint counts
SELECT 
    u.name,
    u.email,
    u.role,
    COUNT(c.id) as complaint_count
FROM users u
LEFT JOIN complaints c ON u.id = c.user_id
GROUP BY u.id, u.name, u.email, u.role
ORDER BY complaint_count DESC;