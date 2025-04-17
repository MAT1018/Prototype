const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  merchantLei: {
    type: String,
    required: true
  },
  payerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  qrCodeData: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Payment', paymentSchema);