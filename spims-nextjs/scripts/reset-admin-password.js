#!/usr/bin/env node
/** Reset admin password to admin123 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
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

async function reset() {
  const client = await pool.connect();
  try {
    // Fix email typo first (admin@spins.gov -> admin@spims.gov)
    await client.query("UPDATE admins SET email = 'admin@spims.gov' WHERE email = 'admin@spins.gov'");

    const hash = await bcrypt.hash('admin123', 12);
    const r = await client.query(
      "UPDATE admins SET password = $1 WHERE email = 'admin@spims.gov' RETURNING email",
      [hash]
    );
    if (r.rowCount > 0) {
      console.log('✅ Admin password reset to: admin123');
      console.log('   Login with: admin@spims.gov / admin123');
    } else {
      console.log('❌ No admin found. Run: npm run db:setup:neon');
    }
  } finally {
    client.release();
    await pool.end();
  }
}
reset().catch(e => { console.error(e); process.exit(1); });
