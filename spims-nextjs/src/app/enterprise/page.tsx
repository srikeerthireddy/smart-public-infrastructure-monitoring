'use client';

import Link from 'next/link';
import { Building2, Users, ClipboardCheck, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function EnterpriseLanding() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-neutral-900 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">SPIMS Enterprise</h1>
                <p className="text-xs text-neutral-600 mt-0.5">Infrastructure Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Public Portal
              </Link>
              <Link
                href="/enterprise/auth/login"
                className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
              >
                Enterprise Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full text-neutral-800 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Government & Enterprise Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Manage Public Infrastructure
              <span className="block text-neutral-700">Efficiently & Effectively</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Enterprise dashboard for government teams and organizations to manage public complaints, 
              assign workers, track progress, and ensure timely resolution of infrastructure issues.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/enterprise/auth/login"
              className="bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-800 transition-all flex items-center"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/enterprise/auth/register"
              className="bg-white text-neutral-900 px-8 py-3.5 rounded-xl font-semibold border-2 border-neutral-300 hover:bg-neutral-50 transition-all flex items-center"
            >
              Register Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for managing public infrastructure complaints and coordinating response teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View & Manage Complaints</h3>
              <p className="text-gray-600 text-sm">
                Access all public complaints assigned to your department. Filter, sort, and prioritize based on urgency and location.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign Workers</h3>
              <p className="text-gray-600 text-sm">
                Assign complaints to specific workers or teams. Track worker availability and specializations for optimal assignment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Status</h3>
              <p className="text-gray-600 text-sm">
                Update complaint status in real-time. Keep citizens informed about progress from "Reported" to "Resolved".
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Workers</h3>
              <p className="text-gray-600 text-sm">
                Add, edit, and manage your workforce. Track worker specializations, contact information, and availability.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Approval</h3>
              <p className="text-gray-600 text-sm">
                Secure registration process with admin approval. Only verified government entities can access the system.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
              <p className="text-gray-600 text-sm">
                Generate detailed reports on complaint resolution times, worker performance, and departmental efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Flow */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complaint Status Flow</h2>
            <p className="text-gray-600">Track complaints through their complete lifecycle</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Reported */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Reported</h3>
              <p className="text-sm text-gray-600">New complaint submitted</p>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

            {/* In Progress */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">In Progress</h3>
              <p className="text-sm text-gray-600">Worker assigned & working</p>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

            {/* Resolved */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Resolved</h3>
              <p className="text-sm text-gray-600">Issue fixed & verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Operations?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join government departments and enterprises already using SPIMS to efficiently manage public infrastructure complaints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/enterprise/auth/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Register Your Enterprise
            </Link>
            <Link
              href="/enterprise/auth/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Building2 className="w-6 h-6" />
              <span className="font-semibold">SPIMS Enterprise Portal</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 Smart Public Infrastructure Monitoring System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}