'use client';

import Link from 'next/link';
import { Building2, Users, ClipboardCheck, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function EnterpriseLanding() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#e5e5e5] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#0a0a0a] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0a0a0a]">SPIMS Enterprise</h1>
                <p className="text-xs text-[#525252] mt-0.5">Infrastructure Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-[#525252] hover:text-[#0a0a0a] transition-colors">
                Public Portal
              </Link>
              <Link
                href="/enterprise/auth/login"
                className="bg-[#0a0a0a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#262626] transition-colors"
              >
                Enterprise Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-[#f0f0f0] rounded-full text-[#0a0a0a] text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Government & Enterprise Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 leading-tight">
              Manage Public Infrastructure
              <span className="block text-[#525252]">Efficiently & Effectively</span>
            </h1>
            <p className="text-lg text-[#525252] max-w-3xl mx-auto mb-8 leading-relaxed">
              Enterprise dashboard for government teams and organizations to manage public complaints, 
              assign workers, track progress, and ensure timely resolution of infrastructure issues.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/enterprise/auth/login"
              className="bg-[#0a0a0a] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#262626] transition-all flex items-center"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/enterprise/auth/register"
              className="bg-white text-[#0a0a0a] px-8 py-3.5 rounded-xl font-semibold border-2 border-[#e5e5e5] hover:bg-[#fafafa] transition-all flex items-center"
            >
              Register Enterprise
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4">Enterprise Features</h2>
            <p className="text-[#525252] max-w-2xl mx-auto">
              Comprehensive tools for managing public infrastructure complaints and coordinating response teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">View & Manage Complaints</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Access all public complaints assigned to your department. Filter, sort, and prioritize based on urgency and location.
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Assign Workers</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Assign complaints to specific workers or teams. Track worker availability and specializations for optimal assignment.
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Update Status</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Update complaint status in real-time. Keep citizens informed about progress from "Reported" to "Resolved".
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Manage Workers</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Add, edit, and manage your workforce. Track worker specializations, contact information, and availability.
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Admin Approval</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Secure registration process with admin approval. Only verified government entities can access the system.
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0a0a0a]/5 rounded-xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Reports & Analytics</h3>
              <p className="text-[#525252] text-sm leading-relaxed">
                Generate detailed reports on complaint resolution times, worker performance, and departmental efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4">Complaint Status Flow</h2>
            <p className="text-[#525252]">Track complaints through their complete lifecycle</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-[#0a0a0a] mb-1">Reported</h3>
              <p className="text-sm text-[#525252]">New complaint submitted</p>
            </div>

            <ArrowRight className="w-6 h-6 text-[#a3a3a3] hidden md:block" />

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 border border-amber-100">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-[#0a0a0a] mb-1">In Progress</h3>
              <p className="text-sm text-[#525252]">Worker assigned & working</p>
            </div>

            <ArrowRight className="w-6 h-6 text-[#a3a3a3] hidden md:block" />

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-[#0a0a0a] mb-1">Resolved</h3>
              <p className="text-sm text-[#525252]">Issue fixed & verified</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Operations?
          </h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
            Join government departments and enterprises already using SPIMS to efficiently manage public infrastructure complaints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/enterprise/auth/register"
              className="bg-white text-[#0a0a0a] px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
            >
              Register Your Enterprise
            </Link>
            <Link
              href="/enterprise/auth/login"
              className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-[#0a0a0a] transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Building2 className="w-6 h-6 text-neutral-300" />
              <span className="font-semibold">SPIMS Enterprise Portal</span>
            </div>
            <div className="text-sm text-neutral-400">
              © 2026 Smart Public Infrastructure Monitoring System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}