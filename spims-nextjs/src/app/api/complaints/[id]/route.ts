import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
}

// GET - Fetch single complaint with status updates (for complaint owner)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);
    const { id } = await params;

    const complaintResult = await query(
      `SELECT c.id, c.title, c.description, c.location, c.latitude, c.longitude,
              c.status, c.priority, c.category, c.image_url, c.created_at, c.updated_at,
              u.name as user_name
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1 AND c.user_id = $2`,
      [id, decoded.userId]
    );

    if (complaintResult.rows.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const statusUpdatesResult = await query(
      `SELECT su.id, su.old_status, su.new_status, su.notes, su.created_at,
              COALESCE(u.name, 'System') as updated_by_name
       FROM status_updates su
       LEFT JOIN users u ON su.updated_by = u.id
       WHERE su.complaint_id = $1
       ORDER BY su.created_at DESC`,
      [id]
    );

    return NextResponse.json({
      complaint: complaintResult.rows[0],
      statusUpdates: statusUpdatesResult.rows
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
