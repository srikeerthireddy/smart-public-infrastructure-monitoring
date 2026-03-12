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
    // Only enterprises with at least one approved user (who can log in and work)
    const result = await query(`
      SELECT DISTINCT e.id, e.name, e.department
      FROM enterprises e
      JOIN users u ON u.enterprise_id = e.id AND u.role = 'enterprise'
      WHERE e.is_active = true
        AND u.approval_status = 'approved'
      ORDER BY e.name
    `);
    return NextResponse.json({ enterprises: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
}
