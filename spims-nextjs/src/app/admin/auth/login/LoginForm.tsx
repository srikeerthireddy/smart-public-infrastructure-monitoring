'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with:', { email, password }); // Debug log

    if (!email || !password) {
      setError('Please fill in both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (response.ok) {
        console.log('Login successful, redirecting...'); // Debug log
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <div className="mx-auto w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-5">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">Admin Login</h1>
            <p className="text-sm text-[#525252] mt-1">System Administrator Access</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                    placeholder="admin@spims.gov"
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-[#525252]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0a0a0a] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Access Admin Dashboard'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#525252] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#0a0a0a] mb-0.5">Security Notice</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    Admin access provides full system control. Only authorized personnel should use this login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}