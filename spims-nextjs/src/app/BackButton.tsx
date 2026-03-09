'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Go Back
    </button>
  );
}