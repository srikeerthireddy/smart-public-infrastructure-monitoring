// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'enterprise' | 'admin';
  created_at: Date;
}

// Complaint Types
export interface Complaint {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'reported' | 'in_progress' | 'resolved';
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: File;
}

// Enterprise Types
export interface Enterprise {
  id: string;
  name: string;
  department: string;
  contact_email: string;
}

// Assignment Types
export interface Assignment {
  id: string;
  complaint_id: string;
  enterprise_id: string;
  worker_name: string;
  status: string;
}

// Status Update Types
export interface StatusUpdate {
  id: string;
  complaint_id: string;
  status: 'reported' | 'in_progress' | 'resolved';
  updated_by: string;
  updated_at: Date;
  comment?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  complaintsThisMonth: number;
}