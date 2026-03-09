'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('spims_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('spims_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data based on email
      const mockUser: User = {
        id: generateUserId(email),
        name: getUserNameFromEmail(email),
        email: email,
        role: 'public',
        created_at: new Date()
      };
      
      // Save user to localStorage and state
      localStorage.setItem('spims_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save user info for future login
      const userInfo = { name, email };
      localStorage.setItem('spims_registered_user', JSON.stringify(userInfo));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('spims_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper functions
function generateUserId(email: string): string {
  // Generate a consistent ID based on email
  return `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
}

function getUserNameFromEmail(email: string): string {
  // Check if we have a registered user with this email
  try {
    const registeredUser = localStorage.getItem('spims_registered_user');
    if (registeredUser) {
      const userData = JSON.parse(registeredUser);
      if (userData.email === email) {
        return userData.name;
      }
    }
  } catch (error) {
    console.error('Error getting registered user:', error);
  }
  
  // Fallback: generate name from email
  const username = email.split('@')[0];
  return username.split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
}