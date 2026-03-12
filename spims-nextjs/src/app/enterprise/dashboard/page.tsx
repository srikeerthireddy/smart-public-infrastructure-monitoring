'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ClipboardList, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  User,
  LogOut,
  Mail,
  Phone,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalWorkers: number;
  activeWorkers: number;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'reported' | 'in_progress' | 'resolved';
  priority: number;
  category?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  assigned_at?: string;
  assignment_notes?: string;
  priority_level?: number;
  assigned_worker_name?: string;
}

interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  enterprise: {
    name: string;
    department: string;
  };
}

export default function EnterpriseDashboard() {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalWorkers: 0,
    activeWorkers: 0
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'reported' | 'in_progress' | 'resolved'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching enterprise dashboard data...');
      
      // For now, let's use mock data since we need to implement the enterprise APIs
      // Fetch complaints data
      const complaintsResponse = await fetch('/api/enterprise/complaints', { credentials: 'include' });

      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json();
        setComplaints(complaintsData.complaints || []);
        
        // Calculate stats from complaints
        const totalComplaints = complaintsData.complaints?.length || 0;
        const pendingComplaints = complaintsData.complaints?.filter((c: Complaint) => c.status === 'reported').length || 0;
        const inProgressComplaints = complaintsData.complaints?.filter((c: Complaint) => c.status === 'in_progress').length || 0;
        const resolvedComplaints = complaintsData.complaints?.filter((c: Complaint) => c.status === 'resolved').length || 0;
        
        setStats({
          totalComplaints,
          pendingComplaints,
          inProgressComplaints,
          resolvedComplaints,
          totalWorkers: 5, // Mock data
          activeWorkers: 4  // Mock data
        });
      } else {
        // Fallback to mock data if API fails
        setComplaints([]);
        setStats({
          totalComplaints: 0,
          pendingComplaints: 0,
          inProgressComplaints: 0,
          resolvedComplaints: 0,
          totalWorkers: 5,
          activeWorkers: 4
        });
      }

      // Set mock user data
      setUser({
        id: '1',
        name: 'Enterprise User',
        email: 'enterprise@example.com',
        enterprise: {
          name: 'City Public Works',
          department: 'Infrastructure'
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data
      setComplaints([]);
      setStats({
        totalComplaints: 0,
        pendingComplaints: 0,
        inProgressComplaints: 0,
        resolvedComplaints: 0,
        totalWorkers: 5,
        activeWorkers: 4
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/enterprise';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/enterprise/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          complaintId,
          status: newStatus,
          notes: `Status updated to ${newStatus} by enterprise`
        }),
      });

      if (response.ok) {
        // Refresh data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filter === 'all' || complaint.status === filter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Enterprise Dashboard</h1>
                {user && (
                  <p className="text-sm text-gray-600">
                    {user.enterprise.name} - {user.enterprise.department}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Complaints */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-red-600">{stats.pendingComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgressComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/enterprise/workers"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Workers</h3>
                <p className="text-sm text-gray-600">{stats.activeWorkers} active workers</p>
              </div>
            </Link>

            <Link
              href="/enterprise/assignments"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ClipboardList className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Assign Tasks</h3>
                <p className="text-sm text-gray-600">Assign complaints to workers</p>
              </div>
            </Link>

            <Link
              href="/enterprise/reports"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ClipboardList className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-600">Performance analytics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Enhanced Complaints Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Complaints Management</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage complaints from public users</p>
              </div>
              
              {/* Filters and Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status ({filteredComplaints.length})</option>
                    <option value="reported">Reported ({complaints.filter(c => c.status === 'reported').length})</option>
                    <option value="in_progress">In Progress ({complaints.filter(c => c.status === 'in_progress').length})</option>
                    <option value="resolved">Resolved ({complaints.filter(c => c.status === 'resolved').length})</option>
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
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 'No complaints have been submitted yet.' : `No ${filter.replace('_', ' ')} complaints found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
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
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {complaint.priority && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
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
                        {complaint.assigned_worker_name && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center text-sm text-blue-800">
                              <Users className="w-4 h-4 mr-2" />
                              <span>Assigned to: <strong>{complaint.assigned_worker_name}</strong></span>
                              {complaint.assigned_at && (
                                <span className="ml-2 text-blue-600">
                                  on {new Date(complaint.assigned_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {complaint.assignment_notes && (
                              <p className="text-sm text-blue-700 mt-2">{complaint.assignment_notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowComplaintModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        
                        {complaint.status === 'reported' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'in_progress')}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                          >
                            Start Work
                          </button>
                        )}
                        
                        {complaint.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}