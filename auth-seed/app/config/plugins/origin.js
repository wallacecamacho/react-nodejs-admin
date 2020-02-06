const config = require('../../config/');

class Origin {
  constructor() {
    this.config = config;
  }

  proccess(req, res, next) {
    if (this.config.origin) {
      if (!this.hasApplication(req)) { return next(this.applicationErrors.throw('O header x-origin-application é obrigatório.', 'PreconditionFailedError')); } // 412

      if (!this.hasChannel(req)) { return next(this.applicationErrors.throw('O header x-origin-channel é obrigatório.', 'PreconditionFailedError')); } // 412

      if (!this.hasDevice(req)) { return next(this.applicationErrors.throw('O header x-origin-device é obrigatório.', 'PreconditionFailedError')); } // 412
    }

    req.origin = {
      application: req.header('x-origin-application'),
      channel: req.header('x-origin-channel'),
      device: req.header('x-origin-device'),
    };

    return next();
  }

  hasApplication(req) {
    return this.config.origin.require.application ? req.header('x-origin-channel') : true;
  }

  hasChannel(req) {
    return this.config.origin.require.channel ? req.header('x-origin-channel') : true;
  }

  hasDevice(req) {
    return this.config.origin.require.device ? req.header('x-origin-device') : true;
  }
}

module.exports = new Origin();
