'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Plus, MapPin, BarChart3, Settings, User } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import LogoutButton from '@/components/LogoutButton';

export default function UsersDashboard() {
  const { user, isLoading, logout } = useUser();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check for success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'complaint-submitted') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      // Clean up URL
      window.history.replaceState({}, '', '/users-dashboard');
    }

    // Load complaints from database or localStorage
    const loadComplaints = async () => {
      try {
        // Try database first
        const response = await fetch('/api/complaints/stats');
        if (response.ok) {
          const data = await response.json();
          console.log('Database stats loaded:', data);
          setStats(data.stats);
          setRecentComplaints(data.recentComplaints);
          return;
        }
      } catch (error) {
        console.error('Database stats failed, using localStorage:', error);
      }
      
      // Fall back to localStorage
      const complaints = JSON.parse(localStorage.getItem('spims_complaints') || '[]');
      const userComplaints = complaints.filter((c: any) => c.user_id === user.id);
      
      // Calculate stats
      const newStats = {
        totalComplaints: userComplaints.length,
        pendingComplaints: userComplaints.filter((c: any) => c.status === 'reported').length,
        inProgressComplaints: userComplaints.filter((c: any) => c.status === 'in_progress').length,
        resolvedComplaints: userComplaints.filter((c: any) => c.status === 'resolved').length
      };
      
      setStats(newStats);
      
      // Get recent complaints (last 5)
      const recent = userComplaints
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      setRecentComplaints(recent);
    };

    if (user.id) {
      loadComplaints();
    }
  }, [user]);

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">SPIMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-semibold text-base">Welcome, {user.name}!</span>
              <Link 
                href="/users-dashboard/settings"
                className="p-3 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:shadow-md"
                title="Settings"
              >
                <Settings className="h-6 w-6" />
              </Link>
              <Link 
                href="/users-dashboard/profile"
                className="p-3 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:shadow-md"
                title="Profile"
              >
                <User className="h-6 w-6" />
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-green-800 font-semibold">Issue reported successfully!</p>
                <p className="text-green-700 text-sm">Your complaint has been submitted and will be reviewed by the authorities.</p>
              </div>
            </div>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.totalComplaints}
                </p>
                <p className="text-gray-700 text-sm font-medium">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {stats.pendingComplaints}
                </p>
                <p className="text-gray-700 text-sm font-medium">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats.inProgressComplaints}
                </p>
                <p className="text-gray-700 text-sm font-medium">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.resolvedComplaints}
                </p>
                <p className="text-gray-700 text-sm font-medium">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/users-dashboard/complaints/new" className="group">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="flex items-center">
                <Plus className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Report Issue</h3>
                  <p className="text-blue-100 text-base">Submit a new complaint</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/users-dashboard/complaints/map" className="group">
            <div className="bg-gradient-to-r from-green-600 via-green-700 to-teal-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-1">View Map</h3>
                  <p className="text-green-100 text-base">See issues near you</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/users-dashboard/analytics" className="group">
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Analytics</h3>
                  <p className="text-purple-100 text-base">View your reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2 mr-3">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            Recent Activity
          </h3>
          
          {stats.totalComplaints === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-700 mb-3">No reports yet</h4>
              <p className="text-gray-600 mb-6 text-base">Start by reporting your first infrastructure issue</p>
              <Link 
                href="/users-dashboard/complaints/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                Report Your First Issue
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint, index) => (
                <div key={complaint.id || index} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200">
                  <div className={`rounded-lg w-10 h-10 flex items-center justify-center mr-4 shadow-lg ${
                    complaint.status === 'resolved' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : complaint.status === 'in_progress'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-base">{complaint.title}</h4>
                    <p className="text-gray-600 text-sm">{complaint.location} • Reported {new Date(complaint.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md ${
                    complaint.status === 'resolved' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : complaint.status === 'in_progress'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    {complaint.status === 'reported' ? 'Pending' : 
                     complaint.status === 'in_progress' ? 'In Progress' : 'Resolved'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Link 
        href="/users-dashboard/complaints/new"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white p-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20"
        title="Report New Issue"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}