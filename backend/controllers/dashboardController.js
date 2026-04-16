const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');

exports.getDashboard = async (req, res) => {
  try {
    console.log('📊 Dashboard endpoint called - User:', req.user?.id, 'Role:', req.user?.role);
    
    // Get statistics
    const totalAssets = await Asset.countDocuments();
    const totalPurchases = await Purchase.countDocuments();
    const totalTransfers = await Transfer.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    // Get recent assets
    const recentAssets = await Asset.find().limit(5).sort({ createdAt: -1 });
    
    // Get status counts for assets
    const assetsByStatus = await Asset.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const dashboardData = {
      stats: {
        totalAssets,
        totalPurchases,
        totalTransfers,
        totalAssignments
      },
      assetsByStatus: assetsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentAssets
    };

    console.log('✓ Dashboard data retrieved:', { totalAssets, totalPurchases, totalTransfers, totalAssignments });
    res.json(dashboardData);
  } catch (error) {
    console.log('✗ Dashboard error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
