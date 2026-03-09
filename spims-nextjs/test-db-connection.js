const { Pool } = require('pg');

// Test different password combinations
const passwords = ['keerthi', 'postgres', 'admin', 'password', 'root'];

async function testConnection(password) {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default postgres database first
    user: 'postgres',
    password: password,
  });

  try {
    const client = await pool.connect();
    console.log(`✅ SUCCESS: Connected with password: "${password}"`);
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log(`✅ Database version: ${result.rows[0].version.substring(0, 50)}...`);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ FAILED: Password "${password}" - ${error.message}`);
    await pool.end();
    return false;
  }
}

async function findWorkingPassword() {
  console.log('🔍 Testing PostgreSQL connection with different passwords...\n');
  
  for (const password of passwords) {
    const success = await testConnection(password);
    if (success) {
      console.log(`\n🎯 FOUND WORKING PASSWORD: "${password}"`);
      console.log(`\n📝 Update your .env file with:`);
      console.log(`DB_USER=postgres`);
      console.log(`DB_PASSWORD=${password}`);
      return password;
    }
  }
  
  console.log('\n❌ None of the common passwords worked.');
  console.log('💡 Try checking your PostgreSQL installation or resetting the password.');
}

findWorkingPassword();