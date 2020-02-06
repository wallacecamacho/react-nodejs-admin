const http = require('http');
const config = require('./config');
// const serverApp = require('./app/config/restify');
const serverApp = require('./config/express');
const route = require('./config/route');
const util = require('./util/log-console');
const database = require('./config/database');
const applicationErrors = require('./config/errors');

// iniciando o servidor web
const server = http.createServer(serverApp.app).listen(config.app.port, () => {
  database.connect();
  util.display(`A aplicação está rodando em modo [${config.app.env}] na porta [${config.app.port}].`);
  // importando as rotas de todos os modulos da aplicação contidos na pasta modules
  route.importModuleRoutes();
});

// rota de health check
serverApp.server.get('/', (req, res, next) => {
  res.send(`${config.app.name} está rodando.`);
  next();
});

// repassa todos os erros para o handler padrão da aplicação
serverApp.server.on('error', applicationErrors.handle.bind(applicationErrors));

// finaliza a conexão com o banco sempre que o restify for finalizado
serverApp.server.on('close', () => {
  util.display('O Servidor está sendo finalizado, fechando portas...');
  database.mongooseConnection().close();
});

process.on('SIGINT', () => {
  util.display('SIGINT...');
  server.close();
});

process.on('unhandledRejection', (reason) => {
  throw reason;
});

module.exports = serverApp.server;
