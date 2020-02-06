const fs = require('fs');
const http = require('http');
const https = require('https');
const AWS = require('aws-sdk');
const config = require('./config');
const serverApp = require('./config/express');
const util = require('./util/log-console');
const database = require('./config/database');
const applicationErrors = require('./config/errors');

const privateKey = fs.readFileSync('./app/config/certs/apache-selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./app/config/certs/apache-selfsigned.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// For dev purposes only
AWS.config.update({
  accessKeyId: config.aws.AWS_KEY,
  secretAccessKey: config.aws.AWS_SECRET,
});


// iniciando o servidor web
const server = http.createServer(serverApp.server).listen(config.app.port, () => {
  database.connect();
  util.display(`A aplicação está rodando em modo [${config.app.env}] http://${config.app.host}:[${config.app.port}].`);
  util.display(`Base Route [${config.app.env}] http://${config.app.host}:${config.app.port}${config.app.baseRoute}`);
});

const secServer = https.createServer(credentials, serverApp.server)
  .listen(config.app.secport, () => {
    util.display(`A aplicação está rodando em modo [${config.app.env}] https://${config.app.host}:[${config.app.secport}].`);
  });
// repassa todos os erros para o handler padrão da aplicação
//serverApp.server.on('error', applicationErrors.handle.bind(applicationErrors));

// finaliza a conexão com o banco sempre que o server for finalizado
serverApp.server.on('close', () => {
  util.display('O Servidor está sendo finalizado, fechando portas...');
  database.mongooseConnection().close();
});

process.on('SIGINT', () => {
  util.display('SIGINT...');
  server.close();
  secServer.close();
});

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  if (!error.isOperational) {
    process.exit(1);
  }
});

module.exports = serverApp.server;
