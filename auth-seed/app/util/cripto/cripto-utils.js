
const crypto = require('crypto');
const biguint = require('biguint-format');

class CriptoUtils {
  constructor() {
    this.crypto = crypto;
    this.biguint = biguint;
  }

  // this generates a random cryptographic filename
  // eslint-disable-next-line class-methods-use-this
  generateRandomFilename() {
    // create pseudo random bytes
    const bytes = crypto.pseudoRandomBytes(32);

    // create the md5 hash of the random bytes
    const checksum = crypto.createHash('MD5').update(bytes).digest('hex');

    // return as filename the hash with the output extension
    return `${checksum}`;
  }
}
module.exports = new CriptoUtils();
