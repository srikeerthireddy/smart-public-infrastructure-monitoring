import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: 'DATABASE_URL not set' },
        { status: 503 }
      );
    }
    await query('SELECT 1');
    return NextResponse.json({ ok: true, database: 'connected' });
  } catch (error: any) {
    console.error('Health check failed:', error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Database connection failed' },
      { status: 503 }
    );
  }
}
