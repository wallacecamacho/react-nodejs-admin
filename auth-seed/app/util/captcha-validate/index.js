const Recaptcha = require('recaptcha-verify');
const logger = require('../../../app/config/log')({ module: 'categoria Validate' });
const applicationError = require('../../config/errors');
const config = require('../../config');

class CaptchaValidate {
  constructor() {
    this.logger = logger;
  }

  validate(req, res, next) {
    this.logger.accessLog.debug('Valida request Categoria');
    const userResponse = req.body.captchaToken || null;
    const recaptcha = new Recaptcha({
      secret: config.captcha.secretKey,
      verbose: true,
    });

    recaptcha.checkResponse(userResponse, (error, response) => {
      if (error) {
        return res.status(400).send(applicationError.throw(error, 'BadRequest'));
      }
      if (response.success) {
        return next();
      }
      return null;
    });
  }
}
module.exports = new CaptchaValidate();
