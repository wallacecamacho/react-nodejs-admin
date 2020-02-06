const logger = require('../../../config/log')({ module: 'Imovel Service' });
const imovelRepository = require('../repository/imovel-repository');
const imovelValidate = require('../validate/validate');

class CorretorService {
  constructor() {
    this.logger = logger;
    this.repository = imovelRepository;
    this.validate = imovelValidate;
  }

  async getAll() {
    this.logger.accessLog.info('Service - getAll');
    try {
      return await this.repository.getAll();
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async getByCoordinates(lnglat) {
    this.logger.accessLog.info('Service - getByCoordinates');
    try {
      return await this.repository.getByCoordinates(lnglat);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async getById(id) {
    this.logger.accessLog.info(`Service - getById (${id})`);
    try {
      return await this.repository.getById(id);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async post(obj) {
    this.logger.accessLog.info('Service - post: ', obj);
    try {
      return await this.repository.insert(obj);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async put(id, obj) {
    this.logger.accessLog.info(`Service - put (${id})`, obj);
    try {
      return await this.repository.update(id, obj);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async delete(id) {
    this.logger.accessLog.info(`Service - delete (${id})`);
    try {
      return await this.repository.delete(id);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }
}
module.exports = new CorretorService();
