const mongoose = require('mongoose');
const db = require('../../../config/database');

const schema = new mongoose.Schema({
  nome: { type: String, unique: true, required: [true, 'Nome é obrigatório!'] },
  email: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'e-mail é obrigatório!'],
    validate: {
      validator(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: '{VALUE} não é um e-mail válido!',
    },
  },
  descricao: { type: String, lowercase: true, required: [true, 'Descrição é obrigatório!'] },
  telefone: { type: String, default: null },
  status: { type: String, default: null },
  thumb: { type: String, default: null },
}, {
  collection: 'Imobiliarias',
  additionalProperties: false,
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

schema.virtual('id').get(function () {
  return this._id;
});

module.exports = db.mongooseConnection().model('Imobiliarias', schema);
