#!/usr/bin/env node
/**
 * SPIMS Neon Database Setup
 * Creates tables and seed data for Neon PostgreSQL.
 * Run: npm run db:setup:neon (with DATABASE_URL in .env)
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env (from project root)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0 && !line.trim().startsWith('#')) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Add it to .env from console.neon.tech');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log('🔄 Connecting to Neon...\n');

    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await client.query(`
      DO $$ BEGIN CREATE TYPE user_role AS ENUM ('public', 'enterprise');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN CREATE TYPE complaint_status AS ENUM ('reported', 'in_progress', 'resolved');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN CREATE TYPE assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
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

    await client.query(`
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
        enterprise_id UUID REFERENCES enterprises(id),
        approval_status VARCHAR(20) DEFAULT 'pending',
        approved_by_admin_id UUID REFERENCES admins(id),
        approved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS enterprise_id UUID REFERENCES enterprises(id)`).catch(() => {});
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending'`).catch(() => {});
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE`).catch(() => {});
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by_admin_id UUID REFERENCES admins(id)`).catch(() => {});
    const hasApprovedBy = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='approved_by'`).catch(() => ({ rows: [] }));
    if (hasApprovedBy.rows.length > 0) {
      const legacyAdmin = await client.query("SELECT id FROM users WHERE email = 'admin@spims.gov' AND role = 'admin' LIMIT 1").catch(() => ({ rows: [] }));
      if (legacyAdmin.rows.length > 0) {
        await client.query(`INSERT INTO admins (id, name, email, password) SELECT id, name, email, password FROM users WHERE email = 'admin@spims.gov' AND role = 'admin'`).catch(() => {});
        await client.query("DELETE FROM users WHERE email = 'admin@spims.gov' AND role = 'admin'").catch(() => {});
      }
      await client.query(`UPDATE users SET approved_by_admin_id = approved_by WHERE approved_by IS NOT NULL`).catch(() => {});
      await client.query(`ALTER TABLE users DROP COLUMN approved_by`).catch(() => {});
    }

    await client.query(`
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
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS status_updates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        old_status complaint_status,
        new_status complaint_status NOT NULL,
        updated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_su_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
        CONSTRAINT fk_su_user FOREIGN KEY (updated_by) REFERENCES users(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_n_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_n_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS enterprise_workers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        specialization VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS complaint_assignments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
        worker_id UUID REFERENCES enterprise_workers(id),
        assigned_by UUID,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        priority_level INTEGER DEFAULT 1,
        estimated_completion TIMESTAMP WITH TIME ZONE,
        UNIQUE(complaint_id)
      )
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)').catch(() => {});
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_enterprise_id ON users(enterprise_id)',
      'CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status)',
      'CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status)',
      'CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_status_updates_complaint_id ON status_updates(complaint_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_complaint_assignments_complaint_id ON complaint_assignments(complaint_id)',
      'CREATE INDEX IF NOT EXISTS idx_complaint_assignments_enterprise_id ON complaint_assignments(enterprise_id)',
    ];
    for (const sql of indexes) await client.query(sql).catch(() => {});

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';
    `);
    await client.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users');
    await client.query('CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()');
    await client.query('DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints');
    await client.query('CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()');
    await client.query('DROP TRIGGER IF EXISTS update_enterprises_updated_at ON enterprises');
    await client.query('CREATE TRIGGER update_enterprises_updated_at BEFORE UPDATE ON enterprises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()');
    await client.query('DROP TRIGGER IF EXISTS update_admins_updated_at ON admins');
    await client.query('CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()');

    const ec = await client.query('SELECT COUNT(*) FROM enterprises');
    if (parseInt(ec.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO enterprises (name, department, contact_email, contact_phone, address) VALUES
        ('City Public Works', 'Infrastructure', 'works@city.gov', '+1-555-0101', '123 City Hall, Main St'),
        ('Water Department', 'Utilities', 'water@city.gov', '+1-555-0102', '456 Water Plant Rd'),
        ('Electrical Services', 'Utilities', 'electric@city.gov', '+1-555-0103', '789 Power Station Ave');
      `);
      console.log('✅ Sample enterprises added');
    }

    let ac = await client.query("SELECT COUNT(*) FROM admins WHERE email = 'admin@spims.gov'");
    if (parseInt(ac.rows[0].count) === 0) {
      const legacyAdmin = await client.query("SELECT id, name, email, password FROM users WHERE email = 'admin@spims.gov' AND role = 'admin' LIMIT 1").catch(() => ({ rows: [] }));
      if (legacyAdmin.rows.length > 0) {
        await client.query(`
          INSERT INTO admins (id, name, email, password) 
          SELECT id, name, email, password FROM users WHERE email = 'admin@spims.gov' AND role = 'admin'
        `);
        await client.query("DELETE FROM users WHERE email = 'admin@spims.gov' AND role = 'admin'");
        console.log('✅ Migrated admin from users to admins table');
      } else {
        await client.query(`
          INSERT INTO admins (name, email, password) VALUES
          ('System Admin', 'admin@spims.gov', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O');
        `);
        console.log('✅ Admin added: admin@spims.gov / admin123 (login only, no registration)');
      }
    }

    console.log('\n🎉 Neon setup complete!');
    console.log('   Admin: admin@spims.gov / admin123');
    console.log('   Enterprise: register at /enterprise/auth/register, then admin must approve\n');
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
