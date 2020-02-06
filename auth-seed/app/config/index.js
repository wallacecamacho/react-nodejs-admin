// carrega o arquivo de configuração conforme a variavel NODE_ENV.
const env = process.env.NODE_ENV || 'default';
const config = require(`./env/${env}`);

// injeta automaticamente a propriedade app.env no json de configuração
config.app.env = env;

module.exports = config;
