const Expenditure = require('../models/Expenditure');
const Asset = require('../models/Asset');

exports.createExpenditure = async (req, res) => {
  try {
    const { assetId, quantity, reason, base } = req.body;

    if (!assetId || !quantity || !reason || !base) {
      return res.status(400).json({ message: "AssetId, quantity, reason, and base are required" });
    }

    const asset = await Asset.findOne({ _id: assetId, base });
    if (!asset) return res.status(404).json({ message: "Asset not found at specified base" });

    if (asset.quantity < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    asset.quantity -= quantity;
    await asset.save();

    const expenditure = await Expenditure.create({
      asset: assetId,
      quantity,
      reason,
      base,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Expenditure recorded", expenditure });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};