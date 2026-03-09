'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  MapPin, 
  ArrowLeft,
  Filter,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Complaint } from '@/types';

export default function ComplaintsMap() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'reported' | 'in_progress' | 'resolved'>('all');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    // For new users, show community complaints as examples
    const mockComplaints: Complaint[] = [
      {
        id: '1',
        title: 'Street Light Not Working',
        description: 'The street light has been out for 3 days.',
        location: 'Main Road, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        status: 'in_progress',
        user_id: 'community1',
        created_at: new Date('2026-03-07'),
        updated_at: new Date('2026-03-08'),
        image_url: '/api/images/streetlight.jpg'
      },
      {
        id: '2',
        title: 'Pothole on Highway',
        description: 'Large pothole causing damage to vehicles.',
        location: 'Highway 101, Mile Marker 15',
        latitude: 40.7589,
        longitude: -73.9851,
        status: 'reported',
        user_id: 'community2',
        created_at: new Date('2026-03-09'),
        updated_at: new Date('2026-03-09')
      },
      {
        id: '3',
        title: 'Broken Water Pipe',
        description: 'Water pipe burst near the park entrance.',
        location: 'Central Park Entrance',
        latitude: 40.7829,
        longitude: -73.9654,
        status: 'resolved',
        user_id: 'community3',
        created_at: new Date('2026-03-05'),
        updated_at: new Date('2026-03-06'),
        image_url: '/api/images/waterpipe.jpg'
      }
    ];

    setComplaints(mockComplaints);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'reported':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'in_progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    statusFilter === 'all' || complaint.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
            <Link 
              href="/users-dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Issues Map</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/users-dashboard/complaints/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Map Placeholder */}
          <div className="w-full h-full bg-gray-200 relative overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
              <div className="absolute inset-0 opacity-20">
                {/* Grid pattern to simulate map */}
                <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
                  {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border border-gray-300 border-opacity-30"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Markers */}
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${((complaint.longitude + 74.0060) * 1000) % 80 + 10}%`,
                  top: `${((complaint.latitude - 40.7128) * 1000) % 60 + 20}%`
                }}
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${getMarkerColor(complaint.status)} flex items-center justify-center hover:scale-110 transition-transform`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All Issues</option>
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowList(!showList)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <List className="h-4 w-4 mr-1" />
                  {showList ? 'Hide List' : 'Show List'}
                </button>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Legend</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Reported</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Resolved</span>
                </div>
              </div>
            </div>

            {/* Selected Complaint Popup */}
            {selectedComplaint && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-sm z-30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(selectedComplaint.status)}
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">{selectedComplaint.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className={getStatusBadge(selectedComplaint.status)}>
                      {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{selectedComplaint.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedComplaint.location}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Reported: {selectedComplaint.created_at.toLocaleDateString()}
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Link
                      href={`/users-dashboard/complaints/${selectedComplaint.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        {showList && (
          <div className="w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Community Issues ({filteredComplaints.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Issues reported by community members in your area
              </p>
              
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{complaint.title}</h3>
                      {getStatusIcon(complaint.status)}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{complaint.location}</span>
                      </div>
                      <span className={getStatusBadge(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6 z-30">
        <Link
          href="/users-dashboard/complaints/new"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110"
          title="Report New Issue"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {/* Map Integration Note */}
      <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm z-20">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Map Integration</h4>
        <p className="text-xs text-blue-800">
          This is a mock map view. In production, integrate with Google Maps API or similar service for real interactive maps.
        </p>
      </div>
    </div>
  );
}