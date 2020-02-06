const logger = require('../../../config/log')({ module: 'Imovel Repository' });
const ImovelModel = require('../model/imovel-model');
const applicationError = require('../../../config/errors');

class ImovelRepository {
  constructor() {
    this.className = 'ImovelRepository';
    this.logger = logger;
    this.model = ImovelModel;
    this.applicationError = applicationError;
  }

  async getAll() {
    this.logger.accessLog.info(`${this.className} :: getAll`);
    try {
      return await this.model.find().exec();
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      throw err;
    }
  }


  async getByCoordinates(lnglat) {
    this.logger.accessLog.info(`${this.className} :: getByCoordinates`);
    try {
      return await this.model.find().where('localidade.location.coordinates').near({
        center: {
          type: 'Point',
          coordinates: lnglat,
        },
        maxDistance: 5,
      }).exec();
    } catch (err) {
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      throw err;
    }
  }

  async getById(id) {
    this.logger.accessLog.info(`${this.className} :: getById`);
    try {
      return await this.model.findById(id).exec();
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
      console.log(validate.errors);
      throw applicationError.throwsValidationError(validate.errors);
    } catch (err) {
      console.log(err);
      console.log(err);
      this.logger.accessLog.error(`Repository - error:  ${err}`);
      if (err.code === 11000) {
        throw applicationError.throwsDocumentoExistenteError('Registro existente');
      }
      throw err;
    }
  }

  async update(id, obj) {
    this.logger.accessLog.info(`${this.className} :: update`);
    try {
      const model = new this.model(obj);
      const validate = model.validateSync();
      if (!validate) {
        return await this.model.findByIdAndUpdate(id, obj).exec();
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

module.exports = new ImovelRepository();
