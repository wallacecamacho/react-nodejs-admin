// Classe responsável por gerenciar e prover logs para a aplicação

const os = require('os');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const {
  format, transports, createLogger,
} = require('winston');
const config = require('../config');

const {
  combine, timestamp, label, splat, colorize, logstash, printf, simple, prettyPrint,
} = format;
const env = process.env.NODE_ENV || 'development';

const getLabel = (callingModule) => {
  const parts = callingModule.filename.split('/');
  return `${parts[parts.length - 2]}/${parts.pop()}`;
};

const PROJECT_ROOT = path.join(__dirname, '..');


class Log {
  constructor({ module }) {
    this.os = os;
    this.config = config;
    this.transportConsole = new transports.Console({
      level: env === 'default' ? 'debug' : 'info',
      handleExceptions: false,
      json: true,
      colorize: true,
      prettyPrint: true,
    });

    this.formatLog = combine(
      printf(nfo => `${nfo.timestamp} [${getLabel} - ${PROJECT_ROOT}] ${nfo.level}:${JSON.stringify(nfo.message)}`),
      label({ label: `${this.config.app.name} - ${module}` }),
      timestamp(),
      logstash(),
      splat(),
    );

    this.accessLog = createLogger({
      level: env === 'default' ? 'debug' : 'info',
      format: this.formatLog,
      json: true,
      // console: 'integratedTerminal',
      transports: [
        this.transportConsole,
        new DailyRotateFile({
          filename: path.join('log', `logger-%DATE%-${this.os.hostname()}.log`),
          //handleExceptions: true,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d',
        }),
      ],
    });

    if (process.env.NODE_ENV === 'production') {
      this.accessLog.remove(this.transportConsole);
    }
  }

  loggers() {
    return {
      accessLog: this.accessLog,
    };
  }
}

// Para criar uma nova instancia de log faça
// let logger = require('app/config/log')({ module: 'Nome do Modulo' });
module.exports = function (options) {
  return new Log(options).loggers();
};
