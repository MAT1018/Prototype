const Payment = require('../models/payment');
const Merchant = require('../models/merchant');
const MojaloopService = require('../services/mojaloopService');
const { v4: uuidv4 } = require('uuid');

class PaymentController {
  async initiatePayment(req, res) {
    const { qrCodeData, payerId, amount, currency } = req.body;

    try {
      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(qrCodeData);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid QR code data' });
      }

      if (!qrData.lei || !qrData.accountId) {
        return res.status(400).json({ error: 'QR code missing required fields' });
      }

      // Verify merchant exists
      const merchant = await Merchant.findOne({ lei: qrData.lei });
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant not found' });
      }

      // Create payment record
      const transactionId = uuidv4();
      const payment = new Payment({
        transactionId,
        merchantLei: qrData.lei,
        payerId,
        amount,
        currency: currency || 'USD',
        status: 'pending',
        qrCodeData: qrCodeData
      });

      await payment.save();

      // Initiate Mojaloop transfer
      const transferResult = await MojaloopService.initiateTransfer(
        payerId,
        qrData.lei,
        amount,
        currency
      );

      if (!transferResult.success) {
        payment.status = 'failed';
        await payment.save();
        return res.status(500).json({ error: 'Payment failed', details: transferResult.error });
      }

      payment.status = 'completed';
      await payment.save();

      res.json({
        success: true,
        transactionId,
        paymentStatus: payment.status,
        mojaloopResponse: transferResult.mojaloopResponse
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ error: 'Payment failed', details: error.message });
    }
  }

  async getPaymentStatus(req, res) {
    const { transactionId } = req.params;

    try {
      const payment = await Payment.findOne({ transactionId });
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Optionally check with Mojaloop for latest status
      if (payment.status === 'pending') {
        try {
          const mojaloopStatus = await MojaloopService.getTransferStatus(transactionId);
          if (mojaloopStatus.transactionState === 'COMMITTED') {
            payment.status = 'completed';
            await payment.save();
          }
        } catch (error) {
          console.error('Error checking Mojaloop status:', error);
        }
      }

      res.json({
        success: true,
        payment: {
          transactionId: payment.transactionId,
          merchantLei: payment.merchantLei,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          timestamp: payment.timestamp
        }
      });
    } catch (error) {
      console.error('Get payment status error:', error);
      res.status(500).json({ error: 'Failed to get payment status' });
    }
  }

  async listPayments(req, res) {
    try {
      const payments = await Payment.find({}, 'transactionId merchantLei amount currency status timestamp');
      res.json({
        success: true,
        payments
      });
    } catch (error) {
      console.error('List payments error:', error);
      res.status(500).json({ error: 'Failed to list payments' });
    }
  }
}

module.exports = new PaymentController();