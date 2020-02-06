// Classe responsável por gerenciar a conexão com o banco de dados (MongoDB)
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../config/log')({ module: 'Database' });
const util = require('../../app/util/log-console/index');


class Database {
  constructor() {
    this.config = config;
    this.logger = logger;
    this.mongoose = mongoose;
    this.mongoose.Promise = global.Promise;
  }

  connect() {
    if (this.config.db) {
      this.mongoose.set('useCreateIndex', true);
      this.mongoose.connect(this.config.db.url, { useNewUrlParser: true })
        .then(() => {
          this.logger.accessLog.info('connect database');
          this.logger.accessLog.debug('connect database debug');
          util.display(`Conectado com sucesso no banco de dados [${this.config.db.url}]`);
        })
        .catch((erro) => {
          util.display(`Erro ao conectar com banco de dados [${this.config.db.url}]`, erro);
        });

      this.mongoose.connection.on('close', () => {
        util.display(`A conexão com o banco de dados foi fechada [${this.config.db.url}]`);
      });
    }
  }

  mongooseConnection() {
    return this.mongoose.connection;
  }
}

module.exports = new Database();
