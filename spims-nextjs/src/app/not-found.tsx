import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-100">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-gray-600">
          Looking for something specific? Try starting from our{' '}
          <Link href="/" className="text-blue-600 hover:text-purple-600 font-semibold">
            homepage
          </Link>
          {' '}or{' '}
          <Link href="/users-dashboard/auth/login" className="text-blue-600 hover:text-purple-600 font-semibold">
            sign in
          </Link>
          {' '}to access your dashboard.
        </p>
      </div>
    </div>
  );
}