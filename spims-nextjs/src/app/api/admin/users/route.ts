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

// GET - Get all users
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    const result = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.phone,
        u.address,
        COALESCE(u.approval_status, 'approved') as approval_status,
        u.is_active,
        u.email_verified,
        u.created_at,
        u.updated_at,
        e.name as enterprise_name,
        e.department as enterprise_department
      FROM users u
      LEFT JOIN enterprises e ON u.enterprise_id = e.id
      WHERE u.role IN ('public', 'enterprise')
      ORDER BY u.created_at DESC
    `);

    return NextResponse.json({
      users: result.rows
    });

  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}

// PATCH - Update user status
export async function PATCH(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    const { userId, action, notes } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Invalid request. userId and action are required.' },
        { status: 400 }
      );
    }

    let updateQuery = '';
    let updateParams = [];

    if (action === 'activate') {
      updateQuery = 'UPDATE users SET is_active = true WHERE id = $1';
      updateParams = [userId];
    } else if (action === 'deactivate') {
      updateQuery = 'UPDATE users SET is_active = false WHERE id = $1';
      updateParams = [userId];
    } else if (action === 'verify_email') {
      updateQuery = 'UPDATE users SET email_verified = true WHERE id = $1';
      updateParams = [userId];
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await query(updateQuery, updateParams);

    return NextResponse.json({
      message: `User ${action}d successfully`
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}