import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

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

// GET - Fetch complaints with coordinates for map display (requires auth)
export async function GET(request: NextRequest) {
  try {
    verifyToken(request);

    const result = await query(
      `SELECT 
        c.id,
        c.title,
        c.description,
        c.location,
        c.latitude,
        c.longitude,
        c.status,
        c.created_at,
        c.updated_at
       FROM complaints c
       WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
       ORDER BY c.created_at DESC
       LIMIT 100`
    );

    return NextResponse.json({
      complaints: result.rows
    });

  } catch (error) {
    console.error('Get map complaints error:', error);
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
