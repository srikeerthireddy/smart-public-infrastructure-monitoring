import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('Admin login: JWT_SECRET not set in environment');
      return NextResponse.json(
        { error: 'Server configuration error. Check environment variables.' },
        { status: 503 }
      );
    }
    if (!process.env.DATABASE_URL) {
      console.error('Admin login: DATABASE_URL not set in environment');
      return NextResponse.json(
        { error: 'Server configuration error. Check environment variables.' },
        { status: 503 }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin (handles typo: admin@spins.gov vs admin@spims.gov in DB)
    const normalizedEmail = email.toLowerCase().trim();
    const result = await query(
      `SELECT id, name, email, password, phone, is_active 
       FROM admins 
       WHERE (email = $1 OR email = $2) AND is_active = true
       LIMIT 1`,
      [normalizedEmail, normalizedEmail === 'admin@spims.gov' ? 'admin@spins.gov' : 'admin@spims.gov']
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
        role: 'admin',
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
        role: 'admin',
        phone: admin.phone
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

  } catch (error: any) {
    console.error('Admin login error:', error?.message || error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? (error?.message || 'Internal server error') : 'Internal server error' },
      { status: 500 }
    );
  }
}