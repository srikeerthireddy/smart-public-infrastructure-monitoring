import { Pool } from 'pg';

// Database connection: use DATABASE_URL for Neon (deployment) or DB_* for local pgAdmin
// Serverless (Vercel): use max 2 to avoid exhausting Neon connections across many instances
const isServerless = !!process.env.DATABASE_URL && process.env.VERCEL === '1';
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: isServerless ? 2 : 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'spims_db',
      user: process.env.DB_USER || 'spims_user',
      password: process.env.DB_PASSWORD || 'your_secure_password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
  // Don't exit in serverless - would crash the function
  if (!process.env.VERCEL) process.exit(-1);
});

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a client from the pool
export async function getClient() {
  return await pool.connect();
}

// Helper function to end the pool (for graceful shutdown)
export async function end() {
  await pool.end();
}

export default pool;