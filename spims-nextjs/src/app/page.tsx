'use client';

import Link from 'next/link';
import { AlertTriangle, MapPin, Users, TrendingUp } from 'lucide-react';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-indigo-25 to-purple-25" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #faf5ff 100%)'}}>
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md shadow-sm border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SPIMS</h1>
              <span className="ml-3 text-sm text-gray-600 hidden md:inline">Smart Public Infrastructure Monitoring</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/users-dashboard/auth/login"
                className="text-gray-700 hover:text-blue-600 px-6 py-2 rounded-lg text-sm font-medium transition-colors bg-white/50 hover:bg-white/80 border border-blue-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-5xl leading-tight">
            Make Your Community
            <span className="text-blue-600 block">Better Together</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Report infrastructure problems, track progress, and collaborate with local authorities 
            to create safer, better communities for everyone.
          </p>
          
          {/* Call to Action */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-center">
              <Link 
                href="/users-dashboard/auth/register"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-10 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🚀 Get Started Free
              </Link>
            </div>
            <p className="text-sm text-gray-600">Join thousands making their communities better</p>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-md border border-blue-50">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-600 text-sm font-medium">Issues Resolved</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-md border border-green-50">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-gray-600 text-sm font-medium">Cities Connected</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-md border border-purple-50">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">25K+</div>
              <div className="text-gray-600 text-sm font-medium">Active Citizens</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-md border border-orange-50">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">72hrs</div>
              <div className="text-gray-600 text-sm font-medium">Avg Response Time</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-red-50">
            <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Report Issues</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Submit complaints about broken streetlights, potholes, and infrastructure problems</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-green-50">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Location</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Pinpoint exact locations and view issues on interactive maps with GPS precision</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-50">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Community Power</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Collaborate with neighbors and local authorities to solve problems faster</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-purple-50">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Live Updates</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Get instant notifications and track progress from report to resolution</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl shadow-xl p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-10 text-center">Simple. Fast. Effective.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/25 backdrop-blur-sm rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">1</span>
                </div>
                <h4 className="text-xl font-bold mb-3">📸 Report Issue</h4>
                <p className="text-blue-100 leading-relaxed text-sm">Spot a problem? Take a photo, add location, and submit your report in under 60 seconds.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/25 backdrop-blur-sm rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">2</span>
                </div>
                <h4 className="text-xl font-bold mb-3">📊 Track Progress</h4>
                <p className="text-blue-100 leading-relaxed text-sm">Monitor your complaint status and receive real-time updates from local authorities.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/25 backdrop-blur-sm rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">3</span>
                </div>
                <h4 className="text-xl font-bold mb-3">✨ See Results</h4>
                <p className="text-blue-100 leading-relaxed text-sm">Watch your community transform through collaborative problem-solving and action.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Community Says</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-gradient-to-br from-blue-25 to-blue-50 rounded-xl p-6 shadow-md" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)'}}>
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">
                "SPIMS helped us get our broken streetlight fixed in just 2 days. The process was so simple!"
              </p>
              <div className="font-bold text-gray-800 text-sm">Sarah Johnson</div>
              <div className="text-xs text-blue-600 font-medium">Downtown Resident</div>
            </div>
            <div className="text-center bg-gradient-to-br from-green-25 to-green-50 rounded-xl p-6 shadow-md" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'}}>
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">👨‍🔧</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">
                "As a city worker, SPIMS helps us prioritize and respond to issues much faster than before."
              </p>
              <div className="font-bold text-gray-800 text-sm">Mike Rodriguez</div>
              <div className="text-xs text-green-600 font-medium">City Maintenance</div>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-25 to-purple-50 rounded-xl p-6 shadow-md" style={{background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'}}>
              <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">👵</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">
                "I love being able to track the progress of my reports. It makes me feel heard and valued."
              </p>
              <div className="font-bold text-gray-800 text-sm">Eleanor Davis</div>
              <div className="text-xs text-purple-600 font-medium">Community Advocate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-25 via-purple-25 to-indigo-25 rounded-2xl p-10 text-center border border-blue-50 shadow-lg" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #f8fafc 100%)'}}>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Ready to Transform Your Community?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of active citizens making their neighborhoods safer, cleaner, and better for everyone.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/users-dashboard/auth/register"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-12 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Start Making Impact
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Free forever • No credit card required • Join in 30 seconds</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-blue-400" />
                <h3 className="ml-2 text-2xl font-bold">SPIMS</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering communities to create better, safer neighborhoods through collaborative infrastructure monitoring and reporting.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 rounded-lg p-2">
                  <span className="text-sm text-gray-400">🏆 Best Civic App 2026</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/users-dashboard/auth/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/users-dashboard/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2026 SPIMS - Smart Public Infrastructure Monitoring System. Built with ❤️ for better communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
