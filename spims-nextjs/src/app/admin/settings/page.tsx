'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <Link
              href="/admin/dashboard"
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
            <div className="w-11 h-11 bg-[#0a0a0a] rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0a0a0a]">Admin Settings</h1>
              <p className="text-sm text-neutral-600">Manage your administration preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-neutral-700" />
                <h3 className="font-semibold text-neutral-900">System Access</h3>
              </div>
              <p className="text-sm text-neutral-600">
                You have full administrative access to the SPIMS platform. Contact your system administrator for password or access changes.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Notifications</h3>
              <p className="text-sm text-neutral-600">
                Admin notification preferences can be configured here. Pending enterprise approvals, new user registrations, and complaint escalations will be sent to your configured email.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
