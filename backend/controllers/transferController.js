const Transfer = require('../models/Transfer');
const Asset = require('../models/Asset');

exports.createTransfer = async (req, res) => {
  try {
    console.log('🔄 Create transfer - User:', req.user?.id, 'Payload:', req.body);
    const { assetId, fromBase, toBase, quantity } = req.body;

    if (!assetId || !fromBase || !toBase || !quantity) {
      console.log('✗ Missing fields - assetId:', !!assetId, 'fromBase:', !!fromBase, 'toBase:', !!toBase, 'quantity:', !!quantity);
      return res.status(400).json({ message: "AssetId, fromBase, toBase, and quantity are required" });
    }

    const source = await Asset.findOne({ _id: assetId, base: fromBase });
    if (!source) {
      console.log('✗ Asset not found at source base:', { assetId, fromBase });
      return res.status(404).json({ message: "Asset not found at source base" });
    }
    
    if (source.quantity < quantity) {
      console.log('✗ Not enough stock:', { available: source.quantity, requested: quantity });
      return res.status(400).json({ message: "Not enough stock" });
    }

    source.quantity -= quantity;
    await source.save();

    let dest = await Asset.findOne({ assetName: source.assetName, base: toBase });

    if (!dest) {
      dest = await Asset.create({
        assetName: source.assetName,
        category: source.category,
        quantity: quantity,
        base: toBase
      });
    } else {
      dest.quantity += quantity;
      await dest.save();
    }

    const transfer = await Transfer.create({
      asset: assetId,
      fromBase,
      toBase,
      quantity,
      createdBy: req.user.id
    });

    console.log('✓ Transfer created:', transfer._id);
    res.status(201).json({ message: "Transfer successful", transfer });
  } catch (error) {
    console.log('✗ Create transfer error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getTransfers = async (req, res) => {
  try {
    console.log('📦 Get transfers - User:', req.user?.id);
    const transfers = await Transfer.find().populate('asset');
    console.log('✓ Transfers fetched:', transfers.length, 'items');
    res.json(transfers);
  } catch (error) {
    console.log('✗ Get transfers error:', error.message);
    res.status(500).json({ message: error.message });
  }
};