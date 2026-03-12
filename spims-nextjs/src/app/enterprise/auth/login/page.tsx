'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Building2, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function EnterpriseLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Try enterprise login API
      const response = await fetch('/api/enterprise/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.approval_status === 'pending') {
          setMessage('Your enterprise account is pending admin approval. Please wait for approval before accessing the dashboard.');
        } else if (data.user.approval_status === 'rejected') {
          setError('Your enterprise account has been rejected. Please contact support.');
        } else if (data.user.approval_status === 'approved') {
          // Redirect to enterprise dashboard
          window.location.href = '/enterprise/dashboard';
        }
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#fafafa]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(229 229 229 / 0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      <div className="w-full max-w-md">
        <Link 
          href="/enterprise" 
          className="inline-flex items-center text-sm font-medium text-[#525252] hover:text-[#0a0a0a] mb-8 transition-colors"
        >
          ← Back to Enterprise Portal
        </Link>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#e5e5e5] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-[#f0f0f0]">
            <div className="mx-auto w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-5">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">Enterprise Login</h1>
            <p className="text-sm text-[#525252] mt-1">Infrastructure Management Dashboard</p>
          </div>

          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-emerald-800">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                  Enterprise Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                    placeholder="enterprise@department.gov"
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
                {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#525252]">
              Don&apos;t have an account?{' '}
              <Link href="/enterprise/auth/register" className="font-semibold text-[#0a0a0a] hover:underline">
                Register here
              </Link>
            </p>

            <div className="mt-6 p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#525252] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#0a0a0a] mb-0.5">Admin Approval Required</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    Enterprise accounts require admin approval before dashboard access.
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