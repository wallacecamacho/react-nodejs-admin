class ResponseUtil {
  constructor() {
    this.responseCode = {
      SUCCESS: 200, // Success GET, POST, PUT e DELETE
      successCreate: 201, // SUCESSO AO INSERIR
      SUCCESS_NO_CONTENT: 204, // SUCESSO AO ALTERAR/ APAGAR
      BAD_REQUEST: 400, // A requisicao nao foi bem construida. Erro de sintaxe
      UNAUTHORIZED: 401, // Requer que seja autenticado e o usuario nao esta.
      FORBIDDEN: 403, // Falha na autenticacao
      NOTFOUND: 404, // Recurso nao encontrado OU Objeto com o ID especificado nao foi encontrado.
      NOTALLOWED: 405, // usuario esta autenticado mas nao tem permissao pra tal funcionalidade.
      TIMEOUT: 408,
      CONFLIT: 409, // Conflito com algum recurso já existente. EX: INSERIR UM ITEM QUE JA EXISTE
      PRECONDITION_FAILED: 412, // Pre requisitos para a requisacao nao foram fornecidos. Ex nome.
      SERVER_ERROR: 500,
      ERRO_NOT_KNOWN: 501,
    };
  }

  getCodeSuccess() {
    return this.responseCode.SUCCESS;
  }

  getCodeSuccessNoContent() {
    return this.responseCode.SUCCESS_NO_CONTENT;
  }

  getCodeSuccessCreated() {
    return this.responseCode.successCreate;
  }

  getCodeSuccessUpdated() {
    return this.responseCode.SUCCESS;
  }

  getCodeSuccessDeleted() {
    return this.responseCode.SUCCESS;
  }

  getCodeErrorInternalServer() {
    return this.responseCode.SERVER_ERROR;
  }

  getCodeErrorDuplicateKey() {
    return this.responseCode.CONFLIT;
  }

  getCodeErrorNotFound() {
    return this.responseCode.NOTFOUND;
  }

  success(obj) {
    return {
      code: this.responseCode.SUCCESS,
      message: 'Operação realizada com sucesso.',
      success: true,
      data: obj || null,
    };
  }

  successCreate(obj, msg) {
    return {
      code: this.responseCode.successCreate,
      message: msg || 'Incluido com sucesso.',
      success: true,
      data: obj || null,
    };
  }

  successUpdate(obj, msg) {
    return {
      code: this.responseCode.SUCCESS_NO_CONTENT,
      message: msg || 'Alterado com sucesso.',
      success: true,
      data: obj || null,
    };
  }

  successDelete() {
    return {
      code: this.responseCode.SUCCESS_NO_CONTENT,
      message: 'Excluido com sucesso.',
      success: true,
    };
  }

  errorValidation(errors) {
    return {
      code: this.responseCode.PRECONDITION_FAILED,
      message: 'Erro de validação',
      success: false,
      errors: errors || [],
    };
  }

  errorInternalServer(message) {
    return {
      code: this.responseCode.SERVER_ERROR,
      success: false,
      message: message || 'Erro interno no servidor.',
    };
  }

  errorForbidden() {
    return {
      code: this.responseCode.FORBIDDEN,
      message: 'Sem permissão para a realização da operação.',
      success: false,
    };
  }

  errorDuplicateKey() {
    return {
      code: this.responseCode.CONFLIT,
      message: 'Näo é permitido inserir objetos duplicados.',
      success: false,
    };
  }

  errorNotFound() {
    return {
      code: this.responseCode.NOTFOUND,
      message: 'Recurso não encontrado.',
      success: false,
    };
  }

  errorParentNotFound() {
    return {
      code: this.responseCode.PRECONDITION_FAILED,
      message: 'Recurso pai não encontrado.',
      success: false,
    };
  }
}

module.exports = new ResponseUtil();
