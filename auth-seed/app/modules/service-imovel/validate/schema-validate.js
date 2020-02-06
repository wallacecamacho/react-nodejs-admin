const Joi = require('joi');

const schemaBasico = Joi.object().keys({
  area: Joi.number().required(),
  categoriaImovel: Joi.object().keys({
    id: Joi.number().required(),
    nome: Joi.string().required(),
  }),
  numeroBanheiro: Joi.string().required(),
  numeroQuarto: Joi.string().required(),
  numeroVaga: Joi.string().required(),
  tipoImovel: Joi.object().keys({
    id: Joi.number().required(),
    nome: Joi.string().required(),
  }),
});

const schemaLocalidade = Joi.object().keys({
  bairro: Joi.string().required(),
  cep: Joi.string().required(),
  cidade: Joi.object().keys({
    long_name: Joi.string().required(),
    short_name: Joi.string().required(),
  }),
  complemento: Joi.string().min(1).allow(''),
  enderecoHtml: Joi.string().required(),
  estado: Joi.object().keys({
    long_name: Joi.string().required(),
    short_name: Joi.string().required(),
  }),
  location: Joi.object().keys({
    type: Joi.string().required().valid('Point'),
    coordinates: Joi.array(),
  }),
  numero: Joi.string().required(),
  pais: Joi.object().keys({
    long_name: Joi.string().required(),
    short_name: Joi.string().required(),
  }),
  placeId: Joi.string().required(),
  rua: Joi.string().required(),
});

const schemaValores = Joi.object().keys({
  valorAluguel: Joi.number().required(),
  valorCondominio: Joi.number().required(),
  valorIPTU: Joi.number().required(),
  valorIncluidoAgua: Joi.boolean().required(),
  valorIncluidoGas: Joi.boolean().required(),
  valorIncluidoInternet: Joi.boolean().required(),
  valorIncluidoLavanderia: Joi.boolean().required(),
  valorIncluidoLuz: Joi.boolean().required(),
  valorIncluidoTV: Joi.boolean().required(),
  valorNegociavel: Joi.boolean().required(),
});

const schema = Joi.object().keys({
  location: Joi.object().keys({
    type: Joi.string().required().valid('Point'),
    coordinates: Joi.array(),
  }),
  informacoes_basicas: schemaBasico,
  localidade: schemaLocalidade,
  valores: schemaValores,
});

module.exports = schema;
