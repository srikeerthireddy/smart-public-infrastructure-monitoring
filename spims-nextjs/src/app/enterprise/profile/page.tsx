'use client';

import Link from 'next/link';
import { ArrowLeft, User, Mail, Building2 } from 'lucide-react';

export default function EnterpriseProfilePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <Link
              href="/enterprise/dashboard"
              className="flex items-center text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0a0a0a]">Enterprise Profile</h1>
              <p className="text-sm text-neutral-600">City Public Works · Infrastructure</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <User className="w-5 h-5 text-neutral-700" />
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="font-medium text-neutral-900">Enterprise User</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <Mail className="w-5 h-5 text-neutral-700" />
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">enterprise@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <Building2 className="w-5 h-5 text-neutral-700" />
              <div>
                <p className="text-xs text-neutral-500">Organization</p>
                <p className="font-medium text-neutral-900">City Public Works</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
