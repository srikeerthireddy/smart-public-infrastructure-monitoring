'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function Login() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check for registration success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'registration-success') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('Login attempt:', { email });
    
    try {
      // Try database login first
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Database login successful:', data.user);
        
        // Save user to localStorage for compatibility
        localStorage.setItem('spims_current_user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/users-dashboard';
        return;
      }
      
      // If database login fails, fall back to localStorage (for existing users)
      console.log('Database login failed, trying localStorage fallback...');
      
      const registeredUsers = JSON.parse(localStorage.getItem('spims_users') || '[]');
      const user = registeredUsers.find((u: any) => u.email === email);
      
      if (user) {
        // Save current user to localStorage
        localStorage.setItem('spims_current_user', JSON.stringify(user));
        console.log('LocalStorage login successful:', user);
        
        // Redirect to dashboard
        window.location.href = '/users-dashboard';
      } else {
        // For demo purposes, create a user from email if not found
        const newUser = {
          id: Date.now().toString(),
          name: getUserNameFromEmail(email),
          email: email,
          role: 'public',
          created_at: new Date().toISOString()
        };
        
        // Save user
        const updatedUsers = [...registeredUsers, newUser];
        localStorage.setItem('spims_users', JSON.stringify(updatedUsers));
        localStorage.setItem('spims_current_user', JSON.stringify(newUser));
        
        console.log('New demo user created:', newUser);
        window.location.href = '/users-dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Helper function to generate name from email
  const getUserNameFromEmail = (email: string): string => {
    const username = email.split('@')[0];
    return username.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 25%, #faf5ff 50%, #f0f9ff 75%, #e8f5e8 100%)'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center group">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <h1 className="ml-4 text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">SPIMS</h1>
          </Link>
          <h2 className="mt-8 text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
          <p className="mt-3 text-lg text-gray-700 font-medium">
            Sign in to continue to your dashboard
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/users-dashboard/auth/register" className="font-bold text-blue-600 hover:text-purple-600 transition-colors duration-200 hover:underline">
              Create one here
            </Link>
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Account created successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">Please sign in with your credentials.</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-8 shadow-xl rounded-2xl border border-white/50 ring-1 ring-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded shadow-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-3 focus:ring-blue-500/30 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <span className="relative">Sign In to Dashboard</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-base font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}