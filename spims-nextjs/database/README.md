# SPIMS Database Documentation

## Smart Public Infrastructure Monitoring System - PostgreSQL Database

This directory contains the complete database schema, migrations, and seed data for the SPIMS application.

## 📁 Directory Structure

```
database/
├── sql/
│   └── schema.sql          # Complete database schema
├── migrations/
│   ├── 001_create_initial_schema.sql
│   ├── 002_add_additional_tables.sql
│   └── 003_add_triggers_and_functions.sql
├── seeds/
│   └── seed_data.sql       # Sample data for development
├── setup.sql               # Complete setup script
└── README.md              # This documentation
```

## 🗄️ Database Schema Overview

### Core Tables

#### 1. **users**
Stores all user accounts (public citizens, enterprise workers, admins)
- **Primary Key**: `id` (UUID)
- **Unique Fields**: `email`
- **Roles**: `public`, `enterprise`, `admin`

#### 2. **enterprises**
Government departments and organizations that handle complaints
- **Primary Key**: `id` (UUID)
- **Examples**: Public Works, Municipal Utilities, Parks & Recreation

#### 3. **complaints**
Infrastructure issues reported by users
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `user_id` → `users.id`
- **Status**: `reported`, `in_progress`, `resolved`
- **Priority**: 1 (Low) to 4 (Critical)

#### 4. **assignments**
Assignment of complaints to enterprises/workers
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `complaint_id` → `complaints.id`, `enterprise_id` → `enterprises.id`

#### 5. **status_updates**
Timeline of status changes and updates for complaints
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `complaint_id` → `complaints.id`, `updated_by` → `users.id`

### Supporting Tables

#### 6. **categories**
Predefined categories for organizing complaints
- Examples: streetlight, pothole, water, traffic, sidewalk, garbage, park

#### 7. **notifications**
System notifications for users
- **Foreign Key**: `user_id` → `users.id`

#### 8. **comments**
Additional comments on complaints for communication
- **Foreign Keys**: `complaint_id` → `complaints.id`, `user_id` → `users.id`

## 🚀 Quick Setup

### Prerequisites
- PostgreSQL 12+ installed
- Database user with appropriate permissions

### Option 1: Complete Setup (Recommended)
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database and user
CREATE DATABASE spims_db;
CREATE USER spims_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;

# Connect to the new database
\c spims_db;

# Run the complete setup
\i setup.sql
```

### Option 2: Step-by-Step Setup
```bash
# Connect to your database
psql -U spims_user -d spims_db

# Run migrations in order
\i migrations/001_create_initial_schema.sql
\i migrations/002_add_additional_tables.sql
\i migrations/003_add_triggers_and_functions.sql

# Load sample data (optional)
\i seeds/seed_data.sql
```

### Option 3: Single Schema File
```bash
# Connect to your database
psql -U spims_user -d spims_db

# Run the complete schema
\i sql/schema.sql

# Load sample data (optional)
\i seeds/seed_data.sql
```

## 📊 Sample Data

The seed data includes:
- **8 Categories** (streetlight, pothole, water, traffic, etc.)
- **11 Users** (5 public, 3 enterprise, 3 admin)
- **5 Enterprises** (Public Works, Utilities, Parks, Traffic, Waste)
- **12 Complaints** with various statuses and priorities
- **Assignments** linking complaints to appropriate departments
- **Status Updates** showing complaint progression
- **Notifications** for user engagement
- **Comments** for additional communication

## 🔍 Key Features

### Data Integrity
- **UUID Primary Keys** for better scalability
- **Foreign Key Constraints** maintain referential integrity
- **Check Constraints** validate latitude/longitude ranges
- **Email Format Validation** using regex patterns

### Performance Optimization
- **Strategic Indexes** on frequently queried columns
- **Composite Indexes** for common query patterns
- **Partial Indexes** for active records only
- **Query Optimization** through proper indexing

### Automation
- **Automatic Timestamps** via triggers
- **Status Update Creation** when complaint status changes
- **Resolved Timestamp** automatically set when status becomes 'resolved'

### Security Features
- **Row Level Security (RLS)** policies
- **Password Hashing** support (implement in application)
- **Role-Based Access Control** through user roles

## 📈 Useful Queries

### Get Complaint Statistics
```sql
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM complaints 
GROUP BY status;
```

### Find Complaints by Location
```sql
SELECT * FROM complaints 
WHERE ST_DWithin(
    ST_Point(longitude, latitude)::geography,
    ST_Point(-74.0060, 40.7128)::geography,
    1000  -- 1000 meters radius
);
```

### Enterprise Workload Report
```sql
SELECT 
    e.name,
    e.department,
    COUNT(a.id) as total_assignments,
    COUNT(CASE WHEN a.status = 'in_progress' THEN 1 END) as active_assignments
FROM enterprises e
LEFT JOIN assignments a ON e.id = a.enterprise_id
GROUP BY e.id, e.name, e.department
ORDER BY active_assignments DESC;
```

### User Activity Report
```sql
SELECT 
    u.name,
    u.email,
    COUNT(c.id) as total_complaints,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_complaints,
    ROUND(
        COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(c.id), 0), 2
    ) as resolution_rate
FROM users u
LEFT JOIN complaints c ON u.id = c.user_id
WHERE u.role = 'public'
GROUP BY u.id, u.name, u.email
HAVING COUNT(c.id) > 0
ORDER BY total_complaints DESC;
```

## 🔧 Maintenance

### Regular Maintenance Tasks
```sql
-- Update table statistics
ANALYZE;

-- Reindex tables (run during low traffic)
REINDEX DATABASE spims_db;

-- Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0;

-- Monitor table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### Backup and Restore
```bash
# Backup
pg_dump -U spims_user -d spims_db > spims_backup.sql

# Restore
psql -U spims_user -d spims_db < spims_backup.sql
```

## 🔄 Migration Management

When making schema changes:

1. **Create a new migration file** in `migrations/` directory
2. **Follow naming convention**: `00X_description.sql`
3. **Test on development database** first
4. **Update this documentation** if needed
5. **Run migration on production** during maintenance window

## 📝 Notes

- All timestamps are stored with timezone information
- UUIDs are used for better distributed system compatibility
- Soft deletes can be implemented using `is_active` flags
- The schema supports multi-tenancy if needed in the future
- Geographic queries can be enhanced with PostGIS extension

## 🤝 Contributing

When modifying the database schema:
1. Always create a migration file
2. Update seed data if necessary
3. Test with existing data
4. Update documentation
5. Consider backward compatibility

---

**SPIMS Database** - Built for scalability, performance, and maintainability! 🏗️✨