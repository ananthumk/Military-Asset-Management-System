import { useEffect, useState } from 'react';
import { Layout, Loader, ErrorMessage, NoData, Alert } from '../components';
import { useAPI } from '../context/APIContext';
import { Plus } from 'lucide-react';

export const TransfersPage = () => {
  const { fetchTransfers, fetchAssets, transfers, assets, loading, addTransfer } = useAPI();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBase: '',
    toBase: '',
    quantity: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError(null);
    const assetsResult = await fetchAssets();
    const transfersResult = await fetchTransfers();
    if (!assetsResult.success || !transfersResult.success) {
      setError(assetsResult.error || transfersResult.error);
    }
  };

  const handleAddTransfer = async (e) => {
    e.preventDefault();
    if (!formData.assetId || !formData.fromBase || !formData.toBase || !formData.quantity) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (formData.fromBase === formData.toBase) {
      setAlert({ type: 'error', message: 'From and To bases must be different' });
      return;
    }

    const result = await addTransfer({
      ...formData,
      quantity: parseInt(formData.quantity),
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Transfer recorded successfully!' });
      setFormData({ assetId: '', fromBase: '', toBase: '', quantity: '' });
      setShowForm(false);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  if (loading) return <Layout><Loader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} onRetry={loadData} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Transfers</h1>
            <p className="page-subtitle">Track asset transfers between bases</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Transfer
          </button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Add Transfer Form */}
        {showForm && (
          <div className="card border-l-4 border-l-blue-600">
            <h2 className="section-title mb-4">Record Transfer</h2>
            <form onSubmit={handleAddTransfer} className="space-y-4">
              <div className="grid-auto-2">
                <div>
                  <label className="label">
                    Asset
                  </label>
                  <select
                    className="input-field"
                    value={formData.assetId}
                    onChange={(e) =>
                      setFormData({ ...formData, assetId: e.target.value })
                    }
                  >
                    <option value="">Select Asset</option>
                    {assets.map((asset) => (
                      <option key={asset._id} value={asset._id}>
                        {asset.assetName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    From Base
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Base A"
                    value={formData.fromBase}
                    onChange={(e) =>
                      setFormData({ ...formData, fromBase: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    To Base
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Base B"
                    value={formData.toBase}
                    onChange={(e) =>
                      setFormData({ ...formData, toBase: e.target.value })
                    }
                  />
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
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn btn-primary">
                  Record Transfer
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

        {/* Transfers Table */}
        {transfers.length > 0 ? (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="table-header border-b border-gray-200">
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Asset Name
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    From Base
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    To Base
                  </th>
                  <th className="table-cell text-center font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, idx) => (
                  <tr key={idx} className="table-row border-b border-gray-200 hover:bg-gray-50">
                    <td className="table-cell text-gray-800 font-medium">
                      {transfer.asset?.assetName || 'N/A'}
                    </td>
                    <td className="table-cell text-gray-800">{transfer.fromBase}</td>
                    <td className="table-cell text-gray-800">{transfer.toBase}</td>
                    <td className="table-cell text-center font-semibold text-gray-800">
                      {transfer.quantity}
                    </td>
                    <td className="table-cell text-gray-600 text-sm">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoData message="No transfers recorded yet" />
        )}
      </div>
    </Layout>
  );
};
