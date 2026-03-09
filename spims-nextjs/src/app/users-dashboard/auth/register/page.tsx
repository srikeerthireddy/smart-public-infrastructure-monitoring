'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Register() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('Registration attempt:', { name, email });
    
    try {
      // Try database registration first
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Database registration successful:', data.user);
        
        // Redirect to login with success message
        window.location.href = '/users-dashboard/auth/login?message=registration-success';
        return;
      } else {
        const error = await response.json();
        if (response.status === 409) {
          alert('User with this email already exists!');
          return;
        }
        throw new Error(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Database registration failed:', error);
      
      // Fall back to localStorage registration
      console.log('Falling back to localStorage registration...');
      
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        role: 'public',
        created_at: new Date().toISOString()
      };
      
      // Get existing users or create empty array
      const existingUsers = JSON.parse(localStorage.getItem('spims_users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.find((u: any) => u.email === email);
      if (userExists) {
        alert('User with this email already exists!');
        return;
      }
      
      // Add new user to the list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('spims_users', JSON.stringify(updatedUsers));
      
      console.log('LocalStorage registration successful:', newUser);
      
      // Redirect to login with success message
      window.location.href = '/users-dashboard/auth/login?message=registration-success';
    }
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
          <h2 className="mt-10 text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-4 text-xl text-gray-700 font-medium">
            Join the community and start reporting issues
          </p>
          <p className="mt-3 text-base text-gray-600">
            Already have an account?{' '}
            <Link href="/users-dashboard/auth/login" className="font-bold text-blue-600 hover:text-purple-600 transition-colors duration-200 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/95 backdrop-blur-md py-12 px-10 shadow-2xl rounded-3xl border border-white/50 ring-1 ring-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Terms and conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms and Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}