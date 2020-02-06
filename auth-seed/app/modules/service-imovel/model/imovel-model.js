const mongoose = require('mongoose');
const db = require('../../../config/database');

const schema = new mongoose.Schema({
  location: {
    type: { type: String },
    coordinates: { type: [Number] },
  },
  informacoes_basicas: {
    area: { type: Number, required: [true, 'Area é obrigatório'] },
    categoriaImovel: {
      id: { type: Number, required: [true, ' Id da Categoria é Obrigatório'] },
      nome: { type: String, required: [true, 'Nome da Categoria é obrigatório'] },
    },
    numeroBanheiro: { type: String, required: [true, 'Numero de Banheiros é obrigatório!'] },
    numeroQuarto: { type: String, required: [true, 'Numero de Quartos é obrigatório!'] },
    numeroVaga: { type: String, required: [true, 'Numero de Vagas é obrigatório!'] },
    tipoImovel: {
      id: { type: Number, required: [true, ' Id do Tipo Imovel é obrigatório'] },
      nome: { type: String, required: [true, 'Nome do Tipo Imovel é obrigatório'] },
    },
  },

  localidade: {
    bairro: { type: String, required: [true, 'Bairro é obrigatório!'] },
    cep: { type: String, required: [true, 'CEP é obrigatório!'] },
    cidade: {
      long_name: { type: String, required: [true, ' LongName Obrigatório'] },
      short_name: { type: String, required: [true, 'ShortName é obrigatório'] },
    },
    complemento: { type: String },
    enderecoHtml: { type: String, required: [true, 'Endereco HTML é obrigatório!'] },
    estado: {
      long_name: { type: String, required: [true, ' LongName Obrigatório'] },
      short_name: { type: String, required: [true, 'ShortName é obrigatório'] },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        index: { type: '2dsphere', sparse: false },
      },
    },
    numero: { type: String, required: [true, 'Numero da Rua é obrigatório!'] },
    pais: {
      long_name: { type: String, required: [true, ' LongName Obrigatório'] },
      short_name: { type: String, required: [true, 'ShortName é obrigatório'] },
    },
    placeId: { type: String, required: [true, 'Place Id é obrigatório!'] },
    rua: { type: String, required: [true, 'Rua é obrigatório!'] },
  },
  valores: {
    valorAluguel: { type: Number, required: [true, 'ValorAluguel é obrigatório'] },
    valorCondominio: { type: Number, required: [true, 'ValorAluguel é obrigatório'] },
    valorIPTU: { type: Number, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoAgua: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoGas: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoInternet: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoLavanderia: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoLuz: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorIncluidoTV: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
    valorNegociavel: { type: Boolean, required: [true, 'ValorAluguel é obrigatório'] },
  },
}, {
  collection: 'Imoveis',
  additionalProperties: false,
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

schema.virtual('id').get(function () {
  return this._id;
});

module.exports = db.mongooseConnection().model('Imoveis', schema);
