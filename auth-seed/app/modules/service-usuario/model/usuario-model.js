const mongoose = require('mongoose');
const crypto = require('crypto');
const db = require('../../../config/database');

const salter = (salt) => {
  if (salt === undefined) {
    return crypto.randomBytes(128).toString('hex');
  }
  return salt;
};

const schema = new mongoose.Schema(
  {
    nome: { type: String, lowercase: true, required: [true, 'nome é obrigatório!'] },
    sobreNome: { type: String, lowercase: true, required: [true, 'sobrenome é obrigatório!'] },
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
    idioma: { type: String, default: null },
    sexo: { type: String, default: null },
    dataNascimento: { type: String, default: null },
    telefoneCelular: { type: String, default: null },
    codigoSms: {
      validado: { type: Boolean, default: false },
      codigo: { type: String, default: null },
    },
    telefoneFixo: { type: String, default: null },
    status: { type: String, default: null },
    role: { type: String, default: null },
    endereco: {
      estado: { type: String, upppercase: true, default: null },
      cidade: { type: String, lowercase: true, default: null },
      bairro: { type: String, lowercase: true, default: null },
      logradouro: { type: String, lowercase: true, default: null },
      numero: { type: Number, default: null },
      cep: { type: Number, default: null },
      loc: { type: String, coordinates: [Number], default: null },
    },
    avatar: { type: String, default: null },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
      set: salter,
    },
    faceboobk: {
      idFacebook: { type: String, default: null },
    },
    google: {
      idGoogle: { type: String, default: null },
      token: { type: String, default: null },
      email: {
        type: String, default: null,
      },
    },
    provider: { type: String, default: null },
    lastAccess: { type: Date, default: Date.now },
    //   treino: { type: mongoose.Schema.Types.ObjectId, ref: 'Treino', default: null },
  },
  {
    collection: 'Usuarios',
    additionalProperties: true,
    // versionKey: true,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

// schema.pre('save', (next) => { });

// schema.post('save', (doc, next) => { });

schema.methods.encryptPassword = function (password) {
  if (this.salt === undefined) {
    this.salt = salter();
  }
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hashedPassword;
};

schema.methods.encryptPasswordVerify = function (password) {
  if (this.salt === undefined) {
    this.salt = salter();
  }
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

schema.virtual('userId').get(function () {
  return this.id;
});

schema.virtual('password').set(function (password) {
  if (this.salt !== undefined) {
    this.hashedPassword = this.encryptPassword(password);
    return this.hashedPassword;
  }
  return null;
}).get(function () {
  return this.plainPassword;
});

schema.set('toJSON', { getters: true, virtuals: false });
schema.set('toObject', { getters: true });

schema.methods.checkPassword = function (password) {
  // this.salt = crypto.createHash('md5').update(this.salt).digest('hex');
  return this.encryptPasswordVerify(password) === this.hashedPassword;
};

module.exports = db.mongooseConnection().model('Usuarios', schema);
