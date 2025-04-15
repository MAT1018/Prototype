const Merchant = require('../models/Merchant');

// ✅ Register a new merchant
exports.registerMerchant = async (req, res) => {
  console.log("💥 Register Merchant API hit");
  console.log("📩 Received data:", req.body);

  const { name, lei, contact, location } = req.body;

  // Validate request
  if (!name || !lei || !contact || !location) {
    return res.status(400).json({ message: '❌ All fields (name, lei, contact, location) are required' });
  }

  try {
    const existingMerchant = await Merchant.findOne({ lei });

    if (existingMerchant) {
      console.log("⚠️ Merchant already exists:", existingMerchant);
      return res.status(409).json({ message: '❌ Merchant with this LEI already exists' });
    }

    const newMerchant = new Merchant({ name, lei, contact, location });
    await newMerchant.save();

    console.log("✅ New Merchant saved:", newMerchant);
    res.status(201).json(newMerchant);
  } catch (err) {
    console.error("❌ Error saving merchant:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get merchant by LEI
exports.getMerchant = async (req, res) => {
  console.log(`💥 Fetch Merchant by LEI hit - ${req.params.lei}`);

  try {
    const merchant = await Merchant.findOne({ lei: req.params.lei });

    if (!merchant) {
      console.log("⚠️ No merchant found for LEI:", req.params.lei);
      return res.status(404).json({ message: '❌ Merchant not found' });
    }

    console.log("✅ Merchant found:", merchant);
    res.status(200).json(merchant);
  } catch (err) {
    console.error("❌ Error fetching merchant:", err.message);
    res.status(500).json({ error: err.message });
  }
};