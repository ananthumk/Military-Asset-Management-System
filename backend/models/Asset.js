const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Vehicle', 'Weapon', 'Ammunition'],
    required: true
  },
  quantity: { type: Number, default: 0 },
  base: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);