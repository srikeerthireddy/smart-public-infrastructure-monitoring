'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p>This is a test page to check if routing works correctly.</p>
        <button 
          onClick={() => alert('Button clicked!')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}