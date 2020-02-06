// Classe responsavel por criar e configurar a instância do restify
// A documentação do restify pode ser encontrada em http://restify.com/
const express = require('express');
const consign = require('consign');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const expressSession = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const errors = require('throw.js');
const passport = require('passport');

const applicationError = require('../config/errors');
const config = require('../config');

const server = null;
const logger = require('./log')({ module: 'Express' });
const util = require('../util/log-console');
const origin = require('./plugins/origin');
const rotas = require('../config/route');

require('./strategy/auth/auth');

class ExpressConfig {
  constructor() {
    this.config = config;
    this.express = express;
    this.server = server;
    this.logger = logger;
    this.origin = origin;
    this.consign = consign;
  }

  configure() {
    this.server = this.express();
    this.applyMiddlewares();
    return this.server;
  }

  // use este método para incluir seus middlewares e plugins, cuidado
  // com a ordem de inclusão, isso pode quebrar o fluxo de execução.
  // http://restify.com/docs/plugins-api/
  applyMiddlewares() {
    const allowedOrigins = ['http://localhost:3001', 'http://localhost:4200', 'http://yourapp.com'];
    const options = ({
      origin: (pOrigin, next) => {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (pOrigin) {
          if (allowedOrigins.indexOf(pOrigin) !== -1) {
            next(null, true);
          } else {
            // next(new Error('Not allowed by CORS'));
            next(applicationError.applicationError.internalServerErrorJson('ddddd'));
          }
        }
        return next(null, true);
      },
    });
    //  this.server.use(cors(options));

    const buildVersion = new Date().getTime();
    const logDirectory = path.join(__dirname, '../../log');
    const accessLogStream = rfs('access.log', { interval: '1d', path: logDirectory });

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }


    this.server.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,x-access-token,Content-Language');

      // Set to true if you need the website to include cookies in the requests sent
      res.setHeader('Access-Control-Allow-Credentials', false);
      res.setHeader('version', buildVersion);
      res.setHeader('Access-Control-Expose-Headers', 'version');

      // Pass to next layer of middleware
      next();
    });

    this.server.use(express.static(path.resolve('app/public')));
    this.server.use(bodyParser.json({ limit: '50mb' }));
    // this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(expressValidator());
    this.server.use(compression());
    this.server.use(morgan('combined', { stream: accessLogStream }));

    // Helmet
    this.server.use(helmet());

    // rota de health check
    this.server.get('/', (req, res, next) => {
      res.send(`${config.app.name} está rodando.`);
    });
    // rota de health check
    this.server.get(`${config.app.baseRoute}/`, (req, res, next) => {
      res.send(`${config.app.name} está rodando.`);
    });

    this.server.use(passport.initialize());
    this.server.use(passport.session());

    const rot = rotas.importModuleRoutes();
    rot.forEach((pathRouter) => {
      util.display(`Importando rotas de [${pathRouter}]`);
      const router = require(path.resolve(pathRouter));
      this.server.use(`${config.app.baseRoute}`, router);
    });

    this.server.use(expressSession({
      secret: '%4359f((mdoO;KD,.&!',
      resave: false,
      saveUninitialized: false,
    }));

    // catch 404 and forward to error handler
    this.server.use((req, res, next) => {
      next(new errors.NotFound());
    });

    this.server.use((err, req, res, next) => {
      this.logger.accessLog.info(err.message);
      this.logger.accessLog.info(req.path);
      if (req.app.get('env') !== 'default' && req.app.get('env') !== 'testing') {
        delete err.stack;
      }
      // res.status(err.statusCode === 404).json(err.message);

      res.status(err.statusCode || 500).json(err);
    });

    // this.consign().into(this.server);

    // habilitando o logs do request e do response
    // configureserver(this.server).configure();
  }
}

const expressConfig = new ExpressConfig();

// devolve uma instancia do config e outra do server.
module.exports = {
  expressConfig,
  server: expressConfig.configure(),
};
