const logger = require('../../config/log')({ module: 'Sender Email' });
const SmsSender = require('./sms-sender');

module.exports = (from, to, message) => {
  const smsSender = new SmsSender(from, to, message);
  smsSender.events.on('error', (error) => {
    logger.accessLog.debug('Error - Sms Sender', error);
  });
  smsSender.events.on('success', (success) => {
    logger.accessLog.debug('Success - Sms Sender', success);
  });
  smsSender.send();
};
