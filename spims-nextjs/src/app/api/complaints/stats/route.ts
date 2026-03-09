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

// GET - Fetch user's complaint statistics
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const userId = decoded.userId;

    // Get complaint counts by status
    const result = await query(
      `SELECT 
         COUNT(*) as total_complaints,
         COUNT(CASE WHEN status = 'reported' THEN 1 END) as pending_complaints,
         COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_complaints,
         COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_complaints
       FROM complaints 
       WHERE user_id = $1`,
      [userId]
    );

    const stats = result.rows[0];

    // Get recent complaints (last 5)
    const recentResult = await query(
      `SELECT id, title, description, location, status, created_at 
       FROM complaints 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    return NextResponse.json({
      stats: {
        totalComplaints: parseInt(stats.total_complaints),
        pendingComplaints: parseInt(stats.pending_complaints),
        inProgressComplaints: parseInt(stats.in_progress_complaints),
        resolvedComplaints: parseInt(stats.resolved_complaints)
      },
      recentComplaints: recentResult.rows
    });

  } catch (error) {
    console.error('Get stats error:', error);
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