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

// GET - Get all enterprises with approval status
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    console.log('🔍 Fetching enterprises for admin dashboard...');
    const result = await query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        u.address as user_address,
        COALESCE(u.approval_status, 'pending') as approval_status,
        u.approved_by_admin_id,
        u.approved_at,
        u.created_at as registration_date,
        e.id as enterprise_id,
        e.name as enterprise_name,
        e.department,
        e.contact_email as enterprise_email,
        null as enterprise_address,
        null as enterprise_description,
        true as enterprise_active,
        approver.name as approved_by_name
      FROM users u
      LEFT JOIN enterprises e ON u.enterprise_id = e.id
      LEFT JOIN admins approver ON u.approved_by_admin_id = approver.id
      WHERE u.role = 'enterprise'
      ORDER BY 
        CASE COALESCE(u.approval_status, 'pending')
          WHEN 'pending' THEN 1 
          WHEN 'approved' THEN 2 
          WHEN 'rejected' THEN 3 
        END,
        u.created_at DESC
    `);

    console.log('📊 Found enterprises:', result.rows.length);
    console.log('📋 Enterprise data:', result.rows);

    return NextResponse.json({
      enterprises: result.rows
    });

  } catch (error: any) {
    console.error('Get enterprises error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}

// PATCH - Approve/Reject enterprise
export async function PATCH(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    const { userId, action, notes } = await request.json();

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. userId and action (approve/reject) are required.' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update user approval status (approved_by_admin_id references admins table)
    await query(
      `UPDATE users 
       SET approval_status = $1, approved_by_admin_id = $2, approved_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND role = 'enterprise'`,
      [newStatus, admin.userId, userId]
    );

    return NextResponse.json({
      message: `Enterprise ${action}ed successfully`,
      status: newStatus
    });

  } catch (error: any) {
    console.error('Update enterprise status error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}