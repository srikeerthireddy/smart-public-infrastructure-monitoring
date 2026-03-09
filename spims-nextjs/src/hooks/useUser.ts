'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id?: string;
  name: string;
  email?: string;
  role?: string;
  created_at?: string;
}

export function useUser() {
  const [user, setUser] = useState<User>({ name: 'Guest User' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = () => {
      try {
        // First try to get from localStorage (for backward compatibility)
        const currentUser = localStorage.getItem('spims_current_user');
        if (currentUser) {
          return JSON.parse(currentUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('spims_current_user');
      }
      return { name: 'Guest User' };
    };
    
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const logout = async () => {
    try {
      // Call API logout to clear server-side session
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('spims_current_user');
      setUser({ name: 'Guest User' });
    }
  };

  const isLoggedIn = user.email ? true : false;

  return {
    user,
    isLoading,
    isLoggedIn,
    logout,
    setUser
  };
}