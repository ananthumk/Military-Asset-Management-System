import { useEffect, useState } from 'react';
import { Layout, Loader, ErrorMessage, NoData, Alert } from '../components';
import { useAPI } from '../context/APIContext';
import { Trash2, Plus } from 'lucide-react';

export const AssetsPage = () => {
  const { fetchAssets, assets, loading, addAsset, deleteAsset } = useAPI();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetName: '',
    category: 'Vehicle',
    quantity: '',
    base: '',
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setError(null);
    const result = await fetchAssets();
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    if (!formData.assetName || !formData.quantity || !formData.base) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    const result = await addAsset({
      ...formData,
      quantity: parseInt(formData.quantity),
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Asset added successfully!' });
      setFormData({ assetName: '', category: 'Vehicle', quantity: '', base: '' });
      setShowForm(false);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDeleteAsset = async (id) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      const result = await deleteAsset(id);
      if (result.success) {
        setAlert({ type: 'success', message: 'Asset deleted successfully!' });
      } else {
        setAlert({ type: 'error', message: result.error });
      }
    }
  };

  if (loading) return <Layout><Loader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} onRetry={loadAssets} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Assets</h1>
            <p className="page-subtitle">Manage your military asset inventory</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Asset
          </button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Add Asset Form */}
        {showForm && (
          <div className="card border-l-4 border-l-blue-600">
            <h2 className="section-title mb-4">Add New Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid-auto-2">
                <div>
                  <label className="label">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Tank, Rifle"
                    value={formData.assetName}
                    onChange={(e) =>
                      setFormData({ ...formData, assetName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Vehicle</option>
                    <option>Weapon</option>
                    <option>Ammunition</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    Base
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Base A"
                    value={formData.base}
                    onChange={(e) =>
                      setFormData({ ...formData, base: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn btn-primary">
                  Add Asset
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assets Table */}
        {assets.length > 0 ? (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="table-header border-b border-gray-200">
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Asset Name
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="table-cell text-center font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Base
                  </th>
                  <th className="table-cell text-center font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id} className="table-row border-b border-gray-200 hover:bg-gray-50">
                    <td className="table-cell text-gray-800 font-medium">{asset.assetName}</td>
                    <td className="table-cell">
                      <span className="badge badge-primary">
                        {asset.category}
                      </span>
                    </td>
                    <td className="table-cell text-center font-semibold text-gray-800">
                      {asset.quantity}
                    </td>
                    <td className="table-cell text-gray-800">{asset.base}</td>
                    <td className="table-cell text-center">
                      <button
                        onClick={() => handleDeleteAsset(asset._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoData message="No assets found. Add your first asset!" />
        )}
      </div>
    </Layout>
  );
};
