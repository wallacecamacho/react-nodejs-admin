const logger = require('../../../config/log')({ module: 'imobiliaria Service' });
const imobiliariaRepository = require('../repository/imobiliaria-repository');
const imobiliariaValidate = require('../validate/imobiliarias-validate');

class ImobiliariaService {
  constructor() {
    this.logger = logger;
    this.imobiliariaRepository = imobiliariaRepository;
    this.imobiliariaValidate = imobiliariaValidate;
  }

  async getAll() {
    this.logger.accessLog.info('Service - getAll');
    try {
      return await this.imobiliariaRepository.getAll();
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async getById(id) {
    this.logger.accessLog.info(`Service - getById (${id})`);
    try {
      return await this.imobiliariaRepository.getById(id);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async post(obj) {
    this.logger.accessLog.info('Service - post: ', obj);
    try {
      return await this.imobiliariaRepository.insert(obj);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async put(obj) {
    this.logger.accessLog.info(`Service - put ${obj}`);
    try {
      return await this.imobiliariaRepository.update(obj);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }

  async delete(id) {
    this.logger.accessLog.info(`Service - delete (${id})`);
    try {
      return await this.imobiliariaRepository.delete(id);
    } catch (err) {
      this.logger.accessLog.error(`Service - error:  ${err}`);
      throw err;
    }
  }
}
module.exports = new ImobiliariaService();
