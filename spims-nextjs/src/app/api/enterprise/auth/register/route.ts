import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Enterprise registration request received');
    
    const body = await request.json();
    console.log('📝 Request body:', { ...body, password: '[HIDDEN]' });
    
    const { name, email, password, phone, enterpriseName, department, address } = body;

    // Validate required fields
    if (!name || !email || !password || !enterpriseName || !department) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, enterpriseName, department are required' },
        { status: 400 }
      );
    }

    console.log('✅ Required fields validated');

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    console.log('✅ User email is available');

    // Create or find enterprise
    console.log('🏢 Creating/finding enterprise...');
    let enterprise;
    
    try {
      // Try to find existing enterprise
      const existingEnterprise = await query(
        'SELECT id, name, department FROM enterprises WHERE name = $1 AND department = $2',
        [enterpriseName, department]
      );

      if (existingEnterprise.rows.length > 0) {
        enterprise = existingEnterprise.rows[0];
        console.log('✅ Found existing enterprise:', enterprise.id);
      } else {
        // Create new enterprise
        console.log('🆕 Creating new enterprise...');
        const newEnterprise = await query(
          `INSERT INTO enterprises (name, department, contact_email, created_at) 
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
           RETURNING id, name, department`,
          [enterpriseName, department, email]
        );
        enterprise = newEnterprise.rows[0];
        console.log('✅ Created new enterprise:', enterprise.id);
      }
    } catch (enterpriseError) {
      console.error('❌ Enterprise creation error:', enterpriseError);
      return NextResponse.json(
        { error: 'Failed to create enterprise' },
        { status: 500 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed');

    // Create enterprise user
    console.log('👤 Creating enterprise user...');
    try {
      const result = await query(
        `INSERT INTO users (
          name, email, password, role, enterprise_id, approval_status, 
          phone, address, is_active, email_verified, created_at, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id, name, email, role, enterprise_id, approval_status, created_at`,
        [
          name,
          email,
          hashedPassword,
          'enterprise',
          enterprise.id,
          'pending',
          phone || null,
          address || null,
          true,
          false
        ]
      );

      const user = result.rows[0];
      console.log('✅ Enterprise user created:', user.id);

      // Return success response
      return NextResponse.json({
        message: 'Enterprise registration submitted successfully. Awaiting admin approval.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          enterprise_id: user.enterprise_id,
          approval_status: user.approval_status,
          created_at: user.created_at
        },
        enterprise: {
          id: enterprise.id,
          name: enterprise.name,
          department: enterprise.department
        }
      }, { status: 201 });

    } catch (userError) {
      console.error('❌ User creation error:', userError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Enterprise registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}