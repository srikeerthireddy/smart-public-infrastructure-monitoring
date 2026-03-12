import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Fetch user's complaints
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    const result = await query(
      `SELECT id, title, description, location, latitude, longitude, 
              status, image_url, created_at, updated_at 
       FROM complaints 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json({
      complaints: result.rows
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new complaint
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    const { title, description, location, latitude, longitude, image_url, category } = await request.json();

    // Validate required fields
    if (!title || !description || !location) {
      return NextResponse.json(
        { error: 'Title, description, and location are required' },
        { status: 400 }
      );
    }

    // Insert new complaint into database
    const result = await query(
      `INSERT INTO complaints (title, description, location, latitude, longitude, 
                              image_url, status, user_id, category) 
       VALUES ($1, $2, $3, $4, $5, $6, 'reported', $7, $8) 
       RETURNING id, title, description, location, latitude, longitude, 
                 status, image_url, category, created_at, updated_at`,
      [title, description, location, latitude || null, longitude || null, image_url || null, userId, category || null]
    );

    const newComplaint = result.rows[0];

    return NextResponse.json({
      message: 'Complaint submitted successfully',
      complaint: newComplaint
    }, { status: 201 });

  } catch (error) {
    console.error('Create complaint error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}