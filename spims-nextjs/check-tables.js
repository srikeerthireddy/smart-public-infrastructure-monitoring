const { Pool } = require('pg');

async function checkTables() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'spims_db',
    user: 'postgres',
    password: 'keerthi',
  });

  try {
    console.log('🔍 Checking table structures...\n');

    // Check users table
    const usersColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 USERS table columns:');
    usersColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });

    // Check enterprises table
    const enterprisesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'enterprises' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 ENTERPRISES table columns:');
    enterprisesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });

    // Check if approval_status column exists
    const hasApprovalStatus = usersColumns.rows.some(col => col.column_name === 'approval_status');
    const hasEnterpriseId = usersColumns.rows.some(col => col.column_name === 'enterprise_id');

    console.log('\n🔧 Missing columns check:');
    console.log(`  - approval_status: ${hasApprovalStatus ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  - enterprise_id: ${hasEnterpriseId ? '✅ EXISTS' : '❌ MISSING'}`);

    if (!hasApprovalStatus || !hasEnterpriseId) {
      console.log('\n🛠️  Adding missing columns...');
      
      if (!hasApprovalStatus) {
        await pool.query('ALTER TABLE users ADD COLUMN approval_status VARCHAR(20) DEFAULT \'pending\'');
        console.log('✅ Added approval_status column');
      }
      
      if (!hasEnterpriseId) {
        await pool.query('ALTER TABLE users ADD COLUMN enterprise_id UUID REFERENCES enterprises(id)');
        console.log('✅ Added enterprise_id column');
      }
    }

    console.log('\n✅ Table check completed!');

  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

checkTables();