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

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    verifyAdminToken(request);

    // Get system statistics (fallback if view doesn't exist)
    let stats;
    try {
      const statsResult = await query('SELECT * FROM admin_system_stats');
      stats = statsResult.rows[0];
    } catch (error) {
      console.log('Admin stats view not found, using direct queries');
      // Fallback to direct queries
      const [publicUsers, enterpriseUsers, pendingEnterprises, totalComplaints, totalEnterprises] = await Promise.all([
        query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['public']),
        query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['enterprise']),
        query('SELECT COUNT(*) as count FROM users WHERE role = $1 AND approval_status = $2', ['enterprise', 'pending']),
        query('SELECT COUNT(*) as count FROM complaints'),
        query('SELECT COUNT(*) as count FROM enterprises')
      ]);
      
      stats = {
        total_public_users: parseInt(publicUsers.rows[0].count),
        total_enterprise_users: parseInt(enterpriseUsers.rows[0].count),
        pending_enterprises: parseInt(pendingEnterprises.rows[0].count),
        approved_enterprises: parseInt(enterpriseUsers.rows[0].count) - parseInt(pendingEnterprises.rows[0].count),
        rejected_enterprises: 0,
        total_complaints: parseInt(totalComplaints.rows[0].count),
        pending_complaints: 0,
        in_progress_complaints: 0,
        resolved_complaints: 0,
        total_enterprises: parseInt(totalEnterprises.rows[0].count),
        total_workers: 0,
        total_assignments: 0
      };
    }

    // Get recent activity (fallback if view doesn't exist)
    let recentActivity;
    try {
      const activityResult = await query('SELECT * FROM admin_recent_activity LIMIT 20');
      recentActivity = activityResult.rows;
    } catch (error) {
      console.log('Admin activity view not found, using direct queries');
      // Fallback to direct queries
      const [userActivity, complaintActivity, enterpriseActivity] = await Promise.all([
        query(`
          SELECT 
            'user_registration' as activity_type,
            name as entity_name,
            email as entity_email,
            role::text as entity_role,
            created_at as activity_time,
            'New user registered' as description
          FROM users 
          WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
          ORDER BY created_at DESC
          LIMIT 10
        `),
        query(`
          SELECT 
            'complaint_submitted' as activity_type,
            title as entity_name,
            location as entity_email,
            'public' as entity_role,
            created_at as activity_time,
            'New complaint submitted' as description
          FROM complaints 
          WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
          ORDER BY created_at DESC
          LIMIT 10
        `),
        query(`
          SELECT 
            'enterprise_registration' as activity_type,
            name as entity_name,
            contact_email as entity_email,
            'enterprise' as entity_role,
            created_at as activity_time,
            'New enterprise registered' as description
          FROM enterprises 
          WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
          ORDER BY created_at DESC
          LIMIT 10
        `)
      ]);
      
      recentActivity = [
        ...userActivity.rows,
        ...complaintActivity.rows,
        ...enterpriseActivity.rows
      ].sort((a, b) => new Date(b.activity_time).getTime() - new Date(a.activity_time).getTime()).slice(0, 20);
    }

    // Get monthly complaint trends
    const trendsResult = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as complaint_count,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count
      FROM complaints 
      WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `);
    const monthlyTrends = trendsResult.rows;

    // Get department performance
    const deptResult = await query(`
      SELECT 
        e.department,
        COUNT(DISTINCT ca.complaint_id) as assigned_complaints,
        COUNT(DISTINCT CASE WHEN c.status = 'resolved' THEN ca.complaint_id END) as resolved_complaints,
        ROUND(
          COUNT(DISTINCT CASE WHEN c.status = 'resolved' THEN ca.complaint_id END)::numeric / 
          NULLIF(COUNT(DISTINCT ca.complaint_id), 0) * 100, 
          2
        ) as resolution_rate
      FROM enterprises e
      LEFT JOIN complaint_assignments ca ON e.id = ca.enterprise_id
      LEFT JOIN complaints c ON ca.complaint_id = c.id
      GROUP BY e.department
      ORDER BY resolution_rate DESC NULLS LAST
    `);
    const departmentPerformance = deptResult.rows;

    return NextResponse.json({
      stats,
      recentActivity,
      monthlyTrends,
      departmentPerformance
    });

  } catch (error: any) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'No token provided' || error.message === 'Admin access required' ? 401 : 500 }
    );
  }
}