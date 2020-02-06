const Joi = require('joi');
const logger = require('../../../config/log')({ module: 'usuario Validate' });
const schema = require('./usuario-schema-validate');
const codeSmsSchema = require('./sms-code-schema-validate');
const schemaNewUser = require('./registro-usuario-schema-validate');
const applicationError = require('../../../config/errors');

class ValidateUsuario {
  constructor() {
    this.logger = logger;
    this.schema = schema;
    this.codeSmsSchema = codeSmsSchema;
    this.joi = Joi;
  }

  validatSchema(req, res, next) {
    this.logger.accessLog.debug('Valida request inserir usuario', req.param);
    const user = req.body;
    const resultValidate = Joi.validate(user, schema);
    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }

  validatSmsCodeSchema(req, res, next) {
    this.logger.accessLog.debug('Valida request inserir usuario', req.param);
    const user = req.body;
    const resultValidate = Joi.validate(user, codeSmsSchema);
    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }

  validatSchemaNewUser(req, res, next) {
    this.logger.accessLog.debug('Valida request inserir usuario', req.param);
    const user = req.body;
    const resultValidate = Joi.validate(user, schemaNewUser);
    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }

  validateEmail(req, res, next) {
    this.logger.accessLog.debug('Valida request inserir usuario', req.params);
    const param = req.params;
    this.schema = Joi.object().keys({
      email: Joi.string().lowercase()
        .required()
        .email(),
    });
    const resultValidate = Joi.validate(param, this.schema);
    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }

  validateNumeroCelular(req, res, next) {
    this.logger.accessLog.debug('Valida request inserir usuario', req.params);
    const param = req.params;
    this.schema = Joi.object().keys({
      numeroCelular: Joi.string().lowercase()
        .required()
        .email(),
    });
    const resultValidate = Joi.validate(param, this.schema);
    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }
}
module.exports = new ValidateUsuario();
