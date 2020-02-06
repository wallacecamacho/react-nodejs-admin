const Joi = require('joi');
const logger = require('../../../config/log')({ module: 'Imovel Validate' });
const schema = require('./schema-validate');
const applicationError = require('../../../config/errors');

class Validate {
  constructor() {
    this.logger = logger;
    this.schema = schema;
    this.joi = Joi;
  }

  validateSchema(req, res, next) {
    this.logger.accessLog.debug('Valida request');
    const params = req.body;
    const resultValidate = Joi.validate(params, schema);

    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }
}
module.exports = new Validate();
