'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function Analytics() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Mock analytics data
  const analyticsData = {
    totalReports: 5,
    resolvedReports: 3,
    pendingReports: 2,
    averageResolutionTime: '4.2 days',
    mostReportedCategory: 'Street Lights',
    recentActivity: [
      { date: '2026-03-08', reports: 2 },
      { date: '2026-03-07', reports: 1 },
      { date: '2026-03-06', reports: 0 },
      { date: '2026-03-05', reports: 1 },
      { date: '2026-03-04', reports: 1 },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/users-dashboard"
                className="mr-4 p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {user.name}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {analyticsData.totalReports}
                </p>
                <p className="text-gray-600 text-sm">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-12 h-12 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {analyticsData.resolvedReports}
                </p>
                <p className="text-gray-600 text-sm">Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yellow-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-12 h-12 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {analyticsData.pendingReports}
                </p>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-12 h-12 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {analyticsData.averageResolutionTime}
                </p>
                <p className="text-gray-600 text-sm">Avg Resolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{day.date}</span>
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      <span className="text-white text-sm font-bold">{day.reports}</span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {day.reports === 1 ? 'report' : 'reports'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Report Categories
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-yellow-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Street Lights</span>
                </div>
                <span className="text-purple-600 font-bold">40%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Road Issues</span>
                </div>
                <span className="text-purple-600 font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Drainage</span>
                </div>
                <span className="text-purple-600 font-bold">20%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Others</span>
                </div>
                <span className="text-purple-600 font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-indigo-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-2">85%</div>
              <div className="text-gray-700 text-sm">Resolution Rate</div>
              <div className="text-green-600 text-xs mt-1">↑ 12% from last month</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-2">3.2</div>
              <div className="text-gray-700 text-sm">Avg Response Time (days)</div>
              <div className="text-green-600 text-xs mt-1">↓ 0.8 days improved</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-2">92%</div>
              <div className="text-gray-700 text-sm">User Satisfaction</div>
              <div className="text-green-600 text-xs mt-1">↑ 5% from last month</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}