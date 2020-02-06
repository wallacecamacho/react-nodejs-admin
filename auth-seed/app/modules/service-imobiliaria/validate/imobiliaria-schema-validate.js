const Joi = require('joi');

const schema = Joi.object().keys({
  id: Joi.string(),
  nome: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  telefone: Joi.string().required(),
  descricao: Joi.string(),
  urlImage: Joi.string(),
  imageData: Joi.string(),
});

module.exports = schema;
