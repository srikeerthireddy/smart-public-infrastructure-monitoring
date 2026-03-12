'use client';

import Link from 'next/link';
import { AlertTriangle, MapPin, Users, TrendingUp, Building2, Shield, CheckCircle, ArrowRight, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <nav className="bg-white/95 backdrop-blur-lg border-b border-[#e5e5e5] sticky top-0 z-50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-[#0a0a0a] p-2 rounded-xl">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-[#0a0a0a]">SPIMS</span>
                <span className="ml-3 text-sm text-[#525252] hidden lg:inline font-medium">Smart Public Infrastructure Monitoring</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/users-dashboard/auth/login"
                className="text-[#525252] hover:text-[#0a0a0a] px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-[#fafafa] hover:bg-white border border-[#e5e5e5] hover:border-[#d4d4d4]"
              >
                Public Login
              </Link>
              <Link
                href="/enterprise/auth/login"
                className="bg-[#0a0a0a] hover:bg-[#262626] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Enterprise</span>
              </Link>
              <Link
                href="/admin/auth/login"
                className="bg-[#0a0a0a] hover:bg-[#262626] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0a0a0a] mb-6 leading-tight">
            Smart Public Infrastructure
            <span className="block text-[#0a0a0a]">
              Monitoring System
            </span>
          </h1>
          
          <p className="text-xl text-[#525252] mb-8 max-w-4xl mx-auto leading-relaxed">
            Report infrastructure problems, track progress, and collaborate with local authorities
            to create safer, better communities for everyone.
          </p>
        </div>

        {/* Side by Side Call to Action Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Public Users Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0a0a0a]">For Public Users</h3>
                  <p className="text-[#525252] text-sm">Community Members</p>
                </div>
              </div>
              
              <p className="text-[#525252] mb-6 leading-relaxed">
                Report infrastructure issues like broken street lights, potholes, water leaks, and track their resolution in real-time.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Report issues with photos & location</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Track complaint status in real-time</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>View issues on interactive map</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Get updates via notifications</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/users-dashboard/auth/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 block text-center group"
                >
                  <span className="flex items-center justify-center">
                    🚀 Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/users-dashboard/auth/login"
                  className="border-2 border-[#e5e5e5] text-[#0a0a0a] hover:border-[#0a0a0a] hover:text-[#0a0a0a] font-medium py-3 px-6 rounded-xl transition-all duration-200 block text-center"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Enterprise Users Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0a0a0a]">For Government & Enterprises</h3>
                  <p className="text-[#525252] text-sm">Departments & Organizations</p>
                </div>
              </div>
              
              <p className="text-[#525252] mb-6 leading-relaxed">
                Manage complaints efficiently, assign workers, track department performance, and ensure timely resolution of public issues.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>View & manage all complaints</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Assign workers to specific issues</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Track performance analytics</span>
                </div>
                <div className="flex items-center text-sm text-[#525252]">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Generate detailed reports</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/enterprise/auth/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 block text-center group"
                >
                  <span className="flex items-center justify-center">
                    🏢 Register Enterprise
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/enterprise/auth/login"
                  className="border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 font-medium py-3 px-6 rounded-xl transition-all duration-200 block text-center"
                >
                  Enterprise Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg max-w-2xl mx-auto">
          <h4 className="text-xl font-semibold text-[#0a0a0a] mb-3">Join Thousands Making Their Communities Better</h4>
          <p className="text-[#525252] mb-4">
              Over 10,000+ issues resolved • 500+ communities served • 24/7 monitoring
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-[#525252]">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Free for Public</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-500 mr-2" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-purple-500 mr-2" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">10K+</div>
            <div className="text-[#525252] text-sm font-medium">Issues Resolved</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">500+</div>
            <div className="text-[#525252] text-sm font-medium">Communities</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">25K+</div>
            <div className="text-[#525252] text-sm font-medium">Active Users</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-[#525252] text-sm font-medium">Monitoring</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-red-100">
            <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Report Issues</h3>
            <p className="text-[#525252] text-sm leading-relaxed">Submit complaints about broken streetlights, potholes, and infrastructure problems</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-green-100">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Smart Location</h3>
            <p className="text-[#525252] text-sm leading-relaxed">Pinpoint exact locations and view issues on interactive maps with GPS precision</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Community Power</h3>
            <p className="text-[#525252] text-sm leading-relaxed">Collaborate with neighbors and local authorities to solve problems faster</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-purple-100">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Live Updates</h3>
            <p className="text-[#525252] text-sm leading-relaxed">Get instant notifications and track progress from report to resolution</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-12 text-center">Simple. Fast. Effective.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
                  <span className="text-3xl font-bold text-white drop-shadow-lg">1</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">📸 Report Issue</h4>
                <p className="text-blue-100 leading-relaxed">Spot a problem? Take a photo, add location, and submit your report in under 60 seconds.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
                  <span className="text-3xl font-bold text-white drop-shadow-lg">2</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">📊 Track Progress</h4>
                <p className="text-blue-100 leading-relaxed">Monitor your complaint status and receive real-time updates from local authorities.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
                  <span className="text-3xl font-bold text-white drop-shadow-lg">3</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">✨ See Results</h4>
                <p className="text-blue-100 leading-relaxed">Watch your community transform through collaborative problem-solving and action.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-12 text-center border border-blue-200 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Ready to Transform Your Community?</h3>
          <p className="text-xl text-[#525252] mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of active citizens making their neighborhoods safer, cleaner, and better for everyone.
          </p>
          <div className="flex justify-center mb-6">
            <Link 
              href="/users-dashboard/auth/register"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-5 px-16 rounded-2xl text-xl shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
            >
              <span>🚀 Start Making Impact</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
          <p className="text-[#525252] font-medium">Free forever • No credit card required • Join in 30 seconds</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-blue-400" />
                <h3 className="ml-2 text-2xl font-bold">SPIMS</h3>
              </div>
              <p className="text-neutral-400 mb-4 max-w-md">
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
          
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-neutral-400">
              &copy; 2026 SPIMS - Smart Public Infrastructure Monitoring System. Built with ❤️ for better communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}