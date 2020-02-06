
/* Crons */
const debug = require('debug')('worker');
const EverySecond = require('./crons/EverySecond');

/* Services */
const services = [];

debug('load settings');
(async () => {
  await Settings.load();
  await LoggerConfig.init();

  debug('load workers');
  Cron.add(Settings.get('CRON_EVERY_SECOND'), EverySecond.runner);

  debug('start workers');
  Cron.startAll();

  debug(`Worker started ${services.length} services`);
})();
