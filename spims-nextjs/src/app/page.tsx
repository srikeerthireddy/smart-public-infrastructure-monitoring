'use client';

import Link from 'next/link';
import { AlertTriangle, MapPin, Users, TrendingUp, Building2, Shield, CheckCircle, ArrowRight, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <nav className="bg-white/95 backdrop-blur-lg border-b border-[#e5e5e5] sticky top-0 z-50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-[#0a0a0a] p-1.5 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-[#0a0a0a]">SPIMS</span>
                <span className="ml-2 text-xs text-[#525252] hidden lg:inline">Smart Public Infrastructure Monitoring</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <Link
                href="/users-dashboard/auth/login"
                className="text-[#525252] hover:text-[#0a0a0a] px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-[#fafafa] hover:bg-white border border-[#e5e5e5] hover:border-[#d4d4d4]"
              >
                Public Login
              </Link>
              <Link
                href="/enterprise/auth/login"
                className="bg-[#0a0a0a] hover:bg-[#262626] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise</span>
              </Link>
              <Link
                href="/admin/auth/login"
                className="bg-[#0a0a0a] hover:bg-[#262626] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0a0a0a] mb-4 leading-tight">
            Smart Public Infrastructure
            <span className="block text-[#0a0a0a]">
              Monitoring System
            </span>
          </h1>
          
          <p className="text-sm text-[#525252] mb-6 max-w-2xl mx-auto leading-relaxed">
            Report infrastructure problems, track progress, and collaborate with local authorities
            to create safer, better communities.
          </p>
        </div>

        {/* Side by Side Call to Action Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Public Users Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0a0a0a]">For Public Users</h3>
                  <p className="text-[#525252] text-xs">Community Members</p>
                </div>
              </div>
              
              <p className="text-[#525252] text-sm mb-4 leading-relaxed">
                Report infrastructure issues like broken street lights, potholes, water leaks.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Report with photos & location</span>
                </div>
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Track status in real-time</span>
                </div>
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>View on interactive map</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/users-dashboard/auth/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg text-sm shadow-md transform hover:scale-[1.02] transition-all duration-200 block text-center group"
                >
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/users-dashboard/auth/login"
                  className="border border-[#e5e5e5] text-[#0a0a0a] hover:border-[#0a0a0a] font-medium py-2 px-4 rounded-lg text-xs transition-all duration-200 block text-center"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Enterprise Users Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0a0a0a]">For Government & Enterprises</h3>
                  <p className="text-[#525252] text-xs">Departments & Organizations</p>
                </div>
              </div>
              
              <p className="text-[#525252] text-sm mb-4 leading-relaxed">
                Manage complaints, assign workers, track performance, ensure timely resolution.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>View & manage all complaints</span>
                </div>
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Assign workers to issues</span>
                </div>
                <div className="flex items-center text-xs text-[#525252]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Performance analytics & reports</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/enterprise/auth/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm shadow-md transform hover:scale-[1.02] transition-all duration-200 block text-center group"
                >
                  <span className="flex items-center justify-center">
                    Register Enterprise
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/enterprise/auth/login"
                  className="border border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 font-medium py-2 px-4 rounded-lg text-xs transition-all duration-200 block text-center"
                >
                  Enterprise Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="text-center mt-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-md max-w-xl mx-auto">
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Join Thousands Making Their Communities Better</h4>
            <p className="text-xs text-[#525252] mb-3">
              10,000+ issues resolved • 500+ communities • 24/7 monitoring
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-[#525252]">
              <div className="flex items-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5" />
                <span>Free for Public</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 text-purple-500 mr-1.5" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">10K+</div>
            <div className="text-[#525252] text-xs font-medium">Issues Resolved</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md border border-green-100 hover:shadow-lg transition-all duration-300">
            <div className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-1">500+</div>
            <div className="text-[#525252] text-xs font-medium">Communities</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100 hover:shadow-lg transition-all duration-300">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-1">25K+</div>
            <div className="text-[#525252] text-xs font-medium">Active Users</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md border border-orange-100 hover:shadow-lg transition-all duration-300">
            <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">24/7</div>
            <div className="text-[#525252] text-xs font-medium">Monitoring</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-red-100">
            <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-lg w-9 h-9 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#0a0a0a] mb-1">Report Issues</h3>
            <p className="text-[#525252] text-xs leading-relaxed">Submit complaints about streetlights, potholes, infrastructure</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-green-100">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg w-9 h-9 flex items-center justify-center mx-auto mb-2">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#0a0a0a] mb-1">Smart Location</h3>
            <p className="text-[#525252] text-xs leading-relaxed">Pinpoint locations on interactive maps with GPS</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-blue-100">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg w-9 h-9 flex items-center justify-center mx-auto mb-2">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#0a0a0a] mb-1">Community Power</h3>
            <p className="text-[#525252] text-xs leading-relaxed">Collaborate with neighbors and authorities</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-purple-100">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg w-9 h-9 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#0a0a0a] mb-1">Live Updates</h3>
            <p className="text-[#525252] text-xs leading-relaxed">Instant notifications and progress tracking</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden max-w-4xl mx-auto">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-8 text-center">Simple. Fast. Effective.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h4 className="text-base font-bold mb-2">Report Issue</h4>
                <p className="text-blue-100 text-sm leading-relaxed">Take a photo, add location, submit in under 60 seconds.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h4 className="text-base font-bold mb-2">Track Progress</h4>
                <p className="text-blue-100 text-sm leading-relaxed">Real-time updates from local authorities.</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h4 className="text-base font-bold mb-2">See Results</h4>
                <p className="text-blue-100 text-sm leading-relaxed">Watch your community transform.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-8 text-center border border-blue-200 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Ready to Transform Your Community?</h3>
          <p className="text-sm text-[#525252] mb-6 max-w-md mx-auto leading-relaxed">
            Join thousands making their neighborhoods safer and better.
          </p>
          <div className="flex justify-center mb-4">
            <Link 
              href="/users-dashboard/auth/register"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 px-10 rounded-lg text-sm shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
            >
              <span>Start Making Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[#525252] text-xs">Free forever • No credit card • Join in 30 seconds</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="col-span-2">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-400" />
                <h3 className="ml-1.5 text-base font-bold">SPIMS</h3>
              </div>
              <p className="text-neutral-400 text-xs mb-3 max-w-sm leading-relaxed">
                Empowering communities through collaborative infrastructure monitoring.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide text-neutral-300">Quick Links</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li><Link href="/users-dashboard/auth/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/users-dashboard/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide text-neutral-300">Support</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-4 text-center">
            <p className="text-neutral-400 text-xs">
              &copy; 2026 SPIMS · Smart Public Infrastructure Monitoring
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}