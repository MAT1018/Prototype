const Merchant = require('../models/merchant');
const LEIService = require('../services/leiService');
const { generateQRCode } = require('../utils/qrGenerator');

class MerchantController {
  async registerMerchant(req, res) {
    const { businessName, lei, accountId } = req.body;

    try {
      // Validate LEI
      const leiValidation = await LEIService.validateLEI(lei);
      if (!leiValidation.valid) {
        return res.status(400).json({ error: 'Invalid LEI' });
      }

      // Generate QR code data
      const qrCodeData = LEIService.generateQRCodeData(lei, accountId);
      const qrCode = await generateQRCode(qrCodeData);

      // Create merchant record
      const merchant = new Merchant({
        businessName,
        lei,
        accountId,
        qrCode,
        verified: true
      });

      await merchant.save();

      res.status(201).json({
        success: true,
        merchant: {
          id: merchant._id,
          businessName: merchant.businessName,
          lei: merchant.lei,
          qrCode: merchant.qrCode,
          registrationDate: merchant.registrationDate
        }
      });
    } catch (error) {
      console.error('Merchant registration error:', error);
      res.status(500).json({ error: 'Failed to register merchant' });
    }
  }

  async getMerchantByLEI(req, res) {
    const { lei } = req.params;

    try {
      const merchant = await Merchant.findOne({ lei });
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant not found' });
      }

      res.json({
        success: true,
        merchant: {
          id: merchant._id,
          businessName: merchant.businessName,
          lei: merchant.lei,
          qrCode: merchant.qrCode
        }
      });
    } catch (error) {
      console.error('Get merchant error:', error);
      res.status(500).json({ error: 'Failed to get merchant' });
    }
  }

  async listMerchants(req, res) {
    try {
      const merchants = await Merchant.find({}, 'businessName lei registrationDate');
      res.json({
        success: true,
        merchants
      });
    } catch (error) {
      console.error('List merchants error:', error);
      res.status(500).json({ error: 'Failed to list merchants' });
    }
  }
}

module.exports = new MerchantController();