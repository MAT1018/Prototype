const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true
  },
  lei: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{18,20}$/.test(v);
      },
      message: props => `${props.value} is not a valid LEI!`
    }
  },
  accountId: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Merchant', merchantSchema);