const Merchant = require('../models/Merchant');

// Register a new merchant
exports.registerMerchant = async (req, res) => {
  const { name, lei, contact, location } = req.body;
  try {
    const existing = await Merchant.findOne({ lei });
    if (existing) return res.status(409).json({ message: 'Merchant with LEI already exists' });

    const newMerchant = new Merchant({ name, lei, contact, location });
    await newMerchant.save();
    res.status(201).json(newMerchant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get merchant by LEI
exports.getMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ lei: req.params.lei });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
    res.json(merchant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};