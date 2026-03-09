'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Upload, 
  X,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { ComplaintFormData } from '@/types';

export default function NewComplaint() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: '',
    description: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    image: undefined
  });

  const [errors, setErrors] = useState<Partial<ComplaintFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ComplaintFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationPermission('granted');
          
          // Reverse geocoding (mock implementation)
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          alert('Unable to get your location. Please enter the location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ComplaintFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const complaintData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        image_url: selectedImage ? URL.createObjectURL(selectedImage) : undefined
      };

      try {
        // Try database submission first
        const response = await fetch('/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(complaintData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Database complaint submitted:', data.complaint);
          
          // Redirect to dashboard with success message
          router.push('/users-dashboard?success=complaint-submitted');
          return;
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Database submission failed');
        }
      } catch (dbError) {
        console.error('Database submission failed, using localStorage:', dbError);
        
        // Fall back to localStorage
        const currentUser = JSON.parse(localStorage.getItem('spims_current_user') || '{}');
        
        const newComplaint = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude || 0,
          longitude: formData.longitude || 0,
          status: 'reported',
          user_id: currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_url: selectedImage ? URL.createObjectURL(selectedImage) : null
        };
        
        // Get existing complaints
        const existingComplaints = JSON.parse(localStorage.getItem('spims_complaints') || '[]');
        
        // Add new complaint
        const updatedComplaints = [...existingComplaints, newComplaint];
        localStorage.setItem('spims_complaints', JSON.stringify(updatedComplaints));
        
        console.log('LocalStorage complaint submitted:', newComplaint);
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to dashboard with success message
        router.push('/users-dashboard?success=complaint-submitted');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const issueTypes = [
    'Street Light Not Working',
    'Pothole',
    'Broken Water Pipe',
    'Damaged Road',
    'Garbage Collection Issue',
    'Traffic Signal Problem',
    'Sidewalk Damage',
    'Other'
  ];

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
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Report New Issue</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type *
              </label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an issue type</option>
                {issueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in detail..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter the location or address"
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Current
                </button>
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              {formData.latitude && formData.longitude && (
                <p className="mt-1 text-sm text-green-600">
                  Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 mx-auto object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {!imagePreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photo
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/users-dashboard"
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Tips for Better Reports</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Be specific about the location and what's wrong</li>
            <li>• Include photos if possible - they help authorities understand the issue</li>
            <li>• Use your current location for accurate positioning</li>
            <li>• Check if someone else has already reported the same issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}