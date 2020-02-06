const logger = require('../../../config/log')({ module: 'usuario Repository' });
const UsuarioModel = require('../model/usuario-model');
const applicationError = require('../../../config/errors');
const constants = require('../../../util/constants');


class UsuarioRepository {
  constructor() {
    this.logger = logger;
    this.UsuarioModel = UsuarioModel;
    this.applicationError = applicationError;
  }

  carregar() {
    return new Promise((resolve) => {
      this.UsuarioModel.find().select(
        '_id endereco config sexo dataNascimento telefone status perfil updatedAt lastAccess nome sobreNome email',
      ).exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.debug(`carregar::UsuarioRepository - Retornou objeto do banco: ${result.length}`);
          }
          return resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`carregar::Erro ao executar carregar ${err}`);
        });
    });
  }

  inserirUsuario(param) {
    this.logger.accessLog.info('inserirUsuario::Inserindo objeto no banco');
    return new Promise((resolve, reject) => {
      const user = new this.UsuarioModel(param);
      user.role = constants.ROLE_USER;
      user.status = constants.STATUS_USER_ATIVO;
      user.provider = param.provider || constants.PROVIDER_LOCAL;
      user.encryptPassword(param.password);
      const validate = user.validateSync();
      if (!validate) {
        user.save((err, result) => {
          if (err) {
            if (err.code === 11000) {
              logger.accessLog.error('inserirUsuario::Objeto Atualizado documento já existe na base de dados', err);
              return reject(applicationError.throwsDocumentoExistenteError('Usuário existente na base de dados'));
            }
          }
          logger.accessLog.info(`inserirUsuario::Objeto inserido no banco: ${result.id}`, `${result.id}`);
          return resolve(result);
        });
      } else {
        return reject(validate);
      }
      return null;
    });
  }

  atualizarUsuario(param) {
    this.logger.accessLog.info('atualizarUsuario::Atualizar objeto no banco');
    return new Promise((resolve, reject) => {
      const user = new this.UsuarioModel(param);
      const validate = user.validateSync();
      if (!validate) {
        this.UsuarioModel.findByIdAndUpdate(param._id, param).exec()
          .then((result) => {
            if (result) {
              this.logger.accessLog.info(`atualizarUsuario::Objeto atualizado no banco: ${result.id}`, result.id);
              return resolve(result);
            }
            this.logger.accessLog.info('atualizarUsuario::Objeto não existe na base de dados');
            return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
          }).catch((err) => {
            this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
            return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
          });
        return null;
      }
      this.logger.accessLog.error(`buscarUsuarioPorEmail::Objeto nao encontrado ${param._id}`);
      return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
    });
  }


  atualizarUsuarioSemValidate(param) {
    this.logger.accessLog.info('atualizarUsuario::Atualizar objeto no banco');
    return new Promise((resolve, reject) => {
      const user = new this.UsuarioModel(param);
      this.UsuarioModel.findByIdAndUpdate(param._id, param).exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.info(`atualizarUsuario::Objeto atualizado no banco: ${result.id}`, result.id);
            return resolve(result);
          }
          this.logger.accessLog.info('atualizarUsuario::Objeto não existe na base de dados');
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        }).catch((err) => {
          this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        });
      return null;
    });
  }

  reenviarSms(param) {
    this.logger.accessLog.info('atualizarUsuario::Atualizar objeto no banco');
    const idParam = param._id;
    delete param._id;

    return new Promise((resolve, reject) => {
      this.UsuarioModel.findByIdAndUpdate(idParam, param).exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.info(`atualizarUsuario::Objeto atualizado no banco: ${result.id}`, result.id);
            return resolve(result);
          }
          this.logger.accessLog.info('atualizarUsuario::Objeto não existe na base de dados');
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        }).catch((err) => {
          this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        });
      return null;
    });
  }

  removerUsuario(param) {
    this.logger.accessLog.info('removerUsuario::Remover objeto no banco');
    return new Promise((resolve, reject) => {
      const user = new UsuarioModel(param);
      user.status = 'DESAT';
      this.UsuarioModel.findByIdAndUpdate(param._id, param).exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.info('removerUsuario::Objeto removido no banco: ', result.id);
            return resolve(result);
          }
          this.logger.accessLog.info('atualizarUsuario::Objeto não existe na base de dados');
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        }).catch((err) => {
          this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(applicationError.throwsDocumentoNaoEncontradoError('Not Founded'));
        });
      return null;
    });
  }

  buscarUsuarioPorEmail(param) {
    return new Promise((resolve, reject) => {
      this.UsuarioModel.findOne({ email: param })
        .select('_id endereco config sexo dataNascimento telefoneCelular status perfil updatedAt lastAccess nome sobreNome email codigoSms ').exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.debug(`buscarUsuarioPorEmail::Retornando objetos do banco: ${result.id}`);
            return resolve(result);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(new Error('buscarUsuarioPorEmail::Erro ao executar a consulta'));
        });
    });
  }
}
module.exports = new UsuarioRepository();
