import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  if (decoded.role !== 'admin') throw new Error('Admin access required');
  return decoded;
}

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);
    const result = await query(
      'SELECT id, name, department FROM enterprises WHERE is_active = true ORDER BY name'
    );
    return NextResponse.json({ enterprises: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
}
