'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Building2, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function EnterpriseRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const registrationData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: password,
      phone: formData.get('phone') as string,
      enterpriseName: formData.get('enterpriseName') as string,
      department: formData.get('department') as string,
      address: formData.get('address') as string,
      role: 'enterprise'
    };

    try {
      console.log('🚀 Submitting enterprise registration:', registrationData);
      
      const response = await fetch('/api/enterprise/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok) {
        console.log('✅ Registration successful');
        setSuccess(true);
      } else {
        console.log('❌ Registration failed:', data.error);
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <div className="p-8 text-center">
              <div className="mx-auto w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Registration Submitted</h1>
              <p className="text-sm text-neutral-600">Your enterprise account is pending admin approval</p>
            </div>
            <div className="px-8 pb-8 space-y-4">
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-neutral-600 space-y-1.5">
                  <li>• Admin will review your registration</li>
                  <li>• You&apos;ll receive an email about approval status</li>
                  <li>• Once approved, you can access the dashboard</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/enterprise/auth/login"
                  className="block w-full bg-neutral-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-neutral-800 transition-colors text-center"
                >
                  Go to Login
                </Link>
                <Link
                  href="/enterprise"
                  className="block w-full border border-neutral-200 text-neutral-900 py-3 px-4 rounded-xl font-medium hover:bg-neutral-50 transition-colors text-center"
                >
                  Back to Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/enterprise" className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 mb-6">
            ← Back to Enterprise Portal
          </Link>
          <div className="mx-auto w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-1">Register Enterprise</h1>
          <p className="text-sm text-neutral-600">Create an account for your government department</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="John Smith"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="john@department.gov"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Enterprise Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="enterpriseName" className="block text-sm font-semibold text-neutral-900 mb-2">Enterprise Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="enterpriseName"
                      name="enterpriseName"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="City Public Works Department"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-semibold text-neutral-900 mb-2">Department</label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                  >
                    <option value="">Select Department</option>
                    <option value="Infrastructure">Infrastructure & Roads</option>
                    <option value="Utilities">Water & Utilities</option>
                    <option value="Electrical">Electrical Services</option>
                    <option value="Sanitation">Sanitation & Waste</option>
                    <option value="Parks">Parks & Recreation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Emergency">Emergency Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-neutral-900 mb-2">Office Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="123 Government Building, Main Street, City"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-11 pr-12 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="Create password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-900 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-11 pr-12 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                      placeholder="Confirm password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Register Enterprise'}
            </button>
          </form>

          <div className="px-8 pb-8 pt-4 border-t border-neutral-100">
            <p className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link href="/enterprise/auth/login" className="font-semibold text-neutral-900 hover:underline">Sign in</Link>
            </p>
            <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-0.5">Admin Approval Required</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Your registration will be reviewed. Only verified departments will be approved. You&apos;ll receive an email once approved.
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