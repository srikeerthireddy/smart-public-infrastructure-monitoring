#!/usr/bin/env node
/**
 * Fix complaint_assignments.assigned_by FK constraint
 * Admin assigns complaints but admins are in admins table, not users.
 * This script drops the FK if it exists so assigned_by can be NULL.
 * Run: node scripts/fix-complaint-assignments-fk.js (with DATABASE_URL in .env)
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

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
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function fix() {
  const client = await pool.connect();
  try {
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'complaint_assignments_assigned_by_fkey'
          AND table_name = 'complaint_assignments'
        ) THEN
          ALTER TABLE complaint_assignments DROP CONSTRAINT complaint_assignments_assigned_by_fkey;
          RAISE NOTICE 'Dropped complaint_assignments_assigned_by_fkey';
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'fk_assignments_assigned_by'
          AND table_name = 'complaint_assignments'
        ) THEN
          ALTER TABLE complaint_assignments DROP CONSTRAINT fk_assignments_assigned_by;
          RAISE NOTICE 'Dropped fk_assignments_assigned_by';
        ELSE
          RAISE NOTICE 'No assigned_by FK found - nothing to do';
        END IF;
      END $$;
    `);
    try {
      await client.query('ALTER TABLE complaint_assignments ALTER COLUMN assigned_by DROP NOT NULL');
    } catch (_) {}
    console.log('Done. assigned_by can now be NULL for admin assignments.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fix();
