const Resize = require('../image/Resize');

class StreamImage {
  static async put(params) {
    this.resize = new Resize(params);
  }
}

module.exports = StreamImage;
