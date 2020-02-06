
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');
const logger = require('./log')({ module: 'Redis' });


class Redis {
  constructor() {
    this.config = config;
    this.logger = logger;
    this.redis = redis;
    this.bluebird = bluebird;

    bluebird.promisifyAll(this.redis.RedisClient.prototype);
    bluebird.promisifyAll(this.redis.Multi.prototype);
  }

  configure() {
    const client = this.redis.createClient(this.config.redis);

    client.on('end', () => {
      this.logger.accessLog.debug('A conexão com o REDIS foi finalizada.');
    });

    return client;
  }
}

module.exports = new Redis().configure();
