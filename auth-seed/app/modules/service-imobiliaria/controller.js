const logger = require('../../config/log')({ module: 'Imobiliaria Controller' });
const response = require('../../config/responseUtil');
const imobiliariaService = require('./service/imobiliaria-service');
const imobiliariaValidate = require('./validate/imobiliarias-validate');
const validateBusinessError = require('../../util/custom-exceptions/validate-business-error');
const documentoExistenteError = require('../../util/custom-exceptions/documento-existente-error');
const criptoUtils = require('../../util/cripto/cripto-utils');
const config = require('../../config');
const localeMessages = require('../../config/locale');
const constants = require('../../util/constants');

class ImobiliariaController {
  constructor() {
    this.logger = logger;
    this.imobiliariaValidate = imobiliariaValidate;
    this.service = imobiliariaService;
    this.validateBusinessError = validateBusinessError;
    this.documentoExistenteError = documentoExistenteError;
    this.criptoUtils = criptoUtils;
    this.config = config;
  }

  before(req, res, next) {
    this.logger.accessLog.debug(`ImobiliariaController - entrada: ${req.params}`);
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
   * POST - Inserir novo documento na colecao.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async post(req, res) {
    this.logger.accessLog.info('Controller - post');
    try {
      const obj = await this.service.post(req.body);
      if (obj) {
        if (req.body.imageData) {
          const imageValue = {
            base64Image: req.body.imageData,
            extension: req.body.imageData.split(';')[0],
            storage: 'remoto',
            name: this.criptoUtils.generateRandomFilename(),
            output: 'png',
            path: this.config.aws.bucket.imageProfile,
          };
          this.streamImage.put(imageValue);
          obj.thumb = `${imageValue.name}.${imageValue.output}`;
          this.service.put(obj);
        }
        this.logger.accessLog.debug('created: ', obj);

        const message = localeMessages.loadMessagesLocale(
          req.headers['content-language'], constants.INSERT_SUCESS,
        );
        return res.status(response.getCodeSuccessCreated())
          .send(response.successCreate(obj, message));
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
      const obj = await this.service.put(req.body);

      if (obj) {
        this.logger.accessLog.debug('updated: ', obj);
        if (req.body.imageData) {
          const imageValue = {
            base64Image: req.body.imageData,
            extension: req.body.imageData.split(';')[0],
            storage: 'remoto',
            name: obj.thumb || this.criptoUtils.generateRandomFilename(),
            output: 'png',
            path: this.config.aws.bucket.imageProfile,
          };
          this.streamImage.put(imageValue);
        }
        const message = localeMessages.loadMessagesLocale(
          req.headers['content-language'], constants.INSERT_SUCESS,
        );
        return res.status(response.getCodeSuccessUpdated())
          .send(response.successUpdate(obj, message));
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
module.exports = new ImobiliariaController();
