const logger = require('../../../config/log')({ module: 'usuario Service' });
const usuarioRepository = require('../repository/usuario-repository');
const usuarioValidate = require('../validate/usuario-validate');
const sendEmail = require('../../../util/email/sender');
const sendSms = require('../../../util/sms-twilio/sender');
const config = require('../../../config');
const localeMessages = require('../../../config/locale');
const constants = require('../../../util/constants');
const randomNumbers = require('../../../util/numbers');

class UsuarioService {
  constructor() {
    this.logger = logger;
    this.config = config;
    this.usuarioRepository = usuarioRepository;
    this.usuarioValidate = usuarioValidate;
    this.sendEmail = sendEmail;
    this.sendSms = sendSms;
    this.localeMessages = localeMessages;
    this.randomNumbers = randomNumbers;
  }

  carregar() {
    this.logger.accessLog.debug('UsuarioService - Chamando usuarios repository');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.carregar()
        .then((usuarios) => {
          if (usuarios) {
            this.logger.accessLog.debug(`Retornando objetos do banco:  ${usuarios.length}`);
            return resolve(usuarios);
          }
          return reject();
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar carregar ${err}`);
          return reject();
        });
    });
  }

  buscarUsuarioPorEmail(email) {
    this.logger.accessLog.debug(`Buscar usuario por email ${email}`);
    return new Promise((resolve, reject) => {
      this.usuarioRepository.buscarUsuarioPorEmail(email)
        .then((result) => {
          this.logger.accessLog.debug(`usuario por email ${email}`);
          return resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(err);
        });
    });
  }

  cadastrar(param) {
    this.logger.accessLog.info('Executando cadastrar service', param);
    return new Promise((resolve, reject) => {
      const smsCode = randomNumbers.randomDecimal(this.config.sms.config.qtyNumbersKey);
      const user = param;
      user.codigoSms = {
        validado: false,
        codigo: smsCode,
      };
      this.usuarioRepository.inserirUsuario(user)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario.id}`);
            if (this.config.mailer.permitSend) {
              this.sendEmail(usuario.email, constants.MSG_WELCOME,
                constants.TEMPLATE_EMAIL_WELCOME, usuario);
            }
            if (this.config.sms.config.permitSend) {
              const messageSms = localeMessages.loadMessagesLocale(user.idioma,
                constants.MSG_SMS_CODE_NEW_USER, [smsCode]);
              this.sendSms(this.config.sms.twilio.twilioNumber, param.telefoneCelular, messageSms);
            }
            return resolve(usuario);
          }
          return null;
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar cadastrar ${err}`);
          return reject(err);
        });
    });
  }

  reSendSms(param) {
    this.logger.accessLog.info('Executando atualizar service');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.reenviarSms(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);

            if (this.config.sms.config.permitSend) {
              const messageSms = localeMessages.loadMessagesLocale(usuario.idioma,
                constants.MSG_SMS_CODE_NEW_USER, [usuario.codigoSms.codigo]);
              this.sendSms(this.config.sms.twilio.twilioNumber, param.telefoneCelular, messageSms);
            }

            return resolve(usuario);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar atualizar ${err}`);
          return reject(err);
        });
    });
  }


  atualizar(param) {
    this.logger.accessLog.info('Executando atualizar service');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.atualizarUsuario(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);
            return resolve(usuario);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar atualizar ${err}`);
          return reject(err);
        });
    });
  }

  atualizarSmsCode(param) {
    this.logger.accessLog.info('Executando atualizar service');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.buscarUsuarioPorEmail(param.email)
        .then((result) => {
          this.logger.accessLog.debug(`usuario por email ${param.email}`, result);
          const updatedValue = result;
          updatedValue.codigoSms.validado = true;
          this.usuarioRepository.atualizarUsuarioSemValidate(updatedValue)
            .then((usuario) => {
              if (usuario) {
                this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);
                return resolve(usuario);
              }
              return resolve(null);
            })
            .catch((err) => {
              this.logger.accessLog.error(`Erro ao executar atualizar ${err}`);
              return reject(err);
            });
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(err);
        });
    });
  }

  remover(param) {
    this.logger.accessLog.info('Executando remover service');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.removerUsuario(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);
            return resolve(usuario);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar remover ${err}`);
          return reject(err);
        });
    });
  }
}
module.exports = new UsuarioService();
