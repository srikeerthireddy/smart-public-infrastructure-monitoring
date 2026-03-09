const { Pool } = require('pg');

async function debugEnterprise() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'spims_db',
    user: 'postgres',
    password: 'keerthi',
  });

  try {
    console.log('🔍 Debugging enterprise data...\n');

    // Check all users
    const users = await pool.query(`
      SELECT id, name, email, role, enterprise_id, approval_status, created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log('👥 ALL USERS:');
    users.rows.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
      console.log(`    Role: ${user.role}, Status: ${user.approval_status}`);
      console.log(`    Enterprise ID: ${user.enterprise_id}`);
      console.log(`    Created: ${user.created_at}`);
      console.log('');
    });

    // Check all enterprises
    const enterprises = await pool.query(`
      SELECT id, name, department, contact_email, created_at
      FROM enterprises 
      ORDER BY created_at DESC
    `);
    
    console.log('🏢 ALL ENTERPRISES:');
    enterprises.rows.forEach(enterprise => {
      console.log(`  - ${enterprise.name} (${enterprise.department})`);
      console.log(`    Contact: ${enterprise.contact_email}`);
      console.log(`    ID: ${enterprise.id}`);
      console.log(`    Created: ${enterprise.created_at}`);
      console.log('');
    });

    // Check enterprise users with their enterprise details
    const enterpriseUsers = await pool.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.approval_status,
        u.created_at as registration_date,
        e.id as enterprise_id,
        e.name as enterprise_name,
        e.department
      FROM users u
      LEFT JOIN enterprises e ON u.enterprise_id = e.id
      WHERE u.role = 'enterprise'
      ORDER BY u.created_at DESC
    `);
    
    console.log('🔗 ENTERPRISE USERS WITH DETAILS:');
    enterpriseUsers.rows.forEach(user => {
      console.log(`  - ${user.user_name} (${user.user_email})`);
      console.log(`    Status: ${user.approval_status}`);
      console.log(`    Enterprise: ${user.enterprise_name || 'NO ENTERPRISE LINKED'}`);
      console.log(`    Department: ${user.department || 'N/A'}`);
      console.log(`    Enterprise ID: ${user.enterprise_id || 'NULL'}`);
      console.log('');
    });

    // Fix any missing enterprise_id connections
    console.log('🔧 Checking for missing enterprise connections...');
    
    const usersWithoutEnterprise = await pool.query(`
      SELECT u.id, u.name, u.email, e.id as enterprise_id
      FROM users u
      LEFT JOIN enterprises e ON u.email = e.contact_email
      WHERE u.role = 'enterprise' AND u.enterprise_id IS NULL
    `);

    if (usersWithoutEnterprise.rows.length > 0) {
      console.log('🛠️  Found users without enterprise connection, fixing...');
      
      for (const user of usersWithoutEnterprise.rows) {
        if (user.enterprise_id) {
          await pool.query(
            'UPDATE users SET enterprise_id = $1 WHERE id = $2',
            [user.enterprise_id, user.id]
          );
          console.log(`✅ Linked ${user.name} to enterprise ${user.enterprise_id}`);
        }
      }
    } else {
      console.log('✅ All enterprise users are properly linked');
    }

  } catch (error) {
    console.error('❌ Error debugging enterprise:', error);
  } finally {
    await pool.end();
  }
}

debugEnterprise();