const express = require('express');
const router = express.Router();
const { registerMerchant, getMerchant } = require('../controllers/merchantcontroller');

router.post('/register', registerMerchant);
router.get('/:lei', getMerchant);

module.exports = router;