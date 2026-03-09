-- SPIMS Database Setup for pgAdmin 4
-- Run these commands in pgAdmin 4 Query Tool

-- Step 1: Create database user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'spims_user') THEN
        CREATE USER spims_user WITH PASSWORD 'keerthi';
    END IF;
END
$$;

-- Step 2: Create database (if not exists)
SELECT 'CREATE DATABASE spims_db OWNER spims_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spims_db')\gexec

-- Step 3: Grant privileges
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;
GRANT CREATE ON SCHEMA public TO spims_user;

-- Step 4: Connect to spims_db database
-- (You'll need to manually connect to spims_db database after creating it)

\echo 'Database and user setup complete!'
\echo 'Now connect to spims_db database and run the schema setup.'