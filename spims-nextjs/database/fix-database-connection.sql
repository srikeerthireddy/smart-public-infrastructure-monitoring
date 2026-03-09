-- Complete Database Fix for SPIMS
-- Run this in pgAdmin Query Tool

-- Step 1: Create spims_user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'spims_user') THEN
        CREATE USER spims_user WITH PASSWORD 'keerthi';
    END IF;
END
$$;

-- Step 2: Grant database creation privileges
ALTER USER spims_user CREATEDB;

-- Step 3: Ensure spims_db exists and set proper ownership
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spims_db') THEN
        CREATE DATABASE spims_db OWNER spims_user;
    ELSE
        ALTER DATABASE spims_db OWNER spims_user;
    END IF;
END
$$;

-- Step 4: Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user;

-- Step 5: Connect to spims_db and set schema permissions
-- (You need to run the following commands after connecting to spims_db)
-- Right-click on spims_db -> Query Tool and run:

/*
-- Grant schema permissions
GRANT ALL ON SCHEMA public TO spims_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spims_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spims_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO spims_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO spims_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO spims_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO spims_user;

-- Verify the user has access
SELECT 'spims_user created and configured successfully!' as message;
*/

-- Step 6: Verify user creation
SELECT 
    usename as username,
    usecreatedb as can_create_db,
    usesuper as is_superuser
FROM pg_user 
WHERE usename = 'spims_user';