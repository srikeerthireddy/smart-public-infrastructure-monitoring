import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

function verifyEnterpriseToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'enterprise') {
      throw new Error('Enterprise access required');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Get complaints assigned to enterprise
export async function GET(request: NextRequest) {
  try {
    const enterprise = verifyEnterpriseToken(request);

    // Get all complaints (for now, later we'll add assignment logic)
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
        c.created_at,
        c.updated_at,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        ca.assigned_at,
        ca.notes as assignment_notes,
        ca.priority_level,
        ew.name as assigned_worker_name
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.enterprise_id = $1
      LEFT JOIN enterprise_workers ew ON ca.worker_id = ew.id
      ORDER BY 
        CASE c.status 
          WHEN 'reported' THEN 1 
          WHEN 'in_progress' THEN 2 
          WHEN 'resolved' THEN 3 
        END,
        c.created_at DESC
      LIMIT 50
    `, [enterprise.enterpriseId]);

    return NextResponse.json({
      complaints: result.rows
    });

  } catch (error: any) {
    console.error('Get enterprise complaints error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Enterprise access required' ? 401 : 500 }
    );
  }
}

// PATCH - Update complaint status
export async function PATCH(request: NextRequest) {
  try {
    const enterprise = verifyEnterpriseToken(request);
    const { complaintId, status, notes, workerId } = await request.json();

    if (!complaintId || !status) {
      return NextResponse.json(
        { error: 'Complaint ID and status are required' },
        { status: 400 }
      );
    }

    // Update complaint status
    await query(
      'UPDATE complaints SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, complaintId]
    );

    // Log status update
    await query(
      `INSERT INTO status_updates (complaint_id, old_status, new_status, updated_by, update_notes, created_at)
       SELECT $1, 
              (SELECT status FROM complaints WHERE id = $1), 
              $2, 
              $3, 
              $4, 
              CURRENT_TIMESTAMP`,
      [complaintId, status, enterprise.userId, notes || `Status updated to ${status}`]
    );

    // Create or update assignment if workerId provided
    if (workerId) {
      await query(
        `INSERT INTO complaint_assignments (complaint_id, enterprise_id, worker_id, assigned_by, assigned_at, notes)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
         ON CONFLICT (complaint_id) 
         DO UPDATE SET worker_id = $3, assigned_by = $4, assigned_at = CURRENT_TIMESTAMP, notes = $5`,
        [complaintId, enterprise.enterpriseId, workerId, enterprise.userId, notes]
      );
    }

    return NextResponse.json({
      message: 'Complaint updated successfully',
      status: status
    });

  } catch (error: any) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Enterprise access required' ? 401 : 500 }
    );
  }
}