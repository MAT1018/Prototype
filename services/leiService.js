const axios = require('axios');
const path = require('path');
const config = require(path.join(__dirname, '../config/default.json'));
const cache = require('memory-cache');

class LEIService {
  constructor() {
    this.cache = new cache.Cache();
  }

  async validateLEI(lei) {
    // Check cache first
    const cached = this.cache.get(lei);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${config.lei.validationEndpoint}?lei=${lei}`);
      const data = response.data;

      if (data && data.length > 0 && data[0].Entity && data[0].Entity.LegalName) {
        const result = {
          valid: true,
          legalName: data[0].Entity.LegalName,
          registrationDate: data[0].Registration.InitialRegistrationDate,
          status: data[0].Registration.RegistrationStatus
        };

        // Cache the result
        this.cache.put(lei, result, config.lei.cacheTTL);
        return result;
      }

      return { valid: false };
    } catch (error) {
      console.error('LEI validation error:', error);
      throw new Error('Failed to validate LEI');
    }
  }

  generateQRCodeData(lei, accountId) {
    return JSON.stringify({
      version: '1.0',
      type: 'merchant-payment',
      lei: lei,
      accountId: accountId,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new LEIService();