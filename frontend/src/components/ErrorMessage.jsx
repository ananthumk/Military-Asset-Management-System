import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="text-red-600" size={36} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-red-600 font-medium mb-6">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
