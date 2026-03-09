// API service utilities for SPIMS

const API_BASE_URL = '/api';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Authentication APIs
export const authAPI = {
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  }
};

// Complaints APIs
export const complaintsAPI = {
  async getComplaints() {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async createComplaint(complaintData: {
    title: string;
    description: string;
    location: string;
    latitude?: number;
    longitude?: number;
    image_url?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
    return handleResponse(response);
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/complaints/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  }
};

// Error handling utility
export function handleAPIError(error: any) {
  console.error('API Error:', error);
  
  if (error.message.includes('Unauthorized')) {
    // Redirect to login if unauthorized
    window.location.href = '/users-dashboard/auth/login';
    return;
  }
  
  return error.message || 'An unexpected error occurred';
}