/* global define, it, describe, after, afterEach, beforeEach */


const expect = require('chai').expect;
const sinon = require('sinon');
const usuarioService = require('../../service/usuario-service');
const usuarioValidate = require('../../validate/usuario-validate');

describe('usuario Service', () => {
  this.usuarioService = usuarioService;
  this.usuarioValidate = usuarioValidate;

  const user = {
    nome: 'Wallacece',
    sobreNome: 'Camacho',
    email: 'wallacecamacho@gmail.com',
    telefoneCelular: '+5521997729025',
    idioma: 'pt-BR',
  };

  it('Deve carregar usuario-service ', (done) => {
    const stub = sinon.stub(usuarioService, 'carregar').returns(Promise.resolve('hello'));
    usuarioService.carregar().then((usuarios) => {
      expect(usuarios).to.equal('hello');
      done();
    });
    stub.restore();
    sinon.assert.calledOnce(stub);
  });

  it.only('Deve cadastrar usuario-service ', (done) => {
    const stub = sinon.stub(usuarioService.usuarioRepository, 'inserirUsuario').returns(Promise.resolve(user));
    usuarioService.cadastrar(user).then((usuarios) => {
      expect(usuarios).to.not.equal(null);
      done();
    });
    stub.restore();
    sinon.assert.calledOnce(stub);
  });

  it('Deve rejeitar usuario-service carregar ', (done) => {
    const stub = sinon.stub(usuarioService, 'carregar').returns(Promise.reject());
    usuarioService.carregar().then((usuarios) => {
      done();
    }).finally(done);
    stub.restore();
    sinon.assert.calledOnce(stub);
  });

  it('Deve consultar usuario-service por id ', (done) => {
    const stub = sinon.stub(usuarioService, 'buscarUsuarioPorEmail').returns(Promise.resolve());
    usuarioService.buscarUsuarioPorEmail('teste@teste.com').then((usuarios) => {
      done();
    });
    stub.restore();
    sinon.assert.calledOnce(stub);
  });

  it('Deve consultar usuario-service por id promise reject ', (done) => {
    const stub = sinon.stub(usuarioService, 'buscarUsuarioPorEmail').returns(Promise.reject());
    usuarioService.buscarUsuarioPorEmail('teste@teste.com').then((usuarios) => {
    }).catch((err) => {
      done();
    });
    stub.restore();
    sinon.assert.calledOnce(stub);
  });
});
