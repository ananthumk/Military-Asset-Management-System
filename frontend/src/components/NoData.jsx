import { Package } from 'lucide-react';

export const NoData = ({ message = 'No data to show' }) => {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Package className="text-gray-400" size={36} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No data available</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};
