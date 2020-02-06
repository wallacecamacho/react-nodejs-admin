const Joi = require('joi');

const schema = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  nome: Joi.string().required(),
  sobreNome: Joi.string().required(),
  email: Joi.string().email().required(),
  telefoneCelular: Joi.number().integer().max(+9999999999999).required(),
  google: {
    id: Joi.number(),
    token: Joi.string(),
  },
  captchaToken: Joi.string(),
  idioma: Joi.string().required(),
});

module.exports = schema;
