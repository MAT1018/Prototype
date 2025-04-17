const axios = require('axios');
const path = require('path');
const config = require(path.join(__dirname, '../config/default.json'));
const { v4: uuidv4 } = require('uuid');

class MojaloopService {
  async initiateTransfer(payerId, merchantLei, amount, currency) {
    const transactionId = uuidv4();
    
    const transferRequest = {
      homeTransactionId: transactionId,
      from: {
        idType: 'MSISDN',
        idValue: payerId
      },
      to: {
        idType: 'LEI',
        idValue: merchantLei
      },
      amountType: 'SEND',
      currency: currency || config.mojaloop.currency,
      amount: amount.toString(),
      transactionType: 'MERCHANT_PAYMENT',
      note: `Payment to merchant ${merchantLei}`,
      expiration: new Date(Date.now() + 60000).toISOString()
    };

    try {
      const response = await axios.post(
        `${config.mojaloop.endpoint}/transfers`,
        transferRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.mojaloop.oauthToken}`,
            'FSPIOP-Source': config.mojaloop.dfspId
          }
        }
      );

      return {
        success: true,
        transactionId: transactionId,
        mojaloopResponse: response.data
      };
    } catch (error) {
      console.error('Mojaloop transfer error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async getTransferStatus(transactionId) {
    try {
      const response = await axios.get(
        `${config.mojaloop.endpoint}/transfers/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.mojaloop.oauthToken}`,
            'FSPIOP-Source': config.mojaloop.dfspId
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Mojaloop transfer status error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new MojaloopService();