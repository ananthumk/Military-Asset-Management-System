const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');

exports.createAssignment = async (req, res) => {
  try {
    const { assetId, assignedTo, quantity, base } = req.body;

    if (!assetId || !assignedTo || !quantity || !base) {
      return res.status(400).json({ message: "AssetId, assignedTo, quantity, and base are required" });
    }

    const asset = await Asset.findOne({ _id: assetId, base });
    if (!asset) return res.status(404).json({ message: "Asset not found at specified base" });

    if (asset.quantity < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    asset.quantity -= quantity;
    await asset.save();

    const assignment = await Assignment.create({
      asset: assetId,
      assignedTo,
      quantity,
      base,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Assigned", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('asset');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};