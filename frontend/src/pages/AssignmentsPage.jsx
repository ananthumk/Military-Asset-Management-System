import { useEffect, useState } from 'react';
import { Layout, Loader, ErrorMessage, NoData, Alert } from '../components';
import { useAPI } from '../context/APIContext';
import { Plus } from 'lucide-react';

export const AssignmentsPage = () => {
  const { fetchAssignments, fetchAssets, assignments, assets, loading, addAssignment } = useAPI();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assignedTo: '',
    quantity: '',
    base: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError(null);
    const assetsResult = await fetchAssets();
    const assignmentsResult = await fetchAssignments();
    if (!assetsResult.success || !assignmentsResult.success) {
      setError(assetsResult.error || assignmentsResult.error);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!formData.assetId || !formData.assignedTo || !formData.quantity || !formData.base) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    const result = await addAssignment({
      ...formData,
      quantity: parseInt(formData.quantity),
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Assignment recorded successfully!' });
      setFormData({ assetId: '', assignedTo: '', quantity: '', base: '' });
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
            <h1 className="page-title">Assignments</h1>
            <p className="page-subtitle">Manage asset assignments to troops and units</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Assignment
          </button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Add Assignment Form */}
        {showForm && (
          <div className="card border-l-4 border-l-blue-600">
            <h2 className="section-title mb-4">Create Assignment</h2>
            <form onSubmit={handleAddAssignment} className="space-y-4">
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
                    Assigned To
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Soldier/Unit name"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
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
                  Create Assignment
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

        {/* Assignments Table */}
        {assignments.length > 0 ? (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="table-header border-b border-gray-200">
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Asset Name
                  </th>
                  <th className="table-cell text-left font-semibold text-gray-700">
                    Assigned To
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
                {assignments.map((assignment, idx) => (
                  <tr key={idx} className="table-row border-b border-gray-200 hover:bg-gray-50">
                    <td className="table-cell text-gray-800 font-medium">
                      {assignment.asset?.assetName || 'N/A'}
                    </td>
                    <td className="table-cell text-gray-800">{assignment.assignedTo}</td>
                    <td className="table-cell text-center font-semibold text-gray-800">
                      {assignment.quantity}
                    </td>
                    <td className="table-cell text-gray-600 text-sm">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoData message="No assignments recorded yet" />
        )}
      </div>
    </Layout>
  );
};
