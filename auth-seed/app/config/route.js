const glob = require('glob');
const path = require('path');
const config = require('../config');

class Route {
  constructor() {
    this.config = config;
    this.glob = glob;
    this.path = path;
  }

  // importa as rotas de todos os modulos da aplicação localizados na pasta modules
  importModuleRoutes() {
    const rotas = [];
    this.glob.sync('app/modules/*/route.js').forEach((file) => {
      rotas.push(file);
      require(this.path.resolve(file));
    });
    return rotas;
  }

  // calcula informações de rota do modulo
  // ex.: { base: 'categoria-dashboard-backend', module: 'fatura',
  // full: 'categoria-dashboard-backend.fatura' }
  info(routeFile) {
    const moduleName = this.path.basename(this.path.dirname(routeFile));
    const full = `${this.config.app.baseRoute}/${moduleName}`;

    return {
      full,
      base: this.config.app.baseRoute,
      module: moduleName,
    };
  }
}

module.exports = new Route();
