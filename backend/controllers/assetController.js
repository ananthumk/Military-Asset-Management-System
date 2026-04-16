const Asset = require('../models/Asset');

exports.createAsset = async (req, res) => {
  try {
    console.log('📦 Create asset - User:', req.user);
    if (!req.body.assetName || !req.body.category || !req.body.base) {
      console.log('✗ Create asset failed - Missing fields:', { assetName: !!req.body.assetName, category: !!req.body.category, base: !!req.body.base });
      return res.status(400).json({ message: "AssetName, category, and base are required" });
    }
    const asset = await Asset.create(req.body);
    console.log('✓ Asset created:', asset._id);
    res.status(201).json({ message: "Asset created", asset });
  } catch (error) {
    console.log('✗ Create asset error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    console.log('📦 Get assets - User:', req.user?.id);
    const assets = await Asset.find();
    console.log('✓ Assets fetched:', assets.length, 'items');
    res.json(assets);
  } catch (error) {
    console.log('✗ Get assets error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    console.log('✏️ Update asset - ID:', req.params.id, 'User:', req.user?.id);
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) {
      console.log('✗ Asset not found:', req.params.id);
      return res.status(404).json({ message: "Asset not found" });
    }
    console.log('✓ Asset updated:', asset._id);
    res.json({ message: "Asset updated", asset });
  } catch (error) {
    console.log('✗ Update asset error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    console.log('🗑️ Delete asset - ID:', req.params.id, 'User:', req.user?.id);
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      console.log('✗ Asset not found for deletion:', req.params.id);
      return res.status(404).json({ message: "Asset not found" });
    }
    console.log('✓ Asset deleted:', asset._id);
    res.json({ message: "Asset deleted", asset });
  } catch (error) {
    console.log('✗ Delete asset error:', error.message);
    res.status(500).json({ message: error.message });
  }
};