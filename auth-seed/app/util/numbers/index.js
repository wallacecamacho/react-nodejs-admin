
const crypto = require('crypto');
const biguint = require('biguint-format');

class NumberUtils {
  constructor() {
    this.crypto = crypto;
    this.biguint = biguint;
  }

  randomValueBase64(len) {
    return this.crypto
      .randomBytes(Math.ceil((len * 3) / 4))
      .toString('base64') // convert to base64 format
      .slice(0, len) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'
  }

  randomDecimal(qty) {
    return biguint(this.crypto.randomBytes(qty), 'dec').toString().slice(0, qty);
  }
}
module.exports = new NumberUtils();
