const express = require('express');
const router = express.Router();
const { registerMerchant, getMerchant } = require('../controllers/merchantController');

// TEMPORARY TEST ROUTE
router.post('/register', (req, res) => {
  console.log("✅ Hit /register with:", req.body);
  res.status(200).json({ message: "Register route works!" });
});

router.get('/:lei', (req, res) => {
  res.status(200).json({ message: "Get merchant works!" });
});

module.exports = router;