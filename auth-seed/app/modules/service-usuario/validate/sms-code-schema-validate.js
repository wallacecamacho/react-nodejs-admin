const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  codeSms: Joi.string(),
});

module.exports = schema;
