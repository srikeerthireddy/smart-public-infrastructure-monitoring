const { Pool } = require('pg');

async function fixEnterpriseData() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'spims_db',
    user: 'postgres',
    password: 'keerthi',
  });

  try {
    console.log('🔧 Fixing enterprise data for admin dashboard...');

    // Get the current enterprise user
    const enterpriseUser = await pool.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        u.address as user_address,
        u.approval_status,
        u.created_at as registration_date,
        e.id as enterprise_id,
        e.name as enterprise_name,
        e.department,
        e.contact_email as enterprise_email
      FROM users u
      JOIN enterprises e ON u.enterprise_id = e.id
      WHERE u.role = 'enterprise' AND u.approval_status = 'pending'
    `);

    console.log('📊 Current pending enterprise users:', enterpriseUser.rows);

    if (enterpriseUser.rows.length > 0) {
      console.log('✅ Found pending enterprise user:', enterpriseUser.rows[0].user_name);
      
      // Test the admin enterprises API query directly
      const testQuery = await pool.query(`
        SELECT 
          u.id as user_id,
          u.name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          u.address as user_address,
          COALESCE(u.approval_status, 'pending') as approval_status,
          u.approved_by,
          u.approved_at,
          u.created_at as registration_date,
          e.id as enterprise_id,
          e.name as enterprise_name,
          e.department,
          e.contact_email as enterprise_email,
          null as enterprise_address,
          null as enterprise_description,
          true as enterprise_active,
          approver.name as approved_by_name
        FROM users u
        LEFT JOIN enterprises e ON u.enterprise_id = e.id
        LEFT JOIN users approver ON u.approved_by = approver.id
        WHERE u.role = 'enterprise'
        ORDER BY 
          CASE COALESCE(u.approval_status, 'pending')
            WHEN 'pending' THEN 1 
            WHEN 'approved' THEN 2 
            WHEN 'rejected' THEN 3 
          END,
          u.created_at DESC
      `);

      console.log('🧪 API Query Result:', JSON.stringify(testQuery.rows, null, 2));

      const pendingEnterprises = testQuery.rows.filter(e => e.approval_status === 'pending');
      console.log('🔍 Pending enterprises found:', pendingEnterprises.length);

      if (pendingEnterprises.length > 0) {
        console.log('✅ Enterprise data is correct. The issue might be in the frontend.');
        console.log('📋 Pending enterprise details:');
        pendingEnterprises.forEach(enterprise => {
          console.log(`  - ${enterprise.user_name} (${enterprise.enterprise_name})`);
          console.log(`    Status: ${enterprise.approval_status}`);
          console.log(`    Department: ${enterprise.department}`);
        });
      }
    } else {
      console.log('❌ No pending enterprise users found');
    }

  } catch (error) {
    console.error('❌ Error fixing enterprise data:', error);
  } finally {
    await pool.end();
  }
}

fixEnterpriseData();