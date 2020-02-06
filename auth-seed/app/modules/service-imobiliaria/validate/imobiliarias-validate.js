const Joi = require('joi');
const logger = require('../../../config/log')({ module: 'Imobiliaria Validate' });
const schema = require('./imobiliaria-schema-validate');
const applicationError = require('../../../config/errors');

class ImobiliariaValidate {
  constructor() {
    this.logger = logger;
    this.schema = schema;
    this.joi = Joi;
  }

  validatSchema(req, res, next) {
    this.logger.accessLog.debug('Valida request Imobiliaria');
    const params = req.body;
    const resultValidate = Joi.validate(params, schema);

    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }
}
module.exports = new ImobiliariaValidate();
