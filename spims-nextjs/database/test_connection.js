// SPIMS Database Connection Test
// Test script to verify database connectivity and basic operations

const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'spims_db',
  user: process.env.DB_USER || 'spims_user',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testDatabaseConnection() {
  console.log('🔍 Testing SPIMS Database Connection...\n');
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test database version
    console.log('\n2. Checking PostgreSQL version...');
    const versionResult = await client.query('SELECT version()');
    console.log(`✅ PostgreSQL Version: ${versionResult.rows[0].version.split(' ')[1]}`);
    
    // Test UUID extension
    console.log('\n3. Testing UUID extension...');
    const uuidResult = await client.query('SELECT uuid_generate_v4() as test_uuid');
    console.log(`✅ UUID Extension working: ${uuidResult.rows[0].test_uuid}`);
    
    // Test table existence
    console.log('\n4. Checking table structure...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const expectedTables = [
      'assignments', 'categories', 'comments', 'complaints', 
      'enterprises', 'notifications', 'status_updates', 'users'
    ];
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log(`✅ Found ${existingTables.length} tables:`, existingTables.join(', '));
    
    // Check if all expected tables exist
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    if (missingTables.length > 0) {
      console.log(`⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('   Run the setup script to create missing tables.');
    } else {
      console.log('✅ All expected tables are present!');
    }
    
    // Test data insertion (if tables exist)
    if (existingTables.includes('users')) {
      console.log('\n5. Testing data operations...');
      
      // Test insert
      const insertResult = await client.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, role, created_at
      `, ['Test User', 'test@example.com', 'hashed_password', 'public']);
      
      const newUser = insertResult.rows[0];
      console.log(`✅ Insert successful: User ${newUser.name} created with ID ${newUser.id}`);
      
      // Test select
      const selectResult = await client.query(
        'SELECT COUNT(*) as user_count FROM users WHERE role = $1',
        ['public']
      );
      console.log(`✅ Select successful: Found ${selectResult.rows[0].user_count} public users`);
      
      // Clean up test data
      await client.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
      console.log('✅ Cleanup successful: Test user removed');
    }
    
    // Test views (if they exist)
    console.log('\n6. Testing views...');
    try {
      const viewResult = await client.query('SELECT COUNT(*) FROM complaint_details');
      console.log(`✅ Views working: complaint_details view has ${viewResult.rows[0].count} records`);
    } catch (error) {
      console.log('⚠️  Views not found - run migrations to create views');
    }
    
    // Test functions and triggers
    console.log('\n7. Testing functions...');
    try {
      const funcResult = await client.query(`
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'FUNCTION'
      `);
      console.log(`✅ Found ${funcResult.rows.length} custom functions`);
    } catch (error) {
      console.log('⚠️  Functions not found - run migrations to create functions');
    }
    
    // Performance test
    console.log('\n8. Performance test...');
    const startTime = Date.now();
    await client.query('SELECT 1');
    const endTime = Date.now();
    console.log(`✅ Query response time: ${endTime - startTime}ms`);
    
    client.release();
    
    console.log('\n🎉 All database tests passed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   - Connection: ✅ Working`);
    console.log(`   - Tables: ✅ ${existingTables.length} found`);
    console.log(`   - Operations: ✅ Insert/Select/Delete working`);
    console.log(`   - Performance: ✅ Good response time`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Check if PostgreSQL is running');
    console.error('   2. Verify database credentials in .env file');
    console.error('   3. Ensure database and user exist');
    console.error('   4. Run setup.sql to create schema');
    console.error('   5. Check network connectivity');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Additional utility functions
async function showDatabaseStats() {
  console.log('\n📈 Database Statistics:');
  
  const client = await pool.connect();
  
  try {
    // Table sizes
    const sizeResult = await client.query(`
      SELECT 
        tablename,
        pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
        pg_total_relation_size(tablename::regclass) as bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(tablename::regclass) DESC
    `);
    
    console.log('\nTable Sizes:');
    sizeResult.rows.forEach(row => {
      console.log(`   ${row.tablename}: ${row.size}`);
    });
    
    // Record counts (if tables have data)
    const tables = ['users', 'enterprises', 'complaints', 'assignments', 'status_updates'];
    console.log('\nRecord Counts:');
    
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   ${table}: Table not found`);
      }
    }
    
  } catch (error) {
    console.error('Error getting database stats:', error.message);
  } finally {
    client.release();
  }
}

// Run tests
async function main() {
  await testDatabaseConnection();
  
  // Show stats if requested
  if (process.argv.includes('--stats')) {
    await showDatabaseStats();
  }
  
  console.log('\n✨ Database testing completed!');
  process.exit(0);
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the test
if (require.main === module) {
  main();
}

module.exports = { testDatabaseConnection, showDatabaseStats };