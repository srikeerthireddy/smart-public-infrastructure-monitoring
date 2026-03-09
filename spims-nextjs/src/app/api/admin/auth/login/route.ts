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

    // Find admin user
    const result = await query(
      `SELECT id, name, email, password, role, phone, address, is_active 
       FROM users 
       WHERE email = $1 AND role = 'admin' AND is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email, 
        role: admin.role,
        isAdmin: true
      },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' } // Shorter session for admin
    );

    // Create response
    const response = NextResponse.json({
      message: 'Admin login successful',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        address: admin.address
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 // 8 hours
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}