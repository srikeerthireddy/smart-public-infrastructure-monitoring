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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminToken(request);
    const { id } = await params;

    const result = await query(
      `SELECT su.id, su.old_status, su.new_status, su.notes, su.created_at,
              COALESCE(u.name, 'System') as updated_by_name
       FROM status_updates su
       LEFT JOIN users u ON su.updated_by = u.id
       WHERE su.complaint_id = $1
       ORDER BY su.created_at DESC`,
      [id]
    );

    return NextResponse.json({ statusUpdates: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
}
