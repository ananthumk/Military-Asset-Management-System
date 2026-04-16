import { useEffect, useState } from 'react';
import { Layout, Loader, ErrorMessage } from '../components';
import { useAPI } from '../context/APIContext';
import { BarChart3, MapPin, Tag, Package } from 'lucide-react';

export const DashboardPage = () => {
  const { fetchDashboard, dashboardData, loading } = useAPI();
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setError(null);
    const result = await fetchDashboard();
    if (!result.success) {
      setError(result.error);
    }
  };

  if (loading) return <Layout><Loader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} onRetry={loadDashboard} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor your military assets</p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid-auto">
          {/* Total Assets Card */}
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="dashboard-card-title flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  Total Assets
                </div>
                <div className="dashboard-card-value text-blue-600">
                  {dashboardData?.totalAssets || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Bases Monitored Card */}
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="dashboard-card-title flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  Bases Monitored
                </div>
                <div className="dashboard-card-value text-blue-600">
                  {dashboardData?.bases ? Object.keys(dashboardData.bases).length : 0}
                </div>
              </div>
            </div>
          </div>

          {/* Categories Count Card */}
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="dashboard-card-title flex items-center gap-2">
                  <Tag size={16} className="text-blue-600" />
                  Categories
                </div>
                <div className="dashboard-card-value text-blue-600">
                  {dashboardData?.categories ? Object.keys(dashboardData.categories).length : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Base Distribution */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Base Distribution
          </h2>
          {dashboardData?.bases && Object.keys(dashboardData.bases).length > 0 ? (
            <div className="grid-auto-2">
              {Object.entries(dashboardData.bases).map(([base, count]) => (
                <div key={base} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{base}</span>
                  <span className="badge badge-primary">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No data available</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Category Distribution
          </h2>
          {dashboardData?.categories && Object.keys(dashboardData.categories).length > 0 ? (
            <div className="grid-auto-2">
              {Object.entries(dashboardData.categories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="badge badge-primary">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No data available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};
