#!/usr/bin/env node
/** Fix admin email typo: admin@spins.gov -> admin@spims.gov */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function fix() {
  const client = await pool.connect();
  try {
    const r = await client.query(
      "UPDATE admins SET email = 'admin@spims.gov' WHERE email = 'admin@spins.gov' RETURNING email"
    );
    if (r.rowCount > 0) {
      console.log('✅ Fixed: admin@spins.gov → admin@spims.gov');
    } else {
      const check = await client.query("SELECT email FROM admins WHERE email LIKE 'admin@spi%'");
      if (check.rows.length > 0) {
        console.log('ℹ️  Admin email is already:', check.rows[0].email);
      } else {
        console.log('ℹ️  No admin with typo found');
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}
fix().catch(e => { console.error(e); process.exit(1); });
