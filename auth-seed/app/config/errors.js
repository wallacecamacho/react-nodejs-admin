// Classe responsavel por gerenciar os erros da aplicação,
// diferenciando erros de negócio de erros inesperados

const logger = require('./log')({ module: 'Error Handler' });
const prettyFormat = require('pretty-format');
const errors = require('throw.js');
const ValidateBusinessError = require('../util/custom-exceptions/validate-business-error');
const UsuarioExistenteError = require('../util/custom-exceptions/documento-existente-error');
const DocumentoNaoEncontradoError = require('../util/custom-exceptions/documento-nao-encontrado-error');

class ApplicationErrors {
  constructor() {
    this.logger = logger;
    this.errors = errors;
    this.prettyFormat = prettyFormat;
    this.ValidateBusinessError = ValidateBusinessError;
    this.UsuarioExistenteError = UsuarioExistenteError;
    this.DocumentoNaoEncontradoError = DocumentoNaoEncontradoError;
    this.jsonRetorno = {
      name: '',
      message: '',
      statusCode: null,
      errorCode: null,
    };
  }

  internalServerError(msg) {
    return this.errors.InternalServerError(msg);
  }

  forbiddenError(msg) {
    return this.errors.InternalServerError(msg);
  }

  // Erro interno.
  internalServerErrorJson(msg) {
    this.jsonRetorno.message = msg.message || this.jsonRetorno.message;
    this.jsonRetorno.statusCode = 500;
    this.jsonRetorno.errorCode = 500;
    this.jsonRetorno.name = 'internalServerError';
    return (this.jsonRetorno);
  }

  // Sem acesso.
  forbiddenErrorJson(msg) {
    this.jsonRetorno.message = msg.message || this.jsonRetorno.message;
    this.jsonRetorno.statusCode = 403;
    this.jsonRetorno.errorCode = 403;
    this.jsonRetorno.name = 'forbidden';
    return (this.jsonRetorno);
  }

  // Usado quando um objeto entrou em conflito com algum dado ja existente
  conflitErrorJson(msg) {
    this.jsonRetorno.message = msg.message || this.jsonRetorno.message;
    this.jsonRetorno.statusCode = 409;
    this.jsonRetorno.errorCode = 409;
    this.jsonRetorno.name = 'conflit';
    return (this.jsonRetorno);
  }

  messageJson(msg) {
    this.jsonRetorno.message = msg || this.jsonRetorno.message;
    this.jsonRetorno.statusCode = 200;
    this.jsonRetorno.errorCode = 200;
    this.jsonRetorno.name = 'success';
    return (this.jsonRetorno);
  }

  throwsValidationError(msg) {
    return new this.ValidateBusinessError(msg, 400, 'ValidateBusinessError');
  }

  throwsDocumentoExistenteError(msg) {
    return new this.UsuarioExistenteError(msg, 'DocumentoExistenteError', null, null);
  }

  throwsDocumentoNaoEncontradoError(msg) {
    return new this.DocumentoNaoEncontradoError(msg, 'DocumentoNaoEncontradoError', null, null);
  }

  // lança exceptions compatíveis
  // caso chame throw com apenas uma string, ele lançará
  // automaticamente uma BusinessException
  throw(error, type) {
    const isError = error instanceof Error;

    if (isError) {
      return error;
    }

    if (!type || error === undefined) {
      return this.internalServerError(error);
    }

    return new this.errors[type](error);
  }

  // loga automaticamente os erros lançados pelo sistema
  handle(req, res, error, callback) {
    this.logger.accessLog.error(error.message, { path: req.path(), stack: error.message, error });

    // Ex.: caso queira fazer algum handle diferenciado
    // dos seus erros, você pode fazer aqui:
    // comunicarAdministrador(error);
    // atualizarEstatisticas(error);

    callback();
  }
}

module.exports = new ApplicationErrors();
