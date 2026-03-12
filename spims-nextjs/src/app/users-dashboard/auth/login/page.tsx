'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Mail, Lock, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#fafafa]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(229 229 229 / 0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-[#525252] hover:text-[#0a0a0a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#e5e5e5] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-[#f0f0f0]">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#0a0a0a]">SPIMS</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">Welcome Back</h1>
            <p className="text-sm text-[#525252] mt-1">Sign in to continue to your dashboard</p>
          </div>

          <div className="p-8">
            {showSuccessMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Account created successfully!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Please sign in with your credentials.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0a0a0a] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 transition-all"
              >
                Sign In to Dashboard
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#525252]">
              Don&apos;t have an account?{' '}
              <Link href="/users-dashboard/auth/register" className="font-semibold text-[#0a0a0a] hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}