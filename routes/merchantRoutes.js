const express = require('express');
const router = express.Router();
const { registerMerchant, getMerchant } = require('../controllers/merchantController');
router.post('/register', registerMerchant);
router.get('/:lei', getMerchant);

module.exports = router;