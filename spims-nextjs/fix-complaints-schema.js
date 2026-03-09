const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'spims_db',
  password: 'keerthi',
  port: 5432,
});

async function fixComplaintsSchema() {
  try {
    console.log('🔧 Fixing complaints table schema...');

    // Add missing columns to complaints table
    const alterQueries = [
      `ALTER TABLE complaints ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1;`,
      `ALTER TABLE complaints ADD COLUMN IF NOT EXISTS category VARCHAR(100);`,
      `ALTER TABLE complaints ADD COLUMN IF NOT EXISTS image_url TEXT;`,
      `COMMENT ON COLUMN complaints.priority IS 'Priority level: 1=Low, 2=Medium, 3=High, 4=Critical';`,
      `COMMENT ON COLUMN complaints.category IS 'Category of complaint: infrastructure, utilities, safety, etc.';`
    ];

    for (const query of alterQueries) {
      try {
        await pool.query(query);
        console.log('✅ Executed:', query.substring(0, 50) + '...');
      } catch (error) {
        if (error.code === '42701') {
          console.log('⚠️ Column already exists:', query.substring(0, 50) + '...');
        } else {
          throw error;
        }
      }
    }

    // Check current schema
    const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'complaints' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Current complaints table schema:');
    console.table(schemaResult.rows);

    // Insert some sample data if table is empty
    const countResult = await pool.query('SELECT COUNT(*) as count FROM complaints');
    const complaintCount = parseInt(countResult.rows[0].count);

    if (complaintCount === 0) {
      console.log('\n📝 Adding sample complaint data...');
      
      // First, get a user ID
      const userResult = await pool.query(`SELECT id FROM users WHERE role = 'public' LIMIT 1`);
      
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        
        const sampleComplaints = [
          {
            title: 'Broken Street Light on Main Road',
            description: 'The street light near the bus stop on Main Road has been broken for over a week. This creates safety concerns for pedestrians at night.',
            location: 'Main Road, Bus Stop Area',
            latitude: 40.7128,
            longitude: -74.0060,
            status: 'reported',
            priority: 2,
            category: 'infrastructure',
            user_id: userId
          },
          {
            title: 'Pothole on Highway 101',
            description: 'Large pothole causing damage to vehicles. Multiple cars have reported tire damage.',
            location: 'Highway 101, Mile Marker 15',
            latitude: 40.7589,
            longitude: -73.9851,
            status: 'reported',
            priority: 3,
            category: 'infrastructure',
            user_id: userId
          },
          {
            title: 'Water Leak in Park Area',
            description: 'Continuous water leak from underground pipe in Central Park. Water is flooding the walking path.',
            location: 'Central Park, Walking Trail Section B',
            latitude: 40.7831,
            longitude: -73.9712,
            status: 'in_progress',
            priority: 2,
            category: 'utilities',
            user_id: userId
          }
        ];

        for (const complaint of sampleComplaints) {
          await pool.query(`
            INSERT INTO complaints (id, title, description, location, latitude, longitude, status, priority, category, user_id, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6::complaint_status, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [
            complaint.title,
            complaint.description,
            complaint.location,
            complaint.latitude,
            complaint.longitude,
            complaint.status,
            complaint.priority,
            complaint.category,
            complaint.user_id
          ]);
        }

        console.log('✅ Added sample complaint data');
      } else {
        console.log('⚠️ No public users found, skipping sample data');
      }
    } else {
      console.log(`\n📊 Found ${complaintCount} existing complaints in database`);
    }

    console.log('\n🎉 Schema fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  } finally {
    await pool.end();
  }
}

fixComplaintsSchema();