const response = require('../../config/responseUtil');
const logger = require('../../config/log')({ module: 'Imovel Controller' });
const imovelService = require('./service/imovel-service');
const imovelValidate = require('./validate/validate');
const validateBusinessError = require('../../util/custom-exceptions/validate-business-error');
const documentoExistenteError = require('../../util/custom-exceptions/documento-existente-error');

class ImovelController {
  constructor() {
    this.logger = logger;
    this.validate = imovelValidate;
    this.service = imovelService;
    this.validateBusinessError = validateBusinessError;
    this.documentoExistenteError = documentoExistenteError;
  }

  before(req, res, next) {
    this.logger.accessLog.debug(`ImovelController - entrada: ${req.params}`);
    return next();
  }

  /**
   * GET  Consultar todos os documentos.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAll(req, res) {
    this.logger.accessLog.info('Controller - getAll');
    try {
      const list = await this.service.getAll();

      if (list && list instanceof Array) {
        this.logger.accessLog.debug('number of returned documents: ', list.length);
        return res.status(response.getCodeSuccess()).send(response.success(list));
      }
    } catch (err) {
      this.logger.accessLog.error('Controller - error');
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
    return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer());
  }

  /**
   * GET/:id Consultar documento por id.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getById(req, res) {
    this.logger.accessLog.info('Controller - getById');
    try {
      const id = req.params.id || null;
      const obj = await this.service.getById(id);

      if (obj) {
        this.logger.accessLog.debug('obj: ', obj);
        return res.status(response.getCodeSuccess()).send(response.success(obj));
      }

      return res.status(response.getCodeErrorNotFound()).send(response.errorNotFound());
    } catch (err) {
      this.logger.accessLog.error('Controller - error');
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
  }

  /**
   * GET/:id Consultar documento por id.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getByCoordinates(req, res) {
    this.logger.accessLog.info('Controller - getByCoordinates');
    try {
      const lng = req.params.lng ? Number(req.params.lng) : null;
      const lat = req.params.lat ? Number(req.params.lat) : null;
      const lnglat = [lng, lat];
      const list = await this.service.getByCoordinates(lnglat);

      if (list) {
        this.logger.accessLog.debug('obj: ', list);
        return res.status(response.getCodeSuccess()).send(response.success(list));
      }
    } catch (err) {
      this.logger.accessLog.error('Controller - error');
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
    return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer());
  }

  /**
   * POST - Inserir novo documento na colecao.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async post(req, res) {
    this.logger.accessLog.info('Controller - post');
    try {
      const body = req.body || null;
      const inserted = await this.service.post(body);

      if (inserted) {
        this.logger.accessLog.debug('created: ', inserted);
        return res.status(response.getCodeSuccessCreated()).send(response.successCreate(inserted));
      }
    } catch (err) {
      this.logger.accessLog.error('Controller - erro');
      if (err instanceof this.documentoExistenteError) {
        return res.status(response.getCodeErrorDuplicateKey()).send(response.errorDuplicateKey(err));
      }
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
    return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer());
  }

  /**
   * PUT/:id - Alterar documento existente na colecao.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async put(req, res) {
    this.logger.accessLog.info('Controller - put');
    try {
      const id = req.params.id || null;
      const updated = await this.service.put(id, req.body);

      if (updated) {
        this.logger.accessLog.debug('updated: ', updated);
        return res.status(response.getCodeSuccessUpdated()).send(response.success_update(updated._id));
      }

      return res.status(response.getCodeErrorNotFound()).send(response.errorNotFound());
    } catch (err) {
      this.logger.accessLog.error('Controller - error');
      if (err instanceof this.documentoExistenteError) {
        return res.status(response.getCodeErrorDuplicateKey()).send(response.errorDuplicateKey(err));
      }
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
  }

  /**
   * DELETE/:id - Remover documento existente na colecao.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async delete(req, res) {
    this.logger.accessLog.info('Controller - delete');
    try {
      const id = req.params.id || null;
      const deleted = await this.service.delete(id);

      if (deleted) {
        this.logger.accessLog.debug('deleted: ', deleted);
        return res.status(response.getCodeSuccessDeleted()).send(response.successDelete(deleted._id));
      }

      return res.status(response.getCodeErrorNotFound()).send(response.errorNotFound());
    } catch (err) {
      this.logger.accessLog.error('Controller - error');
      return res.status(response.getCodeErrorInternalServer()).send(response.errorInternalServer(err));
    }
  }
}
module.exports = new ImovelController();
