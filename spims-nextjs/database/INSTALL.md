# SPIMS Database Installation Guide

## 🚀 Quick Start

### Prerequisites
- PostgreSQL 12+ installed and running
- Node.js 16+ (for testing utilities)
- Basic knowledge of PostgreSQL commands

### Step 1: Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Step 2: Create Database and User
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Or on Windows/macOS
psql -U postgres
```

```sql
-- Create database
CREATE DATABASE spims_db;

-- Create user
CREATE USER spims_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;

-- Exit
\q
```

### Step 3: Setup Database Schema
```bash
# Navigate to database directory
cd database

# Option A: Complete setup (recommended)
psql -U spims_user -d spims_db -f setup.sql

# Option B: Step by step
psql -U spims_user -d spims_db -f migrations/001_create_initial_schema.sql
psql -U spims_user -d spims_db -f migrations/002_add_additional_tables.sql
psql -U spims_user -d spims_db -f migrations/003_add_triggers_and_functions.sql
```

### Step 4: Load Sample Data (Optional)
```bash
# Load seed data for development/testing
psql -U spims_user -d spims_db -f seeds/seed_data.sql
```

### Step 5: Test Connection
```bash
# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Then test the connection
npm test
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the database directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your actual values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spims_db
DB_USER=spims_user
DB_PASSWORD=your_secure_password
```

### Database Configuration
The database is configured with:
- **UUID primary keys** for better scalability
- **Automatic timestamps** with timezone support
- **Foreign key constraints** for data integrity
- **Indexes** for optimal performance
- **Triggers** for automatic status updates

## 📋 Verification Checklist

After installation, verify everything is working:

- [ ] PostgreSQL is running
- [ ] Database `spims_db` exists
- [ ] User `spims_user` has proper permissions
- [ ] All 8 tables are created
- [ ] Sample data is loaded (if using seed data)
- [ ] Connection test passes
- [ ] Views are accessible
- [ ] Triggers are working

### Quick Verification Commands
```sql
-- Connect to database
psql -U spims_user -d spims_db

-- Check tables
\dt

-- Check table counts
SELECT 
  'users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'complaints', COUNT(*) FROM complaints
UNION ALL
SELECT 'enterprises', COUNT(*) FROM enterprises;

-- Test a view
SELECT * FROM complaint_details LIMIT 5;

-- Exit
\q
```

## 🛠️ Useful Commands

### Database Management
```bash
# Backup database
pg_dump -U spims_user -d spims_db > spims_backup.sql

# Restore database
psql -U spims_user -d spims_db < spims_backup.sql

# Connect to database
psql -U spims_user -d spims_db

# List databases
psql -U spims_user -l

# Check database size
psql -U spims_user -d spims_db -c "SELECT pg_size_pretty(pg_database_size('spims_db'));"
```

### Maintenance
```bash
# Update table statistics
psql -U spims_user -d spims_db -c "ANALYZE;"

# Vacuum database
psql -U spims_user -d spims_db -c "VACUUM;"

# Reindex database
psql -U spims_user -d spims_db -c "REINDEX DATABASE spims_db;"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: connection refused
```
**Solution**: Check if PostgreSQL is running
```bash
# Ubuntu/Debian
sudo systemctl status postgresql

# macOS
brew services list | grep postgresql

# Start if not running
sudo systemctl start postgresql  # Ubuntu/Debian
brew services start postgresql   # macOS
```

#### 2. Authentication Failed
```
Error: password authentication failed
```
**Solutions**:
- Check username and password in `.env`
- Verify user exists: `psql -U postgres -c "\du"`
- Reset password: `ALTER USER spims_user PASSWORD 'new_password';`

#### 3. Database Does Not Exist
```
Error: database "spims_db" does not exist
```
**Solution**: Create the database
```sql
CREATE DATABASE spims_db;
```

#### 4. Permission Denied
```
Error: permission denied for table users
```
**Solution**: Grant proper permissions
```sql
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spims_user;
```

#### 5. Tables Don't Exist
```
Error: relation "users" does not exist
```
**Solution**: Run the schema setup
```bash
psql -U spims_user -d spims_db -f setup.sql
```

### Getting Help
- Check PostgreSQL logs: `/var/log/postgresql/`
- Verify configuration: `SHOW config_file;`
- Test with simple query: `SELECT version();`
- Run connection test: `npm test`

## 🔐 Security Notes

### Production Setup
For production environments:

1. **Use strong passwords**
2. **Enable SSL connections**
3. **Configure firewall rules**
4. **Regular backups**
5. **Monitor access logs**
6. **Keep PostgreSQL updated**

### SSL Configuration
```sql
-- Enable SSL (in postgresql.conf)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U spims_user -d spims_db > /backups/spims_$DATE.sql
find /backups -name "spims_*.sql" -mtime +7 -delete
```

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review PostgreSQL logs
3. Test with the connection script
4. Check the main project documentation
5. Contact the development team

---

**SPIMS Database** - Ready for production use! 🚀