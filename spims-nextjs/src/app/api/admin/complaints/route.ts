import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Get all complaints for admin
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause = '';
    let queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE c.status = $1';
      queryParams = [status];
    }

    const result = await query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.location,
        c.latitude,
        c.longitude,
        c.status,
        c.priority,
        c.category,
        c.image_url,
        c.created_at,
        c.updated_at,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        u.address as user_address,
        ca.assigned_at,
        ca.notes as assignment_notes,
        ca.priority_level,
        e.name as assigned_enterprise,
        e.department as enterprise_department,
        ew.name as assigned_worker_name,
        ew.email as worker_email,
        ew.phone as worker_phone
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id
      LEFT JOIN enterprises e ON ca.enterprise_id = e.id
      LEFT JOIN enterprise_workers ew ON ca.worker_id = ew.id
      ${whereClause}
      ORDER BY 
        CASE c.status 
          WHEN 'reported' THEN 1 
          WHEN 'in_progress' THEN 2 
          WHEN 'resolved' THEN 3 
        END,
        c.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM complaints c
      ${whereClause}
    `, queryParams);

    return NextResponse.json({
      complaints: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    });

  } catch (error: any) {
    console.error('Get admin complaints error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}

// PATCH - Assign complaint to enterprise
export async function PATCH(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    const { complaintId, enterpriseId, workerId, notes, priority } = await request.json();

    if (!complaintId || !enterpriseId) {
      return NextResponse.json(
        { error: 'Complaint ID and Enterprise ID are required' },
        { status: 400 }
      );
    }

    const complaintCheck = await query('SELECT 1 FROM complaints WHERE id = $1', [complaintId]);
    if (complaintCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    // assigned_by: use null because admin is in admins table, not users (FK references users.id)
    await query(
      `INSERT INTO complaint_assignments (complaint_id, enterprise_id, worker_id, assigned_by, assigned_at, notes, priority_level)
       VALUES ($1, $2, $3, NULL, CURRENT_TIMESTAMP, $4, $5)
       ON CONFLICT (complaint_id) 
       DO UPDATE SET enterprise_id = $2, worker_id = $3, assigned_by = NULL, assigned_at = CURRENT_TIMESTAMP, notes = $4, priority_level = $5`,
      [complaintId, enterpriseId, workerId || null, notes || 'Assigned by admin', priority || 1]
    );

    // Update complaint status to in_progress in database
    await query(
      `UPDATE complaints 
       SET status = CASE WHEN status = 'reported' THEN 'in_progress'::complaint_status ELSE status END,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [complaintId]
    );

    return NextResponse.json({
      message: 'Complaint assigned successfully'
    });

  } catch (error: any) {
    console.error('Assign complaint error:', error);
    const msg = error.message || 'Internal server error';
    const isFkError = msg.includes('foreign key') || msg.includes('assigned_by');
    return NextResponse.json(
      { error: isFkError ? 'Database configuration error. Run: npm run db:fix-assign-fk' : msg },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}