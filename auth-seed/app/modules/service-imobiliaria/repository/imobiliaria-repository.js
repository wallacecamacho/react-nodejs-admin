const logger = require('../../../config/log')({ module: 'imobiliaria Repository' });
const ImobiliariaModel = require('../model/imobiliaria-model');
const applicationError = require('../../../config/errors');
const config = require('../../../config');

class ImobiliariaRepository {
  constructor() {
    this.className = 'ImobiliariaRepository';
    this.logger = logger;
    this.model = ImobiliariaModel;
    this.applicationError = applicationError;
  }

  async getAll() {
    this.logger.accessLog.info(`${this.className} :: getAll`);
    try {
      let retValue = await this.model.find().exec();
      retValue = retValue.map((value) => {
        const r = {
          id: value._id, 
          telefone: value.telefone,
          status: value.status,
          thumb: value.thumb ? `${this.config.aws.s3}/${this.config.aws.bucket.imageProfile}/${value.thumb}` : null,
          nome: value.nome,
          email: value.email,
          descricao: value.descricao,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        };
        return r;
      });
      return retValue;
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      throw err;
    }
  }

  async getById(id) {
    this.logger.accessLog.info(`${this.className} :: getById`);
    try {
      let retValue = await this.model.findById(id).exec();
      retValue = {
        id: retValue._id, 
        telefone: retValue.telefone,
        status: retValue.status,
        thumb: retValue.thumb ? `${this.config.aws.s3}/${this.config.aws.bucket.imageProfile}/${retValue.thumb}` : null,
        nome: retValue.nome,
        email: retValue.email,
        descricao: retValue.descricao,
        createdAt: retValue.createdAt,
        updatedAt: retValue.updatedAt,
      };
      return retValue;
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      throw err;
    }
  }

  async insert(obj) {
    this.logger.accessLog.info(`${this.className} :: insert`);
    try {
      const model = new this.model(obj);
      const validate = model.validateSync();
      if (!validate) {
        return await model.save();
      }
      throw applicationError.throwsValidationError(validate.errors);
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      if (err.code === 11000) {
        throw applicationError.throwsDocumentoExistenteError('Registro existente');
      }
      throw err;
    }
  }

  async update(obj) {
    this.logger.accessLog.info(`${this.className} :: update`);
    try {
      const model = new this.model(obj);
      const validate = model.validateSync();
      if (!validate) {
        await this.model.findByIdAndUpdate(obj.id, obj).exec();
        return await this.getById(obj.id);
      }
      throw applicationError.throwsValidationError(validate.errors);
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      if (err.code === 11000) {
        throw applicationError.throwsDocumentoExistenteError('Registro existente');
      }
      throw err;
    }
  }

  async delete(id) {
    this.logger.accessLog.info(`${this.className} :: delete`);
    try {
      return await this.model.findByIdAndRemove(id).exec();
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      throw err;
    }
  }
}

module.exports = new ImobiliariaRepository();
