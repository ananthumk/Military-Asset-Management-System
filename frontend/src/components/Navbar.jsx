import { useAPI } from '../context/APIContext';

export const Navbar = () => {
  const { user } = useAPI();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Military Asset Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="font-semibold text-gray-800">{user?.role || 'User'}</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
            {user?.role?.[0] || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};
