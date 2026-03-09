const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function createAdmin() {
  // Hash the password
  const password = 'Admin@123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Password:', password);
  console.log('Hashed Password:', hashedPassword);
  
  // Connect to database
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'spims_db',
    user: 'postgres',
    password: 'keerthi',
  });

  try {
    // Delete existing admin user
    await pool.query('DELETE FROM users WHERE email = $1', ['admin@gmail.com']);
    
    // Create new admin user
    const result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone, address, is_active, email_verified, approval_status, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING id, name, email, role
    `, [
      'System Administrator',
      'admin@gmail.com',
      hashedPassword,
      'admin',
      '+1-555-0000',
      'SPIMS Headquarters',
      true,
      true,
      'approved'
    ]);
    
    console.log('✅ Admin user created successfully:', result.rows[0]);
    
    // Test the password
    const testResult = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', ['admin@gmail.com']);
    const user = testResult.rows[0];
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password verification test:', isValid ? 'PASSED' : 'FAILED');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();