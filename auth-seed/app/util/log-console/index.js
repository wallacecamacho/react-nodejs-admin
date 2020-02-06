const config = require('../../config');

class Util {
  constructor() {
    this.config = config;
  }

  // mostra um log no console com o prefixo da aplicação
  // ex.: categoria-dashboard-backend => Uma mensagem qualquer
  display(message) {
    console.log(`${this.config.app.name} => ${message}`);
  }
}

module.exports = new Util();
