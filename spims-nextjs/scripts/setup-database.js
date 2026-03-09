#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration - connect as postgres admin user first
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: 'postgres', // Connect as postgres admin user
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'your_secure_password',
  database: 'postgres' // Connect to default database first
};

async function setupDatabase() {
  const pool = new Pool(config);
  
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    
    // Create spims_user first (if not exists)
    const userCheckResult = await pool.query(
      "SELECT 1 FROM pg_roles WHERE rolname = 'spims_user'"
    );
    
    if (userCheckResult.rows.length === 0) {
      console.log('👤 Creating SPIMS user...');
      await pool.query(`CREATE USER spims_user WITH PASSWORD '${process.env.DB_PASSWORD || 'keerthi'}'`);
      console.log('✅ User created successfully!');
    } else {
      console.log('✅ User already exists');
    }

    // Check if database exists
    const dbCheckResult = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'spims_db'"
    );
    
    if (dbCheckResult.rows.length === 0) {
      console.log('📦 Creating SPIMS database...');
      await pool.query('CREATE DATABASE spims_db OWNER spims_user');
      console.log('✅ Database created successfully!');
    } else {
      console.log('✅ Database already exists');
    }
    
    // Grant privileges
    console.log('🔐 Granting privileges...');
    await pool.query('GRANT ALL PRIVILEGES ON DATABASE spims_db TO spims_user');
    
    await pool.end();
    
    // Connect to the SPIMS database
    const spimPool = new Pool({
      ...config,
      database: 'spims_db'
    });
    
    console.log('🔄 Setting up database schema...');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await spimPool.query(schema);
    console.log('✅ Schema created successfully!');
    
    // Check if we should load seed data
    const userCount = await spimPool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('🌱 Loading seed data...');
      
      const seedPath = path.join(__dirname, '..', 'database', 'seeds', 'seed_data.sql');
      if (fs.existsSync(seedPath)) {
        const seedData = fs.readFileSync(seedPath, 'utf8');
        await spimPool.query(seedData);
        console.log('✅ Seed data loaded successfully!');
      } else {
        console.log('⚠️  Seed data file not found, skipping...');
      }
    } else {
      console.log('✅ Database already has data, skipping seed...');
    }
    
    await spimPool.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your .env file has the correct database credentials');
    console.log('2. Start your Next.js application: npm run dev');
    console.log('3. Your app will now use PostgreSQL instead of localStorage');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Ensure the database user has CREATE DATABASE permissions');
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };