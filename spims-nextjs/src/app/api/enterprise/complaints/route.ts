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

// GET - Get complaints assigned to this enterprise only
export async function GET(request: NextRequest) {
  try {
    const enterprise = verifyEnterpriseToken(request);

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
        ca.assigned_at,
        ca.notes as assignment_notes,
        ca.priority_level,
        ew.name as assigned_worker_name,
        ew.email as worker_email
      FROM complaints c
      JOIN complaint_assignments ca ON c.id = ca.complaint_id AND ca.enterprise_id = $1
      JOIN users u ON c.user_id = u.id
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

// PATCH - Update complaint status (only for complaints assigned to this enterprise)
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

    // Verify complaint is assigned to this enterprise
    const assignmentCheck = await query(
      'SELECT 1 FROM complaint_assignments WHERE complaint_id = $1 AND enterprise_id = $2',
      [complaintId, enterprise.enterpriseId]
    );
    if (assignmentCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Complaint not assigned to your enterprise' },
        { status: 403 }
      );
    }

    // Get old status before updating
    const oldStatusResult = await query(
      'SELECT status FROM complaints WHERE id = $1',
      [complaintId]
    );
    const oldStatus = oldStatusResult.rows[0]?.status || 'reported';

    // Update complaint status in database
    await query(
      'UPDATE complaints SET status = $1::complaint_status, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, complaintId]
    );

    // Log status update in status_updates table
    await query(
      `INSERT INTO status_updates (complaint_id, old_status, new_status, updated_by, notes, created_at)
       VALUES ($1, $2::complaint_status, $3::complaint_status, $4, $5, CURRENT_TIMESTAMP)`,
      [complaintId, oldStatus, status, enterprise.userId, notes || `Status updated to ${status}`]
    );

    // Notify the complainant (user who reported) about the status update
    const complaintRow = await query(
      'SELECT c.user_id, c.title FROM complaints c WHERE c.id = $1',
      [complaintId]
    );
    if (complaintRow.rows.length > 0) {
      const complainantUserId = complaintRow.rows[0].user_id;
      const title = complaintRow.rows[0].title;
      const statusLabel = status === 'resolved' ? 'resolved' : status === 'in_progress' ? 'in progress' : status;
      await query(
        `INSERT INTO notifications (user_id, complaint_id, title, message, type) VALUES ($1, $2, $3, $4, 'status_update')`,
        [
          complainantUserId,
          complaintId,
          `Complaint "${title}" status updated`,
          `Your complaint "${title}" is now ${statusLabel}.${status === 'resolved' ? ' Thank you for reporting!' : ''}`,
        ]
      );
    }

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