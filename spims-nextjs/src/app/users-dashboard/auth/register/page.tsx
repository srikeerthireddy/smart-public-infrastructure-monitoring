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
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#fafafa]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(229 229 229 / 0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#525252] hover:text-[#0a0a0a] mb-8 transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#e5e5e5] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-[#f0f0f0]">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#0a0a0a]">SPIMS</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">Create Account</h1>
            <p className="text-sm text-[#525252] mt-1">Join the community and start reporting issues</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#0a0a0a] mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0a0a0a] mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#0a0a0a] mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-xl text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#737373] transition-all bg-white"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 text-[#0a0a0a] focus:ring-[#0a0a0a] border-[#d4d4d4] rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#525252]">
                I agree to the <a href="#" className="font-medium text-[#0a0a0a] hover:underline">Terms</a> and <a href="#" className="font-medium text-[#0a0a0a] hover:underline">Privacy Policy</a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0a0a0a] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="px-8 pb-8 pt-2">
            <p className="text-center text-sm text-[#525252]">
              Already have an account?{' '}
              <Link href="/users-dashboard/auth/login" className="font-semibold text-[#0a0a0a] hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}