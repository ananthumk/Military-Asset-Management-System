const Purchase = require('../models/Purchase');
const Asset = require('../models/Asset');

exports.createPurchase = async (req, res) => {
  try {
    console.log('🛒 Create purchase - User:', req.user?.id, 'Payload:', req.body);
    const { assetId, quantity, base } = req.body;

    if (!assetId || !quantity || !base) {
      console.log('✗ Missing fields - assetId:', !!assetId, 'quantity:', !!quantity, 'base:', !!base);
      return res.status(400).json({ message: "AssetId, quantity, and base are required" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      console.log('✗ Asset not found:', assetId);
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.quantity += quantity;
    await asset.save();

    const purchase = await Purchase.create({
      asset: assetId,
      quantity,
      base,
      createdBy: req.user.id
    });

    console.log('✓ Purchase created:', purchase._id);
    res.status(201).json({ message: "Purchase recorded", purchase });
  } catch (error) {
    console.log('✗ Create purchase error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    console.log('📦 Get purchases - User:', req.user?.id);
    const purchases = await Purchase.find().populate('asset');
    console.log('✓ Purchases fetched:', purchases.length, 'items');
    res.json(purchases);
  } catch (error) {
    console.log('✗ Get purchases error:', error.message);
    res.status(500).json({ message: error.message });
  }
};