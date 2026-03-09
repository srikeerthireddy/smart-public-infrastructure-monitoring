import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find enterprise user with enterprise details
    const result = await query(
      `SELECT 
        u.id, u.name, u.email, u.password, u.role, u.phone, u.address,
        u.enterprise_id, u.approval_status, u.approved_by, u.approved_at,
        e.name as enterprise_name, e.department, e.contact_email
       FROM users u
       LEFT JOIN enterprises e ON u.enterprise_id = e.id
       WHERE u.email = $1 AND u.role = 'enterprise'`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials or not an enterprise account' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check approval status
    if (user.approval_status === 'rejected') {
      return NextResponse.json(
        { error: 'Your enterprise account has been rejected. Please contact support.' },
        { status: 403 }
      );
    }

    if (user.approval_status === 'pending') {
      return NextResponse.json(
        { 
          error: 'Your enterprise account is pending admin approval.',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            approval_status: user.approval_status,
            enterprise: {
              name: user.enterprise_name,
              department: user.department
            }
          }
        },
        { status: 202 } // Accepted but pending
      );
    }

    // If approved, generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        enterpriseId: user.enterprise_id,
        approvalStatus: user.approval_status
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        enterprise_id: user.enterprise_id,
        approval_status: user.approval_status,
        approved_at: user.approved_at,
        enterprise: {
          name: user.enterprise_name,
          department: user.department,
          contact_email: user.contact_email
        }
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Enterprise login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}