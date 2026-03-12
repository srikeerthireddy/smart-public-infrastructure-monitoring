'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  Building2, 
  ClipboardList, 
  TrendingUp,
  CheckCircle, 
  Clock, 
  AlertTriangle,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  MoreVertical,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

interface AdminStats {
  total_public_users: number;
  total_enterprise_users: number;
  pending_enterprises: number;
  approved_enterprises: number;
  rejected_enterprises: number;
  total_complaints: number;
  pending_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  total_enterprises: number;
  total_workers: number;
  total_assignments: number;
}

interface RecentActivity {
  activity_type: string;
  entity_name: string;
  entity_email: string;
  entity_role: string;
  activity_time: string;
  description: string;
}

interface Enterprise {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  registration_date: string;
  enterprise_name: string;
  department: string;
  enterprise_email: string;
  approved_by_name?: string;
  approved_at?: string;
  user_address?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'enterprise';
  phone?: string;
  approval_status: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  enterprise_name?: string;
  enterprise_department?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingEnterprises, setPendingEnterprises] = useState<Enterprise[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allComplaints, setAllComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'enterprises' | 'users' | 'analytics'>('overview');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [enterprisesList, setEnterprisesList] = useState<{ id: string; name: string; department: string }[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<any[]>([]);
  const [assigningEnterpriseId, setAssigningEnterpriseId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, enterprisesResponse, usersResponse, complaintsResponse] = await Promise.all([
        fetch('/api/admin/stats', { credentials: 'include' }),
        fetch('/api/admin/enterprises', { credentials: 'include' }),
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/complaints', { credentials: 'include' })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setRecentActivity(statsData.recentActivity);
      }

      if (enterprisesResponse.ok) {
        const enterprisesData = await enterprisesResponse.json();
        console.log('📊 Enterprises data:', enterprisesData); // Debug log
        setPendingEnterprises(
          enterprisesData.enterprises.filter((e: Enterprise) => e.approval_status === 'pending')
        );
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setAllUsers(usersData.users);
      }

      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json();
        setAllComplaints(complaintsData.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterpriseAction = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/enterprises', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action,
          notes: `Enterprise ${action}ed by admin`
        }),
      });

      if (response.ok) {
        // Refresh data
        fetchDashboardData();
      }
    } catch (error) {
      console.error(`Error ${action}ing enterprise:`, error);
    }
  };

  const openAssignModal = async (complaint: any) => {
    setSelectedComplaint(complaint);
    setAssignModalOpen(true);
    setAssignError('');
    setAssigningEnterpriseId('');
    try {
      const res = await fetch('/api/admin/enterprises/list', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEnterprisesList(data.enterprises || []);
      }
    } catch (e) {
      setAssignError('Failed to load enterprises');
    }
  };

  const handleAssignEnterprise = async () => {
    if (!selectedComplaint || !assigningEnterpriseId) {
      setAssignError('Please select an enterprise');
      return;
    }
    setAssignLoading(true);
    setAssignError('');
    try {
      const res = await fetch('/api/admin/complaints', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          enterpriseId: assigningEnterpriseId,
          notes: 'Assigned by admin'
        }),
      });
      if (res.ok) {
        setAssignModalOpen(false);
        setSelectedComplaint(null);
        fetchDashboardData();
      } else {
        const err = await res.json();
        setAssignError(err.error || 'Assignment failed');
      }
    } catch (e) {
      setAssignError('Assignment failed');
    } finally {
      setAssignLoading(false);
    }
  };

  const openHistoryModal = async (complaint: any) => {
    setSelectedComplaint(complaint);
    setHistoryModalOpen(true);
    setStatusUpdates([]);
    try {
      const res = await fetch(`/api/admin/complaints/status-updates/${complaint.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setStatusUpdates(data.statusUpdates || []);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const openDetailsModal = (complaint: any) => {
    setSelectedComplaint(complaint);
    setDetailsModalOpen(true);
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'verify_email') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action,
          notes: `User ${action}d by admin`
        }),
      });

      if (response.ok) {
        // Refresh data
        fetchDashboardData();
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-neutral-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-neutral-900 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Admin Dashboard</h1>
                <p className="text-sm text-neutral-600 mt-0.5">System Administration Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-900">System Administrator</p>
                <p className="text-xs text-neutral-600">admin@spims.gov</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'complaints', label: 'Complaints', icon: ClipboardList },
              { id: 'enterprises', label: 'Enterprises', icon: Building2 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {(stats?.total_public_users || 0) + (stats?.total_enterprise_users || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-neutral-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">Pending Approvals</p>
                    <p className="text-2xl font-bold text-amber-600">{stats?.pending_enterprises || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">Total Complaints</p>
                    <p className="text-2xl font-bold text-neutral-900">{stats?.total_complaints || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-neutral-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-1">System Health</p>
                    <p className="text-2xl font-bold text-emerald-600">98%</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enterprise Approvals - Always Show */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Enterprise Approvals</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage enterprise registrations and approvals</p>
                    </div>
                    <button 
                      onClick={fetchDashboardData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {/* Show all enterprise users, not just pending */}
                  {allUsers.filter(user => user.role === 'enterprise').length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Enterprise Registrations</h3>
                      <p className="text-gray-600">No enterprises have registered yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allUsers.filter(user => user.role === 'enterprise').map((enterprise) => (
                        <div key={enterprise.id} className={`border rounded-lg p-4 ${
                          enterprise.approval_status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                          enterprise.approval_status === 'approved' ? 'bg-green-50 border-green-200' :
                          'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900">
                                  {enterprise.enterprise_name || enterprise.name}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  enterprise.approval_status === 'pending' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  enterprise.approval_status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                  'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                  {enterprise.approval_status.toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  enterprise.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {enterprise.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {enterprise.enterprise_department || 'Department'} Department
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Contact: {enterprise.name} ({enterprise.email})
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Registered: {new Date(enterprise.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {enterprise.approval_status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleEnterpriseAction(enterprise.id, 'approve')}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleEnterpriseAction(enterprise.id, 'reject')}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                                  >
                                    <UserX className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              {enterprise.approval_status === 'approved' && !enterprise.is_active && (
                                <button
                                  onClick={() => handleUserAction(enterprise.id, 'activate')}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Activate
                                </button>
                              )}
                              {enterprise.approval_status === 'approved' && enterprise.is_active && (
                                <button
                                  onClick={() => handleUserAction(enterprise.id, 'deactivate')}
                                  className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                                >
                                  Deactivate
                                </button>
                              )}
                              <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50 transition-colors flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.slice(0, 8).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.activity_type === 'user_registration' ? 'bg-blue-100' :
                          activity.activity_type === 'complaint_submitted' ? 'bg-orange-100' :
                          'bg-green-100'
                        }`}>
                          {activity.activity_type === 'user_registration' ? (
                            <Users className="w-4 h-4 text-blue-600" />
                          ) : activity.activity_type === 'complaint_submitted' ? (
                            <ClipboardList className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Building2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.entity_name} • {new Date(activity.activity_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
            )}

            {activeTab === 'complaints' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">All User Complaints</h2>
                        <p className="text-sm text-gray-600 mt-1">Monitor and manage all complaints from public users</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Status</option>
                            <option>Reported</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                          </select>
                        </div>
                        <button 
                          onClick={fetchDashboardData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {allComplaints.length === 0 ? (
                      <div className="text-center py-12">
                        <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Found</h3>
                        <p className="text-gray-600">No complaints have been submitted by users yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Complaints Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                              <div>
                                <p className="text-sm text-red-600">Reported</p>
                                <p className="text-2xl font-bold text-red-700">
                                  {allComplaints.filter(c => c.status === 'reported').length}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                              <div>
                                <p className="text-sm text-yellow-600">In Progress</p>
                                <p className="text-2xl font-bold text-yellow-700">
                                  {allComplaints.filter(c => c.status === 'in_progress').length}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                              <div>
                                <p className="text-sm text-green-600">Resolved</p>
                                <p className="text-2xl font-bold text-green-700">
                                  {allComplaints.filter(c => c.status === 'resolved').length}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <ClipboardList className="w-8 h-8 text-blue-600 mr-3" />
                              <div>
                                <p className="text-sm text-blue-600">Total</p>
                                <p className="text-2xl font-bold text-blue-700">{allComplaints.length}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Complaints List */}
                        <div className="space-y-4">
                          {allComplaints.slice(0, 20).map((complaint) => (
                            <div key={complaint.id} className={`border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                              complaint.status === 'reported' ? 'border-red-200 bg-red-50' :
                              complaint.status === 'in_progress' ? 'border-yellow-200 bg-yellow-50' :
                              'border-green-200 bg-green-50'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                          complaint.status === 'reported' ? 'bg-red-100 text-red-800 border-red-200' :
                                          complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                          'bg-green-100 text-green-800 border-green-200'
                                        }`}>
                                          {complaint.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        {complaint.priority && (
                                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                            Priority {complaint.priority}
                                          </span>
                                        )}
                                      </div>
                                      
                                      {complaint.category && (
                                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full mb-2">
                                          {complaint.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  <p className="text-gray-700 mb-4 leading-relaxed">{complaint.description}</p>
                                  
                                  {/* User Information */}
                                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Reported by:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{complaint.user_name}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{complaint.user_email}</span>
                                      </div>
                                      {complaint.user_phone && (
                                        <div className="flex items-center">
                                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                          <span>{complaint.user_phone}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Location and Timing */}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      <span>{complaint.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      <span>Reported: {new Date(complaint.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {complaint.updated_at !== complaint.created_at && (
                                      <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Updated: {new Date(complaint.updated_at).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Assignment Info */}
                                  {complaint.assigned_enterprise ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                      <div className="flex items-center text-sm text-blue-800">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        <span>Assigned to: <strong>{complaint.assigned_enterprise}</strong></span>
                                        {complaint.enterprise_department && (
                                          <span className="ml-2 text-blue-600">
                                            ({complaint.enterprise_department})
                                          </span>
                                        )}
                                      </div>
                                      {complaint.assigned_worker_name && (
                                        <div className="flex items-center text-sm text-blue-700 mt-1">
                                          <Users className="w-4 h-4 mr-2" />
                                          <span>Worker: {complaint.assigned_worker_name}</span>
                                        </div>
                                      )}
                                      {complaint.assignment_notes && (
                                        <p className="text-sm text-blue-700 mt-2">{complaint.assignment_notes}</p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        <span>Not assigned to any enterprise yet</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="ml-6 flex flex-col space-y-2">
                                  <button
                                    onClick={() => openDetailsModal(complaint)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                  >
                                    View Details
                                  </button>
                                  
                                  {!complaint.assigned_enterprise && (
                                    <button
                                      onClick={() => openAssignModal(complaint)}
                                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                      Assign Enterprise
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => openHistoryModal(complaint)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                  >
                                    View History
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {allComplaints.length > 20 && (
                          <div className="text-center pt-6">
                            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                              Load More Complaints
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'enterprises' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Enterprise Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage enterprise registrations and approvals</p>
            </div>
            <div className="p-6">
              {pendingEnterprises.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Enterprises</h3>
                  <p className="text-gray-600">All enterprise registrations have been processed.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingEnterprises.map((enterprise) => (
                    <div key={enterprise.user_id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{enterprise.enterprise_name}</h3>
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                              {enterprise.approval_status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{enterprise.department} Department</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Person</h4>
                              <p className="text-sm text-gray-600">{enterprise.user_name}</p>
                              <p className="text-sm text-gray-600">{enterprise.user_email}</p>
                              {enterprise.user_phone && (
                                <p className="text-sm text-gray-600">{enterprise.user_phone}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Details</h4>
                              <p className="text-sm text-gray-600">
                                Registered: {new Date(enterprise.registration_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Time: {new Date(enterprise.registration_date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          
                          {enterprise.user_address && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Address</h4>
                              <p className="text-sm text-gray-600">{enterprise.user_address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEnterpriseAction(enterprise.user_id, 'approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Approve Enterprise</span>
                        </button>
                        <button
                          onClick={() => handleEnterpriseAction(enterprise.user_id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Reject Application</span>
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage all system users</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.enterprise_name && (
                                <div className="text-xs text-gray-400">{user.enterprise_name}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'enterprise' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                              user.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.approval_status}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!user.is_active && (
                              <button className="text-green-600 hover:text-green-900 text-xs">
                                Activate
                              </button>
                            )}
                            {user.is_active && (
                              <button className="text-red-600 hover:text-red-900 text-xs">
                                Deactivate
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-900 text-xs">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Analytics</h2>
                <p className="text-sm text-gray-600 mt-1">Comprehensive system performance and usage analytics</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* User Growth */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-blue-900">User Growth</h3>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {(stats?.total_public_users || 0) + (stats?.total_enterprise_users || 0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                  </div>

                  {/* Complaint Resolution Rate */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-green-900">Resolution Rate</h3>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {stats?.total_complaints && stats.total_complaints > 0 ? 
                        Math.round(((stats?.resolved_complaints || 0) / stats.total_complaints) * 100) : 0}%
                    </p>
                    <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                  </div>

                  {/* Average Response Time */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-orange-900">Avg Response</h3>
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">2.4h</p>
                    <p className="text-xs text-orange-600 mt-1">-0.5h from last month</p>
                  </div>

                  {/* System Uptime */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-purple-900">System Uptime</h3>
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">99.8%</p>
                    <p className="text-xs text-purple-600 mt-1">+0.2% from last month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Public Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.total_public_users || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.total_public_users || 0) / Math.max((stats?.total_public_users || 0) + (stats?.total_enterprise_users || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Enterprise Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.total_enterprise_users || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.total_enterprise_users || 0) / Math.max((stats?.total_public_users || 0) + (stats?.total_enterprise_users || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Pending Approvals</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.pending_enterprises || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.pending_enterprises || 0) / Math.max((stats?.total_enterprise_users || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complaint Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Complaint Status</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Reported</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.pending_complaints || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.pending_complaints || 0) / Math.max((stats?.total_complaints || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">In Progress</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.in_progress_complaints || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.in_progress_complaints || 0) / Math.max((stats?.total_complaints || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Resolved</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{stats?.resolved_complaints || 0}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 ml-4">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{
                              width: `${((stats?.resolved_complaints || 0) / Math.max((stats?.total_complaints || 0), 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Latest 30 days activity breakdown</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* User Registrations */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {recentActivity.filter(a => a.activity_type === 'user_registration').length}
                    </h4>
                    <p className="text-sm text-gray-600">New User Registrations</p>
                  </div>

                  {/* Complaint Submissions */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ClipboardList className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {recentActivity.filter(a => a.activity_type === 'complaint_submitted').length}
                    </h4>
                    <p className="text-sm text-gray-600">Complaint Submissions</p>
                  </div>

                  {/* Enterprise Registrations */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {recentActivity.filter(a => a.activity_type === 'enterprise_registration').length}
                    </h4>
                    <p className="text-sm text-gray-600">Enterprise Registrations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export and Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Reports & Export</h3>
                <p className="text-sm text-gray-600 mt-1">Generate and download system reports</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">User Report</span>
                  </button>
                  
                  <button className="flex items-center justify-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Complaint Report</span>
                  </button>
                  
                  <button className="flex items-center justify-center px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Enterprise Report</span>
                  </button>
                  
                  <button className="flex items-center justify-center px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Analytics Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Assign Enterprise Modal */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign Enterprise</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign &quot;{selectedComplaint.title}&quot; to an enterprise
            </p>
            {assignError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{assignError}</div>
            )}
            <select
              value={assigningEnterpriseId}
              onChange={(e) => setAssigningEnterpriseId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
            >
              <option value="">Select enterprise...</option>
              {enterprisesList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.department})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setAssignModalOpen(false); setSelectedComplaint(null); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignEnterprise}
                disabled={assignLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {assignLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedComplaint.title}</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
              <p><strong>Description:</strong> {selectedComplaint.description || 'N/A'}</p>
              <p><strong>Reported by:</strong> {selectedComplaint.user_name || selectedComplaint.reporter_name} ({selectedComplaint.user_email || selectedComplaint.reporter_email})</p>
              {selectedComplaint.latitude && (
                <p><strong>Location:</strong> {selectedComplaint.latitude}, {selectedComplaint.longitude}</p>
              )}
              {selectedComplaint.reported_at && (
                <p><strong>Reported:</strong> {new Date(selectedComplaint.reported_at).toLocaleString()}</p>
              )}
              {selectedComplaint.assigned_enterprise && (
                <p><strong>Assigned to:</strong> {selectedComplaint.assigned_enterprise} {selectedComplaint.enterprise_department && `(${selectedComplaint.enterprise_department})`}</p>
              )}
            </div>
            <button
              onClick={() => { setDetailsModalOpen(false); setSelectedComplaint(null); }}
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {historyModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status History</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedComplaint.title}</p>
            <div className="space-y-2">
              {statusUpdates.length === 0 ? (
                <p className="text-gray-500 text-sm">No status updates yet.</p>
              ) : (
                statusUpdates.map((u: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p><strong>{u.old_status}</strong> → <strong>{u.new_status}</strong></p>
                    {u.notes && <p className="text-gray-600 mt-1">{u.notes}</p>}
                    <p className="text-gray-500 mt-1 text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleString() : ''}
                      {u.updated_by_name && ` by ${u.updated_by_name}`}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => { setHistoryModalOpen(false); setSelectedComplaint(null); }}
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}