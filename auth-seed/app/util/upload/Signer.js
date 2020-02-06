const cf = require();
const moment = require('moment');

const options = {
  keypairId: process.env.AWS_CLOUDFRONT_KEY_ID,
  privateKeyPath: process.env.AWS_CLOUDFRONT_KEY_PATH,
  expireTime: moment().add(1, 'd'),
};

class Signer {
  static sign(key, type, prefix) {
    try {
      const ext = type === 'video' ? 'mp4' : 'jpg';
      const file = `${key}.${ext}`;

      const signedUrl = cf.getSignedUrl(`${process.env.AWS_CLOUDFRONT_URL}/${prefix}/${file}`, options);

      return signedUrl;
    } catch (e) {
      return null;
    }
  }
}

module.exports = Signer;
