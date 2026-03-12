'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Camera,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Complaint, StatusUpdate } from '@/types';

export default function ComplaintDetail() {
  const params = useParams();
  const complaintId = params.id as string;
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/complaints/${complaintId}`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const c = data.complaint;
          setComplaint({
            id: c.id,
            title: c.title,
            description: c.description,
            location: c.location,
            latitude: c.latitude,
            longitude: c.longitude,
            status: c.status,
            user_id: c.user_name,
            created_at: new Date(c.created_at),
            updated_at: new Date(c.updated_at),
            image_url: c.image_url
          });
          setStatusUpdates((data.statusUpdates || []).map((s: any) => ({
            id: s.id,
            complaint_id: complaintId,
            status: s.new_status,
            updated_by: s.updated_by_name,
            updated_at: new Date(s.created_at),
            comment: s.notes
          })));
        }
      } catch (error) {
        console.error('Failed to load complaint:', error);
      }
      setLoading(false);
    };
    fetchComplaintDetails();
  }, [complaintId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'border-red-500';
      case 'in_progress':
        return 'border-yellow-500';
      case 'resolved':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Complaint Not Found</h2>
          <p className="text-gray-600 mb-4">The complaint you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/users-dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/users-dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Complaint Details</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Complaint Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {getStatusIcon(complaint.status)}
                <h2 className="ml-2 text-2xl font-bold text-gray-900">{complaint.title}</h2>
                <span className={`ml-4 ${getStatusBadge(complaint.status)}`}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Reported: {complaint.created_at.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Updated: {complaint.updated_at.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>ID: #{complaint.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{complaint.description}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-700">{complaint.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              {complaint.image_url ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Photo Evidence</h3>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Photo: streetlight.jpg</p>
                        <p className="text-sm text-gray-500">Click to view full size</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Photo Evidence</h3>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No photo provided</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Status Timeline
          </h3>
          
          <div className="space-y-6">
            {statusUpdates.map((update, index) => (
              <div key={update.id} className="relative">
                {/* Timeline line */}
                {index < statusUpdates.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 bg-white flex items-center justify-center ${getStatusColor(update.status)}`}>
                    {getStatusIcon(update.status)}
                  </div>
                  
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {update.status.replace('_', ' ').charAt(0).toUpperCase() + update.status.replace('_', ' ').slice(1)}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {update.updated_at.toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">Updated by: {update.updated_by}</p>
                    
                    {update.comment && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{update.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/complaints/map"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
          >
            <MapPin className="h-5 w-5 mr-2" />
            View on Map
          </Link>
          <Link
            href="/users-dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}