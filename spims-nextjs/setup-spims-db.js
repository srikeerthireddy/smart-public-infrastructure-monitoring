const { Pool } = require('pg');

async function setupDatabase() {
  // Connect as postgres admin user
  const adminPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'keerthi',
  });

  try {
    console.log('🔄 Connecting to PostgreSQL as admin...');
    const adminClient = await adminPool.connect();
    
    // Create spims_user
    console.log('👤 Creating spims_user...');
    try {
      await adminClient.query("CREATE USER spims_user WITH PASSWORD 'keerthi'");
      console.log('✅ spims_user created successfully');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️  spims_user already exists');
      } else {
        throw error;
      }
    }

    // Create spims_db database
    console.log('🗄️  Creating spims_db database...');
    try {
      await adminClient.query('CREATE DATABASE spims_db OWNER spims_user');
      console.log('✅ spims_db database created successfully');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️  spims_db database already exists');
      } else {
        throw error;
      }
    }

    // Grant privileges
    console.log('🔐 Granting privileges...');
    await adminClient.query('GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user');
    await adminClient.query('ALTER USER spims_user CREATEDB');
    
    adminClient.release();
    await adminPool.end();
    
    // Now connect to spims_db and create tables
    console.log('📊 Connecting to spims_db to create tables...');
    const spimsPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'spims_db',
      user: 'postgres',
      password: 'keerthi',
    });

    const spimsClient = await spimsPool.connect();
    
    // Grant schema permissions
    await spimsClient.query('GRANT ALL ON SCHEMA public TO spims_user');
    await spimsClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spims_user');
    await spimsClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spims_user');
    
    // Create tables
    console.log('🏗️  Creating tables...');
    
    // Enable UUID extension
    await spimsClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create ENUM types
    await spimsClient.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('public', 'enterprise', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await spimsClient.query(`
      DO $$ BEGIN
        CREATE TYPE complaint_status AS ENUM ('reported', 'in_progress', 'resolved');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Create users table
    await spimsClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'public',
        phone VARCHAR(20),
        address TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create complaints table
    await spimsClient.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        location VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status complaint_status NOT NULL DEFAULT 'reported',
        priority INTEGER DEFAULT 1,
        category VARCHAR(100),
        user_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_complaints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create enterprises table
    await spimsClient.query(`
      CREATE TABLE IF NOT EXISTS enterprises (
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
      )
    `);
    
    // Create indexes
    await spimsClient.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await spimsClient.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await spimsClient.query('CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id)');
    await spimsClient.query('CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status)');
    
    // Grant permissions on new tables
    await spimsClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spims_user');
    await spimsClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spims_user');
    
    console.log('✅ All tables created successfully!');
    
    // Test the connection as spims_user
    console.log('🧪 Testing connection as spims_user...');
    spimsClient.release();
    await spimsPool.end();
    
    const testPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'spims_db',
      user: 'spims_user',
      password: 'keerthi',
    });
    
    const testClient = await testPool.connect();
    const result = await testClient.query('SELECT COUNT(*) FROM users');
    console.log(`✅ spims_user can access tables! Current users: ${result.rows[0].count}`);
    
    testClient.release();
    await testPool.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📝 Your .env configuration:');
    console.log('DB_HOST=localhost');
    console.log('DB_PORT=5432');
    console.log('DB_NAME=spims_db');
    console.log('DB_USER=spims_user');
    console.log('DB_PASSWORD=keerthi');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();