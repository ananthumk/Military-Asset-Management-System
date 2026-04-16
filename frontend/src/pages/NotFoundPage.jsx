import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="text-center max-w-lg">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600" size={56} />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transition"
        >
          <Home size={24} />
          Go to Dashboard
        </button>

        {/* Footer Text */}
        <p className="text-gray-500 text-sm mt-8">
          Error code: <span className="font-mono text-gray-700">404 NOT_FOUND</span>
        </p>
      </div>
    </div>
  );
};
