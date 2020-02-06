const applicationError = require('../../config/errors');
const logger = require('../../config/log')({ module: 'usuario Controller' });
const usuarioService = require('./service/usuario-service');
const response = require('../../config/responseUtil');
const usuarioValidate = require('./validate/usuario-validate');
const validateBusinessError = require('../../util/custom-exceptions/validate-business-error');
const usuarioExistenteError = require('../../util/custom-exceptions/documento-existente-error');
const documentoNaoEncontradoError = require('../../util/custom-exceptions/documento-nao-encontrado-error');
const localeMessages = require('../../config/locale');
const constants = require('../../util/constants');

class UsuarioController {
  constructor() {
    this.logger = logger;
    this.usuarioValidate = usuarioValidate;
    this.usuarioService = usuarioService;
    this.validateBusinessError = validateBusinessError;
    this.usuarioExistenteError = usuarioExistenteError;
    this.documentoNaoEncontradoError = documentoNaoEncontradoError;
  }

  before(req, res, next) {
    this.logger.accessLog.debug(`Controller - before dados dos usuarios ${req.params}`);
    return next();
  }

  /**
   * Carregar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  carregar(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos usuarios ${req.params}`);
    this.usuarioService.carregar()
      .then((usuarios) => {
        if (usuarios) {
          return res.send(usuarios);
        }
        return res.status(response.getCodeSuccessNoContent()).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar carregar ${req.params} `);
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Consultar Por Id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  consultarPorEmail(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos usuarios ${req.params}`);
    this.usuarioService.buscarUsuarioPorEmail(req.params.email)
      .then((usuarios) => {
        if (usuarios) {
          return res.send(usuarios);
        }
        return res.status(response.getCodeSuccessNoContent()).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar consultarPorEmail ${req.params} `);
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }


  /**
   * Cadastrar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  cadastrar(req, res) {
    this.logger.accessLog.debug('Cadastrar dados do usuario');
    const user = req.body;
    this.usuarioService.cadastrar(user)
      .then((result) => {
        this.logger.accessLog.debug(`Sucesso ao cadastrar usuario ${result}`);
        return res.status(response.getCodeSuccess()).send(response.successCreate());
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar cadastro de usuário ${req.params}`);
        if (err instanceof usuarioExistenteError) {
          return res.status(response.getCodeErrorDuplicateKey())
            .send(applicationError.conflitErrorJson(err));
        }
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Atualizar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  atualizar(req, res) {
    this.logger.accessLog.debug('Atualizar dados do usuario');
    const user = req.body;
    this.usuarioService.atualizar(user)
      .then((result) => {
        this.logger.accessLog.debug('atualizado dados do usuario', result);
        return res.status(response.getCodeSuccess()).send(response.successUpdate());
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar atualizar de usuário ${req.params}`);
        if (err instanceof usuarioExistenteError) {
          return res.status(response.getCodeErrorDuplicateKey())
            .send(applicationError.forbiddenErrorJson(err));
        }
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Atualizar e valida codigo sms
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  atualizarSmsCode(req, res) {
    this.logger.accessLog.debug('Atualizar dados do usuario');
    const user = req.body;
    this.usuarioService.atualizarSmsCode(user)
      .then((result) => {
        this.logger.accessLog.debug('atualizado dados do usuario', result);
        return res.status(response.getCodeSuccess()).send(response.successUpdate());
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar atualizar de usuário ${req.params}`);
        if (err instanceof usuarioExistenteError) {
          return res.status(response.getCodeErrorDuplicateKey())
            .send(applicationError.forbiddenErrorJson(err));
        }
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Re-enviar sms
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  reenviarSms(req, res) {
    this.logger.accessLog.debug('Atualizar dados do usuario');
    const user = req.body;
    this.usuarioService.reSendSms(user)
      .then(() => {
        this.logger.accessLog.debug('atualizado dados do usuario');
        return res.status(response.getCodeSuccess()).send(response.success());
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar atualizar de usuário ${req.params}`);
        if (err instanceof documentoNaoEncontradoError) {
          const message = localeMessages.loadMessagesLocale(
            req.headers['content-language'], constants.OBJECT_NOT_FOUNDED,
          );
          const newMessage = err;
          newMessage.message = message;
          return res.status(response.getCodeErrorDuplicateKey())
            .send(applicationError.forbiddenErrorJson(newMessage));
        }
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }


  /**
 * Remover
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  remover(req, res) {
    this.logger.accessLog.debug('Remover dados do usuario');
    const user = req.body;
    this.usuarioService.remover(user)
      .then((result) => {
        this.logger.accessLog.debug('retorno remover usuario', result);
        return res.status(response.getCodeSuccess()).send(response.success());
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar remover usuário ${req.params}`);
        return res.status(response.getCodeErrorInternalServer())
          .send(applicationError.internalServerErrorJson(err));
      });
  }
}
module.exports = new UsuarioController();
