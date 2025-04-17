const QRCode = require('qrcode');

async function generateQRCode(data) {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

module.exports = { generateQRCode };