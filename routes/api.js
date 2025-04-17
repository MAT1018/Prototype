const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const paymentController = require('../controllers/paymentController');

// Merchant routes
router.post('/merchants', merchantController.registerMerchant);
router.get('/merchants', merchantController.listMerchants);
router.get('/merchants/:lei', merchantController.getMerchantByLEI);

// Payment routes
router.post('/payments', paymentController.initiatePayment);
router.get('/payments/:transactionId', paymentController.getPaymentStatus);
router.get('/payments', paymentController.listPayments);

module.exports = router;