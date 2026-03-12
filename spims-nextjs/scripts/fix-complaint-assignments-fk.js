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
    // Find and drop ANY foreign key on complaint_assignments.assigned_by
    const fkResult = await client.query(`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = 'complaint_assignments'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'assigned_by'
    `);
    for (const row of fkResult.rows) {
      const name = row.constraint_name;
      await client.query(`ALTER TABLE complaint_assignments DROP CONSTRAINT IF EXISTS "${name}"`);
      console.log('Dropped constraint:', name);
    }
    if (fkResult.rows.length === 0) {
      console.log('No FK on assigned_by found.');
    }
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
